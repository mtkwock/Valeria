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
const COLORS: string[] = [
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
  HEART = 5,
  JAMMER = 6,
  POISON = 7,
  MORTAL_POISON = 8,
  BOMB = 9,
  FIXED = -2,
  NONE = -1,
}

const AttributeToName = new Map<Attribute, string>();
AttributeToName.set(Attribute.FIRE, 'Fire');
AttributeToName.set(Attribute.WATER, 'Water');
AttributeToName.set(Attribute.WOOD, 'Wood');
AttributeToName.set(Attribute.LIGHT, 'Light');
AttributeToName.set(Attribute.DARK, 'Dark');
AttributeToName.set(Attribute.NONE, 'None');
AttributeToName.set(Attribute.HEART, 'Heart');
AttributeToName.set(Attribute.JAMMER, 'Jammer');
AttributeToName.set(Attribute.POISON, 'Poison');
AttributeToName.set(Attribute.MORTAL_POISON, 'Mortal Poison');


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
  AWOKEN = 12,
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
TypeToName.set(MonsterType.AWOKEN, 'Awakening');
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
  RESIST_ATTRIBUTE_ABSORB = 33,
  RESIST_DAMAGE_VOID = 34,
  RESIST_POISON_SKYFALL = 35,
  RESIST_JAMMER_SKYFALL = 36,
  RESIST_LEADER_SWAP = 37,
}

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
  EVO = 39, AWOKEN = 40, ENHANCED = 41, REDEEMABLE = 42,
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
}

const AwakeningToPlus: Map<Awakening, { awakening: Awakening; multiplier: number }> = new Map([
  [Awakening.SKILL_BOOST, { awakening: Awakening.SKILL_BOOST_PLUS, multiplier: 2 }],
  [Awakening.TIME, { awakening: Awakening.TIME_PLUS, multiplier: 2 }],
  [Awakening.RESIST_BIND, { awakening: Awakening.RESIST_BIND_PLUS, multiplier: 2 }],
  [Awakening.RESIST_POISON, { awakening: Awakening.RESIST_POISON_PLUS, multiplier: 5 }],
  [Awakening.RESIST_JAMMER, { awakening: Awakening.RESIST_JAMMER_PLUS, multiplier: 5 }],
  [Awakening.RESIST_BLIND, { awakening: Awakening.RESIST_BLIND_PLUS, multiplier: 5 }],
]);

const TypeToKiller: Record<MonsterType, Awakening> = {
  0: Awakening.EVO,
  1: Awakening.BALANCED,
  2: Awakening.PHYSICAL,
  3: Awakening.HEALER,
  4: Awakening.DRAGON,
  5: Awakening.GOD,
  6: Awakening.ATTACKER,
  7: Awakening.DEVIL,
  8: Awakening.MACHINE,
  12: Awakening.AWOKEN,
  14: Awakening.ENHANCED,
  15: Awakening.REDEEMABLE,
  // Unset values.
  '-1': Awakening.AUTOHEAL,
  9: Awakening.AUTOHEAL,
  10: Awakening.AUTOHEAL,
  11: Awakening.AUTOHEAL,
  13: Awakening.AUTOHEAL,
};

const TypeToLatentKiller: Record<MonsterType, Latent> = {
  0: Latent.EVO,
  1: Latent.BALANCED,
  2: Latent.PHYSICAL,
  3: Latent.HEALER,
  4: Latent.DRAGON,
  5: Latent.GOD,
  6: Latent.ATTACKER,
  7: Latent.DEVIL,
  8: Latent.MACHINE,
  12: Latent.AWOKEN,
  14: Latent.ENHANCED,
  15: Latent.REDEEMABLE,
  // Unset values.
  '-1': Latent.AUTOHEAL,
  9: Latent.AUTOHEAL,
  10: Latent.AUTOHEAL,
  11: Latent.AUTOHEAL,
  13: Latent.AUTOHEAL,
}

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
}

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

const BASE_URL = window.origin + window.location.pathname;

