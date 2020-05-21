import { Attribute, MonsterType, DEFAULT_CARD, idxsFromBits, Rational, TypeToKiller, TypeToLatentKiller, INT_CAP, Awakening } from './common';
import { floof, Card, EnemySkill } from './ilmina_stripped';
import { DamagePing } from './damage_ping';
import { ComboContainer } from './combo_container';

function calcScaleStat(max: number, min: number, level: number, growth: number): number {
  const diff = max - min;
  const frac = (level - 1) / 9;
  const added = Math.round(Math.pow(frac, growth) * diff);
  return min + added;
}

interface EnemyInstanceJson {
  id?: number,
  lv?: number,
}

const Advantage: Record<number, Attribute> = {
  0: 2,
  1: 0,
  2: 1,
  3: 4,
  4: 3,
};

const Disadvantage: Record<number, Attribute> = {
  0: 1,
  1: 2,
  2: 0,
};

class EnemyInstance {
  id: number = 4014;
  lv: number = 10;
  hp: number = -1;

  // Used for determining moveset.
  charges = 0;
  flags = 0;
  counter = 0;
  forceAttack = false; // If true, next attack must be basic.
  otherEnemyHp = 100;

  // Values that can change during battle.
  currentHp: number = 1;
  currentAttribute: number = -1; // -1 is main, -2 is sub.
  statusShield: boolean = false;
  shieldPercent: number = 0; // Damage is multiplied by (100 - shieldPercent) / 100
  attributeAbsorb: Attribute[] = []; // Each attribute absorbed.
  comboAbsorb: number = 0; // Combos of this or fewer are absorbed.
  damageAbsorb: number = 0;
  damageVoid: number = 0;
  attackMultiplier: number = 1; // Enrage
  turnsRemaining: number = 1; // Not to be used yet.
  turnCounterOverride: number = -1; // Not to be used yet.
  invincible: boolean = false;

  // Debuffs by players
  ignoreDefensePercent: number = 0;
  poison: number = 0;
  delayed: boolean = false; // Not to be used yet.

  dungeonMultipliers = {
    hp: new Rational(),
    atk: new Rational(),
    def: new Rational(),
  }

  constructor() {
  }

  setLevel(lv: number) {
    this.lv = lv;
  }

  getHp(): number {
    const c = this.getCard();
    return this.dungeonMultipliers.hp.multiply(calcScaleStat(
      c.enemyHpAtLv10,
      c.enemyHpAtLv1,
      this.lv,
      c.enemyHpCurve,
    ), Math.ceil);
  }

  getHpPercent(): number {
    return Math.round(100 * this.currentHp / this.getHp());
  }

  getAtkBase(): number {
    const c = this.getCard();
    return this.dungeonMultipliers.atk.multiply(calcScaleStat(
      c.enemyAtkAtLv10,
      c.enemyAtkAtLv1,
      this.lv,
      c.enemyAtkCurve,
    ), Math.ceil);
  }

  getAtk(): number {
    return Math.ceil(this.getAtkBase() * this.attackMultiplier);
  }

  getDefBase(): number {
    const c = this.getCard();
    return this.dungeonMultipliers.def.multiply(calcScaleStat(
      c.enemyDefAtLv10,
      c.enemyDefAtLv1,
      this.lv,
      c.enemyDefCurve,
    ), Math.ceil);
  }

  getDef(): number {
    const defMultiplier = (100 - this.ignoreDefensePercent) / 100;
    return Math.ceil(defMultiplier * this.getDefBase());
  }

  getSuperResolve(): { minHp: number; triggersAt: number } {
    const superResolveSkills = this.getEnemySkills(129);
    if (!superResolveSkills.length) {
      return {
        minHp: 0,
        triggersAt: 0,
      };
    }
    if (superResolveSkills.length > 1) {
      console.warn('Multiple super resolve skills detected.  Only using first.');
    }
    return {
      minHp: superResolveSkills[0].skillArgs[0],
      triggersAt: superResolveSkills[0].skillArgs[1],
    };
  }

  private getEnemySkills(internalEffectId = -1): EnemySkill[] {
    const c = this.getCard();
    return c.enemySkills
      .map((skill) => skill.enemySkillId)
      .map((id) => floof.model.enemySkills[id])
      .filter((skill) => internalEffectId < 0 || skill.internalEffectId == internalEffectId);
  }

  getResolve(): number {
    const resolveSkills = this.getEnemySkills(73);
    if (!resolveSkills.length) {
      return 0;
    }
    if (resolveSkills.length > 1) {
      console.warn('Multiple resolve skills detected. Only using first');
    }
    return resolveSkills[0].skillArgs[0];
  }

  getTypeResists(): { types: MonsterType[], percent: number } {
    const resistTypeSkills = this.getEnemySkills(118);
    if (!resistTypeSkills.length) {
      return { types: [], percent: 0 };
    }
    if (resistTypeSkills.length > 1) {
      console.warn('Multiple Type Resist skills detected. Only using first');
    }
    const [typeBits, percent] = resistTypeSkills[0].skillArgs;
    return {
      types: idxsFromBits(typeBits) as MonsterType[],
      percent: percent,
    };
  }

  getAttrResists(): { attrs: Attribute[], percent: number } {
    const resistAttrSkills = this.getEnemySkills(72);
    if (!resistAttrSkills.length) {
      return { attrs: [], percent: 0 };
    }
    if (resistAttrSkills.length > 1) {
      console.warn('Multiple Type Resist skills detected. Only using first');
    }
    const [attrBits, percent] = resistAttrSkills[0].skillArgs;
    return {
      attrs: idxsFromBits(attrBits) as Attribute[],
      percent: percent,
    };
  }

