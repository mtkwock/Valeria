import {Attribute, MonsterType, DEFAULT_CARD} from './common';
import {KnockoutVM, Card} from '../typings/ilmina';

declare var vm: KnockoutVM;

enum EnemySkillEffect {
  NONE = 'None',
  // MULTI_HIT: 'multi-hit', // #hits
  // GRAVITY: 'gravity', // %Gravity
  STATUS_SHIELD = 'Status Shield', // config unused.
  DAMAGE_SHIELD = 'Shield', // %shield (e.g. 50, 75)
  // SELF_HEAL: 'enemy-heal', // %heal (e.g. 10, 50, 100)
  // PLAYER_HEAL: 'player-heal', // %heal
  DAMAGE_ABSORB = 'Damage Absorb', // Minimum value absorbed.
  ATTRIBUTE_ABSORB = 'Attribute Absorb', // Flags, 1: Fire, 2: Water, 4: Wood, 8: Light, 16: Dark
  COMBO_ABSORB = 'Combo Absorb', // Max combos of the absorb.
  // ENRAGE: 'enrage', // %Damage (e.g. 150, 200, 1000)
  DAMAGE_VOID = 'Damage Void', // Min damage voided
  // CLEAR_BUFFS: 'clear', // config unused.
  // RCV_BUFF: 'rcv', // Percent RCV (e.g. 0, 25, 50, 300)
  // TIME_BUFF_FLAT: 'time-flat', // Time delta (e.g. -5, -2, +1, +5)
  // TIME_BUFF_SCALE: 'time-scale', // Time multiplier (e.g. 0.25, 0.5, 3)
  // Not supporting.
  // ORB_CHANGE: 'orb-change',
  // BLIND: 'blind', // Unused config.
  // STICKY_BLIND: 'sticky-blind', // Config is [positions], turns
  // AWAKENING_BIND: 'awakening-bind',
};


function calcScaleStat(max: number, min: number, level: number, growth: number): number {
  const diff = max - min;
  const frac = (level - 1) / 9;
  const added = Math.round(Math.pow(frac, growth) * diff);
  return min + added;
}

interface EnemySkillJson {
  name?: string;
  damagePercent?: number;
  effect?: EnemySkillEffect;
  config?: number;
}

class EnemySkill {
  name: string = '';
  effect: EnemySkillEffect = EnemySkillEffect.NONE;
  config: number = 0;
  damagePercent: number = 0; // If 0, no attack.

  // apply(idc, source) {
  //   // console.warn('Enemy Skills not handled yet');
  //   console.debug(idc);
  //   switch(this.effect) {
  //     case EnemySkillEffect.NONE:
  //       break;
  //     case EnemySkillEffect.STATUS_SHIELD:
  //       source.statusShield = true;
  //       break;
  //     case EnemySkillEffect.DAMAGE_SHIELD:
  //       source.shieldPercent = this.config;
  //       break;
  //     case EnemySkillEffect.DAMAGE_ABSORB:
  //       source.damageAbsorb = this.config;
  //       break;
  //     case EnemySkillEffect.ATTRIBUTE_ABSORB:
  //       source.attributeAbsorb = idxsFromBits(this.config);
  //       break;
  //     case EnemySkillEffect.DAMAGE_VOID:
  //       source.damageVoid = this.config;
  //       break;
  //     case EnemySkillEffect.COMBO_ABSORB:
  //       source.comboAbsorb = this.config;
  //       break;
  //     case EnemySkillEffect.ENRAGE:
  //       source.enrage = this.config;
  //       break;
  //     // case EnemySkillEffect.MULTI_HIT:
  //     // case EnemySkillEffect.GRAVITY:
  //     // case EnemySkillEffect.SELF_HEAL:
  //     // case EnemySkillEffect.PLAYER_HEAL:
  //     // case EnemySkillEffect.CLEAR_BUFFS:
  //     // case EnemySkillEffect.RCV_BUFF:
  //     // case EnemySkillEffect.TIME_BUFF_FLAT:
  //     // case EnemySkillEffect.TIME_BUFF_SCALE:
  //     default:
  //       console.warn('Unhandled type: ' + this.effect);
  //   }
  // }

