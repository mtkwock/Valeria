import { Attribute, Awakening, Latent, LatentSuper, MonsterType, DEFAULT_CARD, idxsFromBits } from './common';
import { Card, CardAssets, floof } from './ilmina_stripped';
import { create, MonsterIcon, MonsterInherit, MonsterLatent, ClassNames, OnMonsterUpdate } from './templates';
import { fuzzyMonsterSearch, prioritizedMonsterSearch, prioritizedInheritSearch } from './fuzzy_search';

const AWAKENING_BONUS = new Map<Awakening, number>([
  [Awakening.HP, 500],
  [Awakening.HP_MINUS, -5000],
  [Awakening.ATK, 100],
  [Awakening.ATK_MINUS, -1000],
  [Awakening.RCV, 200],
  [Awakening.RCV_MINUS, -2000],
]);

const LatentHp = new Map<Latent, number>([
  [Latent.HP, 0.015],
  [Latent.HP_PLUS, 0.045],
  [Latent.ALL_STATS, 0.03],
]);

const LatentAtk = new Map<Latent, number>([
  [Latent.ATK, 0.01],
  [Latent.ATK_PLUS, 0.03],
  [Latent.ALL_STATS, 0.02],
]);

const LatentRcv = new Map<Latent, number>([
  [Latent.RCV, 0.1],
  [Latent.RCV_PLUS, 0.3],
  [Latent.ALL_STATS, 0.2],
]);

const LatentToPdchu = new Map<Latent, string>([
  [Latent.HP, 'hp'],
  [Latent.ATK, 'atk'],
  [Latent.RCV, 'rcv'],
  [Latent.HP_PLUS, 'hp+'],
  [Latent.ATK_PLUS, 'atk+'],
  [Latent.RCV_PLUS, 'rcv+'],
  [Latent.TIME, 'te'],
  [Latent.TIME_PLUS, 'te+'],
  [Latent.AUTOHEAL, 'ah'],
  [Latent.RESIST_FIRE, 'rres'],
  [Latent.RESIST_WATER, 'bres'],
  [Latent.RESIST_WOOD, 'gres'],
  [Latent.RESIST_LIGHT, 'lres'],
  [Latent.RESIST_DARK, 'dres'],
  [Latent.RESIST_FIRE_PLUS, 'rres+'],
  [Latent.RESIST_WATER_PLUS, 'bres+'],
  [Latent.RESIST_WOOD_PLUS, 'gres+'],
  [Latent.RESIST_LIGHT_PLUS, 'lres+'],
  [Latent.RESIST_DARK_PLUS, 'dres+'],
  [Latent.SDR, 'sdr'],
  [Latent.ALL_STATS, 'all'],
  [Latent.EVO, 'evk'],
  [Latent.AWOKEN, 'awk'],
  [Latent.ENHANCED, 'enk'],
  [Latent.REDEEMABLE, 'rek'],
  [Latent.GOD, 'gok'],
  [Latent.DEVIL, 'dek'],
  [Latent.DRAGON, 'drk'],
  [Latent.MACHINE, 'mak'],
  [Latent.BALANCED, 'bak'],
  [Latent.ATTACKER, 'aak'],
  [Latent.PHYSICAL, 'phk'],
  [Latent.HEALER, 'hek'],
]);

const PdchuToLatent = new Map<string, Latent>();
for (const key of LatentToPdchu.keys()) {
  PdchuToLatent.set(LatentToPdchu.get(key) || '', key);
}

function validatePlus(value: number): number {
  value = Math.round(value);
  if (value < 0 || value > 99) {
    return 0;
  }
  return value;
}

function calcScaleStat(card: Card, max: number, min: number, level: number, growth: number): number {
  // Handle Level Limit Breakthrough.
  if (level >= 100) {
    const multiplier = 1 + card.limitBreakStatGain / 100 * (level - 99) / 11;
    return Math.round(max * multiplier);
  }
  const diff = max - min;
  const frac = (level - 1) / (card.maxLevel - 1);
  const added = Math.round(Math.pow(frac, growth) * diff);
  return min + added;
}

