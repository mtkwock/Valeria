import { COLORS, Attribute, Shape, idxsFromBits, AttributeToName, TypeToName } from './common';
import { DamagePing } from './damage_ping';
import { MonsterInstance } from './monster_instance';
import { ComboContainer } from './combo_container';
import { floof } from './ilmina_stripped';

export interface AttackContext {
  ping: DamagePing;
  team: MonsterInstance[];
  percentHp: number;
  comboContainer: ComboContainer;
  skillUsed: boolean;
  isMultiplayer: boolean;
  healing: number;
}

export interface HpContext {
  monster: MonsterInstance;
  team: MonsterInstance[];
  isMultiplayer: boolean;
}

export interface RcvContext {
  monster: MonsterInstance;
  team: MonsterInstance[];
  isMultiplayer: boolean;
}

export interface RcvPostContext {
  monster: MonsterInstance;
  team: MonsterInstance[];
  percentHp: number;
  comboContainer: ComboContainer;
  skillUsed: boolean;
  isMultiplayer: boolean;
}

export interface DamageMultContext {
  attribute: Attribute;
  team: MonsterInstance[];
  comboContainer: ComboContainer;
  percentHp: number;
  healing: number;
}

export interface PlusComboContext {
  team: MonsterInstance[];
  comboContainer: ComboContainer;
}

export interface TrueBonusAttackContext {
  team: MonsterInstance[];
  comboContainer: ComboContainer;
}

export interface AwokenBindClearContext {
  healing: number;
}

interface LeaderSkill {
  toString: (params: number[]) => string;
  bigBoard?: boolean;
  noSkyfall?: boolean;
  ignorePoison?: boolean;
  drumEffect?: boolean;

  minOrbMatch?: (params: number[]) => number;
  resolve?: (params: number[]) => number;
  fixedTime?: (params: number[]) => number;
  timeExtend?: (params: number[]) => number;
  hp?: (params: number[], context: HpContext) => number;
  atk?: (params: number[], context: AttackContext) => number;
  rcv?: (params: number[], context: RcvContext) => number;
  rcvPost?: (params: number[], context: RcvPostContext) => number;
  damageMult?: (params: number[], context: DamageMultContext) => number;
  plusCombo?: (params: number[], context: PlusComboContext) => number;

  drop?: (params: number[]) => number;
  coins?: (params: number[]) => number;
  exp?: (params: number[]) => number;
  autoHeal?: (params: number[]) => number;
  trueBonusAttack?: (params: number[], context: TrueBonusAttackContext) => number;
  bonusAttack?: (params: number[]) => number;
  counter?: (params: number[]) => { multiplier: number, attribute: Attribute };
  awokenBindClear?: (params: number[], context: AwokenBindClearContext) => number;

  // Versions of the above without the context requirements.
  hpMax?: (params: number[]) => number;
  atkMax?: (params: number[]) => number;
  // Includes both rcv and rcvPost
  rcvMax?: (params: number[]) => number;
  damageMultMax?: (params: number[]) => number;
  plusComboMax?: (params: number[]) => number;
  trueBonusAttackMax?: (params: number[]) => number;
  awokenBindClearMax?: (params: number[]) => number;
}

function subs(team: MonsterInstance[]): MonsterInstance[] {
  return team.slice(1, team.length - 1).filter((sub) => sub.getId() >= 0);
}

const atkFromAttr: LeaderSkill = { // 11
  toString: ([attr, atk100]) => `${atk100 / 100}x ATK for ${AttributeToName.get(attr)}`,
  atk: ([attr, atk100]: number[], { ping }: AttackContext): number => {
    return ping.source.isAttribute(attr) ? atk100 / 100 : 1;
  },
  atkMax: ([_, atk100]) => atk100 / 100,
};

const bonusAttackScale: LeaderSkill = { // 12
  toString: ([scale]) => `${scale / 100}x bonus attack after matching orbs.`,
  bonusAttack: ([scale]) => scale / 100,
};

const autoHealLead: LeaderSkill = { // 13
  toString: ([heal100]) => `${heal100 / 100}x healed after matching orbs.`,
  autoHeal: ([heal100]) => heal100 / 100,
};

const resolveLead: LeaderSkill = { // 14
  toString: ([resolveMinPercent]) => `Survive single hit with 1HP if above ${resolveMinPercent}% HP.`,
  resolve: ([resolveMinPercent, UNKNOWN]) => {
    if (UNKNOWN) {
      console.warn(`Unhandled second parameter of resolve: ${UNKNOWN}`);
    }
    return resolveMinPercent;
  },
};

const pureTimeExtend: LeaderSkill = { // 15
  toString: ([sec100]) => `Increase movetime by ${sec100 / 100}s`,
  timeExtend: ([sec100]) => sec100 / 100,
};

const shieldAgainstAll: LeaderSkill = { // 16
  toString: ([shield100]) => `${shield100}% damage reduction.`,
  damageMult: ([shield100]) => (1 - shield100 / 100),
  damageMultMax: ([shield100]) => (1 - shield100 / 100),
};

const shieldAgainstAttr: LeaderSkill = { // 17
  toString: ([attr, shield100]) => `${shield100}% ${AttributeToName.get(attr)} damage reduction.`,
  damageMult: ([attr, shield100], { attribute }) => (attribute == attr) ? 1 - shield100 / 100 : 1,
  damageMultMax: ([_, shield100]) => 1 - shield100 / 100,
};

const atkFromType: LeaderSkill = { // 22
  toString: ([type, atk100]) => `${atk100 / 100}x ATK for ${TypeToName.get(type)}.`,
  atk: ([type, atk100], { ping }) => ping.source.isType(type) ? atk100 / 100 : 1,
  atkMax: ([_, atk100]) => atk100 / 100,
};

const hpFromType: LeaderSkill = { // 23
  toString: ([type, hp100]) => `${hp100 / 100}x HP for ${TypeToName.get(type)}.`,
  hp: ([type, hp100], { monster }) => monster.isType(type) ? hp100 / 100 : 1,
  hpMax: ([_, hp100]) => hp100 / 100,
};

const rcvFromType: LeaderSkill = { // 24
  toString: ([type, rcv100]) => `${rcv100 / 100}x RCV for ${TypeToName.get(type)}`,
  rcv: ([type, rcv100], { monster }) => monster.isType(type) ? rcv100 / 100 : 1,
  rcvMax: ([_, rcv100]) => rcv100 / 100,
};

const atkUnconditional: LeaderSkill = { // 26
  toString: ([atk100]) => `${atk100 / 100}x ATK.`,
  atk: ([atk100]) => atk100 / 100,
  atkMax: ([atk100]) => atk100 / 100,
};

const atkRcvFromAttr: LeaderSkill = { // 28
  toString: ([attr, mult100]) => `${mult100 / 100}x ATK and RCV for ${AttributeToName.get(attr)}.`,
  atk: atkFromAttr.atk,
  rcv: ([attr, mult100], { monster }) => monster.isAttribute(attr) ? mult100 / 100 : 1,

  atkMax: ([_, mult100]) => mult100 / 100,
  rcvMax: ([_, mult100]) => mult100 / 100,
};

const baseStatFromAttr: LeaderSkill = { // 29
  toString: ([attr, mult100]) => `${mult100 / 100}x HP, ATK, and RCV for ${AttributeToName.get(attr)}.`,
  hp: ([attr, mult100], { monster }) => monster.isAttribute(attr) ? mult100 / 100 : 1,
  atk: atkRcvFromAttr.atk,
  rcv: atkRcvFromAttr.rcv,

  hpMax: ([_, mult100]) => mult100 / 100,
  atkMax: atkRcvFromAttr.atkMax,
  rcvMax: atkRcvFromAttr.rcvMax,
};

const hpFromTwoTypes: LeaderSkill = { // 30
  toString: ([type1, type2, hp100]) => `${hp100 / 100}x HP for ${TypeToName.get(type1)} and ${TypeToName.get(type2)}.`,
  hp: ([type1, type2, hp100], { monster }) => monster.anyTypes([type1, type2]) ? hp100 / 100 : 1,
  hpMax: ([_, _a, hp100]) => hp100 / 100,
};

const atkFromTwoTypes: LeaderSkill = { // 31
  toString: ([type1, type2, atk100]) => `${atk100 / 100}x ATK for ${TypeToName.get(type1)} and ${TypeToName.get(type2)}.`,
  atk: ([type1, type2, atk100], { ping }) => ping.source.anyTypes([type1, type2]) ? atk100 / 100 : 1,
  atkMax: ([_, _a, atk100]) => atk100 / 100,
};

const drumSounds: LeaderSkill = { // 33
  toString: () => 'Drum sounds will play.',
  drumEffect: true,
};

const shieldAgainstTwoAttr: LeaderSkill = { // 36
  toString: ([attr1, attr2, shield100]) => `${shield100}% ${AttributeToName.get(attr1)} and ${AttributeToName.get(attr2)} damage reduction.`,
  damageMult: ([attr1, attr2, shield100], { attribute }) => (attribute == attr1 || attribute == attr2) ? 1 - shield100 / 100 : 1,
  damageMultMax: ([shield100]) => 1 - shield100 / 100,
};

const shieldFromHp: LeaderSkill = { // 38
  toString: ([threshold, _, shield100]) => `${shield100}% damage reduction when above ${threshold}% HP.`,
  damageMult: ([threshold, UNKNOWN, shield100], { percentHp }) => {
    if (UNKNOWN) {
      console.warn(`Unhandled parameter of shieldFromHp: ${UNKNOWN}`);
    }
    const mult = 1 - shield100 / 100;
    if (threshold == 100) {
      return percentHp >= 100 ? mult : 1;
    }
    return percentHp <= threshold ? mult : 1;
  },

  damageMultMax: ([_, _a, shield100]) => 1 - shield100 / 100,
};

const atkRcvFromSubHp: LeaderSkill = { // 39
  toString: ([thresh, atkFlag, rcvFlag, mult100]) => {
    const includes = [atkFlag && 'ATK', rcvFlag && 'RCV'].filter(Boolean).join(' and ');
    return `${mult100 / 100}x ${includes} when below ${thresh}% HP.`;
  },
  atk: ([thresh, atkFlag, _, mult100], { percentHp }) => atkFlag && (percentHp <= thresh) ? mult100 / 100 : 1,
  rcvPost: ([thresh, _, rcvFlag, mult100], { percentHp }) => rcvFlag && (percentHp <= thresh) ? mult100 / 100 : 1,

  atkMax: ([_, atkFlag, _a, mult100]) => atkFlag ? mult100 / 100 : 1,
  rcvMax: ([_, _a, rcvFlag, mult100]) => rcvFlag ? mult100 / 100 : 1,
};