  toJson(): EnemySkillJson {
    const obj: EnemySkillJson = {};
    if (this.name) {
      obj.name = this.name;
    }
    if (this.effect != EnemySkillEffect.NONE) {
      obj.effect = this.effect;
    }
    if (this.config) {
      obj.config = this.config;
    }
    if (this.damagePercent) {
      obj.damagePercent = this.damagePercent;
    }
    return obj;
  }

  static fromJson(json: EnemySkillJson): EnemySkill {
    const skill = new EnemySkill();
    skill.name = skill.name || '';
    skill.damagePercent = json.damagePercent || 0;
    skill.effect = json.effect || EnemySkillEffect.NONE;
    skill.config = json.config || 0;
    return skill;
  }
}

interface SkillsetJson {
  skills?: EnemySkillJson[];
}

class EnemySkillset {
  skills: EnemySkill[];
  constructor() {
    this.skills = [];
  }

  // TODO
  // applySkillset(idc, source) {
  //   // console.warn('Enemy skillset application not supported yet.');
  //   for (const skill of this.skills) {
  //     skill.apply(idc, source);
  //   }
  // }

  toJson(): SkillsetJson {
    const obj: SkillsetJson = {};
    if (this.skills.length) {
      obj.skills = this.skills.map((skill) => skill.toJson());
    }
    return obj;
  }

  static fromJson(json: SkillsetJson): EnemySkillset {
    const skillset = new EnemySkillset();
    skillset.skills = (json.skills || []).map((j) => EnemySkill.fromJson(j));
    return skillset;
  }
}

// function attributeMultiplier(attacker, defender) {
//   if (attacker == 0 && defender == 1) {
//     return 0.5;
//   } else if (attacker == 0 && defender == 2) {
//     return 2;
//   } else if (attacker == 1 && defender == 2) {
//     return 0.5;
//   } else if (attacker == 1 && defender == 0) {
//     return 2;
//   } else if (attacker == 2 && defender == 0) {
//     return 0.5;
//   } else if (attacker == 2 && defender == 1) {
//     return 2;
//   } else if (attacker == 3 && defender == 4) {
//     return 2;
//   } else if (attacker == 4 && defender == 3) {
//     return 2;
//   }
//   return 1;
// }

interface EnemyInstanceJson {
  id?: number,
  lv?: number,
  hp?: number,
  attack?: number,
  defense?: number,
  resolvePercent?: number,
  attributesResisted?: Attribute[],
  typesResisted?: MonsterType[],
  preemptiveSkillset?: SkillsetJson,
  skillsets?: SkillsetJson[],
  turnCounter?: number,
}

class EnemyInstance {
  id: number = 4014;
  lv: number = 10;
  hp: number = -1;
  attack: number = -1;
  defense: number = -1;
  resolvePercent: number = 0;
  attributesResisted: Attribute[];
  typesResisted: MonsterType[];
  preemptiveSkillset: EnemySkillset;
  skillsets: EnemySkillset[];
  turnCounter: number = 1; // Currently unused.

  // Values that can change during battle.
  currentHp: number = 1;
  currentAttribute: number = -1; // -1 is main, -2 is sub.
  statusShield: boolean = false;
  shieldPercent: number = 0; // Damage is multiplied by (100 - shieldPercent) / 100
  attributeAbsorb: Attribute[]; // Each attribute absorbed.
  comboAbsorb: number = 0; // Combos of this or fewer are absorbed.
  damageAbsorb: number = 0;
  damageVoid: number = 0;
  attackMultiplier: number = 1; // Enrage
  turnsRemaining: number = 1; // Not to be used yet.
  turnCounterOverride: number = -1; // Not to be used yet.

  // Debuffs by players
  ignoreDefensePercent: number = 0;
  poison: number = 0;
  delayed: boolean = false; // Not to be used yet.