interface MonsterJson {
  id?: number;
  level?: number | undefined;
  awakenings?: number | undefined;
  latents?: Latent[] | undefined;
  superAwakeningIdx?: number | undefined;
  hpPlus?: number | undefined;
  atkPlus?: number | undefined;
  rcvPlus?: number | undefined;
  inheritId?: number | undefined;
  inheritLevel?: number | undefined;
  inheritPlussed?: boolean | undefined;
}

interface MonsterIconRenderData {
  plusses: number;
  unavailableReason: string,
  id: number;
  awakenings: number;
  superAwakeningIdx: number;
  level: number;
  inheritId: number;
  inheritLevel: number;
  inheritPlussed: boolean;
  latents: Latent[];
  showSwap: boolean;
  showTransform: boolean;
  activeTransform: boolean;
}

class MonsterInstance {
  id: number;
  level: number = 1;
  awakenings: number = 0;
  latents: Latent[] = [];
  superAwakeningIdx: number = -1;
  hpPlus: number = 0;
  atkPlus: number = 0;
  rcvPlus: number = 0;
  inheritId: number = -1;
  inheritLevel: number = 1;
  inheritPlussed: boolean = false;

  // Attributes set in dungeon.
  bound: boolean = false; // Monster being bound and unusable.
  attribute: Attribute = Attribute.NONE; // Attribute override.
  transformedTo: number = -1; // Monster transformation.

  el: HTMLElement;
  icon: MonsterIcon;
  inheritIcon: MonsterInherit;
  latentIcon: MonsterLatent;

  constructor(id: number = -1, onUpdate: OnMonsterUpdate = () => { }) {
    this.id = id;

    this.el = create('div');
    this.inheritIcon = new MonsterInherit();
    this.icon = new MonsterIcon();
    this.icon.setOnUpdate(onUpdate);
    this.latentIcon = new MonsterLatent();
    const inheritIconEl = this.inheritIcon.getElement();
    inheritIconEl.onclick = (e) => {
      e.stopPropagation();
      const els = document.getElementsByClassName(ClassNames.MONSTER_SELECTOR);
      if (els.length > 1) {
        const el = els[1] as HTMLInputElement;
        el.focus();
      }
    }
    this.el.appendChild(inheritIconEl);
    this.el.appendChild(this.icon.getElement());
    this.el.onclick = () => {
      const els = document.getElementsByClassName(ClassNames.MONSTER_SELECTOR);
      if (els.length) {
        const el = els[0] as HTMLInputElement;
        el.focus();
      }
    }
    this.el.appendChild(this.latentIcon.getElement());

    this.setId(id);
  }

  getElement(): HTMLElement {
    return this.el;
  }

  setId(id: number): void {
    if (id >= 0 && !(id in floof.model.cards)) {
      console.warn('Invalid monster id: ' + String(id));
      return;
    }
    this.id = id;
    this.transformedTo = -1;
    if (id == -1) {
      this.level = 1;
      this.awakenings = 0;
      this.latents.length = 0;
      this.superAwakeningIdx = -1;
      this.setHpPlus(0);
      this.setAtkPlus(0);
      this.setRcvPlus(0);
      return;
    }
    const c = this.getCard();

    // Change to monster's max level.
    this.setLevel(c.isLimitBreakable ? 110 : c.maxLevel);

    // Change to monster's max awakening level.
    this.awakenings = c.awakenings.length;

    // Attempt to copy the current latents.
    const latentCopy = this.latents;
    this.latents = [];
    for (const latent of latentCopy) {
      this.addLatent(latent);
    }

    // If c has the same SA as our current one, keep that.
    if (this.superAwakeningIdx > -1 && c) {
      const currentSa = c.superAwakenings[this.superAwakeningIdx];
      if (c.superAwakenings.some((sa) => sa == currentSa)) {
        this.superAwakeningIdx = c.superAwakenings.indexOf(currentSa);
      } else {
        this.superAwakeningIdx = -1;
      }
    } else {
      this.superAwakeningIdx = -1;
    }

    if (!CardAssets.canPlus(c)) {
      this.setHpPlus(0);
      this.setAtkPlus(0);
      this.setRcvPlus(0);
      this.inheritId = -1;
    } else {
      this.setHpPlus(99);
      this.setAtkPlus(99);
      this.setRcvPlus(99);
    }
  }