const atkFromTwoAttrs: LeaderSkill = { // 40
  toString: ([attr1, attr2, atk100]) => `${atk100 / 100}x ATK for ${AttributeToName.get(attr1)} and ${AttributeToName.get(attr2)}.`,
  atk: ([attr1, attr2, atk100], { ping }) => ping.source.anyAttributes([attr1, attr2]) ? atk100 / 100 : 1,
  atkMax: ([_, _a, atk100]) => atk100 / 100,
};

const counterattack: LeaderSkill = { // 41
  toString: ([chance, atk100, attr]) => {
    const base = `${atk100 / 100}x ${AttributeToName.get(attr)} counterattack.`;
    if (chance == 100) {
      return base;
    }
    return `${chance}% chance of ` + base;
  },
  counter: ([chance, atk100, attr]) => {
    if (chance != 100) {
      console.warn(`Chance of counterattacking: ${chance}%`);
    }
    return { attribute: attr, multiplier: atk100 / 100 };
  },
};

const shieldFromAboveHp: LeaderSkill = { // 43
  toString: ([thresh, chance, shield100]) => {
    const base = `${shield100}% damage reduction when above ${thresh}% HP.`;
    if (chance == 100) {
      return base;
    }
    return `${chance}% chance of ` + base;
  },
  damageMult: ([thresh, chance, shield100], { percentHp }) => {
    if (chance != 100) {
      console.warn(`Chance of shield happening is ${chance}%`);
    }
    return percentHp >= thresh ? 1 - shield100 / 100 : 1;
  },
  damageMultMax: ([_, _a, shield100]) => 1 - shield100 / 100,
};

const atkRcvFromAboveHp: LeaderSkill = { // 44
  toString: ([thresh, atkFlag, rcvFlag, mult100]) => {
    const includes = [atkFlag && 'ATK', rcvFlag && 'RCV'].filter(Boolean).join(' and ');
    return `${mult100 / 100}x ${includes} when above ${thresh}% HP.`;
  },
  atk: ([thresh, atkFlag, _, mult100], { percentHp }) => (atkFlag && percentHp >= thresh) ? mult100 / 100 : 1,
  rcvPost: ([thresh, _, rcvFlag, mult100], { percentHp }) => (rcvFlag && percentHp >= thresh) ? mult100 / 100 : 1,

  atkMax: ([_, atkFlag, _a, mult100]) => atkFlag ? mult100 / 100 : 1,
  rcvMax: ([_, _a, rcvFlag, mult100]) => rcvFlag ? mult100 / 100 : 1,
};

// 45 see 28

const hpFromTwoAttrs: LeaderSkill = { // 46
  toString: ([attr1, attr2, hp100]) => `${hp100 / 100}x HP for ${AttributeToName.get(attr1)} and ${AttributeToName.get(attr2)}.`,
  hp: ([attr1, attr2, hp100], { monster }) => monster.anyAttributes([attr1, attr2]) ? hp100 / 100 : 1,
  hpMax: ([_, _a, hp100]) => hp100 / 100,
};

const hpFromAttr: LeaderSkill = { // 48
  toString: ([attr, hp100]) => `${hp100 / 100}x HP for ${AttributeToName.get(attr)}.`,
  hp: ([attr, hp100], { monster }) => monster.isAttribute(attr) ? hp100 / 100 : 1,
  hpMax: ([_, hp100]) => hp100 / 100,
};

const rcvFromAttr: LeaderSkill = { // 49
  toString: ([attr, rcv100]) => `${rcv100 / 100}x RCV for ${AttributeToName.get(attr)}.`,
  rcv: ([attr, rcv100], { monster }) => monster.isAttribute(attr) ? rcv100 : 100,
  rcvMax: ([_, rcv100]) => rcv100 / 100,
};

const dropBoost: LeaderSkill = { // 53
  toString: ([boost100]) => `${boost100 / 100}x Drop Rate in Solo Mode.`,
  drop: ([boost100]) => boost100 / 100,
};


const coinBoost: LeaderSkill = { // 54
  toString: ([coins100]) => `${coins100 / 100}x Coins.`,
  coins: ([coins100]) => coins100 / 100,
};

function countMatchedColors(attrBits: number, comboContainer: ComboContainer, team: MonsterInstance[]): number {
  const matchedAttr = idxsFromBits(attrBits)
    .filter((attr) => comboContainer.combos[COLORS[attr]].length)
    .filter((attr) => attr >= 5 || team.some((monster) => !monster.bound && (monster.getAttribute() == attr || monster.getSubattribute() == attr)));
  return matchedAttr.length;
}

const atkScalingFromUniqueColorMatches: LeaderSkill = { // 61
  toString: ([attrBits, minColors, atk100base, atk100scale, moreColors]) => {
    const colors = idxsFromBits(attrBits).map((i) => AttributeToName.get(i));

    const base = `${atk100base}x ATK when matching at least ${minColors} of ${colors.join(', ')}`;
    moreColors = Math.min(moreColors, colors.length - minColors);
    if (!atk100scale || !moreColors) {
      return base + '.';
    }
    return base + `, +${atk100scale / 100}x per color up to ${(atk100scale * moreColors + atk100base)}x at ${colors.length + moreColors}.`;
  },
  atk: ([attrBits, minColors, atk100base, atk100scale, moreColors], { team, comboContainer }) => {
    let count = countMatchedColors(attrBits, comboContainer, team);
    atk100scale = atk100scale || 0;
    const maxColors = minColors + (moreColors || 0);
    if (count < minColors) {
      return 1;
    }
    if (count > maxColors) {
      count = maxColors;
    }
    return (atk100base + (count - minColors) * atk100scale) / 100;
  },

  atkMax: ([attrBits, minColors, atk100base, atk100scale, moreColors]) => {
    // Because Stupid things like Aten has ridiculous scaling that doesn't make sense.
    // ie. moreColors is set to 100 for Aten, which should actually cap at 2.
    moreColors = Math.min(idxsFromBits(attrBits).length - minColors, moreColors || 0);
    return (atk100base + (atk100scale || 0) * moreColors) / 100;
  },
};

const atkHpFromType: LeaderSkill = { // 62
  toString: ([type, mult100]) => `${mult100 / 100}x HP and ATK for ${TypeToName.get(type)}.`,
  hp: ([type, mult100], { monster }) => monster.isType(type) ? mult100 : 1,
  atk: ([type, mult100], { ping }) => ping.source.isType(type) ? mult100 : 1,

  hpMax: ([_, mult100]) => mult100 / 100,
  atkMax: ([_, mult100]) => mult100 / 100,
};

const hpRcvFromType: LeaderSkill = { // 63
  toString: ([type, mult100]) => `${mult100 / 100}x HP and RCV for ${TypeToName.get(type)}.`,
  hp: hpFromType.hp,
  rcv: rcvFromType.rcv,

  hpMax: hpFromType.hpMax,
  rcvMax: rcvFromType.rcvMax,
};

const atkRcvFromType: LeaderSkill = { // 64
  toString: ([type, mult100]) => `${mult100 / 100}x ATK and RCV for ${TypeToName.get(type)}.`,
  hp: hpFromType.hp,
  atk: atkFromType.atk,
  rcv: rcvFromType.rcv,

  hpMax: hpFromType.hpMax,
  atkMax: atkFromType.atkMax,
  rcvMax: rcvFromType.rcvMax,
};

const baseStatFromType: LeaderSkill = { // 65
  toString: ([type, mult100]) => `${mult100 / 100}x HP, ATK, and RCV for ${TypeToName.get(type)}.`,
  hp: hpFromType.hp,
  atk: atkFromType.atk,
  rcv: rcvFromType.rcv,

  hpMax: hpFromType.hpMax,
  atkMax: atkFromType.atkMax,
  rcvMax: rcvFromType.rcvMax,
};

const atkFromCombos: LeaderSkill = { // 66
  toString: ([minCombo, atk100]) => `${atk100 / 100}x ATK when matching ${minCombo}+ combos.`,
  atk: ([minCombo, atk100], { comboContainer }) => (comboContainer.comboCount() >= minCombo) ? atk100 / 100 : 1,
  atkMax: ([_, atk100]) => atk100 / 100,
};

const hpRcvFromAttr: LeaderSkill = { // 67
  toString: ([attr, mult100]) => `${mult100 / 100}x HP and RCV for ${AttributeToName.get(attr)}.`,
  hp: hpFromAttr.hp,
  rcv: rcvFromAttr.rcv,

  hpMax: hpFromAttr.hpMax,
  rcvMax: rcvFromAttr.rcvMax,
};

const atkFromAttrType: LeaderSkill = { // 69 lol
  toString: ([attr, type, atk100]) => `${atk100 / 100}x ATK for ${AttributeToName.get(attr)} and ${TypeToName.get(type)}`,
  atk: ([attr, type, atk100], { ping }) => ping.source.isAttribute(attr) || ping.source.isType(type) ? atk100 / 100 : 1,

  atkMax: ([_, _a, atk100]) => atk100 / 100,
};

const atkHpFromAttrType: LeaderSkill = { // 73
  toString: ([attr, type, mult100]) => `${mult100 / 100}x HP and ATK for ${AttributeToName.get(attr)} and ${TypeToName.get(type)}`,
  hp: ([attr, type, mult100], { monster }) => monster.isAttribute(attr) || monster.isType(type) ? mult100 / 100 : 1,
  atk: atkFromAttrType.atk,

  hpMax: ([_, _a, mult100]) => mult100 / 100,
  atkMax: atkFromAttrType.atkMax,
};

const atkRcvFromAttrType: LeaderSkill = { // 75
  toString: ([attr, type, mult100]) => `${mult100 / 100}x ATK and RCV for ${AttributeToName.get(attr)} and ${TypeToName.get(type)}`,
  atk: atkFromAttrType.atk,
  rcv: ([attr, type, mult100], { monster }) => monster.isAttribute(attr) || monster.isType(type) ? mult100 / 100 : 1,

  atkMax: atkFromAttrType.atkMax,
  rcvMax: ([_, _a, mult100]) => mult100 / 100,
};

const baseStatFromAttrType: LeaderSkill = { // 76
  toString: ([attr, type, mult100]) => `${mult100 / 100}x HP, ATK, and RCV for ${AttributeToName.get(attr)} and ${TypeToName.get(type)}`,
  hp: atkHpFromAttrType.hp,
  atk: atkFromAttrType.atk,
  rcv: atkRcvFromAttr.rcv,

  hpMax: atkHpFromAttrType.hpMax,
  atkMax: atkFromAttrType.atkMax,
  rcvMax: atkRcvFromAttr.rcvMax,
};