  constructor() {
    // Passives that are always applied
    this.attributesResisted = [];
    this.typesResisted = [];
    this.preemptiveSkillset = new EnemySkillset(); // Used when loading the monster.
    this.skillsets = [];
    this.attributeAbsorb = [];
  }

  setLevel(lv: number) {
    this.lv = lv;
  }

  getHp(): number {
    // if (this.hp > 0) {
    //   return this.hp;
    // }
    const c = this.getCard();
    return calcScaleStat(
      c.enemyHpAtLv10,
      c.enemyHpAtLv1,
      this.lv,
      c.enemyHpCurve,
    );
  }

  getAtk(): number {
    // if (this.atk > 0) {
    //   return this.atk;
    // }
    const c = this.getCard();
    return calcScaleStat(
      c.enemyAtkAtLv10,
      c.enemyAtkAtLv1,
      this.lv,
      c.enemyAtkCurve,
    );
  }

  getDef(): number {
    // if (this.def > 0) {
    //   return this.def;
    // }
    const c = this.getCard();
    return calcScaleStat(
      c.enemyDefAtLv10,
      c.enemyDefAtLv1,
      this.lv,
      c.enemyDefCurve,
    );
  }

  getCard(): Card {
    return vm.model.cards[this.id];
  }

  getAttribute() {
    if (this.id in vm.model.cards && this.currentAttribute == -1) {
      return vm.model.cards[this.id].attribute;
    }
    if (this.id in vm.model.cards && this.currentAttribute == -2) {
      return vm.model.cards[this.id].subattribute > -1 ? vm.model.cards[this.id].subattribute : vm.model.cards[this.id].attribute;
    }
    return this.currentAttribute;
  }

  // calcDamage(ping, pings, comboContainer, isMultiplayer, voids) {
  //   let currentDamage = ping.amount;
  //   const types = vm.model.cards[this.id] ? vm.model.cards[this.id].types : [];
  //   // Attribute Advantage
  //   currentDamage *= attributeMultiplier(ping.attribute, this.getAttribute());
  //   currentDamage = Math.ceil(currentDamage);
  //
  //   if (!ping.isActive) {
  //     // Killers
  //     const killerCount = ping.source.getAwakenings(isMultiplayer, new Set(types.map((type) => TypeToKiller[type]))).length;
  //     currentDamage *= (3 ** killerCount);
  //
  //     // Latent Killers
  //     const validLatents = types.map((type) => TypeToLatent[type]);
  //     const latentCount = ping.source.latents.filter((latent) => validLatents.includes(latent)).length;
  //     currentDamage *= (1.5 ** latentCount);
  //     currentDamage = Math.ceil(currentDamage);
  //     if (currentDamage >= 2147483648) {
  //       currentDamage = 2147483647;
  //     }
  //   }
  //
  //   if (ping.attribute != -1) {
  //     // Innate Resists (e.g. attribute and type)
  //     if (this.attributesResisted.includes(ping.attribute)) {
  //       currentDamage *= 0.5;
  //       currentDamage = Math.ceil(currentDamage);
  //     }
  //     if (this.typesResisted.some((type) => ping.source.getCard().types.includes(type))) {
  //       currentDamage *= 0.5;
  //       currentDamage = Math.ceil(currentDamage);
  //     }
  //
  //     // Shield
  //     currentDamage = currentDamage * (100 - this.shieldPercent) / 100
  //     currentDamage = Math.ceil(currentDamage);
  //
  //     // Defense + Guard Break, Damage afterward is minimum 1.
  //     if ((ping.source.countAwakening(Awakening.GUARD_BREAK) == 0 ||
  //             (new Set(pings.map((ping) => ping.attribute))).size < 5)) {
  //       const defense = this.defense * (100 - this.ignoreDefensePercent) / 100;
  //       currentDamage -= defense;
  //       currentDamage = Math.ceil(currentDamage);
  //
  //       currentDamage = Math.max(currentDamage, 1);
  //     }
  //   }
  //
  //   // Void
  //   if (this.damageVoid
  //       && currentDamage > this.damageVoid
  //       && !voids.damageVoid
  //       && (!(COLORS[ping.attribute] in comboContainer.combos) ||
  //           comboContainer.combos[COLORS[ping.attribute]].every((combo) => combo.shape != Shape.BOX))) {
  //     currentDamage = 0;
  //   }
  //
  //   // Absorbs
  //   if (this.attributeAbsorb.includes(ping.attribute) && !voids.attributeAbsorb ||
  //       this.damageAbsorb && currentDamage >= this.damageAbsorb && !voids.damageAbsorb ||
  //       this.comboAbsorb && comboContainer.comboCount() <= this.comboAbsorb && !ping.isActive) {
  //     currentDamage *= -1;
  //   }
  //
  //   return currentDamage;
  // }