  getId(ignoreTransform: boolean = false): number {
    if (!ignoreTransform && this.transformedTo > 0) {
      return this.transformedTo;
    }
    return this.id;
  }

  getRenderData(isMultiplayer: boolean, showSwap = false): MonsterIconRenderData {
    const plusses = this.hpPlus + this.atkPlus + this.rcvPlus
    return {
      plusses,
      // A monster must be above level 99, max plussed, and in solo play for
      // SAs to be active.  This will change later when 3P allows SB.
      unavailableReason: [
        isMultiplayer ? 'Multiplayer' : '',
        plusses != 297 ? 'Unplussed' : '',
        this.level < 100 ? 'Not Limit Broken' : '',
      ].filter(Boolean).join(', '),
      id: this.getId(),
      awakenings: this.awakenings,
      superAwakeningIdx: this.superAwakeningIdx,
      level: this.level,
      inheritId: this.inheritId,
      inheritLevel: this.inheritLevel,
      inheritPlussed: this.inheritPlussed,
      latents: [...this.latents],
      showSwap: showSwap,
      showTransform: this.transformedTo > 0 || this.getCard().transformsTo > 0,
      activeTransform: this.transformedTo > 0,
    };
  }

  update(isMultiplayer: boolean = false, data: MonsterIconRenderData | undefined = undefined): void {
    if (!data) {
      data = this.getRenderData(isMultiplayer);
    }
    this.icon.update({
      id: data.id,
      plusses: data.plusses,
      awakening: data.awakenings,
      superAwakeningIdx: data.superAwakeningIdx,
      unavailableReason: data.unavailableReason,
      level: data.level,
      showSwap: data.showSwap,
      showTransform: data.showTransform,
      activeTransform: data.activeTransform,
    });
    this.inheritIcon.update(data.inheritId, data.inheritLevel, data.inheritPlussed);
    this.latentIcon.update([...data.latents]);
  }

  toJson(): MonsterJson {
    const json: MonsterJson = {};
    if (this.id >= 0) {
      json.id = this.id;
      if (this.level > 1) {
        json.level = this.level;
      }
      // TODO: Make max awakening default;
      json.awakenings = this.awakenings;
      if (this.latents.length) {
        json.latents = [...this.latents];
      }
      if (this.hpPlus) {
        json.hpPlus = this.hpPlus;
      }
      if (this.atkPlus) {
        json.atkPlus = this.atkPlus;
      }
      if (this.rcvPlus) {
        json.rcvPlus = this.rcvPlus;
      }
      if (this.inheritId >= 0) {
        json.inheritId = this.inheritId;
        json.inheritLevel = this.inheritLevel;
        json.inheritPlussed = this.inheritPlussed;
      }
      if (this.superAwakeningIdx >= 0) {
        json.superAwakeningIdx = this.superAwakeningIdx;
      }
    }
    return json;
  }

  getCard(ignoreTransform: boolean = false): Card {
    const id = this.getId(ignoreTransform);
    let c = floof.model.cards[id];
    if (c) {
      return c;
    }
    return DEFAULT_CARD;
  }

  getInheritCard(): Card | void {
    if (this.inheritId == 0) {
      return DEFAULT_CARD;
    }
    return floof.model.cards[this.inheritId];
  }

