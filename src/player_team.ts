import {
  Attribute, AttributeToName, COLORS,
  INT_CAP,
  MonsterType,
  Awakening,
  Latent,
  Round, Shape,
  TeamBadge, TeamBadgeToAwakening,
  BoolSetting,
} from './common';
import { MonsterInstance, MonsterJson, monsterJsonEqual } from './monster_instance';
import { DamagePing } from './damage_ping';
import { StoredTeamDisplay, TeamPane, TeamUpdate, Stats, MonsterUpdate } from './templates';
import { ComboContainer } from './combo_container';
import { compress, decompress } from './ilmina_stripped';
import * as leaders from './leaders';
import { debug } from './debugger';
import { runTests, TestContext, CompareBoolean, PlayerTeamContext } from './team_conformance';
import { SETTINGS } from './templates';

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
  skills: boolean;
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
  bigBoard: boolean;
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
  currentHp: -1,
  skills: true,
  skillUsed: true,
  shieldPercent: 0,
  attributesShielded: [],
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

  rcvMult: 1,
  fixedHp: 0,

  leadSwaps: [0, 0, 0],
  bigBoard: false,
};

const DEFAULT_BURST: Burst = {
  attrRestrictions: [],
  typeRestrictions: [],
  awakenings: [],
  multiplier: 1,
  awakeningScale: 0,
};

interface TeamJson {
  title: string;
  playerMode: number;
  badges: TeamBadge[];
  description: string;
  tests: string;
  monsters: MonsterJson[];
}

