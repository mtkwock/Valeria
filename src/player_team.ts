import { Attribute, MonsterType, Awakening, Latent, Round, Shape, COLORS, AwakeningToPlusAwakening, PlusAwakeningMultiplier } from './common';
import { MonsterInstance, MonsterJson } from './monster_instance';
import { DamagePing } from './damage_ping';
import { StoredTeamDisplay, TeamPane, TeamUpdate, Stats, MonsterUpdate } from './templates';
import { ComboContainer } from './combo_container';
import { floof, compress, decompress } from './ilmina_stripped';
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
  voidDamageAbsorb: boolean;
  voidAttributeAbsorb: boolean;
  voidDamageVoid: boolean;

  timeBonus: number;
  timeIsMult: boolean;

  rcvMult: number;
  fixedHp: number;
  leadSwaps: number[];
}

interface TeamStateContext {
  awakenings?: boolean;
  healPercent?: number;
  healFlat?: number;
  damagePercent?: number;
  damageFlat?: number;
  damageAttribute?: Attribute;

  shieldPercent?: number;
  attributesShielded?: Attribute[];
  burst?: Burst;
  voidDamageAbsorb?: boolean;
  voidAttributeAbsorb?: boolean;
  voidDamageVoid?: boolean;

  timeBonus?: number;
  timeIsMult?: boolean;

  rcvMult?: number;
  fixedHp?: number;
  leadSwap?: number;
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
  voidDamageAbsorb: false,
  voidAttributeAbsorb: false,
  voidDamageVoid: false,

  timeBonus: 0,
  timeIsMult: false,

  rcvMult: 0,
  fixedHp: 0,

  leadSwaps: [0, 0, 0],
};

interface TeamJson {
  title: string;
  description: string,
  playerMode: number,
  monsters: MonsterJson[],
}

class StoredTeams {
  teams: Record<string, TeamJson> = {};
  display: StoredTeamDisplay;