// 77 see 31

const atkRcvFromTwoTypes: LeaderSkill = { // 79
  atk: atkFromTwoTypes.atk,
  rcv: ([type1, type2, rcv100], { monster }) => monster.anyTypes([type1, type2]) ? rcv100 / 100 : 1,

  atkMax: atkFromTwoTypes.atkMax,
  rcvMax: ([_, _b, rcv100]) => rcv100 / 100,
};

const atkRcvFromAttrAndSubHp: LeaderSkill = { // 94
  atk: ([thresh, attr, atkFlag, _, atk100], { ping, percentHp }) => {
    return atkFlag && thresh <= percentHp && ping.source.isAttribute(attr) ? atk100 / 100 : 1;
  },
  rcvPost: ([thresh, attr, _, rcvFlag, rcv100], { monster, percentHp }) => {
    return rcvFlag && thresh <= percentHp && monster.isAttribute(attr) ? rcv100 / 100 : 1;
  },

  atkMax: ([_, _a, atkFlag, _b, mult100]) => atkFlag ? mult100 / 100 : 1,
  rcvMax: ([_, _a, _b, rcvFlag, mult100]) => rcvFlag ? mult100 / 100 : 1,
};

const atkRcvFromTypeAndSubHp: LeaderSkill = { // 95
  atk: ([thresh, type, atkFlag, _, atk100], { ping, percentHp }) => {
    return atkFlag && thresh <= percentHp && ping.source.isType(type) ? atk100 / 100 : 1;
  },
  rcvPost: ([thresh, type, _, rcvFlag, rcv100], { monster, percentHp }) => {
    return rcvFlag && thresh <= percentHp && monster.isType(type) ? rcv100 / 100 : 1;
  },

  atkMax: ([_, _a, atkFlag, _b, mult100]) => atkFlag ? mult100 / 100 : 1,
  rcvMax: ([_, _a, _b, rcvFlag, mult100]) => rcvFlag ? mult100 / 100 : 1,
};

const atkRcvFromAttrAndAboveHp: LeaderSkill = { // 96
  atk: ([thresh, attr, atkFlag, _, atk100], { ping, percentHp }) => {
    return atkFlag && thresh >= percentHp && ping.source.isAttribute(attr) ? atk100 / 100 : 1;
  },
  rcvPost: ([thresh, attr, _, rcvFlag, rcv100], { monster, percentHp }) => {
    return rcvFlag && thresh >= percentHp && monster.isAttribute(attr) ? rcv100 / 100 : 1;
  },

  atkMax: ([_, _a, atkFlag, _b, mult100]) => atkFlag ? mult100 / 100 : 1,
  rcvMax: ([_, _a, _b, rcvFlag, mult100]) => rcvFlag ? mult100 / 100 : 1,
};

const atkRcvFromTypeAndAboveHp: LeaderSkill = { // 97
  atk: ([thresh, type, atkFlag, _, atk100], { ping, percentHp }) => {
    return atkFlag && thresh >= percentHp && ping.source.isType(type) ? atk100 / 100 : 1;
  },
  rcvPost: ([thresh, type, _, rcvFlag, rcv100], { monster, percentHp }) => {
    return rcvFlag && thresh >= percentHp && monster.isType(type) ? rcv100 / 100 : 1;
  },

  atkMax: ([_, _a, atkFlag, _b, mult100]) => atkFlag ? mult100 / 100 : 1,
  rcvMax: ([_, _a, _b, rcvFlag, mult100]) => rcvFlag ? mult100 / 100 : 1,
};

const atkScalingFromCombos: LeaderSkill = { // 98
  atk: ([minCombo, atk100base, atk100scale, maxCombo], { comboContainer }) => {
    let count = comboContainer.comboCount();
    if (count < minCombo) {
      return 1;
    }
    if (count > maxCombo) {
      count = maxCombo;
    }
    return (atk100base + (count - minCombo) * atk100scale) / 100;
  },

  atkMax: ([minCombo, atk100base, atk100scale, maxCombo]) => (atk100base + ((maxCombo || minCombo) - minCombo) * (atk100scale || 0)) / 100,
};

const atkRcvFromSkill: LeaderSkill = { // 100
  atk: ([atkFlag, _, mult100], { skillUsed }) => atkFlag && skillUsed ? mult100 / 100 : 1,
  rcvPost: ([_, rcvFlag, mult100], { skillUsed }) => rcvFlag && skillUsed ? mult100 / 100 : 1,

  atkMax: ([atkFlag, _, mult100]) => atkFlag ? mult100 / 100 : 1,
  rcvMax: ([_, rcvFlag, mult100]) => rcvFlag ? mult100 / 100 : 1,
};

const atkFromExactCombos: LeaderSkill = { // 101
  atk: ([combos, atk100], { comboContainer }) => comboContainer.comboCount() == combos ? atk100 / 100 : 1,

  atkMax: ([_, atk100]) => atk100 / 100,
};

const atkRcvFromCombos: LeaderSkill = { // 103
  atk: ([minCombo, atkFlag, _, atk100], { comboContainer }) => atkFlag && comboContainer.comboCount() >= minCombo ? atk100 / 100 : 1,
  rcvPost: ([minCombo, _, rcvFlag, rcv100], { comboContainer }) => rcvFlag && comboContainer.comboCount() >= minCombo ? rcv100 / 100 : 1,

  atkMax: ([_, atkFlag, _a, mult100]) => atkFlag ? mult100 / 100 : 1,
  rcvMax: ([_, _a, rcvFlag, mult100]) => rcvFlag ? mult100 / 100 : 1,
};

const atkRcvFromAttrCombos: LeaderSkill = { // 104
  atk: ([a, attrBits, b, c, d], ctx) => ctx.ping.source.anyAttributes(idxsFromBits(attrBits)) ? atkRcvFromCombos.atk!([a, b, c, d], ctx) : 1,
  rcvPost: ([a, attrBits, b, c, d], ctx) => ctx.monster.anyAttributes(idxsFromBits(attrBits)) ? atkRcvFromCombos.rcv!([a, b, c, d], ctx) : 1,

  atkMax: ([_, _a, atkFlag, _b, mult100]) => atkFlag ? mult100 / 100 : 1,
  rcvMax: ([_, _a, _b, rcvFlag, mult100]) => rcvFlag ? mult100 / 100 : 1,
};

const atkFromDecreasedRcv: LeaderSkill = { // 105
  atk: ([_, atk100]) => atk100 / 100,
  rcv: ([rcv100]) => rcv100 / 100,

  atkMax: ([_, atk100]) => atk100,
  rcvMax: ([rcv100]) => rcv100,
};

const atkFromDecreasedHp: LeaderSkill = { // 106
  hp: ([hp100]) => hp100 / 100,
  atk: ([_, atk100]) => atk100 / 100,

  hpMax: ([hp100]) => hp100 / 100,
  atkMax: ([_, atk100]) => atk100 / 100,
};

const hpDecrease: LeaderSkill = { // 107
  hp: ([hp100]) => hp100 / 100,
  atk: ([_, attrBits, atk100]: number[], { ping }: AttackContext): number => {
    return ping.source.anyAttributes(idxsFromBits(attrBits)) ? atk100 / 100 : 1;
  },

  hpMax: ([hp100]) => hp100 / 100,
  atkMax: ([_, _a, atk100]) => atk100 ? atk100 / 100 : 1,
};

const atkFromTypeDecreasedHp: LeaderSkill = { // 108
  hp: ([hp100]) => hp100 / 100,
  atk: ([_, type, atk100], { ping }) => ping.source.isType(type) ? atk100 / 100 : 1,

  hpMax: ([hp100]) => hp100 / 100,
  atkMax: ([_, _a, atk100]) => atk100 / 100,
};

const atkFromLinkedOrbs: LeaderSkill = { // 109
  atk: ([attrBits, minLinked, atk100], { comboContainer }) => idxsFromBits(attrBits).some(
    (attr) => comboContainer.combos[COLORS[attr]].some(
      (c) => c.count >= minLinked)) ? atk100 / 100 : 1,

  atkMax: ([_, _a, atk100]) => atk100 / 100,
};

const atkHpFromTwoAttrs: LeaderSkill = { // 111
  hp: hpFromTwoAttrs.hp,
  atk: atkFromTwoAttrs.atk,

  hpMax: hpFromTwoAttrs.hpMax,
  atkMax: atkFromTwoAttrs.atkMax,
};

const baseStatFromTwoAttrs: LeaderSkill = { // 114
  hp: hpFromTwoAttrs.hp,
  atk: atkFromTwoAttrs.atk,
  rcv: ([attr1, attr2, rcv100], { monster }) => monster.anyAttributes([attr1, attr2]) ? rcv100 / 100 : 1,


  hpMax: hpFromTwoAttrs.hpMax,
  atkMax: atkFromTwoAttrs.atkMax,
  rcvMax: ([_, _a, rcv100]) => rcv100 / 100,
};

// This shouldn't be called.
const multipleLeaderSkills: LeaderSkill = { // 116 + 138
}

const atkScalingFromLinkedOrbs: LeaderSkill = { // 119
  atk: ([attrBits, minLinked, atk100base, atk100scale, maxLinked], { comboContainer }) => {
    atk100scale = atk100scale || 0;
    maxLinked = maxLinked || minLinked;

    let linked = 0;
    for (const attr of idxsFromBits(attrBits)) {
      for (const combo of comboContainer.combos[COLORS[attr]]) {
        linked = combo.count > linked ? combo.count : linked;
      }
    }

    if (linked < minLinked) {
      return 1;
    }
    if (linked > maxLinked) {
      linked = maxLinked;
    }
    return (atk100base + (linked - minLinked) * atk100scale) / 100;
  },

  atkMax: ([_, minLinked, atk100base, atk100scale, maxLinked]) => (atk100base + ((maxLinked || minLinked) - minLinked) * (atk100scale || 0)) / 100,
};

const baseStatFromAttrsTypes: LeaderSkill = { // 121
  hp: ([attrBits, typeBits, hp100], { monster }) => hp100 && (monster.anyAttributes(idxsFromBits(attrBits)) || monster.anyTypes(idxsFromBits(typeBits))) ? hp100 / 100 : 1,
  atk: ([attrBits, typeBits, _, atk100], { ping }) => atk100 && (ping.source.anyAttributes(idxsFromBits(attrBits)) || ping.source.anyTypes(idxsFromBits(typeBits))) ? atk100 / 100 : 1,
  rcv: ([attrBits, typeBits, _, _a, rcv100], { monster }) => rcv100 && (monster.anyAttributes(idxsFromBits(attrBits)) || monster.anyTypes(idxsFromBits(typeBits))) ? rcv100 / 100 : 1,

  hpMax: ([_, _a, hp100]) => (hp100 || 100) / 100,
  atkMax: ([_, _a, _b, atk100]) => (atk100 || 100) / 100,
  rcvMax: ([_, _a, _b, _c, rcv100]) => (rcv100 || 100) / 100,
};

