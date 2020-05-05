import {Attribute, MonsterType, Awakening, Latent, vm} from './common';
import {MonsterInstance, MonsterJson} from './monster_instance';
import {StoredTeamDisplay, TeamPane, Stats} from './templates';
import * as leaders from './leaders';

interface Burst {
  attrRestrictions: Attribute[];
  typeRestrictions: MonsterType[];
  awakenings: Awakening[];
  multiplier: number;
  awakeningScale: number;
}

interface TeamState {
  awakenings: boolean;
  currentHp: number;
  skillUsed: boolean;
  shieldPercent: number;
  attributesShielded: Attribute[];
  burst: Burst;
  ignoreDamageAbsorb: boolean;
  ignoreAttributeAbsorb: boolean;
  ignoreDamageVoid: boolean;

  timeBonus: number;
  timeIsMult: boolean;

  rcvMult: number;
  fixedHp: number;
}

const DEFAULT_STATE: TeamState = {
  awakenings: true,
  currentHp: 0,
  skillUsed: true,
  shieldPercent: 0,
  attributesShielded: [
      Attribute.FIRE, Attribute.WATER, Attribute.WOOD,
      Attribute.LIGHT, Attribute.DARK],
  burst: {
    attrRestrictions: [],
    typeRestrictions: [],
    awakenings: [],
    multiplier: 1,
    awakeningScale: 0,
  },
  ignoreDamageAbsorb: false,
  ignoreAttributeAbsorb: false,
  ignoreDamageVoid: false,

  timeBonus: 0,
  timeIsMult: false,

  rcvMult: 0,
  fixedHp: 0,
};

interface TeamJson {
  title: string;
  description: string,
  playerMode: number,
  monsters: MonsterJson[],
}

class StoredTeams {
  teams: Record<string, TeamJson>;
  display: StoredTeamDisplay;

  constructor(team: Team) {
    this.teams = {};
    if (window.localStorage.idcStoredTeams) {
      this.teams = JSON.parse(window.localStorage.idcStoredTeams);
    }
    this.display = new StoredTeamDisplay(
      // On Save Click
      () => {
        this.saveTeam(team.toJson());
        this.update();
      },
      // On Load Click
      (name: string) => {
        team.fromJson(this.getTeam(name));
      },
      // On Delete Click
      (name: string) => {
        this.deleteTeam(name);
        this.update();
      },
    );
    this.update();
  }

  getElement(): HTMLElement {
    return this.display.getElement();
  }

  update(): void {
    this.display.update(Object.keys(this.teams));
  }

  getTeam(name: string): TeamJson {
    if (!(name in this.teams)) {
      throw 'Invalid team name.';
    }
    return this.teams[name];
  }

  // TODO: Add confirmation if overriding.
  saveTeam(teamJson: TeamJson) {
    this.teams[teamJson.title] = teamJson;
    window.localStorage.idcStoredTeams = JSON.stringify(this.teams);
  }

  // TODO: Add confirmation.
  deleteTeam(title: string) {
    delete this.teams[title];
    window.localStorage.idcStoredTeams = JSON.stringify(this.teams);
  }
}

const SHARED_AWAKENINGS = new Set([
  Awakening.SKILL_BOOST,
  Awakening.SKILL_BOOST_PLUS,
  Awakening.RESIST_POISON,
  Awakening.RESIST_POISON_PLUS,
  Awakening.RESIST_BLIND,
  Awakening.RESIST_BLIND_PLUS,
  Awakening.RESIST_JAMMER,
  Awakening.RESIST_JAMMER_PLUS,
  Awakening.SBR,
  Awakening.RESIST_CLOUD,
  Awakening.RESIST_TAPE,
]);

class Team {
  teamName: string = '';
  description: string = '';
  monsters: MonsterInstance[] = [];
  playerMode: number = 1;
  activeTeamIdx: number = 0;
  activeMonster: number = 0;
  lastMaxHp: number = 0;

  storage: StoredTeams;
  state: TeamState = Object.assign({}, DEFAULT_STATE);
  teamPane: TeamPane;
  updateIdxCb: (idx: number) => any;