  getCard(): Card {
    if (!floof.model.cards[this.id]) {
      return DEFAULT_CARD;
    }
    return floof.model.cards[this.id];
  }

  getAttribute() {
    if (this.id in floof.model.cards && this.currentAttribute == -1) {
      return floof.model.cards[this.id].attribute;
    }
    if (this.id in floof.model.cards && this.currentAttribute == -2) {
      return floof.model.cards[this.id].subattribute > -1 ? floof.model.cards[this.id].subattribute : floof.model.cards[this.id].attribute;
    }
    return this.currentAttribute;
  }

  calcDamage(
    ping: DamagePing,
    pings: DamagePing[],
    comboContainer: ComboContainer,
    isMultiplayer: boolean,
    voids: { attributeAbsorb: boolean; damageAbsorb: boolean; damageVoid: boolean }): number {

    let currentDamage = ping.damage;
    if (!currentDamage) {
      return 0;
    }

    // Handle Attribute (dis)advantage
    if (Advantage[ping.attribute] == this.getAttribute()) {
      currentDamage *= 2;
    } else if (Disadvantage[ping.attribute] == this.getAttribute()) {
      currentDamage = Math.ceil(currentDamage / 2);
    }

    // Handle killers.
    const types: MonsterType[] = floof.model.cards[this.id] ? floof.model.cards[this.id].types : [];
    if (!ping.isActive) {
      let killerCount = 0;
      let latentCount = 0;
      for (const type of types) {
        killerCount += ping.source.countAwakening(TypeToKiller[type], isMultiplayer);
        latentCount += ping.source.latents.filter((latent) => latent == TypeToLatentKiller[type]).length;
      }
      currentDamage *= (3 ** killerCount);
      currentDamage *= (1.5 ** latentCount);
      currentDamage = Math.min(currentDamage, INT_CAP);
    }

    if (ping.attribute != Attribute.FIXED) {
      // Handle resisted Attributes and Types
      const attrResists = this.getAttrResists();
      if (attrResists.attrs.includes(ping.attribute)) {
        currentDamage *= (100 - attrResists.percent) / 100;
      }
      const typeResists = this.getTypeResists();
      if (ping.source.anyTypes(typeResists.types)) {
        currentDamage *= (100 - typeResists.percent) / 100;
      }
      currentDamage = Math.ceil(currentDamage);

      // Handle Defense
      if (!ping.source.countAwakening(Awakening.GUARD_BREAK) ||
        new Set(pings.filter((p) => p.damage).map((p) => p.attribute)).size < 5) {
        currentDamage -= this.getDef();
        currentDamage = Math.max(currentDamage, 1);
      }

      // Handle Shield
      if (this.shieldPercent) {
        currentDamage *= (100 - this.shieldPercent) / 100;
        currentDamage = Math.ceil(currentDamage);
      }
    }

    // Handle void
    if (this.damageVoid && currentDamage >= this.damageVoid &&
      !ping.ignoreVoid && !voids.damageVoid) {
      currentDamage = 0;
    }

    // Handle Absorbs
    if (this.attributeAbsorb.includes(ping.attribute) && !voids.attributeAbsorb) {
      currentDamage *= -1;
    } else if (this.damageAbsorb && currentDamage >= this.damageAbsorb && !voids.damageAbsorb) {
      currentDamage *= -1;
    } else if (this.comboAbsorb && !ping.isActive && comboContainer.comboCount() <= this.comboAbsorb) {
      currentDamage *= -1;
    }

    return currentDamage;
  }

  setId(id: number): void {
    if (!(id in floof.model.cards)) {
      return;
    }

    this.id = id;
    this.reset();
  }

  getName(): string {
    if (this.id < 0 || !(this.id in floof.model.cards)) {
      return 'UNSET';
    }
    return floof.model.cards[this.id].name;
  }

  reset(/** idc */) {
    this.currentHp = this.getHp();
    this.currentAttribute = -1;
    this.statusShield = false;
    this.shieldPercent = 0;
    this.attributeAbsorb.length = 0;
    this.comboAbsorb = 0;
    this.damageAbsorb = 0;
    this.damageVoid = 0;
    this.attackMultiplier = 1;
    // this.turnsRemaining = this.turnCounter;
    this.turnCounterOverride = -1;
    this.ignoreDefensePercent = 0;
    this.poison = 0;
    this.delayed = false;

    // Assume that only large monsters are alone.
    this.otherEnemyHp = this.getCard().monsterSize == 5 ? 0 : 100;

    this.charges = floof.model.cards[this.id].charges;
    this.counter = 0;
    this.flags = 0;
  }

  // TODO
  // useSkillset(skillIdx, idc) {
  //   if (!skillIdx in this.skillsets) {
  //     console.warn(`Invalid idx: ${skillIdx}, not performing any.`)
  //     return;
  //   }
  //   this.skillsets[skillIdx].applySkillset(idc, this);
  // }

  toJson(): EnemyInstanceJson {
    const obj: EnemyInstanceJson = {};
    if (this.id in floof.model.cards) {
      obj.id = this.id;
    }
    if (this.lv != 10) {
      obj.lv = this.lv;
    }
    return obj;
  }

  static fromJson(json: EnemyInstanceJson): EnemyInstance {
    const enemy = new EnemyInstance();
    enemy.id = Number(json.id) || -1;
    enemy.lv = Number(json.lv) || 10;
    enemy.reset();
    return enemy;
  }
}

export {
  EnemyInstance,
  EnemyInstanceJson,
};