const atkRcvFromAttrTypeSubHp: LeaderSkill = { // 122
  atk: ([thresh, attrBits, typeBits, atk100], { ping, percentHp }) => {
    if (atk100 && percentHp <= thresh && (ping.source.anyAttributes(idxsFromBits(attrBits)) || ping.source.anyTypes(idxsFromBits(typeBits)))) {
      return atk100 / 100;
    }
    return 1;
  },
  rcvPost: ([thresh, attrBits, typeBits, _, rcv100], { monster, percentHp }) => {
    if (rcv100 && percentHp <= thresh && (monster.anyAttributes(idxsFromBits(attrBits)) || monster.anyTypes(idxsFromBits(typeBits)))) {
      return rcv100 / 100;
    }
    return 1;
  },

  atkMax: ([_, _a, _b, atk100]) => (atk100 || 100) / 100,
  rcvMax: ([_, _a, _b, _c, rcv100]) => (rcv100 || 100) / 100,
};

const atkFromAttrTypeAboveHp: LeaderSkill = { //123
  atk: ([thresh, attrBits, typeBits, atk100], { ping, percentHp }) => {
    if (atk100 && percentHp >= thresh && (ping.source.anyAttributes(idxsFromBits(attrBits)) || ping.source.anyTypes(idxsFromBits(typeBits)))) {
      return atk100 / 100;
    }
    return 1;
  },

  atkMax: ([_, _a, _b, atk100]) => atk100 / 100,
}

const atkScalingFromMatchedColors2: LeaderSkill = { // 124
  atk: ([attr1bit, attr2bit, attr3bit, attr4bit, attr5bit, minMatch, atk100base, atk100scale], { comboContainer }) => {
    atk100scale = atk100scale || 0;
    const maxCounts: Record<number, number> = {
      0: 0, 1: 0, 2: 0, 3: 0, 4: 0,
      5: 0, 6: 0, 7: 0, 8: 0, 9: 9,
    };
    for (const attrBit of [attr1bit, attr2bit, attr3bit, attr4bit, attr5bit].filter((a) => a > 0)) {
      const attr = idxsFromBits(attrBit)[0];
      maxCounts[attr]++;
    }

    let total = 0;
    for (const attr in maxCounts) {
      total += Math.min(comboContainer.combos[COLORS[attr]].length, maxCounts[attr]);
    }
    if (total < minMatch) {
      return 1;
    }
    return ((total - minMatch) * atk100scale + atk100base) / 100;
  },

  atkMax: ([a, b, c, d, e, minMatch, atk100base, atk100scale]) => (([a, b, c, d, e].filter(Boolean).length - minMatch) * (atk100scale || 0) + atk100base) / 100,
};

function hasAll(ids: number[], team: MonsterInstance[]): boolean {
  return ids
    .filter((id) => id > 0)
    .every((id) => team.some((monster) => monster.id == id));
}

const baseStatFromRequiredSubs: LeaderSkill = { // 125
  hp: ([a, b, c, d, e, hp100], { team }) => hp100 && hasAll([a, b, c, d, e], team) ? hp100 / 100 : 1,
  atk: ([a, b, c, d, e, _, atk100], { team }) => atk100 && hasAll([a, b, c, d, e], team) ? atk100 / 100 : 1,
  rcv: ([a, b, c, d, e, _, _a, rcv100], { team }) => rcv100 && hasAll([a, b, c, d, e], team) ? rcv100 / 100 : 1,

  hpMax: ([_, _a, _b, _c, _d, _e, hp100]) => (hp100 || 100) / 100,
  atkMax: ([_, _a, _b, _c, _d, _e, _f, atk100]) => (atk100 || 100) / 100,
  rcvMax: ([_, _a, _b, _c, _d, _e, _f, _g, rcv100]) => (rcv100 || 100) / 100,
};

const baseStatShieldFromAttributeType: LeaderSkill = { // 129
  hp: ([attrBits, typeBits, hp100], { monster }) => hp100 && monster.anyAttributeTypeBits(attrBits, typeBits) ? hp100 / 100 : 1,
  atk: ([attrBits, typeBits, _, atk100], { ping }) => atk100 && ping.source.anyAttributeTypeBits(attrBits, typeBits) ? atk100 / 100 : 1,
  rcv: ([attrBits, typeBits, _, _a, rcv100], { monster }) => rcv100 && monster.anyAttributeTypeBits(attrBits, typeBits) ? rcv100 / 100 : 1,
  damageMult: ([_, _a, _b, _c, _d, _e, attrBits, shield], { attribute }) => shield && idxsFromBits(attrBits).some((attr) => attr == attribute) ? 1 - shield / 100 : 1,

  hpMax: ([_, _a, hp100]) => (hp100 || 100) / 100,
  atkMax: ([_, _a, _b, atk100]) => (atk100 || 100) / 100,
  rcvMax: ([_, _a, _b, _c, rcv100]) => (rcv100 || 100) / 100,
};

const atkRcvShieldFromSubHp: LeaderSkill = { // 130
  atk: ([thresh, attrBits, typeBits, atk100], { percentHp, ping }) => atk100 && percentHp <= thresh && ping.source.anyAttributeTypeBits(attrBits, typeBits) ? atk100 / 100 : 1,
  rcvPost: ([thresh, attrBits, typeBits, _, rcv100], { percentHp, monster }) => rcv100 && percentHp <= thresh && monster.anyAttributeTypeBits(attrBits, typeBits) ? rcv100 / 100 : 1,
  damageMult: ([thresh, _, _a, _b, _c, _d, _e, attrBits, shield100], { percentHp, attribute }) => shield100 && percentHp <= thresh && idxsFromBits(attrBits).some((attr) => attr == attribute) ? 1 - shield100 / 100 : 1,

  atkMax: ([_, _a, _b, atk100]) => (atk100 || 100) / 100,
  rcvMax: ([_, _a, _b, _c, rcv100]) => (rcv100 || 100) / 100,
  damageMultMax: ([_, _a, _b, _c, _d, _e, _f, _g, shield100]) => (1 - (shield100 || 100) / 100),
};

// Same as above, but with inverted requirement.
const atkRcvShieldFromAboveHp: LeaderSkill = { // 131
  atk: ([thresh, ...remaining], context) => context.percentHp >= thresh ? atkRcvShieldFromSubHp.atk!([101, ...remaining], context) : 1,
  rcvPost: ([thresh, ...remaining], context) => context.percentHp >= thresh ? atkRcvShieldFromSubHp.rcv!([101, ...remaining], context) : 1,
  damageMult: ([thresh, ...remaining], context) => context.percentHp >= thresh ? atkRcvShieldFromSubHp.damageMult!([101, ...remaining], context) : 1,

  atkMax: atkRcvShieldFromSubHp.atkMax,
  rcvMax: atkRcvShieldFromSubHp.rcvMax,
  damageMultMax: atkRcvShieldFromSubHp.damageMultMax,
};

const atkRcvFromAttrsTypesSkillUse: LeaderSkill = { // 133
  atk: ([attrBits, typeBits, atk100], { ping, skillUsed }) => atk100 && skillUsed && ping.source.anyAttributeTypeBits(attrBits, typeBits) ? atk100 / 100 : 1,
  rcvPost: ([attrBits, typeBits, _, rcv100], { monster, skillUsed }) => rcv100 && skillUsed && monster.anyAttributeTypeBits(attrBits, typeBits) ? rcv100 / 100 : 1,

  atkMax: ([_, _a, atk100]) => (atk100 || 100) / 100,
  rcvMax: ([_, _a, _b, rcv100]) => (rcv100 || 100) / 100,
};

const stackingBaseStatsFromAttrs: LeaderSkill = { // 136
  hp: ([attr1bit, hp100a, _a, _b, attr2bit, hp100b], { monster }) => {
    return (hp100a && monster.anyAttributeTypeBits(attr1bit, 0) ? hp100a / 100 : 1) * (
      (hp100b && monster.anyAttributeTypeBits(attr2bit, 0) ? hp100b / 100 : 1));
  },
  atk: ([attr1bit, _a, atk100a, _b, attr2bit, _c, atk100b], { ping }) => {
    return (atk100a && ping.source.anyAttributeTypeBits(attr1bit, 0) ? atk100a / 100 : 1) * (
      (atk100b && ping.source.anyAttributeTypeBits(attr2bit, 0) ? atk100b / 100 : 1));
  },
  rcv: ([attr1bit, _a, _b, rcv100a, attr2bit, _c, _d, rcv100b], { monster }) => {
    return (rcv100a && monster.anyAttributeTypeBits(attr1bit, 0) ? rcv100a / 100 : 1) * (
      (rcv100b && monster.anyAttributeTypeBits(attr2bit, 0) ? rcv100b / 100 : 1));
  },

  hpMax: ([_, hp100a, _a, _b, _c, hp100b]) => (hp100a || 100) * (hp100b || 100) / 10000,
  atkMax: ([_, _a, atk100a, _b, _c, _d, atk100b]) => (atk100a || 100) * (atk100b || 100) / 10000,
  rcvMax: ([_, _a, _b, rcv100a, _c, _d, _e, rcv100b]) => (rcv100a || 100) * (rcv100b || 100) / 10000,
};

const stackingBaseStatsFromTypes: LeaderSkill = { // 137
  hp: ([type1bit, hp100a, _a, _b, type2bit, hp100b], { monster }) => {
    return (hp100a && monster.anyAttributeTypeBits(0, type1bit) ? hp100a / 100 : 1) * (
      (hp100b && monster.anyAttributeTypeBits(0, type2bit) ? hp100b / 100 : 1));
  },
  atk: ([type1bit, _a, atk100a, _b, type2bit, _c, atk100b], { ping }) => {
    return (atk100a && ping.source.anyAttributeTypeBits(0, type1bit) ? atk100a / 100 : 1) * (
      (atk100b && ping.source.anyAttributeTypeBits(0, type2bit) ? atk100b / 100 : 1));
  },
  rcv: ([type1bit, _a, _b, rcv100a, type2bit, _c, _d, rcv100b], { monster }) => {
    return (rcv100a && monster.anyAttributeTypeBits(0, type1bit) ? rcv100a / 100 : 1) * (
      (rcv100b && monster.anyAttributeTypeBits(0, type2bit) ? rcv100b / 100 : 1));
  },

  hpMax: ([_, hp100a, _a, _b, _c, hp100b]) => (hp100a || 100) * (hp100b || 100) / 10000,
  atkMax: ([_, _a, atk100a, _b, _c, _d, atk100b]) => (atk100a || 100) * (atk100b || 100) / 10000,
  rcvMax: ([_, _a, _b, rcv100a, _c, _d, _e, rcv100b]) => (rcv100a || 100) * (rcv100b || 100) / 10000,
};