  constructor() {
    /**
     * 1P: 0-5
     * 2P: 0-4, 6-10
     * 3P: 0-5, 6-11, 12-17
     */
    for (let i = 0; i < 18; i++) {
      this.monsters.push(new MonsterInstance());
    }

    this.storage = new StoredTeams(this);
    this.teamPane = new TeamPane(
      this.storage.getElement(),
      this.monsters.map((monster) => monster.getElement()),
      (idx: number) => this.setActiveMonsterIdx(idx),
      (idx: number) => this.setActiveTeamIdx(idx),
      (name: string) => {
        this.teamName = name;
      },
    );

    this.updateIdxCb = () => null;

    // TODO: Battle Display - Different Class?
  }

  setActiveMonsterIdx(idx: number) {
    if (this.playerMode == 2) {
      if (idx == 5) {
        idx = 6;
      }
      if (idx == 11) {
        idx = 0;
      }
    }
    this.activeMonster = idx;
    this.updateIdxCb(idx);
  }

  resetState(partial: boolean = false): void {
    const state = this.state;

    if (partial) {
      state.currentHp = state.currentHp / this.lastMaxHp * this.getHp();
      this.lastMaxHp = this.getHp();
      return;
    }
    Object.assign(this.state, DEFAULT_STATE);
    state.currentHp = this.getHp();
  }

  isMultiplayer(): boolean {
    return this.playerMode != 1;
  }

  toPdchu(): string {
    const strings = this.monsters.map((monster) => monster.toPdchu());
    function combine(s: string[]): string {
      return s.join(' / ');
    }
    switch (this.playerMode) {
      case 1:
        return combine(strings.slice(0, 6));
      case 2:
        return combine(strings.slice(0, 5)) + ' ; ' + combine(strings.slice(6, 12));
      case 3:
        return [combine(strings.slice(0, 6)), combine(strings.slice(6, 12)), combine(strings.slice(12, 18))].join(' ; ');
    }
    // Unhandled player mode.
    return '';
  }

  fromPdchu(s: string): void {
    const teamStrings = s.split(';');
    // We don't support >3P.
    if (teamStrings.length > 3) {
      teamStrings.length = 3;
    }
    this.setPlayerMode(teamStrings.length);
    const defaultMonster = '1929 | +0aw0lv1'
    for (let i = 0; i < teamStrings.length; i++) {
      const multiplierRegex = /\*\s*\d$/;
      if (!teamStrings[i]) {
        teamStrings[i] = defaultMonster;
      }
      let monsterStrings = teamStrings[i].split('/')
          .map((s: string): string => s.trim())
          .reduce((allStrings: string[], monsterString: string) => {
            const multiply = monsterString.match(multiplierRegex);
            let count = 1;
            if (multiply) {
              count = Number(multiply[0][multiply[0].length - 1]);
              monsterString = monsterString.substring(0, multiply.index);
            }
            for (let j = 0; j < count; j++) {
              allStrings = allStrings.concat([monsterString])
            }
            return allStrings;
          }, []);
      if (this.playerMode == 2) {
        if (monsterStrings.length > 5) {
          monsterStrings.length = 5;
        }
        while(monsterStrings.length < 5) {
          monsterStrings.push(defaultMonster);
        }
      } else {
        if (monsterStrings.length > 6) {
          monsterStrings.length = 6;
        }
        while(monsterStrings.length < 6) {
          monsterStrings.push(defaultMonster);
        }
      }

      const team = this.getTeamAt(i);
      for (let j = 0; j < monsterStrings.length; j++) {
        team[j].fromPdchu(monsterStrings[j]);
      }
    }

    this.update();
  }

  getTeamAt(teamIdx: number): MonsterInstance[] {
    const monsters = Array(6);
    for (let i = 0; i < 6; i++) {
      monsters[i] = this.monsters[this.getMonsterIdx(teamIdx, i)];
    }
    return monsters;
  }

  getActiveTeam(): MonsterInstance[] {
    return this.getTeamAt(this.activeTeamIdx);
  }

  toJson(): TeamJson {
    return {
      playerMode: this.playerMode,
      title: this.teamName,
      description: this.description,
      monsters: this.monsters.map((monster) => monster.toJson()),
    };
  }