  setId(id: number): void {
    if (!(id in vm.model.cards)) {
      return;
    }

    this.id = id;
  }

  getName(): string {
    if (this.id < 0 || !(this.id in vm.model.cards)) {
      return 'UNSET';
    }
    return vm.model.cards[this.id].name;
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
    this.turnsRemaining = this.turnCounter;
    this.turnCounterOverride = -1;
    this.ignoreDefensePercent = 0;
    this.poison = 0;
    this.delayed = false;
    if (this.preemptiveSkillset) {
    //   this.preemptiveSkillset.applySkillset(idc, this);
    }
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
    let card: Card = DEFAULT_CARD;
    if (this.id in vm.model.cards) {
      obj.id = this.id;
      card = vm.model.cards[this.id];
    }
    if (this.lv != 10) {
      obj.lv = this.lv;
    }
    if (this.hp > 0) {
      obj.hp = this.hp;
    }
    if (this.attack > 0) {
      obj.attack = this.attack;
    }
    if (this.defense >= 0) {
      obj.defense = this.defense;
    }
    if (this.resolvePercent > 0) {
      obj.resolvePercent = this.resolvePercent;
    }
    if (this.attributesResisted.length) {
      obj.attributesResisted = [...this.attributesResisted];
    }
    if (this.typesResisted.length) {
      obj.typesResisted = [...this.typesResisted];
    }
    if (this.preemptiveSkillset) {
      const preemptiveJson = this.preemptiveSkillset.toJson();
      if (preemptiveJson.skills && preemptiveJson.skills.length) {
        obj.preemptiveSkillset = preemptiveJson;
      }
    }
    if (this.skillsets.length) {
      obj.skillsets = this.skillsets.map((skillset) => skillset.toJson());
    }
    if (this.turnCounter != 1) {
      obj.turnCounter = this.turnCounter;
    }
    return obj;
  }

  static fromJson(json: EnemyInstanceJson): EnemyInstance {
    const enemy = new EnemyInstance();
    enemy.id = Number(json.id) || -1;
    enemy.lv = Number(json.lv) || 10;
    if (enemy.id in vm.model.cards) {
      const card = vm.model.cards[enemy.id];
      // TODO: Preload Card with this information.
      enemy.hp = Number(json.hp) || -1;
      enemy.attack = Number(json.attack) || -1;
      enemy.defense = Number(json.defense) || -1;
    } else {
      enemy.hp = Number(json.hp) || 1;
      enemy.attack = Number(json.attack) || 1;
      enemy.defense = Number(json.defense) || 0;
    }
    enemy.resolvePercent = Number(json.resolvePercent) || 0;
    enemy.attributesResisted = (json.attributesResisted || []).map((a) => Number(a));
    enemy.typesResisted = (json.typesResisted || []).map((a) => Number(a));
    enemy.preemptiveSkillset = json.preemptiveSkillset ?
        EnemySkillset.fromJson(json.preemptiveSkillset) : new EnemySkillset();
    enemy.skillsets = (json.skillsets || []).map(
        (skillsetJson) => EnemySkillset.fromJson(skillsetJson));
    enemy.turnCounter = json.turnCounter || 1;
    enemy.reset();
    return enemy;
  }
}

export {
  EnemyInstance,
  EnemyInstanceJson,
};