// 138 see 116

const atkFromAttrTypeMultiThresh: LeaderSkill = { // 139
  atk: ([attrBits, typeBits, threshA, isLesserA, atk100a, threshB, isLesserB, atk100b], { ping, percentHp }) => {
    if (!ping.source.anyAttributeTypeBits(attrBits, typeBits)) {
      return 1;
    }
    let multiplier = 1;
    if ((isLesserA && percentHp <= threshA) || (!isLesserA && percentHp >= threshA)) {
      multiplier *= atk100a / 100;
    } else if ((isLesserB && percentHp <= threshB) || (!isLesserB && percentHp >= threshB)) {
      multiplier *= atk100b / 100;
    }
    return multiplier;
  },

  atkMax: ([_, _a, _b, _c, atk100a, _d, _e, _f, atk100b]) => Math.max(atk100a || 0, atk100b || 0) / 100,
};

const expBoost: LeaderSkill = { // 148
  exp: ([exp100]) => exp100 / 100,
};

const rcvFromHpa: LeaderSkill = { // 149
  rcvPost: ([rcv100], { comboContainer }) => comboContainer.combos['h'].some((combo) => combo.count == 4) ? rcv100 / 100 : 1,
  rcvMax: ([rcv100]) => rcv100 / 100,
};

const fiveOrbEnhance: LeaderSkill = { // 150
  atk: ([_unknown, atk100], { ping, comboContainer }) => comboContainer.combos[COLORS[ping.attribute]].some((combo) => combo.count == 5 && combo.enhanced > 0) ? atk100 / 100 : 1,
  atkMax: ([_, atk100]) => atk100 / 100,
};

const atkRcvShieldFromHeartCross: LeaderSkill = { // 151
  atk: ([atk100], { comboContainer }) => atk100 && comboContainer.combos['h'].some((c) => c.shape == Shape.CROSS) ? atk100 / 100 : 1,
  rcvPost: ([_, rcv100], { comboContainer }) => rcv100 && comboContainer.combos['h'].some((c) => c.shape == Shape.CROSS) ? rcv100 / 100 : 1,
  damageMult: ([_, _a, shield], { comboContainer }) => shield && comboContainer.combos['h'].some((c) => c.shape == Shape.CROSS) ? 1 - shield / 100 : 1,

  atkMax: ([atk100]) => (atk100 || 100) / 100,
  rcvMax: ([_, rcv100]) => (rcv100 || 100) / 100,
  damageMultMax: ([_, _a, shield100]) => (1 - (shield100 || 0) / 100),
};

const baseStatFromAttrTypeMultiplayer: LeaderSkill = { // 155
  hp: (params, context) => context.isMultiplayer ? baseStatFromAttrsTypes.hp!(params, context) : 1,
  atk: (params, context) => context.isMultiplayer ? baseStatFromAttrsTypes.atk!(params, context) : 1,
  rcv: (params, context) => context.isMultiplayer ? baseStatFromAttrsTypes.rcv!(params, context) : 1,

  hpMax: baseStatFromAttrsTypes.hpMax,
  atkMax: baseStatFromAttrsTypes.atkMax,
  rcvMax: baseStatFromAttrsTypes.rcvMax,
};

const atkScalingFromCross: LeaderSkill = { // 157
  atk: (params, { comboContainer }) => {
    let multiplier = 1;
    for (let i = 0; i + 1 < params.length; i += 2) {
      const count = comboContainer.combos[COLORS[params[i]]].filter((c) => c.shape == Shape.CROSS).length;
      multiplier *= (params[i + 1] / 100) ** count;
    }
    return multiplier;
  },

  // Assume triple cross
  atkMax: ([_a, mult1, _b, mult2, _c, mult3, _d, mult4, _e, mult5]) => (Math.max(mult1 || 0, mult2 || 0, mult3 || 0, mult4 || 0, mult5 || 0) / 100),
};

// Same as baseStatFromAttrType, but HP and ATK are swapped with minMatch at
// the beginning.
const baseStatFromAttrsTypesMinMatch: LeaderSkill = { // 158
  minOrbMatch: ([minMatch]) => minMatch,
  hp: ([_, ...p], context) => baseStatFromAttrsTypes.hp!([p[0], p[1], p[3], p[2], p[4]], context),
  atk: ([_, ...p], context) => baseStatFromAttrsTypes.atk!([p[0], p[1], p[3], p[2], p[4]], context),
  rcv: ([_, ...p], context) => baseStatFromAttrsTypes.rcv!([p[0], p[1], p[3], p[2], p[4]], context),

  hpMax: ([_, _a, _b, _c, hp100]) => (hp100 || 100) / 100,
  atkMax: ([_, _a, _b, atk100]) => (atk100 || 100) / 100,
  rcvMax: ([_, _a, _b, _c, _d, rcv100]) => (rcv100 || 100) / 100,
};

const bigBoardLeader: LeaderSkill = {
  bigBoard: true,
};

const baseStatFromAttrsTypesNoSkyfall: LeaderSkill = { // 163
  noSkyfall: true,
  hp: baseStatFromAttrsTypes.hp,
  atk: baseStatFromAttrsTypes.atk,
  rcv: baseStatFromAttrsTypes.rcv,
  damageMult: baseStatFromAttrsTypes.damageMult,

  hpMax: baseStatFromAttrsTypes.hpMax,
  atkMax: baseStatFromAttrsTypes.atkMax,
  rcvMax: baseStatFromAttrsTypes.rcvMax,
  damageMultMax: baseStatFromAttrsTypes.damageMultMax,
};

const atkRcvScalingFromColorMatches: LeaderSkill = { // 164
  atk: ([a, b, c, d, minMatch, atk100base, _, scale100], { comboContainer }) => {
    if (!atk100base) {
      return 1;
    }
    scale100 = scale100 || 0;
    const attrs = [a, b, c, d].filter(Boolean).map((bit) => idxsFromBits(bit)[0]);
    const counts: Record<number, number> = {};
    for (const attr of attrs) {
      counts[attr] = (attr in counts) ? counts[attr] + 1 : 1;
    }
    let total = 0;
    for (const attr in counts) {
      total += Math.max(comboContainer.combos[COLORS[attr]].length, counts[attr]);
    }
    if (total < minMatch) {
      return 1;
    }
    return ((total - minMatch) * scale100 + atk100base) / 100;
  },
  rcvPost: ([a, b, c, d, minMatch, _, rcv100base, scale100], { comboContainer }) => {
    if (!rcv100base) {
      return 1;
    }
    scale100 = scale100 || 0;
    const attrs = [a, b, c, d].filter(Boolean).map((bit) => idxsFromBits(bit)[0]);
    const counts: Record<number, number> = {};
    for (const attr of attrs) {
      counts[attr] = (attr in counts) ? counts[attr] + 1 : 1;
    }
    let total = 0;
    for (const attr in counts) {
      total += Math.max(comboContainer.combos[COLORS[attr]].length, counts[attr]);
    }
    if (total < minMatch) {
      return 1;
    }
    return ((total - minMatch) * scale100 + rcv100base) / 100;
  },

  atkMax: ([a, b, c, d, minMatch, atk100base, _, scale100]) => (([a, b, c, d].filter(Boolean).length - minMatch) * (scale100 || 0) + atk100base) / 100,
  rcvMax: ([a, b, c, d, minMatch, _, rcv100base, scale100]) => (([a, b, c, d].filter(Boolean).length - minMatch) * (scale100 || 0) + rcv100base) / 100,
};

const atkRcvScalingFromUniqueColorMatches: LeaderSkill = { // 165
  atk: ([a, b, c, _, d, _a, e], context) => atkScalingFromUniqueColorMatches.atk!([a, b, c, d, e], context),
  rcvPost: ([attrBits, minColors, _, rcv100base, _a, rcv100scale, maxColors], { team, comboContainer }) => {
    maxColors = maxColors || minColors;
    rcv100scale = rcv100scale || 0;
    let count = countMatchedColors(attrBits, comboContainer, team);

    if (count < minColors) {
      return 1;
    }
    if (count > maxColors) {
      count = minColors;
    }
    return ((count - minColors) * rcv100scale + rcv100base) / 100;
  },
  atkMax: ([attrBits, minColors, atk100base, _, atk100scale, _a, moreColors]) => atkScalingFromUniqueColorMatches.atkMax!([attrBits, minColors, atk100base, atk100scale, moreColors]),
  rcvMax: ([attrBits, minColors, _, rcv100base, _a, rcv100scale, moreColors]) => atkScalingFromUniqueColorMatches.atkMax!([attrBits, minColors, rcv100base, rcv100scale, moreColors]),
};

const atkRcvScalingFromCombos: LeaderSkill = { // 166
  atk: ([minCombo, atk100base, _, atk100scale, _a, maxCombo], { comboContainer }) => {
    atk100scale = atk100scale || 0;
    maxCombo = maxCombo || minCombo;

    let count = comboContainer.comboCount();
    if (count < minCombo) {
      return 1;
    }
    if (count > maxCombo) {
      count = maxCombo;
    }
    return ((count - minCombo) * atk100scale + atk100base) / 100;
  },
  rcvPost: ([minCombo, _, rcv100base, _a, rcv100scale, maxCombo], { comboContainer }) => {
    rcv100scale = rcv100scale || 0;
    maxCombo = maxCombo || minCombo;

    let count = comboContainer.comboCount();
    if (count < minCombo) {
      return 1;
    }
    if (count > maxCombo) {
      count = maxCombo;
    }
    return ((count - minCombo) * rcv100scale + rcv100base) / 100;
  },

  atkMax: ([minCombo, atk100base, _, atk100scale, _a, maxCombo]) => (((maxCombo || minCombo) - minCombo) * (atk100scale || 0) + atk100base) / 100,
  rcvMax: ([minCombo, _, rcv100base, _a, rcv100scale, maxCombo]) => (((maxCombo || minCombo) - minCombo) * (rcv100scale || 0) + rcv100base) / 100,
};