  fromJson(json: TeamJson): void {
    this.playerMode = json.playerMode || 1;
    this.teamName = json.title || 'UNTITLED';
    this.description = json.description || '';
    for (let i = 0; i < this.monsters.length; i++) {
      if (i < json.monsters.length) {
        this.monsters[i].fromJson(json.monsters[i]);
      } else {
        this.monsters[i].setId(-1);
      }
    }
    this.update();
  }

  setPlayerMode(newMode: number): void {
    if (newMode != 1 && newMode != 2 && newMode != 3) {
      throw `Invalid player mode, must be 1, 2, or 3, got ${newMode}`;
    }
    if (this.playerMode == 2) {
      /**
       0 1 2 3  4 6
       6 7 8 9 10 0
       x x x x x x
       ->
       0 1 2 3  4  5
       6 7 8 9 10 11
       x x x x  x  x
       */
      if (newMode == 3) {
        this.monsters[5].copyFrom(this.monsters[6]);
        this.monsters[11].copyFrom(this.monsters[0]);
      }
      if (newMode == 1) {
        this.monsters[5].copyFrom(this.monsters[6]);
      }
    } else if (this.playerMode == 3) {
    } else { // Handle 1P
      if (newMode == 2) {
        this.monsters[6].copyFrom(this.monsters[5]);
      }
    }

    this.playerMode = newMode;
    if (this.activeTeamIdx >= newMode) {
      this.setActiveTeamIdx(newMode - 1);
    }
    // TODO: Update UI to reflect this.
  }

  getHpPercent(): number {
    if (this.getHp() == 0) {
      return 0;
    }
    return Math.round(100 * this.state.currentHp / this.getHp());
  }

  setActiveTeamIdx(idx: number): void {
    if (idx >= this.playerMode || idx < 0) {
      throw `Index should be [0, ${this.playerMode}]`;
    }
    if (this.activeTeamIdx == idx) {
      return;
    }
    this.activeTeamIdx = idx;
    if (this.playerMode != 2) {
      this.state.currentHp = this.getHp();
    }
    this.update();
    // this.reloadStatDisplay();
    // TODO: Update visuals and calculations when this happens.
  }

  getMonsterIdx(teamIdx: number, localIdx: number): number {
    let idx = 6 * teamIdx + localIdx;
    if (this.playerMode == 2 &&
        ((teamIdx == 0 && localIdx == 5) || (teamIdx == 1 && localIdx == 5))) {
      idx = (1 - teamIdx) * 6;
    }
    return idx;
  }

  getIndividualHp(includeLeaderSkill: boolean = false, includeP2: boolean = false): number[] {
    const monsters = this.getActiveTeam();
    const partialLead = (monster: MonsterInstance): number => {
      return leaders.hp(monsters[0].getCard().leaderSkillId, {
        monster: monster,
        team: monsters,
        isMultiplayer: this.isMultiplayer(),
      });
    };
    const partialHelper = (monster: MonsterInstance): number => {
      return leaders.hp(monsters[5].getCard().leaderSkillId, {
        monster: monster,
        team: monsters,
        isMultiplayer: this.isMultiplayer(),
      });
    };
    if (includeP2) {
      const p2Monsters = this.getTeamAt(this.activeTeamIdx ^ 1);
      for (let i = 1; i < 5; i++) {
        monsters.push(p2Monsters[i]);
      }
    }
    if (!includeLeaderSkill) {
      return monsters.map((monster) => monster.getHp(this.isMultiplayer(), this.state.awakenings));
    }
    let hps = [];
    const teamHpAwakeningsMult = 1 + (this.state.awakenings ? (monsters.reduce((total, monster) => total + monster.countAwakening(Awakening.TEAM_HP), 0) * 0.05) : 0);
    for (const monster of monsters) {
      if (!monster.id || monster.id <= 0) {
        hps.push(0);
        continue;
      }
      const hpMult = partialLead(monster) * partialHelper(monster);
      const hpBase = monster.getHp(this.isMultiplayer(), this.state.awakenings);
      hps.push(Math.round(hpBase * hpMult * teamHpAwakeningsMult));
    }
    return hps;
  }

  getHp(): number {
    if (this.state.fixedHp) {
      return this.state.fixedHp;
    }
    const individualHps = this.getIndividualHp(true, this.playerMode == 2);
    return individualHps.reduce((total, next) => total + next, 0);
  }