async function waitFor(conditionFn: () => boolean, waitMs = 50) {
  while (!conditionFn()) {
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
}

enum FontColor {
  FIRE = 'red',
  WATER = 'cyan',
  WOOD = 'lawngreen',
  LIGHT = 'yellow',
  DARK = 'fuchsia',
  HEART = 'pink',
  JAMMER = 'lightgray',
  POISON = 'purple',
  MORTAL_POISON = 'darkpurple',
  BOMB = 'brown',
  COLORLESS = 'gray',
  FIXED = 'white',
  NONE = 'black',
}

const AttributeToFontColor: Record<Attribute, FontColor> = {
  0: FontColor.FIRE,
  1: FontColor.WATER,
  2: FontColor.WOOD,
  3: FontColor.LIGHT,
  4: FontColor.DARK,
  5: FontColor.HEART,
  6: FontColor.JAMMER,
  7: FontColor.POISON,
  8: FontColor.MORTAL_POISON,
  9: FontColor.BOMB,
  '-2': FontColor.FIXED,
  '-1': FontColor.NONE,
};

// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function addCommas(n: number): string {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  // let decimalPart = '';
  // if (!Number.isInteger(n)) {
  //   let fn = Math.floor;
  //   if (n < 0) {
  //     fn = Math.ceil;
  //   }
  //   decimalPart = String(n - fn(n)).substring(1, 2 + maxPrecision);
  //   while (decimalPart[decimalPart.length - 1] == '0') {
  //     decimalPart = decimalPart.substring(0, decimalPart.length - 1);
  //   }
  //   n = fn(n);
  // }
  // const reversed = String(n).split('').reverse().join('');
  // const forwardCommaArray = reversed.replace(/(\d\d\d)/g, '$1,').split('').reverse();
  // if (forwardCommaArray[0] == ',') {
  //   forwardCommaArray.splice(0, 1);
  // } else if (forwardCommaArray[0] == '-' && forwardCommaArray[1] == ',') {
  //   forwardCommaArray.splice(1, 1);
  // }
  // return forwardCommaArray.join('') + decimalPart;
}

function removeCommas(s: string): number {
  return Number(s.replace(/,/g, ''));
}

class Rational {
  numerator: number = 0;
  denominator: number = 1;

  private static matcher: RegExp = /\s*(-?\d+)\s*\/\s*(\d+)\s*/;

  constructor(numerator: number = 0, denominator: number = 1) {
    this.numerator = numerator;
    this.denominator = denominator;
  }

  multiply(n: number, roundingFn: (a: number) => number = (x) => x): number {
    return roundingFn(n * this.numerator / this.denominator);
  }

  reduce() {
    // Cannot reduce if denominator already 1
    if (this.denominator == 1) {
      return;
    }
    // Can only reduce integral pairs.
    if (!Number.isInteger(this.numerator) || !Number.isInteger(this.denominator)) {
      return;
    }

    function divides(num: number, den: number): boolean {
      return Number.isInteger(num / den);
    }

    function gcd(a: number, b: number): number {
      while (!divides(a, b) && !divides(b, a)) {
        if (a > b) {
          a -= b;
        } else {
          b -= a;
        }
      }

      return Math.min(a, b);
    }

    const divisor = gcd(this.numerator, this.denominator);
    if (divisor == 1) {
      return;
    }
    this.numerator /= divisor;
    this.denominator /= divisor;
  }

  toString(): string {
    this.reduce();

    if (this.denominator == 1) {
      return String(this.numerator);
    }
    return `${this.numerator} / ${this.denominator}`;
  }

  static from(s: string): Rational {
    if (!s.includes('/')) {
      return new Rational(Number(s));
    }

    let match = s.match(Rational.matcher);
    if (match && match[0] == s) {
      return new Rational(Number(match[1]), Number(match[2]));
    }
    return new Rational(NaN);
  }
}

const INT_CAP = 2 ** 31 - 1;

enum TeamBadge {
  NONE = 0,
  COST = 1,
  TIME = 2,
  MASS_ATTACK = 3,
  RCV = 4,
  HP = 5,
  ATK = 6,
  SKILL_BOOST = 7,
  RESIST_BIND = 8,
  SBR = 9,
  EXP = 10,
  NO_SKYFALL = 11,
  RESIST_BLIND = 12,
  RESIST_JAMMER = 13,
  RESIST_POISON = 14,
  RCV_PLUS = 17,
  HP_PLUS = 18,
  ATK_PLUS = 19,
  TIME_PLUS = 21,
}

const TeamBadgeToName: Record<TeamBadge, string> = {
  0: 'None',
  1: 'Cost',
  2: 'Time Extend',
  3: 'Mass Attack',
  4: 'RCV',
  5: "HP",
  6: 'ATK',
  7: 'Skill Boost',
  8: 'Bind Immune',
  9: 'Skill-Bind Resist',
  11: 'No-Skyfall',
  17: 'RCV+',
  18: 'HP+',
  19: 'ATK+',
  21: 'Time Extend+',
  12: 'Blind Resist',
  13: 'Jammer Resist',
  14: 'Poison Resist',
  10: 'Rank Exp',
};