  constructor(team: Team) {
    if (window.localStorage.idcStoredTeams) {
      try {
        this.teams = JSON.parse(decompress(window.localStorage.idcStoredTeams));
      } catch (e) {
        this.teams = JSON.parse(window.localStorage.idcStoredTeams);
        window.localStorage.idcStoredTeams = compress(window.localStorage.idcStoredTeams);
      }
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
        team.openTeamTab();
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
    window.localStorage.idcStoredTeams = compress(JSON.stringify(this.teams));
  }

  // TODO: Add confirmation.
  deleteTeam(title: string) {
    delete this.teams[title];
    window.localStorage.idcStoredTeams = compress(JSON.stringify(this.teams));
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
  // On change monster selection.
  updateCb: (idx: number) => any;

  constructor() {
    /**
     * 1P: 0-5
     * 2P: 0-4, 6-10
     * 3P: 0-5, 6-11, 12-17
     */
    for (let i = 0; i < 18; i++) {
      this.monsters.push(new MonsterInstance(-1, (ctx: MonsterUpdate) => {
        if (ctx.transformActive != undefined) {
          const idxToTransform = this.getMonsterIdx(Math.floor(i / 6), i % 6);
          const monster = this.monsters[idxToTransform];
          if (monster.getCard().transformsTo > 0) {
            monster.transformedTo = monster.getCard().transformsTo;
          } else if (!ctx.transformActive) {
            monster.transformedTo = -1;
          }
        }
        this.update();
      }));
    }

    this.storage = new StoredTeams(this);
    this.teamPane = new TeamPane(
      this.storage.getElement(),
      this.monsters.map((monster) => monster.getElement()),
      (ctx: TeamUpdate) => {
        if (ctx.title) {
          this.teamName = ctx.title;
        }
        if (ctx.teamIdx != undefined) {
          this.setActiveTeamIdx(ctx.teamIdx);
        }
        if (ctx.monsterIdx != undefined) {
          this.setActiveMonsterIdx(ctx.monsterIdx);
        }
        if (ctx.description) {
          this.description = ctx.description;
        }

        if (ctx.currentHp != undefined) {
          if (ctx.currentHp < 0) {
            this.state.currentHp = 0;
          } else if (ctx.currentHp > this.getHp()) {
            this.state.currentHp = this.getHp();
          } else {
            this.state.currentHp = ctx.currentHp;
          }
        }
        if (ctx.fixedHp != undefined) {
          this.state.fixedHp = ctx.fixedHp;
        }
        if (ctx.leadSwap != undefined) {
          this.updateState({ leadSwap: ctx.leadSwap });
        }

        if (ctx.voidDamageAbsorb != undefined) {
          this.state.voidDamageAbsorb = ctx.voidDamageAbsorb;
        }
        if (ctx.voidAttributeAbsorb != undefined) {
          this.state.voidAttributeAbsorb = ctx.voidAttributeAbsorb;
        }
        if (ctx.voidDamageVoid != undefined) {
          this.state.voidDamageVoid = ctx.voidDamageVoid;
        }
        if (ctx.voidAwakenings != undefined) {
          this.state.awakenings = !ctx.voidAwakenings;
        }

        this.update();
      }
    );

    this.updateCb = () => null;

    // TODO: Battle Display - Different Class?
  }

  updateState(ctx: TeamStateContext): void {
    if (ctx.leadSwap != undefined) {
      if (ctx.leadSwap >= 0 && ctx.leadSwap < 5) {
        this.state.leadSwaps[this.activeTeamIdx] = ctx.leadSwap;
      } else {
        console.error('Lead Swap index must be in range [0, 4]');
      }
    }

    this.update();
  }

  openTeamTab(): void {
    this.teamPane.goToTab('Team');
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
    // Determine which leadSwap we're talking about.
    const leadSwap = this.state.leadSwaps[Math.floor(idx / 6)];
    if (leadSwap) {
      if (idx % 6 == 0) {
        idx += leadSwap;
      } else if (idx % 6 == leadSwap) {
        idx -= leadSwap;
      }
    }
    this.activeMonster = idx;
    this.updateCb(idx);
  }

  resetState(partial: boolean = false): void {
    const state = this.state;

    if (partial) {
      state.currentHp = state.currentHp / this.lastMaxHp * this.getHp();
      this.lastMaxHp = this.getHp();
      return;
    }
    Object.assign(this.state, DEFAULT_STATE);
    for (let i = 0; i < 3; i++) {
      this.state.leadSwaps[i] = 0;
    }
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
        return combine(strings.slice(0, 5)) + ' ; ' + combine(strings.slice(6, 11));
      case 3:
        return [combine(strings.slice(0, 6)), combine(strings.slice(6, 12)), combine(strings.slice(12, 18))].join(' ; ');
    }
    // Unhandled player mode.
    return '';
  }

  fromPdchu(s: string): void {
    this.resetState();
    const teamStrings = s.split(';');
    // We don't support >3P.
    if (teamStrings.length > 3) {
      teamStrings.length = 3;
    }
    this.setPlayerMode(teamStrings.length);
    const defaultMonster = '-1 | +0aw0lv1'
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
        while (monsterStrings.length < 5) {
          monsterStrings.push(defaultMonster);
        }
      } else {
        if (monsterStrings.length > 6) {
          monsterStrings.length = 6;
        }
        while (monsterStrings.length < 6) {
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

  /**
   * Obtain the monster at the requested position. This takes into account
   * lead swapping.
   */
  getMonsterIdx(teamIdx: number, localIdx: number): number {
    // Adjust for P2 lead.
    if (this.playerMode == 2 && localIdx == 5 && teamIdx < 2) {
      teamIdx = 1 - teamIdx;
      localIdx = 0;
    }
    // Adjust for leadswaps.
    if (localIdx == 0) {
      localIdx = this.state.leadSwaps[teamIdx];
    } else if (localIdx == this.state.leadSwaps[teamIdx]) {
      localIdx = 0;
    }
    const idx = teamIdx * 6 + localIdx;
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
    switch (this.playerMode) {
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
      if (leaders.bigBoard(m1.getCard(true).leaderSkillId)) {
        continue;
      }
      if (leaders.bigBoard(m2.getCard(true).leaderSkillId)) {
        continue;
      }
      // If neither of the leads have bigBoard, return 6.
      return 6;
    }
    // All teams have bigBoard.
    return 7;
  }

  getDamageCombos(comboContainer: ComboContainer): { pings: DamagePing[], healing: number, trueBonusAttack: number } {
    comboContainer.bonusCombosLeader = 0;

    const mp = this.isMultiplayer();
    const awoke = this.state.awakenings;
    const percentHp = this.getHpPercent();
    let monsters = this.getActiveTeam();
    const leadId = monsters[0].bound ? -1 : monsters[0].getCard().leaderSkillId;
    const helpId = monsters[5].bound ? -1 : monsters[5].getCard().leaderSkillId;
    const partialAtk = (id: number, ping: DamagePing, healing: number) => leaders.atk(id, {
      ping,
      team: monsters,
      percentHp,
      comboContainer,
      skillUsed: this.state.skillUsed,
      isMultiplayer: mp,
      healing,
    });

    const enhancedCounts: Record<string, number> = {
      r: this.countAwakening(Awakening.OE_FIRE),
      b: this.countAwakening(Awakening.OE_WATER),
      g: this.countAwakening(Awakening.OE_WOOD),
      l: this.countAwakening(Awakening.OE_LIGHT),
      d: this.countAwakening(Awakening.OE_DARK),
      h: this.countAwakening(Awakening.OE_HEART),
    };

    const rowTotals: Record<Attribute, number> = {
      0: 0,
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      '-1': 0,
      '-2': 0,
    };
    const rowAwakenings: Record<Attribute, number> = {
      '-2': 0,
      '-1': 0,
      0: this.countAwakening(Awakening.ROW_FIRE),
      1: this.countAwakening(Awakening.ROW_WATER),
      2: this.countAwakening(Awakening.ROW_WOOD),
      3: this.countAwakening(Awakening.ROW_LIGHT),
      4: this.countAwakening(Awakening.ROW_DARK),
      5: this.countAwakening(Awakening.RECOVER_BIND),
    };

    // monsters = monsters.filter((monster) => monster.getId() > 0);
    let pings: DamagePing[] = Array(2 * monsters.length);

    const NO_ONE = new MonsterInstance(-1, () => { });

    for (let i = 0; i < monsters.length; i++) {
      if (monsters[i].getId() <= 0 || monsters[i].bound) {
        pings[i] = new DamagePing(NO_ONE, Attribute.NONE);
        pings[i + 6] = new DamagePing(NO_ONE, Attribute.NONE);
        continue;
      }
      const m = monsters[i];
      pings[i] = new DamagePing(m, m.getAttribute());
      pings[i + monsters.length] = new DamagePing(m, m.getSubattribute());
      pings[i + monsters.length].isSub = true;
    }

    for (const c of 'rbgld') {
      const attr = COLORS.indexOf(c) as Attribute;
      for (const combo of comboContainer.combos[c]) {
        let baseMultiplier = (combo.count + 1) * 0.25;
        if (combo.enhanced) {
          baseMultiplier *= (1 + 0.06 * combo.enhanced);
          if (awoke && enhancedCounts[c]) {
            baseMultiplier *= (1 + enhancedCounts[c] * 0.07);
          }
        }
        if (combo.shape == Shape.ROW) {
          rowTotals[attr] += rowAwakenings[attr];
        }
        for (const ping of pings) {
          if (!ping || ping.attribute != attr) {
            continue;
          }
          let curAtk = ping.source.getAtk(mp, awoke);
          curAtk = Round.UP(curAtk * baseMultiplier);
          if (ping.isSub) {
            const divisor = ping.attribute == ping.source.getAttribute() ? 10 : 3;
            curAtk = Round.UP(curAtk / divisor);
          }

          let multiplier = 1;
          if (awoke) {
            if (combo.count == 4) {
              multiplier *= (1.5 ** ping.source.countAwakening(Awakening.TPA, mp));
            }
            if (combo.shape == Shape.L) {
              multiplier *= (1.5 ** ping.source.countAwakening(Awakening.L_UNLOCK, mp));
            }
            if (combo.shape == Shape.BOX) {
              multiplier *= (2.5 ** ping.source.countAwakening(Awakening.VDP, mp));
              ping.ignoreVoid = true;
            }
          }

          // Handle burst.
          const burst = this.state.burst;
          if (!burst.typeRestrictions.length || ping.source.anyTypes(burst.typeRestrictions)) {
            if (!burst.attrRestrictions.length || burst.attrRestrictions.includes(ping.attribute)) {
              let burstMultiplier = burst.multiplier;
              for (const awakening of burst.awakenings) {
                burstMultiplier += this.countAwakening(awakening) * burst.awakeningScale;
                if (AwakeningToPlusAwakening.has(awakening)) {
                  const plusAwakening = AwakeningToPlusAwakening.get(awakening) as Awakening;
                  const perAwakening = Number(PlusAwakeningMultiplier.get(plusAwakening));
                  burstMultiplier += perAwakening * this.countAwakening(plusAwakening) * burst.awakeningScale;
                }
              }
              multiplier *= burstMultiplier;
            }
          }


          ping.add(Round.UP(curAtk * multiplier))
        }
      }
    }

    let healing = 0;
    const teamRcvAwakenings = this.countAwakening(Awakening.TEAM_RCV);
    let trueBonusAttack = 0;

    const partialRcv = (id: number, monster: MonsterInstance) => leaders.rcv(id, {
      monster,
      team: monsters,
      isMultiplayer: mp,
    });

    for (const combo of comboContainer.combos['h']) {
      let multiplier = (combo.count + 1) * 0.25;
      if (combo.enhanced) {
        multiplier *= (1 + 0.06 * combo.enhanced);
        if (awoke && enhancedCounts[Attribute.HEART]) {
          multiplier *= (1 + enhancedCounts[Attribute.HEART] * 0.07);
        }
      }
      multiplier *= this.state.rcvMult;

      if (awoke) {
        if (combo.shape == Shape.COLUMN) {
          trueBonusAttack += this.countAwakening(Awakening.BONUS_ATTACK);
        }
        if (combo.shape == Shape.BOX) {
          trueBonusAttack += (99 * this.countAwakening(Awakening.BONUS_ATTACK_SUPER));
        }
        multiplier *= (1 + 0.1 * teamRcvAwakenings);
      }

      for (const monster of monsters) {
        let rcv = monster.getRcv(mp, awoke);
        if (awoke && combo.count == 4) {
          rcv *= (1.5 ** monster.countAwakening(Awakening.OE_HEART, mp));
        }
        const rcvMult = partialRcv(leadId, monster) * partialRcv(helpId, monster);
        healing += Round.UP(rcv * multiplier * rcvMult);
      }
    }

    comboContainer.bonusCombosLeader = leaders.plusCombo(
      leadId, { team: monsters, comboContainer }) +
      leaders.plusCombo(helpId, { team: monsters, comboContainer });

    const comboCount = comboContainer.comboCount();
    const comboMultiplier = comboCount * 0.25 + 0.75;

    for (const ping of pings) {
      if (ping) {
        ping.multiply(comboMultiplier, Round.UP);
      }
    }
    healing = Round.UP(healing * comboMultiplier);

    // Apply awakenings.
    // Known order according to PDC:
    // (7c/10c), (80%/50%), Rows, Sfua, L-Guard
    // Poison Blessing occurs after rows.  Unknown relative to L-Guard as it's impossible to get both.
    // Jammer applies after Sfua.
    // Assuming:
    // (7c/10c), (80%/50%), Rows, Sfua, L-Guard, JammerBless, PoisonBless
    if (awoke) {
      for (const ping of pings) {
        if (!ping || ping.damage == 0) {
          continue;
        }
        const apply = (awakening: Awakening, multiplier: number) => {
          const count = ping.source.countAwakening(awakening, mp);
          if (count) {
            ping.multiply(multiplier ** ping.source.countAwakening(awakening, mp), Round.NEAREST);
          }
        }
        if (comboCount >= 7) {
          apply(Awakening.COMBO_7, 2);
        }
        if (comboCount >= 10) {
          apply(Awakening.COMBO_10, 5);
        }
        if (percentHp <= 50) {
          apply(Awakening.HP_LESSER, 2);
        }
        if (percentHp >= 80) {
          apply(Awakening.HP_GREATER, 1.5);
        }
        if (rowTotals[ping.attribute]) {
          ping.multiply(1 + 0.15 * rowTotals[ping.attribute], Round.NEAREST);
        }
        if (comboContainer.combos['h'].some((combo) => combo.shape == Shape.BOX)) {
          apply(Awakening.BONUS_ATTACK_SUPER, 2);
        }
        if (comboContainer.combos['h'].some((combo) => combo.shape == Shape.L)) {
          apply(Awakening.L_GUARD, 1.5);
        }
        if (comboContainer.combos['j'].length) {
          // TODO: Change when Jammer Boost is buffed.
          apply(Awakening.JAMMER_BOOST, 1.5);
        }
        if (comboContainer.combos['p'].length || comboContainer.combos['m'].length) {
          apply(Awakening.POISON_BOOST, 2);
        }
      }
    }

    for (const ping of pings) {
      if (!ping || !ping.damage) {
        continue;
      }

      let val = ping.damage;
      // val = val * partialAtk(leadId, ping, healing);
      // val = val * partialAtk(helpId, ping, healing);
      val = Math.fround(val) * Math.fround(partialAtk(leadId, ping, healing) * 100) / Math.fround(100);
      val = Math.fround(val) * Math.fround(partialAtk(helpId, ping, healing) * 100) / Math.fround(100);
      ping.damage = Math.round(val);
    }

    healing += this.countAwakening(Awakening.AUTOHEAL) * 1000;

    trueBonusAttack += leaders.trueBonusAttack(leadId, {
      team: monsters, comboContainer
    }) + leaders.trueBonusAttack(helpId, {
      team: monsters, comboContainer
    });

    for (const ping of pings) {
      if (ping && ping.damage > 2 ** 31) {
        ping.damage = 2 ** 31 - 1;
      }
    }

    return {
      pings,
      healing,
      trueBonusAttack,
    };
  }

  update(): void {
    this.teamPane.update(this.playerMode, this.teamName, this.description);
    for (let teamIdx = 0; teamIdx < 3; teamIdx++) {
      for (let monsterIdx = 0; monsterIdx < 6; monsterIdx++) {
        const displayIndex = 6 * teamIdx + monsterIdx;
        const actualIndex = this.getMonsterIdx(teamIdx, monsterIdx);
        // We should only show the lead swap icon on the lead who is now the sub.
        const showSwap = Boolean(displayIndex != actualIndex && monsterIdx && monsterIdx < 5);
        this.monsters[displayIndex].update(
          this.isMultiplayer(),
          this.monsters[actualIndex].getRenderData(this.isMultiplayer(), showSwap),
        );
      }
    }
    this.teamPane.updateStats(this.getStats());
    this.teamPane.updateBattle({
      currentHp: this.state.currentHp,
      maxHp: this.getHp(),
      leadSwap: this.state.leadSwaps[this.activeTeamIdx],
      voids: [this.state.voidDamageAbsorb, this.state.voidAttributeAbsorb, this.state.voidDamageVoid, !this.state.awakenings],
      fixedHp: this.state.fixedHp,
    });
    this.updateCb(this.activeMonster);
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
        baseCd = floof.model.playerSkills[card.activeSkillId].maxCooldown;
      }

      let inheritCd = 0;

      const inheritCard = monster.getInheritCard();
      if (inheritCard && inheritCard.activeSkillId > 0) {
        inheritCd = floof.model.playerSkills[inheritCard.activeSkillId].maxCooldown;
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

    // General
    counts.set(Awakening.SKILL_BOOST,
      this.countAwakening(Awakening.SKILL_BOOST) +
      2 * this.countAwakening(Awakening.SKILL_BOOST_PLUS));
    counts.set(Awakening.TIME, this.countAwakening(Awakening.TIME) +
      2 * this.countAwakening(Awakening.TIME_PLUS));
    counts.set(Awakening.SOLOBOOST, this.countAwakening(Awakening.SOLOBOOST));
    counts.set(Awakening.BONUS_ATTACK, this.countAwakening(Awakening.BONUS_ATTACK));
    counts.set(Awakening.BONUS_ATTACK_SUPER, this.countAwakening(Awakening.BONUS_ATTACK_SUPER));
    counts.set(Awakening.L_GUARD, this.countAwakening(Awakening.L_GUARD));

    // Resists
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

    // OE
    counts.set(Awakening.OE_FIRE, this.countAwakening(Awakening.OE_FIRE));
    counts.set(Awakening.OE_WATER, this.countAwakening(Awakening.OE_WATER));
    counts.set(Awakening.OE_WOOD, this.countAwakening(Awakening.OE_WOOD));
    counts.set(Awakening.OE_LIGHT, this.countAwakening(Awakening.OE_LIGHT));
    counts.set(Awakening.OE_DARK, this.countAwakening(Awakening.OE_DARK));
    counts.set(Awakening.OE_HEART, this.countAwakening(Awakening.OE_HEART));

    // Rows
    counts.set(Awakening.ROW_FIRE, this.countAwakening(Awakening.ROW_FIRE));
    counts.set(Awakening.ROW_WATER, this.countAwakening(Awakening.ROW_WATER));
    counts.set(Awakening.ROW_WOOD, this.countAwakening(Awakening.ROW_WOOD));
    counts.set(Awakening.ROW_LIGHT, this.countAwakening(Awakening.ROW_LIGHT));
    counts.set(Awakening.ROW_DARK, this.countAwakening(Awakening.ROW_DARK));
    counts.set(Awakening.RECOVER_BIND, this.countAwakening(Awakening.RECOVER_BIND));

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