  toPdchu(): string {
    let string = '';
    if (this.id in floof.model.cards) {
      string += String(this.id);
    } else {
      string += 'sdr';
    }

    const card = this.getCard();
    const inherit = this.getInheritCard();
    if (inherit) {
      string += ` (${this.inheritId}`;
      if (inherit.attribute == card.attribute) {
        let stats = ' |';
        if (this.inheritLevel != 1) {
          stats += ` lv${this.inheritLevel}`;
        }
        if (this.inheritPlussed) {
          stats += ' +297';
        }
        if (stats.length > 2) {
          string += stats;
        }
      }
      string += ')';
    }

    if (this.latents.length) {
      const counts = new Map<string, number>();
      for (const latent of this.latents) {
        const name = LatentToPdchu.get(latent) || 'sdr';
        counts.set(name, (counts.get(name) || 0) + 1);
      }
      string += '[';
      for (const name of counts.keys()) {
        if (counts.get(name) == 1) {
          string += name + ',';
        } else {
          string += name + `*${counts.get(name)},`;
        }
      }
      string = string.substring(0, string.length - 1) + ']';
    }

    let stats = ' |';

    if (this.level != card.maxLevel) {
      stats += ` lv${this.level}`;
    }
    if (this.awakenings != card.awakenings.length) {
      stats += ` aw${this.awakenings}`;
    }
    if (this.hpPlus == 0 && this.atkPlus == 0 && this.rcvPlus == 0) {
      stats += ' +0';
    } else if (this.hpPlus != 99 || this.atkPlus != 99 || this.rcvPlus != 99) {
      stats += ` +H${this.hpPlus} +A${this.atkPlus} +R${this.rcvPlus}`;
    }

    if (this.superAwakeningIdx >= 0) {
      stats += ` sa${this.superAwakeningIdx + 1}`;
    }
    if (stats.length > 2) {
      string += stats;
    }

    return string;
  }

