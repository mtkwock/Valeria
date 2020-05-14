import { Card } from './ilmina_stripped';

// 3 is red and blue
// 1 red
// 2 blue
// 4 green
// 8 light
// 16 dark
// 32 heart
// 64 jammer
// 128 poison
// 256 mortal poison
// const COLOR_ORDER = 'rbgldhjpmou';
const COLORS = [
  'r',
  'b',
  'g',
  'l',
  'd',
  'h',
  'j',
  'p',
  'm',
  'o',
  'u',
];

function idxsFromBits(bits: number): number[] {
  const idxs = [];
  for (let idx = 0; bits >> idx; idx++) {
    if (bits >> idx & 1) {
      idxs.push(idx);
    }
  }
  return idxs;
}

enum Attribute {
  FIRE = 0,
  WATER = 1,
  WOOD = 2,
  LIGHT = 3,
  DARK = 4,
  NONE = -1,
}

const AttributeToName = new Map<Attribute, string>();
AttributeToName.set(Attribute.FIRE, 'Fire');
AttributeToName.set(Attribute.WATER, 'Water');
AttributeToName.set(Attribute.WOOD, 'Wood');
AttributeToName.set(Attribute.LIGHT, 'Light');
AttributeToName.set(Attribute.DARK, 'Dark');
AttributeToName.set(Attribute.NONE, 'None');

enum MonsterType {
  NONE = -1,
  EVO = 0,
  BALANCED = 1,
  PHYSICAL = 2,
  HEALER = 3,
  DRAGON = 4,
  GOD = 5,
  ATTACKER = 6,
  DEVIL = 7,
  MACHINE = 8,
  AWAKENING = 12,
  ENHANCED = 14,
  REDEEMABLE = 15,

  UNKNOWN_1 = 9,
  UNKNOWN_2 = 10,
  UNKNOWN_3 = 11,
  UNKNOWN_4 = 13,
}

const TypeToName = new Map<MonsterType, string>();
TypeToName.set(MonsterType.EVO, 'Evo');
TypeToName.set(MonsterType.BALANCED, 'Balanced');
TypeToName.set(MonsterType.PHYSICAL, 'Physical');
TypeToName.set(MonsterType.HEALER, 'Healer');
TypeToName.set(MonsterType.DRAGON, 'Dragon');
TypeToName.set(MonsterType.GOD, 'God');
TypeToName.set(MonsterType.ATTACKER, 'Attacker');
TypeToName.set(MonsterType.DEVIL, 'Devil');
TypeToName.set(MonsterType.MACHINE, 'Machine');
TypeToName.set(MonsterType.AWAKENING, 'Awakening');
TypeToName.set(MonsterType.ENHANCED, 'Enhanced');
TypeToName.set(MonsterType.REDEEMABLE, 'Redeemable');
TypeToName.set(MonsterType.NONE, 'None');

enum Latent {
  HP = 0, ATK = 1, RCV = 2,
  TIME = 3,
  AUTOHEAL = 4,
  RESIST_FIRE = 5, RESIST_WATER = 6, RESIST_WOOD = 7,
  RESIST_LIGHT = 8, RESIST_DARK = 9,
  SDR = 10,
  ALL_STATS = 11,
  EVO = 12, AWOKEN = 13, ENHANCED = 14, REDEEMABLE = 15,

  GOD = 16, DRAGON = 17, DEVIL = 18, MACHINE = 19,
  BALANCED = 20, ATTACKER = 21, PHYSICAL = 22, HEALER = 23,

  HP_PLUS = 24, ATK_PLUS = 25, RCV_PLUS = 26,
  TIME_PLUS = 27,
  RESIST_FIRE_PLUS = 28,
  RESIST_WATER_PLUS = 29,
  RESIST_WOOD_PLUS = 30,
  RESIST_LIGHT_PLUS = 31,
  RESIST_DARK_PLUS = 32,
};

enum Awakening {
  HP = 1, ATK = 2, RCV = 3,
  RESIST_FIRE = 4, RESIST_WATER = 5, RESIST_WOOD = 6, RESIST_LIGHT = 7, RESIST_DARK = 8,
  AUTOHEAL = 9,
  RESIST_BIND = 10, RESIST_BLIND = 11, RESIST_JAMMER = 12, RESIST_POISON = 13,
  OE_FIRE = 14, OE_WATER = 15, OE_WOOD = 16, OE_LIGHT = 17, OE_DARK = 18,
  TIME = 19,
  RECOVER_BIND = 20,
  SKILL_BOOST = 21,
  ROW_FIRE = 22, ROW_WATER = 23, ROW_WOOD = 24, ROW_LIGHT = 25, ROW_DARK = 26,
  TPA = 27,
  SBR = 28,
  OE_HEART = 29,
  MULTIBOOST = 30,
  DRAGON = 31, GOD = 32, DEVIL = 33, MACHINE = 34,
  BALANCED = 35, ATTACKER = 36, PHYSICAL = 37, HEALER = 38,
  EVO = 39, AWAKENING = 40, ENHANCED = 41, REDEEMABLE = 42,
  COMBO_7 = 43,
  GUARD_BREAK = 44,
  BONUS_ATTACK = 45,
  TEAM_HP = 46, TEAM_RCV = 47,
  VDP = 48,
  AWOKEN_ASSIST = 49,
  BONUS_ATTACK_SUPER = 50,
  SKILL_CHARGE = 51,
  RESIST_BIND_PLUS = 52,
  TIME_PLUS = 53,
  RESIST_CLOUD = 54, RESIST_TAPE = 55,
  SKILL_BOOST_PLUS = 56,
  HP_GREATER = 57, HP_LESSER = 58,
  L_GUARD = 59, L_UNLOCK = 60,
  COMBO_10 = 61, COMBO_ORB = 62,
  VOICE = 63,
  SOLOBOOST = 64,
  HP_MINUS = 65, ATK_MINUS = 66, RCV_MINUS = 67,
  RESIST_BLIND_PLUS = 68, RESIST_JAMMER_PLUS = 69, RESIST_POISON_PLUS = 70,
  JAMMER_BOOST = 71, POISON_BOOST = 72,
};