function teamJsonEqual(a: TeamJson, b: TeamJson): boolean {
  if (a.title != b.title) {
    return false;
  }

  if (String(a.badges) != String(b.badges)) {
    return false;
  }

  if (a.description != b.description) {
    return false;
  }

  if (a.playerMode != b.playerMode) {
    return false;
  }

  if (a.tests != b.tests) {
    return false;
  }

  if (a.monsters.length != b.monsters.length) {
    return false;
  }

  for (let i = 0; i < a.monsters.length; i++) {
    if (!monsterJsonEqual(a.monsters[i], b.monsters[i])) {
      return false;
    }
  }

  return true;
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
        if (team.hasChange() &&
          (!SETTINGS.getBool(BoolSetting.WARN_CHANGE)
            || window.confirm('Changes made to current team, load anyways?'))
        ) {
          team.fromJson(this.getTeam(name));
          team.openTeamTab();
        }
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
  saveTeam(teamJson: TeamJson): void {
    this.teams[teamJson.title] = teamJson;
    window.localStorage.idcStoredTeams = compress(JSON.stringify(this.teams));
  }

  // TODO: Add confirmation.
  deleteTeam(title: string): void {
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
  teamName = '';
  description = '';
  tests = '';
  monsters: MonsterInstance[] = [];
  playerMode = 1;
  activeTeamIdx = 0;
  activeMonster = 0;
  lastMaxHp = 0;

  action = -1;

  storage: StoredTeams;
  state: TeamState = Object.assign({}, DEFAULT_STATE);
  teamPane: TeamPane;
  badges: TeamBadge[] = [TeamBadge.NONE, TeamBadge.NONE, TeamBadge.NONE];
  // On change monster selection.
  updateCb: (idx: number) => void;
  onSelectMonster: () => void = () => { };

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
        if (ctx.description != undefined) {
          this.description = ctx.description;
        }
        if (ctx.tests != undefined) {
          this.tests = ctx.tests;
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
        if (ctx.action != undefined) {
          this.action = ctx.action;
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
        if (ctx.timeBuff != undefined) {
          this.state.timeBonus = ctx.timeBuff;
        }
        if (ctx.timeIsMult != undefined) {
          this.state.timeIsMult = ctx.timeIsMult;
        }
        if (ctx.rcvBuff != undefined) {
          this.state.rcvMult = ctx.rcvBuff;
        }

        if (ctx.burst != undefined) {
          this.state.burst = ctx.burst;
        }

        this.update();
      }
    );
    this.teamPane.onMonsterSwap = (a: number, b: number) => {
      const idxA = this.getMonsterIdx(Math.floor(a / 6), a % 6);
      const idxB = this.getMonsterIdx(Math.floor(b / 6), b % 6);

      MonsterInstance.swap(this.monsters[idxA], this.monsters[idxB]);
    };

    this.updateCb = () => { };
  }

  hasChange(): boolean {
    let storedTeam: TeamJson;
    try {
      storedTeam = this.storage.getTeam(this.teamName);
    } catch (e) {
      return true;
    }
    const currentJson = this.toJson();

    return !teamJsonEqual(currentJson, storedTeam);
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

  setAction(idx: number): void {
    this.action = idx;
  }

  skillBind(): void {
    const count = this.countAwakening(Awakening.SBR);
    if (count >= 5) {
      return;
    }
    if (Math.random() * 5 > count) {
      this.state.skills = false;
    }
  }

  openTeamTab(): void {
    this.teamPane.goToTab('Team');
  }

  setActiveMonsterIdx(idx: number) {
    const relativeIdx = idx % 6;
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
    if (this.activeMonster == idx) {
      // If the current action equals the active, choose inherit instead.
      // If current action is the inherit, reset to combos.
      // Otherwise set action to the base monster's active.
      if (this.action == 2 * relativeIdx) {
        if (this.getActiveTeam()[relativeIdx].inheritId > 0) {
          this.action++;
        } else {
          this.action = -1;
        }
      } else if (this.action == 2 * relativeIdx + 1 || this.getActiveTeam()[relativeIdx].getId() <= 0) {
        this.action = -1;
      } else {
        this.action = 2 * relativeIdx;
      }
    } else {
      this.onSelectMonster();
    }
    this.activeMonster = idx;
    this.updateCb(idx);
  }

  resetState(partial = false): void {
    const state = this.state;

    if (partial) {
      state.currentHp = state.currentHp / this.lastMaxHp * this.getHp();
      this.lastMaxHp = this.getHp();
      return;
    }
    Object.assign(this.state, DEFAULT_STATE);
    // Burst being a nested object means that editing state at all will cause
    // it to be propagated and continued.
    // Curse you, mutability!
    Object.assign(this.state.burst, DEFAULT_BURST);
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
      const monsterStrings = teamStrings[i].split('/')
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

    this.resetState();
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
      badges: this.badges.slice(),
      description: this.description,
      monsters: this.monsters.map((monster) => monster.toJson()),
      tests: this.tests,
    };
  }

  fromJson(json: TeamJson): void {
    this.setPlayerMode(json.playerMode || 1);
    this.action = -1;
    this.teamName = json.title || 'UNTITLED';
    this.description = json.description || '';
    if (json.badges) {
      this.badges = json.badges;
    } else {
      this.badges = [TeamBadge.NONE, TeamBadge.NONE, TeamBadge.NONE];
    }
    for (let i = 0; i < this.monsters.length; i++) {
      if (i < json.monsters.length) {
        this.monsters[i].fromJson(json.monsters[i]);
      } else {
        this.monsters[i].setId(-1);
      }
    }
    if (json.tests) {
      this.tests = json.tests;
    } else {
      this.tests = '';
    }
    this.update();
  }

  setPlayerMode(newMode: number): void {
    if (newMode != 1 && newMode != 2 && newMode != 3) {
      throw `Invalid player mode, must be 1, 2, or 3, got ${newMode}`;
    }
    const el = document.getElementById(`valeria-player-mode-${newMode}`);
    if (el instanceof HTMLInputElement) {
      el.checked = true;
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
    } else if (this.playerMode == 1) {
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

  getIndividualHp(includeLeaderSkill = false, includeP2 = false): number[] {
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
    let p1TeamHp = monsters.reduce((total, monster) => total + monster.countAwakening(Awakening.TEAM_HP), 0);
    let p2TeamHp = 0;
    if (includeP2) {
      const p2Monsters = this.getTeamAt(this.activeTeamIdx ^ 1);
      for (let i = 1; i < 5; i++) {
        monsters.push(p2Monsters[i]);
      }
      p1TeamHp -= monsters[5].countAwakening(Awakening.TEAM_HP);
      p2TeamHp = monsters.slice(5).reduce((total, monster) => total + monster.countAwakening(Awakening.TEAM_HP), 0);
    }
    if (!includeLeaderSkill) {
      return monsters.map((monster) => monster.getHp(this.playerMode, this.state.awakenings));
    }
    const hps = [];
    for (let i = 0; i < monsters.length; i++) {
      const monster = monsters[i];
      if (!monster.id || monster.id <= 0) {
        hps.push(0);
        continue;
      }
      const hpMult = partialLead(monster) * partialHelper(monster);
      const hpBase = monster.getHp(this.playerMode, this.state.awakenings);
      let totalTeamHp = p1TeamHp;
      if (monsters.length > 6 && i >= 5) {
        totalTeamHp = p2TeamHp;
      }
      if (!this.state.awakenings) {
        totalTeamHp = 0;
      }

      hps.push(Math.round(hpBase * hpMult * (1 + 0.05 * totalTeamHp)));
    }
    return hps;
  }

  getHp(): number {
    if (this.state.fixedHp) {
      return this.state.fixedHp;
    }
    const individualHps = this.getIndividualHp(true, this.playerMode == 2);
    let total = individualHps.reduce((total, next) => total + next, 0);
    if (this.playerMode != 2) {
      if (this.badges[this.activeTeamIdx] == TeamBadge.HP) {
        total = Math.ceil(total * 1.05);
      } else if (this.badges[this.activeTeamIdx] == TeamBadge.HP_PLUS) {
        total = Math.ceil(total * 1.15);
      }
    }
    return total;
  }

  getEffectiveHp(): number {
    const baseHp = this.getHp();
    const monsters = this.getActiveTeam();
    const leadId = monsters[0].getCard().leaderSkillId;
    const helpId = monsters[5].getCard().leaderSkillId;
    const mult = leaders.damageMult(leadId) * leaders.damageMult(helpId);

    return Math.floor(baseHp / mult);
  }

  getIndividualRcv(includeLeaderSkill: boolean = false): number[] {
    const rcvs = [];
    const monsters = this.getActiveTeam();
    if (!includeLeaderSkill) {
      return monsters.map((monster) => monster.getRcv(this.playerMode, this.state.awakenings));
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

    const p1TeamRcv = 1 + monsters.reduce((total, monster) => total + monster.countAwakening(Awakening.TEAM_RCV), 0) * 0.10;

    for (let i = 0; i < monsters.length; i++) {
      const monster = monsters[i];
      if (!monster.id || monster.id <= 0) {
        rcvs.push(0);
        continue;
      }
      const rcvMult = partialLead(monster) * partialHelper(monster);
      const rcvBase = monster.getRcv(this.playerMode, this.state.awakenings);

      // let totalTeamRcv = p1TeamRcv;
      // if (monsters.length > 6 && i >= 5) {
      //   totalTeamRcv = p2TeamRcv;
      // }
      rcvs.push(Math.round(rcvBase * rcvMult * p1TeamRcv));
    }
    return rcvs;
  }

  // Base recovery before matching.
  getRcv(): number {
    const rcvs = this.getIndividualRcv(true);
    const totalRcv = rcvs.reduce((total, next) => total + next, 0);
    let total = totalRcv > 0 ? totalRcv : 0;
    if (this.playerMode != 2) {
      if (this.badges[this.activeTeamIdx] == TeamBadge.RCV) {
        total = Math.ceil(total * 1.25);
      } else if (this.badges[this.activeTeamIdx] == TeamBadge.RCV_PLUS) {
        total = Math.ceil(total * 1.35);
      }
    }
    return total;
  }

  getAutohealAwakening(): number {
    if (!this.state.awakenings) {
      return 0;
    }

    const awakeningAutoheal = this.countAwakening(Awakening.AUTOHEAL) * 1000;

    let latentAutoheal = 0;
    for (const monster of this.getActiveTeam()) {
      const c = monster.getCard();
      const rcv = monster.calcScaleStat(c.maxRcv, c.minRcv, c.rcvGrowth);
      if (rcv <= 0) continue;

      const latentCount = monster.latents.filter((latent) => latent == Latent.AUTOHEAL).length;
      latentAutoheal += Math.round(0.15 * latentCount * rcv);
    }

    return awakeningAutoheal + latentAutoheal;
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

    time += this.countAwakening(Awakening.TIME, { includeTeamBadge: true }) * 0.5;
    for (const monster of monsters) {
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
      // If neither of the leads have bigBoard, return 5 to default to the dungeon's.
      return 5;
    }
    // All teams have bigBoard.
    return 7;
  }

  getBadge(idx: number = -1): TeamBadge {
    if (this.playerMode == 2) {
      return TeamBadge.NONE;
    }
    if (idx < 0) {
      idx = this.activeTeamIdx;
    }
    return this.badges[this.activeTeamIdx];
  }

  getDamageCombos(comboContainer: ComboContainer): { pings: DamagePing[]; healing: number; trueBonusAttack: number } {
    comboContainer.bonusCombosLeader = 0;
    const pm = this.playerMode;
    const awoke = this.state.awakenings;
    const percentHp = this.getHpPercent();
    const monsters = this.getActiveTeam();
    const leadId = monsters[0].bound ? -1 : monsters[0].getCard().leaderSkillId;
    const helpId = monsters[5].bound ? -1 : monsters[5].getCard().leaderSkillId;
    const badge = this.getBadge();
    const partialAtk = (id: number, ping: DamagePing, healing: number) => leaders.atk(id, {
      ping,
      team: monsters,
      percentHp,
      comboContainer,
      skillUsed: this.state.skillUsed,
      isMultiplayer: this.isMultiplayer(),
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
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      '-1': 0,
      '-2': 0,
    };
    const rowAwakenings: Record<Attribute, number> = {
      '-2': 0,
      '-1': 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      0: this.countAwakening(Awakening.ROW_FIRE),
      1: this.countAwakening(Awakening.ROW_WATER),
      2: this.countAwakening(Awakening.ROW_WOOD),
      3: this.countAwakening(Awakening.ROW_LIGHT),
      4: this.countAwakening(Awakening.ROW_DARK),
      5: this.countAwakening(Awakening.RECOVER_BIND),
    };

    // monsters = monsters.filter((monster) => monster.getId() > 0);
    const pings: DamagePing[] = Array(2 * monsters.length);
    const mults: {
      base: number,
      combo: number;
      badge: number;
      lead: number;
      help: number;
      awakenings: number;
      final: number;
    }[] = [];

    for (let i = 0; i < pings.length; i++) {
      mults.push({
        base: 0,
        combo: 1,
        badge: 1,
        lead: 1,
        help: 1,
        awakenings: 1,
        final: 0,
      });
    }

    const NO_ONE = new MonsterInstance(-1, () => null);

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

    let potentialComboOrbPlus = 0;

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
          let curAtk = ping.source.getAtk(pm, awoke);
          curAtk = Round.UP(curAtk * baseMultiplier);
          if (ping.isSub && ping.source.getAttribute() != Attribute.JAMMER) {
            const divisor = ping.attribute == ping.source.getAttribute() ? 10 : 3;
            curAtk = Round.UP(curAtk / divisor);
          }

          let multiplier = 1;
          if (awoke) {
            if (combo.count == 4) {
              multiplier *= (1.5 ** ping.source.countAwakening(Awakening.TPA, pm));
            } else if (combo.shape == Shape.L) {
              multiplier *= (1.5 ** ping.source.countAwakening(Awakening.L_UNLOCK, pm));
            } else if (combo.shape == Shape.BOX) {
              const vdpCount = ping.source.countAwakening(Awakening.VDP, pm);
              if (vdpCount) {
                multiplier *= (2.5 ** vdpCount);
                ping.ignoreVoid = true;
              }
            }

            let comboOrbs = ping.source.countAwakening(Awakening.COMBO_ORB);
            if (combo.count >= 10 && combo.count <= 12 &&
              // Monsters with the same attribute and subattribute should not be
              // counted twice.
              (!ping.isSub || ping.source.getAttribute() != ping.attribute)) {
              potentialComboOrbPlus += comboOrbs;
            }
          }

          // Handle burst.
          const burst = this.state.burst;
          if (!burst.typeRestrictions.length || ping.source.anyTypes(burst.typeRestrictions)) {
            if (!burst.attrRestrictions.length || burst.attrRestrictions.includes(ping.attribute)) {
              let burstMultiplier = burst.multiplier;
              for (const awakening of burst.awakenings) {
                burstMultiplier += this.countAwakening(awakening) * burst.awakeningScale;
              }
              multiplier *= burstMultiplier;
            }
          }

          ping.add(Round.UP(curAtk * multiplier))
        }
      }
    }

    for (let i = 0; i < pings.length; i++) {
      mults[i].base = pings[i].damage;
    }

    // Apply poison damage.
    let poison = 0;
    for (const c of 'pm') {
      for (const combo of comboContainer.combos[c]) {
        let multiplier = 0;
        if (combo.attribute == Attribute.POISON) {
          multiplier = (combo.count + 1) * 0.05;
        } else if (combo.attribute == Attribute.MORTAL_POISON) {
          multiplier = (combo.count + 1) * 0.125;
        }
        poison += this.getHp() * multiplier;
      }
    }
    poison = Math.round(poison);

    let healingFromCombos = 0;
    const teamRcvAwakenings = this.countAwakening(Awakening.TEAM_RCV);
    let trueBonusAttack = 0;

    const partialRcv = (id: number, monster: MonsterInstance) => leaders.rcv(id, {
      monster,
      team: monsters,
      isMultiplayer: this.isMultiplayer(),
    });

    let rcvBadgeMult = 1;
    if (badge == TeamBadge.RCV) {
      rcvBadgeMult = 1.25;
    } else if (badge == TeamBadge.RCV_PLUS) {
      rcvBadgeMult = 1.35;
    }

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

      let healingFromCombo = 0;
      for (const monster of monsters) {
        let rcv = monster.getRcv(pm, awoke);
        if (awoke && combo.count == 4) {
          rcv *= (1.5 ** monster.countAwakening(Awakening.OE_HEART, pm));
        }
        const rcvMult = partialRcv(leadId, monster) * partialRcv(helpId, monster);
        healingFromCombo += Round.UP(rcv * multiplier * rcvMult * rcvBadgeMult);
      }
      if (healingFromCombo > 0) {
        healingFromCombos += healingFromCombo;
      }
    }

    comboContainer.setBonusComboLeader(
      leaders.plusCombo(leadId, { team: monsters, comboContainer }) +
      leaders.plusCombo(helpId, { team: monsters, comboContainer }));

    // Currently max of 2 combo orbs can be added at any time.
    comboContainer.setBonusComboOrb(Math.min(potentialComboOrbPlus, 2));

    const comboCount = comboContainer.comboCount();
    const comboMultiplier = comboCount * 0.25 + 0.75;

    for (let i = 0; i < pings.length; i++) {
      mults[i].combo = comboMultiplier;
      if (pings[i]) {
        pings[i].multiply(comboMultiplier, Round.UP);
      }
    }
    healingFromCombos = Round.UP(healingFromCombos * comboMultiplier);

    // Apply awakenings.
    // Known order according to PDC:
    // (7c/10c), (80%/50%), Rows, Sfua, L-Guard
    // Poison Blessing occurs after rows.  Unknown relative to L-Guard as it's impossible to get both.
    // Jammer applies after Sfua.
    // Assuming:
    // (7c/10c), (80%/50%), Rows, Sfua, L-Guard, JammerBless, PoisonBless
    if (awoke) {
      for (let i = 0; i < pings.length; i++) {
        const ping = pings[i];
        if (!ping || ping.damage == 0) {
          continue;
        }
        const baseDamage = ping.damage;
        const apply = (awakening: Awakening, multiplier: number) => {
          const count = ping.source.countAwakening(awakening, pm);
          if (count) {
            ping.multiply(multiplier ** ping.source.countAwakening(awakening, pm), Round.NEAREST);
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
          ping.multiply(1 + 0.2 * rowTotals[ping.attribute], Round.NEAREST);
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
        mults[i].awakenings = pings[i].damage / baseDamage;
      }
    }

    let atkBadgeMult = 1;
    if (badge == TeamBadge.ATK) {
      atkBadgeMult = 1.05;
    } else if (badge == TeamBadge.ATK_PLUS) {
      atkBadgeMult = 1.15;
    }

    for (let i = 0; i < pings.length; i++) {
      const ping = pings[i];
      if (!ping || !ping.damage) {
        continue;
      }

      let val = ping.damage;
      val = Math.fround(val) * Math.fround(partialAtk(leadId, ping, healingFromCombos) * 100) / Math.fround(100);
      val = Math.fround(val) * Math.fround(partialAtk(helpId, ping, healingFromCombos) * 100) / Math.fround(100);
      mults[i].badge = atkBadgeMult;
      mults[i].lead = partialAtk(leadId, ping, healingFromCombos);
      mults[i].help = partialAtk(helpId, ping, healingFromCombos);
      ping.damage = Math.round(val * atkBadgeMult);
      mults[i].final = ping.damage;
    }

    const healingAwakening = this.getAutohealAwakening();
    const healingLeader = leaders.autoHeal(leadId) * Math.max(0, monsters[0].getRcv(pm, awoke))
      + leaders.autoHeal(helpId) * Math.max(0, monsters[5].getRcv(pm, awoke));
    const healing = healingFromCombos - poison + healingAwakening + healingLeader;

    trueBonusAttack += leaders.trueBonusAttack(leadId, {
      team: monsters, comboContainer
    }) + leaders.trueBonusAttack(helpId, {
      team: monsters, comboContainer
    });

    for (const ping of pings) {
      ping.damage = Math.min(ping.damage, INT_CAP);
    }

    console.log(mults);

    return {
      pings,
      healing,
      trueBonusAttack,
    };
  }

  update(): void {
    this.teamPane.update(this.playerMode, this.teamName, this.description, this.badges);
    for (let teamIdx = 0; teamIdx < 3; teamIdx++) {
      for (let monsterIdx = 0; monsterIdx < 6; monsterIdx++) {
        const displayIndex = 6 * teamIdx + monsterIdx;
        const actualIndex = this.getMonsterIdx(teamIdx, monsterIdx);
        // We should only show the lead swap icon on the lead who is now the sub.
        const showSwap = Boolean(displayIndex != actualIndex && monsterIdx && monsterIdx < 5);
        let renderData = this.monsters[actualIndex].getRenderData(this.playerMode, showSwap);
        if (!SETTINGS.getBool(BoolSetting.SHOW_COOP_PARTNER)
          && this.playerMode == 2 && monsterIdx == 5) {
          renderData = {
            plusses: 0,
            unavailableReason: '',
            id: -1,
            awakenings: 0,
            superAwakeningIdx: -1,
            level: 1,
            inheritId: -1,
            inheritLevel: 1,
            inheritPlussed: false,
            latents: [],
            showSwap: false,
            showTransform: false,
            activeTransform: false,
          };
        }
        this.monsters[displayIndex].update(this.playerMode, renderData);
      }
    }
    this.teamPane.updateStats(this.getStats());
    const ns: number[] = [];
    this.teamPane.updateBattle({
      currentHp: this.state.currentHp,
      maxHp: this.getHp(),
      leadSwap: this.state.leadSwaps[this.activeTeamIdx],
      voids: [this.state.voidDamageAbsorb, this.state.voidAttributeAbsorb, this.state.voidDamageVoid, !this.state.awakenings],
      fixedHp: this.state.fixedHp,
      ids: ns.concat(...this.getActiveTeam().map((m) => [m.getId(), m.inheritId])),
      burst: this.state.burst,
      timeBuff: this.state.timeBonus,
      timeIsMult: this.state.timeIsMult,
      rcvBuff: this.state.rcvMult,
    });
    this.updateCb(this.activeMonster);
  }

  private makeTeamContext(idx: number): PlayerTeamContext {
    const monsters = this.getTeamAt(idx);
    const opts = {
      includeTeamBadge: true,
    };
    const LEADER = monsters[0].makeTestContext(this.playerMode);
    const HELPER = monsters[5].makeTestContext(this.playerMode);
    const SUB_1 = monsters[1].makeTestContext(this.playerMode);
    const SUB_2 = monsters[2].makeTestContext(this.playerMode);
    const SUB_3 = monsters[3].makeTestContext(this.playerMode);
    const SUB_4 = monsters[4].makeTestContext(this.playerMode);
    const leadId = monsters[0].getCard().leaderSkillId;
    const helpId = monsters[5].getCard().leaderSkillId;
    const hasAutofua = leaders.bonusAttack(leadId) || leaders.trueBonusAttack(leadId) || leaders.bonusAttack(helpId) || leaders.trueBonusAttack(helpId);
    const result: PlayerTeamContext = {
      HP: this.getHp(),
      EFFECTIVE_HP: this.getEffectiveHp(),
      RCV: this.getRcv(),
      TIME: this.getTime(),
      LEADER, HELPER, SUB_1, SUB_2, SUB_3, SUB_4,
      ATTRIBUTES: LEADER.ATTRIBUTE | LEADER.SUBATTRIBUTE | HELPER.ATTRIBUTE | HELPER.SUBATTRIBUTE | SUB_1.ATTRIBUTE | SUB_1.SUBATTRIBUTE | SUB_2.ATTRIBUTE | SUB_2.SUBATTRIBUTE | SUB_3.ATTRIBUTE | SUB_3.SUBATTRIBUTE | SUB_4.ATTRIBUTE | SUB_4.SUBATTRIBUTE,
      SB: this.countAwakening(Awakening.SKILL_BOOST, opts),
      SBR: this.countAwakening(Awakening.SBR, opts),
      FUA: this.countAwakening(Awakening.BONUS_ATTACK),
      SFUA: this.countAwakening(Awakening.BONUS_ATTACK_SUPER),
      RESIST_BLIND: this.countAwakening(Awakening.RESIST_BLIND, opts),
      RESIST_POISON: this.countAwakening(Awakening.RESIST_POISON, opts),
      RESIST_JAMMER: this.countAwakening(Awakening.RESIST_JAMMER, opts),
      RESIST_CLOUD: this.countAwakening(Awakening.RESIST_CLOUD),
      RESIST_TAPE: this.countAwakening(Awakening.RESIST_TAPE),
      GUARD_BREAK: this.countAwakening(Awakening.GUARD_BREAK),

      RESIST_FIRE: this.countAwakening(Awakening.RESIST_FIRE) * 7 + this.countLatent(Latent.RESIST_FIRE) + this.countLatent(Latent.RESIST_FIRE_PLUS) * 2.5,
      RESIST_WATER: this.countAwakening(Awakening.RESIST_WATER) * 7 + this.countLatent(Latent.RESIST_WATER) + this.countLatent(Latent.RESIST_WATER_PLUS) * 2.5,
      RESIST_WOOD: this.countAwakening(Awakening.RESIST_WOOD) * 7 + this.countLatent(Latent.RESIST_WOOD) + this.countLatent(Latent.RESIST_WOOD_PLUS) * 2.5,
      RESIST_LIGHT: this.countAwakening(Awakening.RESIST_LIGHT) * 7 + this.countLatent(Latent.RESIST_LIGHT) + this.countLatent(Latent.RESIST_LIGHT_PLUS) * 2.5,
      RESIST_DARK: this.countAwakening(Awakening.RESIST_DARK) * 7 + this.countLatent(Latent.RESIST_DARK) + this.countLatent(Latent.RESIST_DARK_PLUS) * 2.5,

      // Leader Skill capabilities.
      AUTOFUA: hasAutofua ? CompareBoolean.TRUE : CompareBoolean.FALSE,
    }
    return result;
  }

  private makeTestContext(): TestContext {
    const ctx: TestContext = {
      MODE: this.playerMode,
      P1: this.makeTeamContext(0),

      // Constants.
      FIRE: 1 << 0,
      WATER: 1 << 1,
      WOOD: 1 << 2,
      LIGHT: 1 << 3,
      DARK: 1 << 4,
      ALL_ATTRIBUTES: 31,
      TRUE: CompareBoolean.TRUE,
      FALSE: CompareBoolean.FALSE,
    };
    if (this.playerMode > 1) {
      ctx.P2 = this.makeTeamContext(1);
    }
    if (this.playerMode > 2) {
      ctx.P3 = this.makeTeamContext(2);
    }
    return ctx;
  }

  countAwakening(awakening: Awakening, opts: { ignoreTransform?: boolean, includeTeamBadge?: boolean } = {}): number {
    if (!this.state.awakenings) {
      return 0;
    }
    const monsters = this.getActiveTeam();
    if (this.playerMode == 2 && SHARED_AWAKENINGS.has(awakening)) {
      const p2Monsters = this.getTeamAt(this.activeTeamIdx ^ 1);
      for (let i = 1; i < 5; i++) {
        monsters.push(p2Monsters[i]);
      }
    }

    let initialCount = monsters.reduce(
      (total, monster) => total + monster.countAwakening(awakening, this.playerMode, opts.ignoreTransform || false),
      0);
    if (this.playerMode != 2 && opts.includeTeamBadge) {
      const maybeAwakeningCount = TeamBadgeToAwakening.get(this.badges[this.activeTeamIdx]);
      if (maybeAwakeningCount && maybeAwakeningCount.awakening == awakening) {
        initialCount += maybeAwakeningCount.count;
      }
    }
    return initialCount;
  }

  countLatent(latent: Latent): number {
    if (!this.state.awakenings) {
      return 0;
    }
    const monsters = this.getActiveTeam();
    return monsters.reduce((total, monster) => total + monster.latents.filter((l) => l == latent).length, 0);
  }

  damage(amount: number, attribute: Attribute, comboContainer: ComboContainer) {
    debug.print(`Team being hit for ${amount} of ${AttributeToName.get(attribute)}`);
    let multiplier = 1;
    if (this.state.attributesShielded.includes(attribute)) {
      multiplier = 0;
      debug.print('Team is avoiding all damage from ' + AttributeToName.get(attribute));
    }
    const team = this.getActiveTeam();
    const leader = team[0].getCard().leaderSkillId;
    const helper = team[5].getCard().leaderSkillId;
    const percentHp = this.getHpPercent();
    const ctx = {
      attribute,
      team,
      comboContainer,
      percentHp,
      healing: 0,
    };
    const leaderMultiplier = leaders.damageMult(leader, ctx) * leaders.damageMult(helper, ctx);
    if (leaderMultiplier != 1) {
      debug.print(`Damage reduced to ${(leaderMultiplier * 100).toFixed(2)}% from leader skills.`);
      multiplier *= leaderMultiplier;
    }
    if (this.state.shieldPercent) {
      const shieldMultiplier = (100 - this.state.shieldPercent) / 100;
      multiplier *= shieldMultiplier;

      debug.print(`Damage reduced to ${shieldMultiplier.toFixed(2)}x due to shields.`);
    }

    // Assuming stacking L-Guards.
    if (comboContainer.combos['h'].some((c) => c.shape == Shape.L)) {
      let lGuardMultiplier = 1 - this.countAwakening(Awakening.L_GUARD) * 0.05;

      if (lGuardMultiplier < 0) {
        lGuardMultiplier = 0;
      }
      if (lGuardMultiplier != 1) {
        multiplier *= lGuardMultiplier;
        debug.print(`Damage reduced to ${lGuardMultiplier.toFixed(2)}x due to L-Guard`);
      }
    }

    let attrMultiplier = 1;
    switch (attribute) {
      case Attribute.FIRE:
        attrMultiplier -= this.countAwakening(Awakening.RESIST_FIRE) * 0.07;
        attrMultiplier -= this.countLatent(Latent.RESIST_FIRE) * 0.01;
        attrMultiplier -= this.countLatent(Latent.RESIST_FIRE_PLUS) * 0.025;
        break;
      case Attribute.WATER:
        attrMultiplier -= this.countAwakening(Awakening.RESIST_WATER) * 0.07;
        attrMultiplier -= this.countLatent(Latent.RESIST_WATER) * 0.01;
        attrMultiplier -= this.countLatent(Latent.RESIST_WATER_PLUS) * 0.025;
        break;
      case Attribute.WOOD:
        attrMultiplier -= this.countAwakening(Awakening.RESIST_WOOD) * 0.07;
        attrMultiplier -= this.countLatent(Latent.RESIST_WOOD) * 0.01;
        attrMultiplier -= this.countLatent(Latent.RESIST_WOOD_PLUS) * 0.025;
        break;
      case Attribute.LIGHT:
        attrMultiplier -= this.countAwakening(Awakening.RESIST_LIGHT) * 0.07;
        attrMultiplier -= this.countLatent(Latent.RESIST_LIGHT) * 0.01;
        attrMultiplier -= this.countLatent(Latent.RESIST_LIGHT_PLUS) * 0.025;
        break;
      case Attribute.DARK:
        attrMultiplier -= this.countAwakening(Awakening.RESIST_DARK) * 0.07;
        attrMultiplier -= this.countLatent(Latent.RESIST_DARK) * 0.01;
        attrMultiplier -= this.countLatent(Latent.RESIST_DARK_PLUS) * 0.025;
        break;
      default:
        console.warn('Unhandled damage: ' + attribute);
    }
    attrMultiplier = Math.max(0, attrMultiplier);
    if (attrMultiplier != 1) {
      multiplier *= (attrMultiplier);
      debug.print(`Damage reduced to ${(100 * attrMultiplier).toFixed(1)}% due to Attribute Resist Awakenings and Latents`);
    }

    amount = Math.ceil(amount * multiplier);
    debug.print(`Team hit for ${amount}, which is ${(multiplier * 100).toFixed(2)}% of the original damage`);

    this.state.currentHp -= amount;
    if (this.state.currentHp < 0) {
      debug.print(`Team was overkilled by ${-1 * this.state.currentHp}`);
    }
    this.state.currentHp = Math.max(0, this.state.currentHp) || 0;
    // Resolve
    // TODO: Account for 1-2 HP.
    if (this.state.currentHp == 0) {
      if (percentHp >= Math.min(leaders.resolve(leader), leaders.resolve(helper))) {
        this.state.currentHp = 1;
        debug.print('RESOLVE TRIGGERED, team maintains 1 HP');
      }
    }
  }

  heal(amount: number, percent = 0) {
    this.state.currentHp += amount;
    if (percent) {
      this.state.currentHp += Math.ceil(this.getHp() * percent / 100);
    }
    this.state.currentHp = Math.min(this.state.currentHp, this.getHp());
  }

  getStats(): Stats {
    const team = this.getActiveTeam();
    const cds = [];
    for (const monster of team) {
      const baseCd = monster.getCooldown();
      const inheritCd = monster.getCooldownInherit();

      if (baseCd && baseCd != inheritCd) {
        cds.push(`${baseCd}(${inheritCd})`);
      } else if (baseCd && baseCd == inheritCd) {
        cds.push(`${baseCd}`);
      } else if (!baseCd && inheritCd) {
        cds.push(`?(? + ${inheritCd})`);
      } else {
        cds.push('');
      }
    }

    const atks = this.getActiveTeam().map((monster) => monster.getAtk(this.playerMode, this.state.awakenings));

    const counts: Map<Awakening, number> = new Map();
    const opts = {
      includeTeamBadge: true,
    };

    // General
    counts.set(Awakening.SKILL_BOOST, this.countAwakening(Awakening.SKILL_BOOST, opts));
    counts.set(Awakening.TIME, this.countAwakening(Awakening.TIME, opts));
    counts.set(Awakening.SOLOBOOST, this.countAwakening(Awakening.SOLOBOOST));
    counts.set(Awakening.BONUS_ATTACK, this.countAwakening(Awakening.BONUS_ATTACK));
    counts.set(Awakening.BONUS_ATTACK_SUPER, this.countAwakening(Awakening.BONUS_ATTACK_SUPER));
    counts.set(Awakening.L_GUARD, this.countAwakening(Awakening.L_GUARD));

    // Resists
    counts.set(Awakening.SBR, this.countAwakening(Awakening.SBR, opts));
    counts.set(Awakening.RESIST_POISON, this.countAwakening(Awakening.RESIST_POISON, opts));
    counts.set(Awakening.RESIST_BLIND, this.countAwakening(Awakening.RESIST_BLIND, opts));
    counts.set(Awakening.RESIST_JAMMER, this.countAwakening(Awakening.RESIST_JAMMER, opts));
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

    // Resists
    counts.set(Awakening.RESIST_FIRE, this.countAwakening(Awakening.RESIST_FIRE));
    counts.set(Awakening.RESIST_WATER, this.countAwakening(Awakening.RESIST_WATER));
    counts.set(Awakening.RESIST_WOOD, this.countAwakening(Awakening.RESIST_WOOD));
    counts.set(Awakening.RESIST_LIGHT, this.countAwakening(Awakening.RESIST_LIGHT));
    counts.set(Awakening.RESIST_DARK, this.countAwakening(Awakening.RESIST_DARK));
    counts.set(Awakening.AUTOHEAL, this.countAwakening(Awakening.AUTOHEAL));

    const testResult = runTests(this.tests, this.makeTestContext());

    const monsters = this.getActiveTeam();
    const leadId = monsters[0].getCard().leaderSkillId;
    const helpId = monsters[5].getCard().leaderSkillId;

    const leadBaseId = monsters[0].getCard(true).leaderSkillId;
    const helpBaseId = monsters[5].getCard(true).leaderSkillId;

    return {
      hps: this.getIndividualHp(),
      atks,
      rcvs: this.getIndividualRcv(),
      cds,
      totalHp: this.getHp(),
      effectiveHp: this.getEffectiveHp(),
      totalRcv: this.getRcv(),
      totalTime: this.getTime(),
      counts,
      tests: this.tests,
      testResult,

      lead: {
        bigBoard: leaders.bigBoard(leadBaseId) || leaders.bigBoard(helpBaseId),
        hp: leaders.hp(leadId) * leaders.hp(helpId),
        atk: leaders.atk(leadId) * leaders.atk(helpId),
        rcv: leaders.rcv(leadId) * leaders.rcv(helpId),
        damageMult: leaders.damageMult(leadId) * leaders.damageMult(helpId),
        plusCombo: leaders.plusCombo(leadId) + leaders.plusCombo(helpId),
        bonusAttack: leaders.bonusAttack(leadId) * monsters[0].getAtk(this.playerMode, this.state.awakenings) + leaders.bonusAttack(helpId) * monsters[5].getAtk(this.playerMode, this.state.awakenings),
        trueBonusAttack: leaders.trueBonusAttack(leadId) + leaders.trueBonusAttack(helpId),
      },
    };
  }
}

export {
  Team
};