const atkRcvScalingFromLinkedOrbs: LeaderSkill = { // 167
  atk: ([attrBits, minLinked, atk100base, _, atk100scale, _a, maxLinked], { comboContainer }) => {
    if (!atk100base) {
      return 1;
    }
    atk100scale = atk100scale || 0;
    maxLinked = maxLinked || minLinked;
    let highest = 0;
    for (const attr of idxsFromBits(attrBits)) {
      for (const c of comboContainer.combos[COLORS[attr]]) {
        if (c.count > highest) {
          highest = c.count;
        }
      }
    }
    if (highest < minLinked) {
      return 1;
    }
    if (highest > maxLinked) {
      highest = maxLinked;
    }
    return ((highest - minLinked) * atk100scale + atk100base) / 100;
  },
  rcvPost: ([attrBits, minLinked, _, rcv100base, _a, rcv100scale, maxLinked], { comboContainer }) => {
    if (!rcv100base) {
      return 1;
    }
    rcv100scale = rcv100scale || 0;
    maxLinked = maxLinked || minLinked;
    let highest = 0;
    for (const attr of idxsFromBits(attrBits)) {
      for (const c of comboContainer.combos[COLORS[attr]]) {
        if (c.count > highest) {
          highest = c.count;
        }
      }
    }
    if (highest < minLinked) {
      return 1;
    }
    if (highest > maxLinked) {
      highest = maxLinked;
    }
    return ((highest - minLinked) * rcv100scale + rcv100base) / 100;
  },

  atkMax: ([_, minLinked, atk100base, _a, atk100scale, _b, maxLinked]) => (((maxLinked || minLinked) - minLinked) * (atk100scale || 0) + atk100base) / 100,
  rcvMax: ([_, minLinked, _a, rcv100base, _b, rcv100scale, maxLinked]) => (((maxLinked || minLinked) - minLinked) * (rcv100scale || 0) + rcv100base) / 100,
};

const atkShieldFromCombos: LeaderSkill = { // 169
  atk: ([minCombos, atk100], { comboContainer }) => atk100 && comboContainer.comboCount() >= minCombos ? atk100 / 100 : 1,
  damageMult: ([minCombos, _, shield], { comboContainer }) => shield && comboContainer.comboCount() >= minCombos ? 1 - shield / 100 : 1,

  atkMax: ([_, atk100]) => (atk100 || 100) / 100,
  damageMultMax: ([_, _a, shield100]) => 1 - (shield100 || 0) / 100,
};

const atkShieldFromColorMatches: LeaderSkill = { // 170
  atk: ([attrBits, minMatch, atk100], { comboContainer, team }) => atk100 && countMatchedColors(attrBits, comboContainer, team) >= minMatch ? atk100 / 100 : 1,
  damageMult: ([attrBits, minMatch, _, shield], { comboContainer, team }) => shield && countMatchedColors(attrBits, comboContainer, team) >= minMatch ? 1 - shield / 100 : 1,

  atkMax: (p) => (p[2] || 100) / 100,
  damageMultMax: (p) => 1 - (p[3] || 0) / 100,
};

function countColorMatches(cbits: number[], comboContainer: ComboContainer): number {
  const counts: Record<number, number> = {};
  for (const attr of cbits.filter(Boolean).map((v) => idxsFromBits(v)[0])) {
    counts[attr] = counts[attr] ? counts[attr] + 1 : 1;
  }
  let total = 0;
  for (const attr in counts) {
    total += Math.min(counts[attr], comboContainer.combos[COLORS[attr]].length);
  }
  return total;
}

const atkShieldFromColorMatches2: LeaderSkill = { // 171
  atk: ([a, b, c, d, minMatch, atk100], { comboContainer }) => atk100 && countColorMatches([a, b, c, d], comboContainer) >= minMatch ? atk100 / 100 : 1,
  damageMult: ([a, b, c, d, minMatch, _, shield100], { comboContainer }) => shield100 && countColorMatches([a, b, c, d], comboContainer) >= minMatch ? (1 - shield100 / 100) : 1,

  atkMax: (p) => (p[5] || 100) / 100,
  damageMultMax: (p) => 1 - (p[6] || 0) / 100,
};

const baseStatFromCollab: LeaderSkill = { // 175
  hp: ([c1, c2, c3, hp100], { team }) => hp100 && subs(team).every((sub) => [c1, c2, c3].filter(Boolean).some((c) => c == sub.getCard().collab)) ? hp100 / 100 : 1,
  atk: ([c1, c2, c3, _, atk100], { team }) => atk100 && subs(team).every((sub) => [c1, c2, c3].filter(Boolean).some((c) => c == sub.getCard().collab)) ? atk100 / 100 : 1,
  rcv: ([c1, c2, c3, _, _a, rcv100], { team }) => rcv100 && subs(team).every((sub) => [c1, c2, c3].filter(Boolean).some((c) => c == sub.getCard().collab)) ? rcv100 / 100 : 1,

  hpMax: (p) => (p[3] || 100) / 100,
  atkMax: (p) => (p[4] || 100) / 100,
  rcvMax: (p) => (p[5] || 100) / 100,
};

const atkScalingFromOrbsRemaining: LeaderSkill = { // 177
  atk: ([a, b, c, d, e, maxRemaining, atk100base, atk100scale], { comboContainer }) => {
    atk100scale = atk100scale || 0;
    const unknowns = [a, b, c, d, e].filter(Boolean);
    if (unknowns.length) {
      console.warn(`Unhandled parameters from atkScalingFromOrbsRemaining: ${[a, b, c, d, e]}`);
    }
    const remaining = comboContainer.getRemainingOrbs();
    if (remaining > maxRemaining) {
      return 1;
    }
    return ((maxRemaining - remaining) * (atk100scale || 0) + atk100base) / 100;
  },

  atkMax: (p) => (p[5] * (p[7] || 0) + p[6]) / 100,
};

const baseStatFromAttrsTypesFixedTime: LeaderSkill = { // 178
  fixedTime: ([fixedSeconds]) => fixedSeconds,
  hp: ([_, ...params], context) => baseStatFromAttrsTypes.hp!(params, context),
  atk: ([_, ...params], context) => baseStatFromAttrsTypes.atk!(params, context),
  rcv: ([_, ...params], context) => baseStatFromAttrsTypes.rcv!(params, context),

  hpMax: (p) => (p[3] || 100) / 100,
  atkMax: (p) => (p[4] || 100) / 100,
  rcvMax: (p) => (p[5] || 100) / 100,
};

const atkShieldFromLinkedOrbs: LeaderSkill = { // 182
  atk: ([attrBits, minMatched, atk100], { comboContainer }) => {
    if (!atk100) {
      return 1;
    }
    let highest = 0;
    for (const attr of idxsFromBits(attrBits)) {
      for (const c of comboContainer.combos[COLORS[attr]]) {
        highest = c.count > highest ? c.count : highest;
      }
    }
    return highest >= minMatched ? atk100 / 100 : 1;
  },
  damageMult: ([attrBits, minMatched, _, shield], { comboContainer }) => {
    if (!shield) {
      return 1;
    }
    let highest = 0;
    for (const attr of idxsFromBits(attrBits)) {
      for (const c of comboContainer.combos[COLORS[attr]]) {
        highest = c.count > highest ? c.count : highest;
      }
    }
    return highest >= minMatched ? shield / 100 : 1;
  },

  atkMax: (p) => (p[2] || 100) / 100,
  damageMultMax: (p) => 1 - (p[3] || 0) / 100,
};

const atkRcvShieldFromMultThresh: LeaderSkill = { // 183
  atk: ([attrBits, typeBits, minThresh, aboveAtk100, _, maxThresh, belowAtk100], { ping, percentHp }) => {
    if (!ping.source.anyAttributeTypeBits(attrBits, typeBits) || (!aboveAtk100 && !belowAtk100)) {
      return 1;
    }
    maxThresh = maxThresh || 0;
    belowAtk100 = belowAtk100 || 100;
    aboveAtk100 = aboveAtk100 || 100;

    let multiplier = 1;
    if (percentHp >= minThresh) {
      multiplier *= aboveAtk100 / 100;
    }
    if (percentHp <= maxThresh) {
      multiplier *= belowAtk100 / 100;
    }
    return multiplier;
  },
  rcvPost: ([attrBits, typeBits, _, _a, _b, maxThresh, _c, belowRcv100], { monster, percentHp }) => {
    if (!maxThresh || !belowRcv100 || !monster.anyAttributeTypeBits(attrBits, typeBits)) {
      return 1;
    }
    return percentHp <= maxThresh ? belowRcv100 / 100 : 1;
  },
  damageMult: ([_, _a, minThresh, _b, shield], { percentHp }) => {
    return shield && percentHp <= minThresh ? 1 - shield / 100 : 1;
  },

  atkMax: (p) => Math.max(p[3] || 100, p[6] || 100) / 100,
  rcvMax: (p) => (p[7] || 100) / 100,
  damageMultMax: (p) => 1 - (p[4] || 0) / 100,
};

const baseStatFromAttrsTypesTimeExtend: LeaderSkill = { // 185
  timeExtend: ([sec100]) => sec100 / 100,
  hp: ([_, ...params], context) => baseStatFromAttrsTypes.hp!(params, context),
  atk: ([_, ...params], context) => baseStatFromAttrsTypes.atk!(params, context),
  rcv: ([_, ...params], context) => baseStatFromAttrsTypes.rcv!(params, context),

  hpMax: (p) => (p[3] || 100) / 100,
  atkMax: (p) => (p[4] || 100) / 100,
  rcvMax: (p) => (p[5] || 100) / 100,
};

const baseStatFromAttrsTypesBigBoard: LeaderSkill = { // 186
  bigBoard: true,
  hp: baseStatFromAttrsTypes.hp,
  atk: baseStatFromAttrsTypes.atk,
  rcv: baseStatFromAttrsTypes.rcv,

  hpMax: baseStatFromAttrsTypes.hpMax,
  atkMax: baseStatFromAttrsTypes.atkMax,
  rcvMax: baseStatFromAttrsTypes.rcvMax,
};

const atkPlusCombosFromAllLinkedOrbs: LeaderSkill = { // 192
  atk: ([attrBits, minLinked, atk100], { comboContainer }) => {
    if (!atk100) {
      return 1;
    }
    return idxsFromBits(attrBits)
      .every((attr) => comboContainer.combos[COLORS[attr]]
        .some((c) => c.count >= minLinked)) ? atk100 / 100 : 1;
  },
  plusCombo: ([attrBits, minLinked, _, comboBonus], { comboContainer }) => {
    if (!comboBonus) {
      return 0;
    }
    return idxsFromBits(attrBits)
      .every((attr) => comboContainer.combos[COLORS[attr]]
        .some((c) => c.count >= minLinked)) ? comboBonus : 0;
  },

  atkMax: (p) => (p[2] || 100) / 100,
  plusComboMax: (p) => p[3] || 0,
};