  fromPdchu(str: string): void {
    let s = str.trim().toLowerCase();
    let assistPlussed = false;
    let assistLevel = 1;
    let latents = [];
    let hpPlus = 99;
    let atkPlus = 99;
    let rcvPlus = 99;
    let awakeningLevel = 9;
    let superAwakeningIdx = -1;
    let level = 99;

    const MONSTER_NAME_REGEX = /^\s*((\"[^"]+\")|[^\(\[\|]*)/;
    const ASSIST_REGEX = /\(\s*("[^"]*")?[^\)]+\)/;
    const ASSIST_NAME_REGEX = /^\s*("[^"]+"|[^|]+)/;
    const LATENT_REGEX = /\[[^\]]*\]/;

    const monsterNameMatch = s.match(MONSTER_NAME_REGEX);
    if (!monsterNameMatch) {
      return;
    }

    let monsterName = monsterNameMatch[0].trim();
    if (monsterName.startsWith('"')) {
      monsterName = monsterName.substring(1);
    }
    if (monsterName.endsWith('"')) {
      monsterName = monsterNameMatch[0].substring(0, monsterName.length - 1);
    }
    // Remove monster name.
    s = s.replace(monsterNameMatch[0], '');

    // Handle assist.
    let assistName = '';
    const assistMatch = s.match(ASSIST_REGEX);
    if (assistMatch) {
      let assistString = assistMatch[0].substring(1, assistMatch[0].length - 1).trim();
      const assistNameMatch = assistString.match(ASSIST_NAME_REGEX);
      if (assistNameMatch) {
        assistName = assistNameMatch[0].trim();
        if (assistName.startsWith('"')) {
          assistName = assistName.substring(1);
        }
        if (assistName.endsWith('"')) {
          assistName = assistName.substring(0, assistName.length - 1);
        }

        const pieces = assistString.replace(assistNameMatch[0], '').split('|');
        if (pieces.length > 1) {
          const assistStatString = pieces.slice(1).join('');
          const lvMatch = assistStatString.match(/lv\d+/);
          if (lvMatch) {
            assistLevel = Number(lvMatch[0].substring(2));
          }
          const plusMatch = assistStatString.match(/\+297/);
          if (plusMatch) {
            assistPlussed = true;
          }
        }
      }
      s = s.replace(assistMatch[0], '').trim();
    }

    let latentMatch = s.match(LATENT_REGEX);
    if (latentMatch) {
      const latentPieces = latentMatch[0]
        .substring(1, latentMatch[0].length - 1)
        .trim()
        .split(',')
        .map((piece) => piece.trim())
        .filter((a) => a.length > 0);
      for (const piece of latentPieces) {
        const latentMatch = piece.match(/\w+\+?/);
        if (!latentMatch) {
          continue;
        }
        const latentName = latentMatch[0];
        let latent = PdchuToLatent.get(String(latentName)) || Latent.SDR;
        if (latent == undefined) {
          continue;
        }
        if (piece.includes('*')) {
          for (let i = 0; i < Number(piece[piece.length - 1]); i++) {
            latents.push(latent);
          }
        } else {
          latents.push(latent);
        }
      }

      s.replace(latentMatch[0], '');
    }

    // Handle Stats.
    if (s.includes('|')) {
      s = s.substring(s.indexOf('|'));
      const saMatch = s.match(/sa\d/);
      if (saMatch) {
        superAwakeningIdx = Number(saMatch[0].substring(2)) - 1;
        level = 110;
      }
      const lvMatch = s.match(/lv\d+/);
      if (lvMatch) {
        level = Number(lvMatch[0].substring(2));
      }
      const awakeningMatch = s.match(/aw\d/);
      if (awakeningMatch) {
        awakeningLevel = Number(awakeningMatch[0].substring(2));
      }
      const plusMatch = s.match(/\+0/);
      if (plusMatch) {
        hpPlus = 0;
        atkPlus = 0;
        rcvPlus = 0;
      }
      const plusHpMatch = s.match(/\+h\d+/);
      if (plusHpMatch) {
        hpPlus = Number(plusHpMatch[0].substring(2));
      }
      const plusAtkMatch = s.match(/\+a\d+/);
      if (plusAtkMatch) {
        atkPlus = Number(plusAtkMatch[0].substring(2));
      }
      const plusRcvMatch = s.match(/\+r\d+/);
      if (plusRcvMatch) {
        rcvPlus = Number(plusRcvMatch[0].substring(2));
      }
    }

    const bestGuessIds = fuzzyMonsterSearch(monsterName, 20, prioritizedMonsterSearch);
    if (bestGuessIds.length == 0) {
      console.warn('No Monsters matched');
      return;
    }

    this.inheritPlussed = assistPlussed;
    this.inheritLevel = assistLevel;
    this.latents.length = 0;
    this.setId(bestGuessIds[0]);
    this.superAwakeningIdx = superAwakeningIdx;
    this.setLevel(level);
    for (const latent of latents) {
      this.addLatent(/** @type {!Latent}*/(latent));
    }
    if (bestGuessIds[0] != -1) {
      this.setHpPlus(hpPlus);
      this.setAtkPlus(atkPlus);
      this.setRcvPlus(rcvPlus);
      this.awakenings = Math.min(floof.model.cards[bestGuessIds[0]].awakenings.length, awakeningLevel);
    }
    if (assistName) {
      const bestGuessInheritIds = fuzzyMonsterSearch(assistName, 20, prioritizedInheritSearch);
      if (bestGuessInheritIds.length == 0) {
        this.inheritId = -1;
        console.warn('No inherits matched');
      } else {
        this.inheritId = bestGuessInheritIds[0];
      }
    } else {
      this.inheritId = -1;
    }
  }

  isSuperAwakeningActive(isMultiplayer: boolean): boolean {
    return (!isMultiplayer && this.level > 99 && this.hpPlus == 99
      && this.atkPlus == 99 && this.hpPlus == 99);
  }

  getAwakenings(isMultiplayer: boolean, filterSet: Set<Awakening>): Awakening[] {
    let filterFn = (_awakening: Awakening) => true;
    if (filterSet) {
      filterFn = (awakening: Awakening) => filterSet.has(awakening);
    }
    const c = this.getCard();
    let awakenings: Awakening[] = c.awakenings.slice(0, this.awakenings);
    // A transformed monster is always fully awoken.
    if (this.transformedTo > 0) {
      awakenings = [...c.awakenings];
    }
    if (this.isSuperAwakeningActive(isMultiplayer) && this.superAwakeningIdx > -1) {
      awakenings.push(c.superAwakenings[this.superAwakeningIdx]);
    }
    const inherit = this.getInheritCard();
    if (inherit && inherit.awakenings.length && inherit.awakenings[0] == Awakening.AWOKEN_ASSIST) {
      for (const a of inherit.awakenings) {
        awakenings.push(a);
      }
    }
    return awakenings.filter(filterFn);
  }

  countAwakening(awakening: Awakening, isMultiplayer: boolean = false): number {
    return this.getAwakenings(isMultiplayer, new Set([awakening])).length;
  }

  getLatents(filterSet: Set<Latent> | null = null): Latent[] {
    let filterFn = (_latent: Latent) => true;
    if (filterSet) {
      filterFn = (latent: Latent) => filterSet.has(latent);
    }
    return this.latents.filter(filterFn);
  }

  calcScaleStat(max: number, min: number, growth: number): number {
    return calcScaleStat(this.getCard(), max, min, this.level, growth);
  }

  addLatent(latent: Latent): void {
    const c = this.getCard(true);
    // Only monsters capable of taking latent killers can take latents.
    if (!c.latentKillers.length) {
      return;
    }
    const maxSlots = c.inheritanceType & 32 ? 8 : 6;
    let totalSlots = 0;
    for (const l of this.latents) {
      totalSlots += LatentSuper.has(l) ? 2 : 1;
    }
    totalSlots += LatentSuper.has(latent) ? 2 : 1;
    if (totalSlots > maxSlots) return;
    if (latent >= 16 && latent <= 23 && !c.latentKillers.some((killer) => killer == (latent - 11))) {
      return;
    }
    this.latents.push(latent);
  }

  removeLatent(latentIdx: number): void {
    if (latentIdx >= this.latents.length) {
      console.warn(`latent index out of range: ${latentIdx}`);
      return;
    }
    this.latents = [...this.latents.slice(0, latentIdx), ...this.latents.slice(latentIdx + 1)];
  }

  setLevel(v: number): void {
    v = Math.round(v);
    const c = this.getCard();
    if (v < 1) {
      v = 1;
    }
    const maxLevel = c.isLimitBreakable ? 110 : c.maxLevel;
    if (v > maxLevel) {
      v = maxLevel;
    }
    this.level = v;
  }
  setHpPlus(v: number): void {
    this.hpPlus = validatePlus(v);
  }
  setAtkPlus(v: number): void {
    this.atkPlus = validatePlus(v);
  }
  setRcvPlus(v: number): void {
    this.rcvPlus = validatePlus(v);
  }

  getHp(isMultiplayer: boolean = true, awakeningsActive: boolean = true): number {
    if (this.id == -1) {
      return 0;
    }
    const c = this.getCard();
    let hp = this.calcScaleStat(c.maxHp, c.minHp, c.hpGrowth);
    if (awakeningsActive) {
      let latentMultiplier = 1;
      for (const latent of this.getLatents(new Set([Latent.HP, Latent.HP_PLUS, Latent.ALL_STATS]))) {
        latentMultiplier += LatentHp.get(latent) || 0;
      }
      hp *= latentMultiplier;
      let awakeningAdder = 0;
      for (const awakening of this.getAwakenings(isMultiplayer, new Set([Awakening.HP, Awakening.HP_MINUS]))) {
        awakeningAdder += AWAKENING_BONUS.get(awakening) || 0;
      }
      hp += awakeningAdder;
    }

    const plusAdder = this.hpPlus * 10;
    hp += plusAdder;

    const inherit = this.getInheritCard();
    if (inherit && c.attribute == inherit.attribute) {
      const inheritBonus = calcScaleStat(
        inherit, inherit.maxHp, inherit.minHp, this.inheritLevel, inherit.hpGrowth) + (this.inheritPlussed ? 990 : 0);
      hp += Math.round(inheritBonus * 0.1);
    }

    if (isMultiplayer) {
      const multiboostMultiplier = 1.5 ** this.countAwakening(Awakening.MULTIBOOST, isMultiplayer);
      hp *= multiboostMultiplier;
    }

    return Math.max(Math.round(hp), 1);
  }

  getAtk(isMultiplayer: boolean = true, awakeningsActive: boolean = true): number {
    if (this.id == -1) {
      return 0;
    }
    const c = this.getCard();
    let atk = this.calcScaleStat(c.maxAtk, c.minAtk, c.atkGrowth);
    if (awakeningsActive) {
      let latentMultiplier = 1;
      for (const latent of this.getLatents(new Set([Latent.ATK, Latent.ATK_PLUS, Latent.ALL_STATS]))) {
        latentMultiplier += LatentAtk.get(latent) || 0;
      }
      atk *= latentMultiplier;
      let awakeningAdder = 0;
      for (const awakening of this.getAwakenings(isMultiplayer, new Set([Awakening.ATK, Awakening.ATK_MINUS]))) {
        awakeningAdder += AWAKENING_BONUS.get(awakening) || 0;
      }
      atk += awakeningAdder;
    }

    const plusAdder = this.atkPlus * 5;
    atk += plusAdder;

    const inherit = this.getInheritCard();
    if (inherit && c.attribute == inherit.attribute) {
      const inheritBonus = calcScaleStat(
        inherit, inherit.maxAtk, inherit.minAtk, this.inheritLevel, inherit.atkGrowth) + (this.inheritPlussed ? 495 : 0);
      atk += Math.round(inheritBonus * 0.05);
    }

    if (isMultiplayer && awakeningsActive) {
      const multiboostMultiplier = 1.5 ** this.countAwakening(Awakening.MULTIBOOST, isMultiplayer);
      atk *= multiboostMultiplier;
    }

    return Math.max(Math.round(atk), 1);
  }

  getRcv(isMultiplayer: boolean = true, awakeningsActive: boolean = true): number {
    const c = this.getCard();
    let rcv = this.calcScaleStat(c.maxRcv, c.minRcv, c.rcvGrowth);
    if (awakeningsActive) {
      let latentMultiplier = 1;
      for (const latent of this.getLatents(new Set([Latent.RCV, Latent.RCV_PLUS, Latent.ALL_STATS]))) {
        latentMultiplier += LatentRcv.get(latent) || 0;
      }
      rcv *= latentMultiplier;
      const rcvSet = new Set([Awakening.RCV, Awakening.RCV_MINUS]);
      let total = 0;
      for (const awakening of this.getAwakenings(isMultiplayer, rcvSet)) {
        total += AWAKENING_BONUS.get(awakening) || 0;
      }
      rcv += total;
    }

    const plusAdder = this.rcvPlus * 3;
    rcv += plusAdder;

    const inherit = this.getInheritCard();
    if (inherit && c.attribute == inherit.attribute) {
      const inheritBonus = calcScaleStat(
        inherit, inherit.maxRcv, inherit.minRcv, this.inheritLevel, inherit.rcvGrowth) + (this.inheritPlussed ? 297 : 0);
      rcv += Math.round(inheritBonus * 0.15);
    }

    if (isMultiplayer && awakeningsActive) {
      const multiboostMultiplier = 1.5 ** this.countAwakening(Awakening.MULTIBOOST, isMultiplayer);
      rcv *= multiboostMultiplier;
    }

    return Math.round(rcv);
  }

  getAttribute(): Attribute {
    if (this.attribute != Attribute.NONE) {
      return this.attribute;
    }
    return this.getCard().attribute;
  }

  getSubattribute(): Attribute {
    const c = this.getCard();
    if (c.subattribute == Attribute.NONE) {
      return Attribute.NONE;
    }
    if (this.attribute != Attribute.NONE) {
      return this.attribute;
    }
    return c.subattribute;
  }

  isType(t: MonsterType): boolean {
    return this.getCard().types.some((type) => type == t);
  }

  anyTypes(t: MonsterType[]): boolean {
    return t.some((type) => this.isType(type));
  }

  isAttribute(a: Attribute): boolean {
    const c = this.getCard();
    return c.attribute == a || c.subattribute == a;
  }

  anyAttributes(a: Attribute[]): boolean {
    return a.some((attr) => this.isAttribute(attr));
  }

  anyAttributeTypeBits(attrBits: number, typeBits: number) {
    return this.anyAttributes(idxsFromBits(attrBits)) || this.anyTypes(idxsFromBits(typeBits));
  }

  fromJson(json: MonsterJson): void {
    // const monster = new MonsterInstance(json.id || -1);
    this.setId(json.id || -1);
    this.level = json.level || 1;
    this.awakenings = json.awakenings || 1;
    this.latents = [...(json.latents || [])];
    if (json.superAwakeningIdx == null || json.superAwakeningIdx == undefined) {
      this.superAwakeningIdx = -1;
    } else {
      this.superAwakeningIdx = json.superAwakeningIdx;
    }
    this.setHpPlus(json.hpPlus || 0);
    this.setAtkPlus(json.atkPlus || 0);
    this.setRcvPlus(json.rcvPlus || 0);
    this.inheritId = json.inheritId || -1;
    this.inheritLevel = json.inheritLevel || 1;
    this.inheritPlussed = json.inheritPlussed || false;
  }

  // TODO: Consider loading this like a fromJson.
  copyFrom(otherInstance: MonsterInstance) {
    this.level = otherInstance.level;
    this.awakenings = otherInstance.awakenings;
    this.latents = [...otherInstance.latents];
    this.superAwakeningIdx = otherInstance.superAwakeningIdx;
    this.hpPlus = otherInstance.hpPlus;
    this.atkPlus = otherInstance.atkPlus;
    this.rcvPlus = otherInstance.rcvPlus;

    this.inheritId = otherInstance.inheritId;
    this.inheritLevel = otherInstance.inheritLevel;
    this.inheritPlussed = otherInstance.inheritPlussed;
    this.setId(otherInstance.id);
  }

  static swap(instanceA: MonsterInstance, instanceB: MonsterInstance): void {
    const temp = new MonsterInstance();
    temp.copyFrom(instanceA);
    instanceA.copyFrom(instanceB);
    instanceB.copyFrom(temp);
  }
}

// class DamagePing {
//   source: MonsterInstance;
//   attribute: Attribute;
//
//   amount: number = 0;
//
//   ignoreVoid: boolean = false;
//   ignoreDefense: boolean = false;
//   isSub: boolean = false;
//
//   // Only makes sense when hitting an enemy.
//   rawDamage: number = -1;
//   actualDamage: number = -1;
//
//   constructor(source: MonsterInstance, attribute: Attribute) {
//     this.source = source;
//     this.attribute = attribute;
//   }
//
//   add(amount: number) {
//     this.amount += amount;
//   }
//
//   multiply(multiplier: number, round = Round.NEAREST): void {
//     this.amount = round(this.amount * multiplier);
//   }
// }

export {
  LatentToPdchu,
  MonsterInstance,
  MonsterJson,
}