const TEAM_BADGE_ORDER: TeamBadge[] = [
  TeamBadge.NONE,
  TeamBadge.COST,
  TeamBadge.MASS_ATTACK,
  TeamBadge.RCV,
  TeamBadge.HP,
  TeamBadge.ATK,
  TeamBadge.SKILL_BOOST,
  TeamBadge.RESIST_BIND,
  TeamBadge.SBR,
  TeamBadge.NO_SKYFALL,
  TeamBadge.RCV_PLUS,
  TeamBadge.HP_PLUS,
  TeamBadge.ATK_PLUS,
  TeamBadge.TIME_PLUS,
  TeamBadge.RESIST_BLIND,
  TeamBadge.RESIST_JAMMER,
  TeamBadge.RESIST_POISON,
  TeamBadge.EXP,
];

const TeamBadgeToAwakening: Map<TeamBadge, { awakening: Awakening, count: number }> = new Map([
  [TeamBadge.TIME, { awakening: Awakening.TIME, count: 2 }],
  [TeamBadge.SKILL_BOOST, { awakening: Awakening.SKILL_BOOST, count: 1 }],
  [TeamBadge.RESIST_BIND, { awakening: Awakening.RESIST_BIND, count: 2 }],
  [TeamBadge.SBR, { awakening: Awakening.SBR, count: 2.5 }],
  [TeamBadge.TIME_PLUS, { awakening: Awakening.TIME, count: 4 }],
  [TeamBadge.RESIST_BLIND, { awakening: Awakening.RESIST_BLIND, count: 2.5 }],
  [TeamBadge.RESIST_JAMMER, { awakening: Awakening.RESIST_JAMMER, count: 2.5 }],
  [TeamBadge.RESIST_POISON, { awakening: Awakening.RESIST_POISON, count: 2.5 }],
]);

interface DungeonMechanics {
  // Occurs no matter what
  resolve: boolean;
  superResolve: boolean;

  skillDelay: number;
  skillBind: boolean;
  leaderBind: boolean;
  helperBind: boolean;
  subBind: boolean;
  awokenBind: boolean;

  hits: (number | string)[];
  timeDebuff: boolean;
  rcvDebuff: boolean;
  atkDebuff: boolean;

  comboAbsorb: number;
  damageAbsorb: boolean;
  attributesAbsorbed: number;
  damageVoid: boolean;
  leaderSwap: boolean;
  poisonChange: boolean;
  jammerChange: boolean;
  blind: boolean;
  cloud: boolean;
  tape: boolean;
  poisonSkyfall: boolean;
  jammerSkyfall: boolean;
  blindSkyfall: boolean;
  spinner: boolean;
  lock: boolean;
  unmatchable: boolean;
  noSkyfall: boolean;
}

enum BoolSetting {
  APRIL_FOOLS = 'aprilFools',
  INHERIT_PLUSSED = 'inheritPlussed',
  USE_PREEMPT = 'usePreempt',
  WARN_CLOSE = 'warnOnClose',
  WARN_CHANGE = 'warnOnChange',
  DEBUG_AREA = 'debugArea',
}
enum NumberSetting {
  MONSTER_LEVEL = 'monsterLevel',
  INHERIT_LEVEL = 'inheritLevel',
}

interface SettingsInterface {
  getBool: (s: BoolSetting) => boolean;
  setBool: (s: BoolSetting, b: boolean) => void;
  getNumber: (s: NumberSetting) => number;
  setNumber: (s: NumberSetting, n: number) => void;
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
  AwakeningToPlus,
  PlusAwakeningMultiplier,
  AwakeningToName,
  Shape,
  LetterToShape,
  ShapeToLetter,
  TypeToKiller, TypeToLatentKiller,
  BASE_URL,
  COLORS,
  INT_CAP,
  idxsFromBits,
  numberWithCommas,
  Round,
  waitFor,
  FontColor, AttributeToFontColor,
  addCommas, removeCommas,
  Rational,
  TeamBadge, TeamBadgeToName, TEAM_BADGE_ORDER, TeamBadgeToAwakening,
  DungeonMechanics,
  SettingsInterface, BoolSetting, NumberSetting
};