const atkRcvShieldFromLMatch: LeaderSkill = { // 193
  atk: ([attrBits, atk100], { comboContainer }) => atk100 && idxsFromBits(attrBits).some((attr) => comboContainer.combos[COLORS[attr]].some((c) => c.shape == Shape.L)) ? atk100 / 100 : 1,
  rcvPost: ([attrBits, _, rcv100], { comboContainer }) => rcv100 && idxsFromBits(attrBits).some((attr) => comboContainer.combos[COLORS[attr]].some((c) => c.shape == Shape.L)) ? rcv100 / 100 : 1,
  damageMult: ([attrBits, _, _a, shield], { comboContainer }) => shield && idxsFromBits(attrBits).some((attr) => comboContainer.combos[COLORS[attr]].some((c) => c.shape == Shape.L)) ? 1 - shield / 100 : 1,

  atkMax: (p) => (p[1] || 100) / 100,
  rcvMax: (p) => (p[2] || 100) / 100,
  damageMultMax: (p) => 1 - (p[3] || 0) / 100,
};

const atkPlusCombosFromRainbow: LeaderSkill = { // 194
  atk: ([attrBits, minColors, atk100], { comboContainer, team }) => atk100 && countMatchedColors(attrBits, comboContainer, team) >= minColors ? atk100 / 100 : 1,
  plusCombo: ([attrBits, minColors, _, comboBonus], { comboContainer, team }) => comboBonus && countMatchedColors(attrBits, comboContainer, team) >= minColors ? comboBonus : 0,

  atkMax: (p) => (p[2] || 100) / 100,
  plusComboMax: (p) => p[3] || 0,
};

const disablePoisonDamage: LeaderSkill = { // 197
  ignorePoison: true,
};

const atkShieldAwokenClearFromHealing: LeaderSkill = { // 198
  atk: ([thresh, atk100], { healing }) => atk100 && healing >= thresh ? atk100 / 100 : 1,
  damageMult: ([thresh, _, damageMult], { healing }) => damageMult && healing >= thresh ? damageMult / 100 : 1,
  awokenBindClear: ([thresh, _, _a, awokenBindClear], { healing }) => awokenBindClear && healing >= thresh ? awokenBindClear : 0,

  atkMax: (p) => (p[1] || 100) / 100,
  damageMultMax: (p) => 1 - (p[2] || 0) / 100,
  awokenBindClearMax: (p) => p[3] || 0,
};

const trueBonusFromRainbowMatches: LeaderSkill = { // 199
  trueBonusAttack: ([attrBits, minMatch, trueDamage], { team, comboContainer }) => countMatchedColors(attrBits, comboContainer, team) >= minMatch ? trueDamage : 0,
  trueBonusAttackMax: (p) => p[2],
};

const trueBonusFromLinkedOrbs: LeaderSkill = { // 200
  trueBonusAttack: ([attrBits, minLinked, trueDamage], { comboContainer }) => {
    return idxsFromBits(attrBits)
      .some((attr) => comboContainer.combos[COLORS[attr]]
        .some((c) => c.count >= minLinked)) ? trueDamage : 0;
  },
  trueBonusAttackMax: (p) => p[2],
};

const trueBonusFromColorMatches: LeaderSkill = { // 201
  trueBonusAttack: ([c1, c2, c3, c4, minColors, trueDamage], { comboContainer }) => countColorMatches([c1, c2, c3, c4], comboContainer) >= minColors ? trueDamage : 0,
  trueBonusAttackMax: (p) => p[5],
};

const GROUP_CHECK: Record<number, (m: MonsterInstance) => boolean> = {
  0: (m) => m.getCard().evoMaterials.includes(3826),
  2: (m) => Boolean(m.getCard().inheritanceType & 32),
};

function checkSubsMatchGroup(groupId: number, team: MonsterInstance[]): boolean {
  const groupCheck = GROUP_CHECK[groupId];
  if (!groupCheck) {
    console.error(`Unhandled Group ID: ${groupId}`);
    return false;
  }
  return subs(team).every(groupCheck);
}

const baseStatFromGroup: LeaderSkill = { // 203
  hp: ([groupId, hpMult100], { team }) => hpMult100 && checkSubsMatchGroup(groupId, team) ? hpMult100 / 100 : 1,
  atk: ([groupId, _, atkMult100], { team }) => atkMult100 && checkSubsMatchGroup(groupId, team) ? atkMult100 / 100 : 1,
  rcv: ([groupId, _, _a, rcvMult100], { team }) => rcvMult100 && checkSubsMatchGroup(groupId, team) ? rcvMult100 / 100 : 1,

  hpMax: (p) => (p[1] || 100) / 100,
  atkMax: (p) => (p[2] || 100) / 100,
  rcvMax: (p) => (p[3] || 100) / 100,
};

const plusComboFromColorMatches: LeaderSkill = { // 206
  plusCombo: ([a, b, c, d, e, minMatch, bonusCombo], { comboContainer }) => countColorMatches([a, b, c, d, e], comboContainer) >= minMatch ? bonusCombo : 0,
  plusComboMax: (p) => p[6],
};

const LEADER_SKILL_GENERATORS: Record<number, LeaderSkill> = {
  0: {},
  11: atkFromAttr,
  12: bonusAttackScale,
  13: autoHealLead,
  14: resolveLead,
  15: pureTimeExtend,
  16: shieldAgainstAll,
  17: shieldAgainstAttr,
  22: atkFromType,
  23: hpFromType,
  24: rcvFromType,
  26: atkUnconditional,
  28: atkRcvFromAttr,
  29: baseStatFromAttr,
  30: hpFromTwoTypes,
  31: atkFromTwoTypes,
  33: drumSounds,
  36: shieldAgainstTwoAttr,
  38: shieldFromHp,
  39: atkRcvFromSubHp,
  40: atkFromTwoAttrs,
  41: counterattack,
  43: shieldFromAboveHp,
  44: atkRcvFromAboveHp,
  45: atkRcvFromAttr, // Duplicate of 28
  46: hpFromTwoAttrs,
  48: hpFromAttr,
  49: rcvFromAttr,
  53: dropBoost,
  54: coinBoost,
  61: atkScalingFromUniqueColorMatches,
  62: atkHpFromType,
  63: hpRcvFromType,
  64: atkRcvFromType,
  65: baseStatFromType,
  66: atkFromCombos,
  67: hpRcvFromAttr,
  69: atkFromAttrType,
  73: atkHpFromAttrType,
  75: atkRcvFromAttrType,
  76: baseStatFromAttrType,
  77: atkFromTwoTypes, // Duplicate of 31
  79: atkRcvFromTwoTypes,
  94: atkRcvFromAttrAndSubHp,
  95: atkRcvFromTypeAndSubHp,
  96: atkRcvFromAttrAndAboveHp,
  97: atkRcvFromTypeAndAboveHp,
  98: atkScalingFromCombos,
  100: atkRcvFromSkill,
  101: atkFromExactCombos,
  103: atkRcvFromCombos,
  104: atkRcvFromAttrCombos,
  105: atkFromDecreasedRcv,
  106: atkFromDecreasedHp,
  107: hpDecrease,
  108: atkFromTypeDecreasedHp,
  109: atkFromLinkedOrbs,
  111: atkHpFromTwoAttrs,
  114: baseStatFromTwoAttrs,
  119: atkScalingFromLinkedOrbs,
  121: baseStatFromAttrsTypes,
  122: atkRcvFromAttrTypeSubHp,
  123: atkFromAttrTypeAboveHp,
  124: atkScalingFromMatchedColors2,
  125: baseStatFromRequiredSubs,
  129: baseStatShieldFromAttributeType,
  130: atkRcvShieldFromSubHp,
  131: atkRcvShieldFromAboveHp,
  133: atkRcvFromAttrsTypesSkillUse,
  136: stackingBaseStatsFromAttrs,
  137: stackingBaseStatsFromTypes,
  138: multipleLeaderSkills,
  139: atkFromAttrTypeMultiThresh,
  148: expBoost,
  149: rcvFromHpa,
  150: fiveOrbEnhance,
  151: atkRcvShieldFromHeartCross,
  155: baseStatFromAttrTypeMultiplayer,
  157: atkScalingFromCross,
  158: baseStatFromAttrsTypesMinMatch,
  159: atkScalingFromLinkedOrbs, // Duplicate of 119
  162: bigBoardLeader,
  163: baseStatFromAttrsTypesNoSkyfall,
  164: atkRcvScalingFromColorMatches,
  165: atkRcvScalingFromUniqueColorMatches,
  166: atkRcvScalingFromCombos,
  167: atkRcvScalingFromLinkedOrbs,
  169: atkShieldFromCombos,
  170: atkShieldFromColorMatches,
  171: atkShieldFromColorMatches2,
  175: baseStatFromCollab,
  177: atkScalingFromOrbsRemaining,
  178: baseStatFromAttrsTypesFixedTime,
  182: atkShieldFromLinkedOrbs,
  183: atkRcvShieldFromMultThresh,
  185: baseStatFromAttrsTypesTimeExtend,
  186: baseStatFromAttrsTypesBigBoard,
  192: atkPlusCombosFromAllLinkedOrbs,
  193: atkRcvShieldFromLMatch,
  194: atkPlusCombosFromRainbow,
  197: disablePoisonDamage,
  198: atkShieldAwokenClearFromHealing,
  199: trueBonusFromRainbowMatches,
  200: trueBonusFromLinkedOrbs,
  201: trueBonusFromColorMatches,
  203: baseStatFromGroup,
  206: plusComboFromColorMatches,
};

// Functions for libraries to call directly.

export function bigBoard(id: number): boolean {
  const playerSkill = floof.getPlayerSkill(id);

  // Handle multiple leader skills.
  if (playerSkill.internalEffectId == 138) {
    return playerSkill.internalEffectArguments.some((i) => bigBoard(i));
  }
  return LEADER_SKILL_GENERATORS[playerSkill.internalEffectId].bigBoard || false;
}

export function noSkyfall(id: number): boolean {
  const playerSkill = floof.getPlayerSkill(id);

  if (playerSkill.internalEffectId == 138) {
    return playerSkill.internalEffectArguments.some((i) => noSkyfall(i));
  }
  return LEADER_SKILL_GENERATORS[playerSkill.internalEffectId].noSkyfall || false;
}