  getIndividualRcv(includeLeaderSkill: boolean = false): number[] {
    let rcvs = [];
    const monsters = this.getActiveTeam();
    if (!includeLeaderSkill) {
      return monsters.map((monster) => monster.getRcv(this.isMultiplayer(), this.state.awakenings));
    }
    const partialLead = (monster: MonsterInstance): number => {
      return leaders.rcv(monsters[0].getCard().leaderSkillId, {
        monster: monster,
        team: monsters,
        isMultiplayer: this.isMultiplayer(),
      });
    };
    const partialHelper = (monster: MonsterInstance): number => {
      return leaders.rcv(monsters[5].getCard().leaderSkillId, {
        monster: monster,
        team: monsters,
        isMultiplayer: this.isMultiplayer(),
      });
    };
    const teamRcvAwakeningsMult = 1 + (this.state.awakenings ? (monsters.reduce((total, monster) => total + monster.countAwakening(Awakening.TEAM_RCV), 0) * 0.1) : 0);
    for (const monster of monsters) {
      if (!monster.id || monster.id <= 0) {
        rcvs.push(0);
        continue;
      }
      const rcvMult = partialLead(monster) * partialHelper(monster);
      const rcvBase = monster.getRcv(this.isMultiplayer(), this.state.awakenings);
      rcvs.push(Math.round(rcvBase * rcvMult * teamRcvAwakeningsMult));
    }
    return rcvs;
  }

  // Base recovery before matching.
  getRcv(): number {
    const rcvs = this.getIndividualRcv(true);
    const totalRcv = rcvs.reduce((total, next) => total + next, 0);
    return totalRcv > 0 ? totalRcv : 0;
  }

  getTime(): number {
    const monsters = this.getActiveTeam();
    const leadId = monsters[0].getCard().leaderSkillId;
    const helperId = monsters[5].getCard().leaderSkillId;
    const fixedLead = leaders.fixedTime(leadId);
    const fixedHelper = leaders.fixedTime(helperId);
    if (fixedLead || fixedHelper) {
      return Math.min(...[fixedLead, fixedHelper].filter(Boolean));
    }

    let time = 5;

    time += leaders.timeExtend(leadId) + leaders.timeExtend(helperId);

    for (const monster of monsters) {
      time += monster.countAwakening(Awakening.TIME) * 0.5;
      time += monster.countAwakening(Awakening.TIME_PLUS);
      time += monster.latents.filter((l) => l == Latent.TIME).length * 0.05;
      time += monster.latents.filter((l) => l == Latent.TIME_PLUS).length * 0.12;
    }

    if (this.state.timeIsMult) {
      time *= this.state.timeBonus;
    } else {
      time += this.state.timeBonus;
    }

    return time;
  }

  getBoardWidth(): number {
    const monsterGroupsToCheck: MonsterInstance[][] = [[this.monsters[0]]];
    switch(this.playerMode) {
      case 1:
        monsterGroupsToCheck[0].push(this.monsters[5]);
        break;
      case 2:
        monsterGroupsToCheck[0].push(this.monsters[6]);
        break;
      case 3:
        monsterGroupsToCheck[0].push(this.monsters[5]);
        monsterGroupsToCheck.push([this.monsters[6], this.monsters[11]]);
        monsterGroupsToCheck.push([this.monsters[12], this.monsters[17]]);
    }

    for (const [m1, m2] of monsterGroupsToCheck) {
      if (leaders.bigBoard(m1.getCard().leaderSkillId)) {
        continue;
      }
      if (leaders.bigBoard(m2.getCard().leaderSkillId)) {
        continue;
      }
      // If neither of the leads have bigBoard, return 6.
      return 6;
    }
    // All teams have bigBoard.
    return 7;
  }

  update(): void {
    if (this.playerMode == 2) {
      this.monsters[5].copyFrom(this.monsters[6]);
      this.monsters[11].copyFrom(this.monsters[0]);
    }
    this.teamPane.update(this.playerMode, this.teamName, this.description);
    for (const monster of this.monsters) {
      monster.update(this.isMultiplayer());
    }
    this.teamPane.updateStats(this.getStats());
  }

