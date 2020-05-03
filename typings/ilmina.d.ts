// Type definitions for Ilmina's interface.
// Definitions by: Scarlet

export interface CardEnemySkill {
  ai: number,
  enemySkillId: number,
  rnd: number,
}

export interface Card {
  id: number;
  name: string;
  maxLevel: number;
  attribute: number;
  subattribute: number;
  superAwakenings: number[];
  latentKillers: number[];
  awakenings: number[];
  minHp: number;
  maxHp: number;
  hpGrowth: number;
  minAtk: number;
  maxAtk: number;
  atkGrowth: number;
  minRcv: number;
  maxRcv: number;
  rcvGrowth: number;
  isLimitBreakable: boolean;
  limitBreakStatGain: number;
  types: number[];
  unknownData: number[];
  evoTreeBaseId: number;
  collab: number;
  leaderSkillId: number;
  activeSkillId: number;
  inheritanceType: number;
  enemyAtkAtLv1: number;
  enemyDefAtLv1: number;
  enemyHpAtLv1: number;
  enemyAtkAtLv10: number;
  enemyDefAtLv10: number;
  enemyHpAtLv10: number;
  enemyAtkCurve: number;
  enemyDefCurve: number;
  enemyHpCurve: number;

  enemySkills: CardEnemySkill[];
}

export interface CardGroup {
  name: string;
  aliases: string[];
  collabId: number;
  cards: number[];
}

export interface PlayerSkill {
  internalEffectId: number;
  internalEffectArguments: number[];
  maxCooldown: number;
}

export interface EvolutionTreeDetails {
  cards: Card[],
  baseId: number,
}

export interface GraphicsDescription {
  url: string;

  baseHeight: number;
  baseWidth: number;
  offsetX: number;
  offsetY: number;
}

export interface EnemySkill {
  aiArgs: number[];
  id: number;
  internalEffectId: number;
  name: string;
  ratio: number;
  skillArgs: number[];
  usageText: string;
}

export interface Model {
  cards: Record<number, Card>;
  playerSkills: PlayerSkill[];
  evoTrees: Record<number, EvolutionTreeDetails>;
  cardGroups: CardGroup[];
  enemySkills: EnemySkill[];
}

// Create an instance by:
// declare var vm: KnockoutVM;
export interface KnockoutVM {
  model: Model;
  page: () => number;
}

// Create an instance by:
// declare var CardAssets: CardAssetInterface;
export interface CardAssetInterface {
  canPlus(card: Card): boolean;
  getIconImageData(card: Card): GraphicsDescription|null;
  getCroppedPortrait(card: Card): string;
  getTypeImageData(type: number, vm: KnockoutVM): GraphicsDescription;
}

// Create an instance by:
// declare var CardUiAssets: CardUiAssetInterface;
export interface CardUiAssetInterface {
  getIconFrame(attribute: number, isSubattribute: boolean, vm: KnockoutVM): GraphicsDescription|null;
}