export function ignorePoison(id: number): boolean {
  const { internalEffectId, internalEffectArguments } = floof.getPlayerSkill(id);

  // Handle multiple leader skills.
  if (internalEffectId == 138) {
    return internalEffectArguments.some((i) => ignorePoison(i));
  }
  return LEADER_SKILL_GENERATORS[internalEffectId].ignorePoison || false;
}

export function drumEffect(id: number): boolean {
  const { internalEffectId, internalEffectArguments } = floof.getPlayerSkill(id);

  // Handle multiple leader skills.
  if (internalEffectId == 138) {
    return internalEffectArguments.some((i) => drumEffect(i));
  }
  return LEADER_SKILL_GENERATORS[internalEffectId].drumEffect || false;

}

export function minOrbMatch(id: number): number {
  const { internalEffectId, internalEffectArguments } = floof.getPlayerSkill(id);

  if (internalEffectId == 138) {
    return Math.max(...internalEffectArguments.map((i) => minOrbMatch(i)));
  }

  return (LEADER_SKILL_GENERATORS[internalEffectId].minOrbMatch || (() => 3))(internalEffectArguments);
}

export function resolve(id: number): number {
  const { internalEffectId, internalEffectArguments } = floof.getPlayerSkill(id);

  if (internalEffectId == 138) {
    return Math.min(...internalEffectArguments.map((i) => resolve(i)));
  }

  return (LEADER_SKILL_GENERATORS[internalEffectId].resolve || (() => 101))(internalEffectArguments);
}

export function fixedTime(id: number): number {
  const { internalEffectId, internalEffectArguments } = floof.getPlayerSkill(id);

  if (internalEffectId == 138) {
    const times = internalEffectArguments.map((i) => fixedTime(i)).filter((t) => t > 0);
    return times.length ? Math.min(...times) : 0;
  }

  return (LEADER_SKILL_GENERATORS[internalEffectId].fixedTime || (() => 0))(internalEffectArguments);
}

export function timeExtend(id: number): number {
  const { internalEffectId, internalEffectArguments } = floof.getPlayerSkill(id);

  if (internalEffectId == 138) {
    return internalEffectArguments.map((i) => timeExtend(i)).reduce(
      (total: number, value: number) => total + value);
  }

  return (LEADER_SKILL_GENERATORS[internalEffectId].timeExtend || (() => 0))(internalEffectArguments);
}

export function hp(id: number, context: HpContext | undefined = undefined): number {
  const { internalEffectId, internalEffectArguments } = floof.getPlayerSkill(id);

  if (internalEffectId == 138) {
    return internalEffectArguments.map((i) => hp(i, context)).reduce(
      (total: number, value: number) => total * value);
  }

  if (context) {
    return (LEADER_SKILL_GENERATORS[internalEffectId].hp || (() => 1))(internalEffectArguments, context);
  }
  return (LEADER_SKILL_GENERATORS[internalEffectId].hpMax || (() => 1))(internalEffectArguments);
}

export function atk(id: number, context: AttackContext | undefined = undefined): number {
  const { internalEffectId, internalEffectArguments } = floof.getPlayerSkill(id);

  if (internalEffectId == 138) {
    // Stupid handling of multiple cross leads.
    if (!context) {
      let remainingCrosses = 3;
      let multiplier = 1;
      for (const arg of internalEffectArguments) {
        const skill = floof.getPlayerSkill(arg);
        // Heart Cross uses one cross.
        if (skill.internalEffectId == 151) {
          if (!remainingCrosses) {
            continue;
          }
          remainingCrosses--;
        }
        // Normal Cross scaling all remaining.
        if (floof.getPlayerSkill(arg).internalEffectId == 157) {
          if (remainingCrosses) {
            multiplier *= atkScalingFromCross.atkMax!(skill.internalEffectArguments) ** remainingCrosses;
            remainingCrosses = 0;
          }
          continue;
        }
        multiplier *= (LEADER_SKILL_GENERATORS[skill.internalEffectId].atkMax || (() => 1))(skill.internalEffectArguments);
      }
      return multiplier;
    }
    return internalEffectArguments.map((i) => atk(i, context)).reduce(
      (total: number, value: number) => total * value);
  }

  if (context) {
    return (LEADER_SKILL_GENERATORS[internalEffectId].atk || (() => 1))(internalEffectArguments, context);
  }
  return (LEADER_SKILL_GENERATORS[internalEffectId].atkMax || (() => 1))(internalEffectArguments);
}

export function rcv(id: number, context: RcvContext | undefined = undefined): number {
  const { internalEffectId, internalEffectArguments } = floof.getPlayerSkill(id);

  if (internalEffectId == 138) {
    return internalEffectArguments.map((i) => rcv(i, context)).reduce(
      (total: number, value: number) => total * value);
  }

  if (context) {
    return (LEADER_SKILL_GENERATORS[internalEffectId].rcv || (() => 1))(internalEffectArguments, context);
  }
  return (LEADER_SKILL_GENERATORS[internalEffectId].rcvMax || (() => 1))(internalEffectArguments);
}

export function rcvPost(id: number, context: RcvPostContext): number {
  const { internalEffectId, internalEffectArguments } = floof.getPlayerSkill(id);

  if (internalEffectId == 138) {
    return internalEffectArguments.map((i) => rcvPost(i, context)).reduce(
      (total: number, value: number) => total * value);
  }

  return (LEADER_SKILL_GENERATORS[internalEffectId].rcvPost || (() => 1))(internalEffectArguments, context);
}

export function damageMult(id: number, context: DamageMultContext | undefined = undefined): number {
  const { internalEffectId, internalEffectArguments } = floof.getPlayerSkill(id);

  if (internalEffectId == 138) {
    return internalEffectArguments.map((i) => damageMult(i, context)).reduce(
      (total: number, value: number) => total * value);
  }

  if (context) {
    return (LEADER_SKILL_GENERATORS[internalEffectId].damageMult || (() => 1))(internalEffectArguments, context);
  }
  return (LEADER_SKILL_GENERATORS[internalEffectId].damageMultMax || (() => 1))(internalEffectArguments);
}

export function plusCombo(id: number, context: PlusComboContext | undefined = undefined): number {
  const { internalEffectId, internalEffectArguments } = floof.getPlayerSkill(id);

  if (internalEffectId == 138) {
    return internalEffectArguments.map((i) => plusCombo(i, context)).reduce(
      (total: number, value: number) => total + value, 0);
  }

  if (context) {
    return (LEADER_SKILL_GENERATORS[internalEffectId].plusCombo || (() => 0))(internalEffectArguments, context);
  }
  return (LEADER_SKILL_GENERATORS[internalEffectId].plusComboMax || (() => 0))(internalEffectArguments);
}

export function drop(id: number): number {
  const { internalEffectId, internalEffectArguments } = floof.getPlayerSkill(id);

  if (internalEffectId == 138) {
    return internalEffectArguments.map((i) => drop(i)).reduce(
      (total: number, value: number) => total * value);
  }

  return (LEADER_SKILL_GENERATORS[internalEffectId].drop || (() => 1))(internalEffectArguments);
}

export function coins(id: number): number {
  const { internalEffectId, internalEffectArguments } = floof.getPlayerSkill(id);

  if (internalEffectId == 138) {
    return internalEffectArguments.map((i) => coins(i)).reduce(
      (total: number, value: number) => total * value);
  }

  return (LEADER_SKILL_GENERATORS[internalEffectId].coins || (() => 1))(internalEffectArguments);
}

export function exp(id: number): number {
  const { internalEffectId, internalEffectArguments } = floof.getPlayerSkill(id);

  if (internalEffectId == 138) {
    return internalEffectArguments.map((i) => exp(i)).reduce(
      (total: number, value: number) => total * value);
  }

  return (LEADER_SKILL_GENERATORS[internalEffectId].exp || (() => 1))(internalEffectArguments);
}

export function autoHeal(id: number): number {
  const { internalEffectId, internalEffectArguments } = floof.getPlayerSkill(id);

  if (internalEffectId == 138) {
    return internalEffectArguments.map((i) => autoHeal(i)).reduce(
      (total: number, value: number) => total + value);
  }

  return (LEADER_SKILL_GENERATORS[internalEffectId].autoHeal || (() => 0))(internalEffectArguments);
}

export function trueBonusAttack(id: number, context: TrueBonusAttackContext | undefined = undefined): number {
  const { internalEffectId, internalEffectArguments } = floof.getPlayerSkill(id);

  if (internalEffectId == 138) {
    return internalEffectArguments.map((i) => trueBonusAttack(i, context)).reduce(
      (total: number, value: number) => total + value);
  }
  if (context) {
    return (LEADER_SKILL_GENERATORS[internalEffectId].trueBonusAttack || (() => 0))(internalEffectArguments, context);
  }
  return (LEADER_SKILL_GENERATORS[internalEffectId].trueBonusAttackMax || (() => 0))(internalEffectArguments);
}

export function bonusAttack(id: number): number {
  const { internalEffectId, internalEffectArguments } = floof.getPlayerSkill(id);

  if (internalEffectId == 138) {
    return internalEffectArguments.map((i) => bonusAttack(i)).reduce(
      (total: number, value: number) => total + value);
  }

  return (LEADER_SKILL_GENERATORS[internalEffectId].bonusAttack || (() => 0))(internalEffectArguments);
}

export function counter(id: number): { multiplier: number, attribute: Attribute } {
  const { internalEffectId, internalEffectArguments } = floof.getPlayerSkill(id);

  if (internalEffectId == 138) {
    return internalEffectArguments
      .map((i) => counter(i))
      .reduce((aggregate, next) => ({
        multiplier: aggregate.multiplier + next.multiplier,
        attribute: Math.max(aggregate.attribute, next.attribute)
      }));
  }

  return (LEADER_SKILL_GENERATORS[internalEffectId].counter || (() => ({ multiplier: 0, attribute: -1 })))(internalEffectArguments);
}

export function awokenBindClear(id: number, context: AwokenBindClearContext | undefined = undefined): number {
  const { internalEffectId, internalEffectArguments } = floof.getPlayerSkill(id);

  if (internalEffectId == 138) {
    return internalEffectArguments.map((i) => awokenBindClear(i, context)).reduce(
      (total: number, value: number) => total + value);
  }

  if (context) {
    return (LEADER_SKILL_GENERATORS[internalEffectId].awokenBindClear || (() => 0))(internalEffectArguments, context);
  }
  return (LEADER_SKILL_GENERATORS[internalEffectId].awokenBindClearMax || (() => 0))(internalEffectArguments);
}