  countAwakening(awakening: Awakening): number {
    const monsters = this.getActiveTeam();
    if (this.playerMode == 2 && SHARED_AWAKENINGS.has(awakening)) {
      const p2Monsters = this.getTeamAt(this.activeTeamIdx ^ 1);
      for (let i = 1; i < 5; i++) {
        monsters.push(p2Monsters[i]);
      }
    }

    return monsters.reduce(
      (total, monster) => total + monster.countAwakening(awakening, this.isMultiplayer()),
      0);
  }

  getStats(): Stats {
    const team = this.getActiveTeam();
    const cds = [];
    for (const monster of team) {
      const card = monster.getCard();
      let baseCd = 0;
      if (card.activeSkillId > 0) {
        baseCd = vm.model.playerSkills[card.activeSkillId].maxCooldown;
      }

      let inheritCd = 0;

      const inheritCard = monster.getInheritCard();
      if (inheritCard && inheritCard.activeSkillId > 0) {
        inheritCd = vm.model.playerSkills[inheritCard.activeSkillId].maxCooldown;
      }

      if (baseCd && inheritCd) {
        cds.push(`${baseCd}(${baseCd + inheritCd})`);
      } else if (baseCd && !inheritCd) {
        cds.push(`${baseCd}`);
      } else if (!baseCd && inheritCd) {
        cds.push(`?(? + ${inheritCd})`);
      } else {
        cds.push('');
      }
    }

    const atks = this.getActiveTeam().map((monster) => monster.getAtk(this.isMultiplayer(), this.state.awakenings));

    const counts: Map<Awakening, number> = new Map();
    counts.set(Awakening.SKILL_BOOST,
      this.countAwakening(Awakening.SKILL_BOOST) +
      2 * this.countAwakening(Awakening.SKILL_BOOST_PLUS));
    counts.set(Awakening.TIME, this.countAwakening(Awakening.TIME) +
        2 * this.countAwakening(Awakening.TIME_PLUS));
    counts.set(Awakening.SOLOBOOST, this.countAwakening(Awakening.SOLOBOOST));
    counts.set(Awakening.BONUS_ATTACK, this.countAwakening(Awakening.BONUS_ATTACK));
    counts.set(Awakening.BONUS_ATTACK_SUPER, this.countAwakening(Awakening.BONUS_ATTACK_SUPER));
    counts.set(Awakening.SBR, this.countAwakening(Awakening.SBR));
    counts.set(Awakening.RESIST_POISON,
      this.countAwakening(Awakening.RESIST_POISON) +
      5 * this.countAwakening(Awakening.RESIST_POISON_PLUS));
    counts.set(Awakening.RESIST_BLIND,
      this.countAwakening(Awakening.RESIST_BLIND) +
      5 * this.countAwakening(Awakening.RESIST_BLIND_PLUS));
    counts.set(Awakening.RESIST_JAMMER,
      this.countAwakening(Awakening.RESIST_JAMMER) +
      5 * this.countAwakening(Awakening.RESIST_JAMMER_PLUS));
    counts.set(Awakening.RESIST_CLOUD, this.countAwakening(Awakening.RESIST_CLOUD));
    counts.set(Awakening.RESIST_TAPE, this.countAwakening(Awakening.RESIST_TAPE));
    counts.set(Awakening.OE_FIRE, this.countAwakening(Awakening.OE_FIRE));
    counts.set(Awakening.OE_WATER, this.countAwakening(Awakening.OE_WATER));
    counts.set(Awakening.OE_WOOD, this.countAwakening(Awakening.OE_WOOD));
    counts.set(Awakening.OE_LIGHT, this.countAwakening(Awakening.OE_LIGHT));
    counts.set(Awakening.OE_DARK, this.countAwakening(Awakening.OE_DARK));
    counts.set(Awakening.OE_HEART, this.countAwakening(Awakening.OE_HEART));

    return {
      hps: this.getIndividualHp(),
      atks: atks,
      rcvs: this.getIndividualRcv(),
      cds: cds,
      totalHp: this.getHp(),
      totalRcv: this.getRcv(),
      totalTime: this.getTime(),
      counts: counts,
    }
  }
}

export {
  Team
}