const AwakeningToPlusAwakening = new Map<Awakening, Awakening>([
  [Awakening.SKILL_BOOST, Awakening.SKILL_BOOST_PLUS],
  [Awakening.TIME, Awakening.TIME_PLUS],
  [Awakening.RESIST_BIND, Awakening.RESIST_BIND_PLUS],
  [Awakening.RESIST_BLIND, Awakening.RESIST_BLIND_PLUS],
  [Awakening.RESIST_POISON, Awakening.RESIST_POISON_PLUS],
  [Awakening.RESIST_JAMMER, Awakening.RESIST_JAMMER_PLUS],
]);

const PlusAwakeningMultiplier = new Map<Awakening, number>();
PlusAwakeningMultiplier.set(Awakening.SKILL_BOOST_PLUS, 2);
PlusAwakeningMultiplier.set(Awakening.TIME_PLUS, 2);
PlusAwakeningMultiplier.set(Awakening.RESIST_BIND_PLUS, 2);
PlusAwakeningMultiplier.set(Awakening.RESIST_BLIND_PLUS, 5);
PlusAwakeningMultiplier.set(Awakening.RESIST_JAMMER_PLUS, 5);
PlusAwakeningMultiplier.set(Awakening.RESIST_POISON_PLUS, 5);

const AwakeningToName = [
  'NULL',
  'HP', 'ATK', 'RCV', 'Resist Fire', 'Resist Water', 'Resist Wood', 'Resist Light', 'Resist Dark',
  'Autoheal', 'Resist Bind', 'Resist Blind', 'Resist Jammer', 'Resist Poison',
  'Fire OE', 'Water OE', 'Wood OE', 'Light OE', 'Dark OE',
  'Time',
  'Recover Bind',
  'Skill Boost',
  'Fire Row', 'Water Row', 'Wood Row', 'Light Row', 'Dark Row',
  'TPA', 'Skill-Bind Resist', 'Heart OE', 'Multiboost',
  'Dragon Killer', 'God Killer', 'Devil Killer', 'Machine Killer',
  'Balanced Killer', 'Attacker Killer', 'Physical Killer', 'Healer Killer',
  'Evo Killer', 'Awakening Killer', 'Enhanced Killer', 'Redeemable Killer',
  'Enhanced Combo', 'Guard Break', 'Bonus Attack', 'Team HP+', 'Team RCV+',
  'Damage Void Piercer', 'Awoken Assist', 'Super Bonus Attack', 'Skill Charge',
  'Resist Bind+', 'Time+', 'Resist Cloud', 'Resist Immobility', 'Skill Boost+',
  '>=80% Enhace', '<=50% Enhance', 'L-Guard', 'L-Unlock', 'Enhanced Combo+',
  'Combo Orb', 'Voice', 'Soloboost', 'HP-', 'ATK-', 'RCV-',
  'Resist Blind+', 'Resist Poison+', 'Resist Jammer+',
  'Jammer Blessing', 'Poison Blessing',
];

const Round = {
  UP: Math.ceil,
  DOWN: Math.floor,
  NEAREST: Math.round,
  NONE: (a: number) => a,
};

function numberWithCommas(x: number): string {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const DEFAULT_CARD = new Card();

const LatentSuper = new Set<Latent>([
  Latent.EVO, Latent.AWOKEN, Latent.ENHANCED, Latent.REDEEMABLE,
  Latent.GOD, Latent.DRAGON, Latent.DEVIL, Latent.MACHINE,
  Latent.BALANCED, Latent.ATTACKER, Latent.PHYSICAL, Latent.HEALER,

  Latent.ALL_STATS, Latent.HP_PLUS, Latent.ATK_PLUS,
  Latent.RCV_PLUS, Latent.TIME_PLUS,
  Latent.RESIST_FIRE_PLUS, Latent.RESIST_WATER_PLUS, Latent.RESIST_WOOD_PLUS,
  Latent.RESIST_LIGHT_PLUS, Latent.RESIST_DARK_PLUS,
]);

enum Shape {
  AMORPHOUS = 0,
  L = 1,
  COLUMN = 2,
  CROSS = 3,
  BOX = 4,
  ROW = 5,
};

const LetterToShape: Record<string, Shape> = {
  'A': Shape.AMORPHOUS,
  'L': Shape.L,
  'C': Shape.COLUMN,
  'X': Shape.CROSS,
  'B': Shape.BOX,
  'R': Shape.ROW,
};

const ShapeToLetter: Record<Shape, string> = {
  0: 'A',
  1: 'L',
  2: 'C',
  3: 'X',
  4: 'B',
  5: 'R',
};

const BASE_URL = (document.getElementById('valeria-referenceable-img') as HTMLImageElement).src.replace('assets/UIPAT1.PNG', '');

async function waitFor(conditionFn: () => boolean, waitMs = 50) {
  while (!conditionFn()) {
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
}

export {
  Attribute,
  AttributeToName,
  MonsterType,
  TypeToName,
  Latent,
  LatentSuper,
  Awakening,
  AwakeningToPlusAwakening,
  PlusAwakeningMultiplier,
  AwakeningToName,
  Shape,
  LetterToShape,
  ShapeToLetter,
  BASE_URL,
  COLORS,
  DEFAULT_CARD,
  idxsFromBits,
  numberWithCommas,
  Round,
  waitFor,
};
