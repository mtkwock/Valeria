/**
 * Stripped down version of Ilmina's tsc.js.  This mainly contains the classes,
 * functions, and methods needed to process the data of cards.
 * TODO: Update typing so that a large number of ANY types aren't used.
 */
import { ajax } from './ajax';
import { lzutf8Interface } from '../typings/lzutf8';

declare var LZUTF8: lzutf8Interface;

const AUGMENT_JP = Boolean(window.localStorage.augmentJp);

// TODO: Add more.
const LOADING_TEXTS = [
  'Fluffing the Floof',
  'Getting Grimoires Grimy',
  'Ransacking the Library',
  'Tossing Fluff Around',
  'Whispering Obscene Texts',
  'This Should Be Fun',
  'Liberating the Librarian',
  'Openly Discussing Data',
  'Arguing with the Keeper',
  'Instructing the Phantom',
  'Looking for Romia',
  'Definitely not PDC',
  'Throwing Shade on the Grimore',
  'Coloring the Books',
  'Boosting Ilmina\'s Skills',
  'Extending Time to Move',
  'Translating JP to NA',
  'Screw the Rules, I have Stones',
];

function compress(s: string): string {
  return LZUTF8.compress(s, { outputEncoding: 'StorageBinaryString' });
}

function decompress(s: string): string {
  return LZUTF8.decompress(s, { inputEncoding: 'StorageBinaryString' });
}

class CardAssets {
  static baseUrl = "https://f000.backblazeb2.com/file/ilmina/";
  static apkVersion = "PAD_16.0.0.apk";
  static isAlt(card: Card): boolean {
    return card.id > 10000;
  }
  static getAltBaseId(card: Card): number {
    return card.id % 100000;
  }
  static getCroppedPortrait(card: Card): string {
    let id = (card.id % 100000) + '';
    while (id.length < 5) {
      id = '0' + id;
    }
    //return CardAssets.baseUrl + "extract/mons/MONS_" + id + ".PNG";
    return "https://ilmina.com/extract/mons/MONS_" + id + ".PNG";
  }
  static getUncroppedPortrait(card: Card): string {
    let id = (card.id % 100000) + '';
    while (id.length < 5) {
      id = '0' + id;
    }
    return "https://ilmina.com/extract/mons2/MONS_" + id + ".PNG";
  }
  static getIconImageData(card: Card): GraphicDescription {
    const idIndex = card.id - 1;
    const idSet = Math.floor(idIndex / 100) + 1;
    const idSetStr = "000" + idSet;
    const idSetFinal = idSetStr.substr(-3, 3);
    const fileName = "CARDS_" + idSetFinal + ".PNG";
    let url = CardAssets.baseUrl + "extract/cards2/" + fileName;
    if (DataSource.isAprilFools()) {
      url = CardAssets.baseUrl + "extract/cards3/" + fileName;
    }
    const ret = new GraphicDescription(url, 0, 0, 102, 102);
    const iconOffsetInSet = idIndex % 100;
    ret.offsetX = (iconOffsetInSet % 10) * ret.width;
    ret.offsetY = Math.floor(iconOffsetInSet / 10) * ret.height;
    ret.baseHeight = 1024;
    ret.baseWidth = 1024;
    return ret;
  }
  static getTypeImageData(cardType: number): GraphicDescription {
    const row = 7 + Math.floor(cardType / 11);
    const column = cardType % 11;
    const url = CardAssets.baseUrl + "custom/eggs.png";
    const ret = new GraphicDescription(url, 0, 0, 36, 36, 400, 580);
    ret.offsetY += row * 36;
    ret.offsetX += column * 36;
    return ret;
  }
  static canPlus(card: Card) {
    if (card.types.indexOf(CardType.Evo as number) > -1) {
      return false;
    }
    if (card.types.indexOf(CardType.Awakening as number) > -1) {
      return false;
    }
    if (card.types.indexOf(CardType.Enhance as number) > -1 && card.maxLevel == 1) {
      return false;
    }
    return true;
  }
}
/*
    This class is for Card related assets that are only on the UI and not really part of the card itself.
    For example Awakenings are really part of Cards while the "Skill" icon and background are not.
*/
class CardUiAssets {
  static tryAddApkMetadata(asset: GraphicDescription, model: Model): boolean {
    if (!model) {
      return false;
    }
    const apkMetadata = model.apkMetadata;
    if (!apkMetadata) {
      return false;
    }
    let fileName = asset.url;
    if (!fileName) {
      return false;
    }
    const expectedStart = CardAssets.baseUrl + "extract/" + CardAssets.apkVersion + "2/";
    if (fileName.indexOf(expectedStart) != 0) {
      console.error("Url " + fileName + " does not support metadata");
      return false;
    }
    fileName = fileName.substr(expectedStart.length);
    const assetMetadata = apkMetadata[fileName];
    if (!assetMetadata) {
      return false;
    }
    asset.baseHeight = assetMetadata.height;
    asset.baseWidth = assetMetadata.width;
    return true;
  }
  static getIconBackground(model: Model): GraphicDescription {
    const url = CardAssets.baseUrl + "extract/" + CardAssets.apkVersion + "2/CARDFRAME.PNG";
    const ret = new GraphicDescription(url, 0, 104, 102, 102);
    CardUiAssets.tryAddApkMetadata(ret, model);
    return ret;
  }
  static getIconFrame(color: number, isSubAttribute: boolean, model: Model): GraphicDescription | null {
    const url = CardAssets.baseUrl + "extract/" + CardAssets.apkVersion + "2/CARDFRAME2.PNG";
    const ret = new GraphicDescription(url, 0, 0, 102, 102);
    let dx = -1;
    switch (color) {
      case ColorAttribute.Fire:
        dx = 0;
        break;
      case ColorAttribute.Water:
        dx = 1;
        break;
      case ColorAttribute.Wood:
        dx = 2;
        break;
      case ColorAttribute.Light:
        dx = 3;
        break;
      case ColorAttribute.Dark:
        dx = 4;
        break;
    }
    if (dx == -1) {
      return null;
    }
    ret.offsetX = dx * ret.width;
    ret.offsetY = (isSubAttribute ? ret.height + 2 : 0);
    CardUiAssets.tryAddApkMetadata(ret, model);
    return ret;
  }
}

class DataSource {
  static Version = "";
  errorReporter: { onError: (msg: string, fullMsg: string) => any };

  constructor(errorReporter: { onError: (msg: string, fullMsg: string) => any }) {
    if (!errorReporter) {
      throw "Requires reporter";
    }
    this.errorReporter = errorReporter;
  }
  static isAprilFools(): boolean {
    // const currentTime = new Date();
    // 3 = April
    // 1 = the actual date.
    // JS is weird.
    // const isAprilFools = currentTime.getMonth() == 3 && currentTime.getDate() == 1;
    return Boolean(window.localStorage.aprilFools);
    // return isAprilFools;
  }
  loadWithCache(label: string, url: string, callback: (data: any) => any) {
    try {
      const json = decompress(localStorage.getItem("dataSourceCache" + label) || '');
      if (json) {
        const obj = JSON.parse(json);
        if (obj.version == DataSource.Version) {
          setTimeout(() => {
            callback(obj.value);
          }, 0);
          return;
        }
      }
    }
    catch (e) {
      // Well we tried
      console.error(e);
    }
    const call = ajax(url);
    call.done((data) => {
      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      try {
        const decompressed = JSON.stringify({ version: DataSource.Version, value: data });
        localStorage.setItem("dataSourceCache" + label, compress(decompressed));
      }
      catch (e) {
        console.error(e);
      }
      callback(data);
    });
    call.fail((error) => {
      this.errorReporter.onError("Failed to load " + label + " data", error);
      callback(null);
    });
  }
  loadVersion(callback: (data: any) => any) {
    const call = ajax(CardAssets.baseUrl + "extract/metadata/recentlyUpdated.json");
    call.done((data) => {
      if (typeof data == "string") {
        data = JSON.parse(data);
      }
      DataSource.Version = data.date;
      callback(data);
    });
    call.fail((error) => {
      this.errorReporter.onError("Failed to load version data", error);
      callback(null);
    });
  }
  loadCardData(callback: (data: any) => any) {
    const url = CardAssets.baseUrl + "extract/api/download_card_data.json";
    // if (AUGMENT_JP) {
    //   url = CardAssets.baseUrl + "extract/api/jp/download_card_data.json";
    // }
    this.loadWithCache("CardData", url, callback);
  }
  loadCardDataJP(callback: (data: any) => any) {
    // let url = CardAssets.baseUrl + "extract/api/download_card_data.json";
    // if (AUGMENT_JP) {
    const url = CardAssets.baseUrl + "extract/api/jp/download_card_data.json";
    // }
    this.loadWithCache("CardDataJP", url, callback);
  }
  loadPlayerSkillData(callback: (data: any) => any) {
    let url = CardAssets.baseUrl + "extract/api/download_skill_data.json";
    // if (AUGMENT_JP) {
    //   url = CardAssets.baseUrl + "extract/api/jp/download_skill_data.json";
    // }
    this.loadWithCache("PlayerSkill", url, callback);
  }
  loadPlayerSkillDataJP(callback: (data: any) => any) {
    // let url = CardAssets.baseUrl + "extract/api/download_skill_data.json";
    // if (AUGMENT_JP) {
    let url = CardAssets.baseUrl + "extract/api/jp/download_skill_data.json";
    // }
    this.loadWithCache("PlayerSkillJP", url, callback);
  }
  loadEnemySkillData(callback: (data: any) => any) {
    let url = CardAssets.baseUrl + "extract/api/download_enemy_skill_data.json";
    // if (AUGMENT_JP) {
    //   url = CardAssets.baseUrl + "extract/api/jp/download_enemy_skill_data.json";
    // }
    this.loadWithCache("EnemySkill", url, callback);
  }
  loadEnemySkillDataJP(callback: (data: any) => any) {
    // let url = CardAssets.baseUrl + "extract/api/download_enemy_skill_data.json";
    // if (AUGMENT_JP) {
    let url = CardAssets.baseUrl + "extract/api/jp/download_enemy_skill_data.json";
    // }
    this.loadWithCache("EnemySkillJP", url, callback);
  }
  loadApkMetadata(callback: (data: any) => any) {
    const url = CardAssets.baseUrl + "extract/metadata/" + CardAssets.apkVersion + ".json";
    this.loadWithCache("ApkMetadata", url, callback);
  }
  loadMonsMetadata(callback: (data: any) => any) {
    const url = CardAssets.baseUrl + "extract/metadata/mons.json";
    this.loadWithCache("MonsMetadata", url, callback);
  }
  loadDungeonData(callback: (data: any) => any) {
    const url = CardAssets.baseUrl + "extract/api/download_dungeon_data.json";
    this.loadWithCache("Dungeon", url, callback);
  }
}
class GraphicDescription {
  scale: number = 1;
  url: string;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
  baseHeight: number;
  baseWidth: number;

  constructor(
    url: string,
    offsetX: number,
    offsetY: number,
    width: number,
    height: number,
    baseWidth: number | undefined = undefined,
    baseHeight: number | undefined = undefined) {
    if (baseWidth === void 0) { baseWidth = 0; }
    if (baseHeight === void 0) { baseHeight = 0; }
    this.scale = 1;
    this.url = url;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.width = width;
    this.height = height;
    this.baseHeight = baseHeight;
    this.baseWidth = baseWidth;
  }
}
class Ilmina {
  cards: Record<number, Card> = {};
  errorMessage: (s: string) => string = (s) => s;
  model: Model = new Model();
  apkMetadata: Record<string, { width: number, height: number }> = {};
  ready: boolean = false;
  // Initialization
  constructor() {
    // Helpers
    this.init();
  }
  // Public methods
  onError(simpleDescription: string, fullDescription: string) {
    console.error(simpleDescription);
    console.error(fullDescription);
  }
  init() {
    console.log("Loading card data...");
    const dataSource = new DataSource(this);
    dataSource.loadVersion(() => {
      const modelBuilder = new ModelBuilder();
      let totalCounts = 0;
      let countRemaining = 0;
      const decrementCount = () => {
        countRemaining--;
        const loadingBar = document.getElementById('valeria-loading');
        if (loadingBar) {
          const percentageCleared = `${Math.round(100 * (totalCounts - countRemaining) / totalCounts)}%`;
          const flavorText = LOADING_TEXTS[Math.floor(Math.random() * LOADING_TEXTS.length)];
          loadingBar.innerText = flavorText + ': ' + percentageCleared;
          loadingBar.style.width = percentageCleared;
        }
        if (countRemaining == 0) {
          this.finishedLoadingData(modelBuilder);
        }
      }

      countRemaining++; // Card groups
      totalCounts++;
      dataSource.loadCardData((x) => {
        this.parseCardData(x, modelBuilder);
        if (!AUGMENT_JP) {
          decrementCount();
          return;
        }
        dataSource.loadCardDataJP((y) => {
          this.parseCardData(y, modelBuilder);
          decrementCount();
        });
      });

      countRemaining++;
      totalCounts++;
      dataSource.loadMonsMetadata((x) => { modelBuilder.buildMonsMetadata(x); decrementCount(); });

      countRemaining++;
      totalCounts++;
      dataSource.loadApkMetadata((x) => { modelBuilder.buildApkMetadata(x); decrementCount(); });

      countRemaining++;
      totalCounts++;
      dataSource.loadPlayerSkillData((x) => {
        this.parsePlayerSkillData(x, modelBuilder);
        if (!AUGMENT_JP) {
          decrementCount();
          return;
        }
        dataSource.loadPlayerSkillDataJP((y) => {
          this.parsePlayerSkillData(y, modelBuilder);
          decrementCount();
        });
      });


      countRemaining++;
      totalCounts++;
      dataSource.loadEnemySkillData((x) => {
        modelBuilder.buildEnemySkillsData(x);
        if (!AUGMENT_JP) {
          decrementCount();
          return;
        }
        dataSource.loadEnemySkillDataJP((y) => {
          modelBuilder.buildEnemySkillsData(y);
          decrementCount();
        });
      });
    });
  }
  parseCardData(data: { card: string[] }, builder: ModelBuilder) {
    if (!data) {
      return;
    }
    console.log("Parsing card data...");
    data.card.forEach((v: string) => {
      builder.buildCard(v);
    });
  }
  parsePlayerSkillData(data: { skill: string[] }, builder: ModelBuilder) {
    if (!data) {
      return;
    }
    builder.buildPlayerSkillData(data.skill);
  }
  finishedLoadingData(builder: ModelBuilder) {
    const model = builder.build();
    // Manually put in P'numas's link back.
    model.cards[5987].transformsTo = 5986;
    this.model = model;
    this.finishedDataRender();
  }
  finishedDataRender(): void {
    this.setClockTimer();
    this.ready = true;
    console.log('The FLOOF is READY');
  }
  setClockTimer(): void {
    setInterval(() => {
      DateConverter.updateTime();
    }, 1000);
  }
}

const Awakening: Record<string | number, string | number> = {
  "Super": -1, '-1': "Super",
  "Unknown": 0, '0': "Unknown",
  "EnhancedHP": 1, '1': "EnhancedHP",
  "EnhancedATK": 2, '2': "EnhancedATK",
  "EnhancedRCV": 3, '3': "EnhancedRCV",
  "FireResist": 4, '4': "FireResist",
  "WaterResist": 5, '5': "WaterResist",
  "WoodResist": 6, '6': "WoodResist",
  "LightResist": 7, '7': "LightResist",
  "DarkResist": 8, '8': "DarkResist",
  "Autoheal": 9, '9': "Autoheal",
  "BindResist": 10, '10': "BindResist",
  "BlindResist": 11, '11': "BlindResist",
  "JammerResist": 12, '12': "JammerResist",
  "PoisonResist": 13, '13': "PoisonResist",
  "FireEnhance": 14, '14': "FireEnhance",
  "WaterEnhance": 15, '15': "WaterEnhance",
  "WoodEnhance": 16, '16': "WoodEnhance",
  "LightEnhance": 17, '17': "LightEnhance",
  "DarkEnhance": 18, '18': "DarkEnhance",
  "TimeExtend": 19, '19': "TimeExtend",
  "BindRecovery": 20, '20': "BindRecovery",
  "SkillBoost": 21, '21': "SkillBoost",
  "FireRow": 22, '22': "FireRow",
  "WaterRow": 23, '23': "WaterRow",
  "WoodRow": 24, '24': "WoodRow",
  "LightRow": 25, '25': "LightRow",
  "DarkRow": 26, '26': "DarkRow",
  "TPA": 27, '27': "TPA",
  "SBR": 28, '28': "SBR",
  "HeartEnhance": 29, '29': "HeartEnhance",
  "Multiboost": 30, '30': "Multiboost",
  "DragonKiller": 31, '31': "DragonKiller",
  "GodKiller": 32, '32': "GodKiller",
  "DevilKiller": 33, '33': "DevilKiller",
  "MachineKiller": 34, '34': "MachineKiller",
  "BalancedKiller": 35, '35': "BalancedKiller",
  "AttackerKiller": 36, '36': "AttackerKiller",
  "PhysicalKiller": 37, '37': "PhysicalKiller",
  "HealerKiller": 38, '38': "HealerKiller",
  "EvoKiller": 39, '39': "EvoKiller",
  "AwakeningKiller": 40, '40': "AwakeningKiller",
  "EnhanceKiller": 41, '41': "EnhanceKiller",
  "RedeemableKiller": 42, '42': "RedeemableKiller",
  "SevenCombo": 43, '43': "SevenCombo",
  "Guardbreak": 44, '44': "Guardbreak",
  "FUA": 45, '45': "FUA",
  "TeamHP": 46, '46': "TeamHP",
  "TeamRCV": 47, '47': "TeamRCV",
  "VDP": 48, '48': "VDP",
  "EquipAssist": 49, '49': "EquipAssist",
  "SuperFUA": 50, '50': "SuperFUA",
  "RainbowHaste": 51, '51': "RainbowHaste",
  "UnbindablePlus": 52, '52': "UnbindablePlus",
  "TimeExtendPlus": 53, '53': "TimeExtendPlus",
  "CloudResist": 54, '54': "CloudResist",
  "ScrollResist": 55, '55': "ScrollResist",
  "SkillBoostPlus": 56, '56': "SkillBoostPlus",
  "HP80": 57, '57': "HP80",
  "HP50": 58, '58': "HP50",
  "LShield": 59, '59': "LShield",
  "LUnlock": 60, '60': "LUnlock",
  "TenCombo": 61, '61': "TenCombo",
  "ComboOrb": 62, '62': "ComboOrb",
  "Voice": 63, '63': "Voice",
  "Dungeon": 64, '64': "Dungeon",
  "HpMinus": 65, '65': "HpMinus",
  "AtkMinus": 66, '66': "AtkMinus",
  "RcvMinus": 67, '67': "RcvMinus",
  "BlindResistPlus": 68, '68': "BlindResistPlus",
  "JammerResistPlus": 69, '69': "JammerResistPlus",
  "PoisonResistPlus": 70, '70': "PoisonResistPlus",
  "JammerSkyfall": 71, '71': "JammerSkyfall",
  "PoisonSkyfall": 72, '72': "PoisonSkyfall",
  "Unknown73": 73, '73': "Unknown73",
  "Unknown74": 74, '74': "Unknown74",
  "Unknown75": 75, '75': "Unknown75",
  "Unknown76": 76, '76': "Unknown76",
};
class Card {
  id = -1;
  monsterPoints: number = -1;
  /**
   * Bit flags
   * &1: Can be inherited onto another monster.
   * &2: Can be an inherit base.
   * &4: ??? Has something to do with collabs.
   * &8: Set if the monster is unstackable (Only occurs for evo, enhance, awakenings)
   * &16: Set if this monster cannot be used on a team.
   * &32: Set if the monster can take extra latent slots (e.g. Revos and SRevos)
   */
  inheritanceType: number = 0;
  unknownData: any[] = [];
  imageMetadata: any;
  name = "";
  japaneseName: string = "";
  attribute: number = ColorAttribute.None as number;
  subattribute: number = ColorAttribute.None as number;
  collab: number = -1;
  isEvoReversable = false;
  types: number[] = [];
  starCount = 0;
  cost = 0;
  evoType: number = EvolutionType.Normal as number;
  maxLevel = 0;
  feedExpPerLevel = 0;
  sellPricePerLevel = 0;
  minHp = 0;
  maxHp = 0;
  minAtk = 0;
  maxAtk = 0;
  minRcv = 0;
  maxRcv = 0;
  expCurve = 0;
  activeSkillId = 0;
  leaderSkillId = 0;
  turnTimer = 0;
  technicalTurnTimer = 0; // If this is 0, default to turnTimer value.
  evoFromId = 0;
  evoMaterials: number[] = [];
  devoMaterials: number[] = [];
  enemySkills: CardEnemySkill[] = [];
  awakenings: number[] = [];
  superAwakenings: number[] = [];
  latentKillers: number[] = [];
  isInheritable = false;
  extraSlottable = false;
  isLimitBreakable = false;
  limitBreakStatGain = 0;
  isAlt = false;
  altBaseCardId: number = -1;
  alternateVersions: number[] = [];
  exchangesTo = [];
  exchangesFrom = [];
  voiceId = 0;
  orbSkin = 0;
  charges = 0;
  chargeGain = 0;
  enemyHpAtLv1 = 0;
  enemyHpAtLv10 = 0;
  enemyHpCurve = 0;
  enemyAtkAtLv1 = 0;
  enemyAtkAtLv10 = 0;
  enemyAtkCurve = 0;
  enemyDefAtLv1 = 0;
  enemyDefAtLv10 = 0;
  enemyDefCurve = 0;
  maxEnemyLevel = 0;
  enemyCoinsAtLv2 = 0;
  enemyExpAtLv2 = 0;
  groups: any[] = [];
  evoTreeBaseId: number = -1;
  atkGrowth: number = 1;
  hpGrowth: number = 1;
  rcvGrowth: number = 1;
  /**
   * Note that this is only a guess.
   * Size of a monster in a dungeon.
   * 5 is full-width (#1465 Awoken Thoth)
   * 4 is half-width (#1464 Thoth)
   * 3 and below are smaller.  Not sure what the exact percentage is.
   */
  monsterSize: number = 0;
  groupingKey: number = 0; // How monsters are sorted in the Monster Book.
  latentId: number = 0; // Latents for fusion.
  transformsTo: number = -1;
  /**
   * 0: Old AI: Does 100% basic attack when initial preempt is unreachable.
   * 1: Current AI: Moves to next skill if a preempt is unreachable.
   */
  aiVersion: number = 0;
}
class CardEnemySkill {
  enemySkillId: number = -1;
  ai: number = -1;
  rnd: number = -1;
}
class ImageMetadata {
  filename: string = '';
  width: number = -1;
  height: number = -1;
}
const CardType: Record<string | number, string | number> = {
  "None": -1, "-1": "None",
  "Evo": 0, "0": "Evo",
  "Balanced": 1, "1": "Balanced",
  "Physical": 2, "2": "Physical",
  "Healer": 3, "3": "Healer",
  "Dragon": 4, "4": "Dragon",
  "God": 5, "5": "God",
  "Attacker": 6, "6": "Attacker",
  "Devil": 7, "7": "Devil",
  "Machine": 8, "8": "Machine",
  "UNKNOWN9": 9, "9": "UNKNOWN9",
  "UNKNOWN10": 10, "10": "UNKNOWN10",
  "UNKNOWN11": 11, "11": "UNKNOWN11",
  "Awakening": 12, "12": "Awakening",
  "UNKNOWN13": 13, "13": "UNKNOWN13",
  "Enhance": 14, "14": "Enhance",
  "Redeemable": 15, "15": "Redeemable",
};
const CollabGroup: Record<string, string | number> = {
  "None": 0, "0": "None",
  "Ragnarok": 1, "1": "Ragnarok",
  "Taiko": 2, "2": "Taiko",
  "ECO": 3, "3": "ECO",
  "UNKNOWN4": 4, "4": "UNKNOWN4",
  "Gunma": 5, "5": "Gunma",
  "FFCD": 6, "6": "FFCD",
  "Necky": 7, "7": "Necky",
  "Punt": 8, "8": "Punt",
  "Android": 9, "9": "Android",
  "Shinrabansho": 10, "10": "Shinrabansho",
  "Kapibara": 11, "11": "Kapibara",
  "CrazyTower": 12, "12": "CrazyTower",
  "TenkaTrigger": 13, "13": "TenkaTrigger",
  "EVA": 14, "14": "EVA",
  "SevenEleven": 15, "15": "SevenEleven",
  "ClashOfClans": 16, "16": "ClashOfClans",
  "GrooveCoaster": 17, "17": "GrooveCoaster",
  "ROACE": 18, "18": "ROACE",
  "DragonsDogma": 19, "19": "DragonsDogma",
  "Takaoka": 20, "20": "Takaoka",
  "BattleCats": 21, "21": "BattleCats",
  "Batman": 22, "22": "Batman",
  "BaskinRobbins": 23, "23": "BaskinRobbins",
  "AngryBirds": 24, "24": "AngryBirds",
  "UNKNOWN25": 25, "25": "UNKNOWN25",
  "HxH": 26, "26": "HxH",
  "HelloKitty": 27, "27": "HelloKitty",
  "PADBT": 28, "28": "PADBT",
  "BEAMS": 29, "29": "BEAMS",
  "Dragonball": 30, "30": "Dragonball",
  "SaintSeiya": 31, "31": "SaintSeiya",
  "RoadToDragons": 32, "32": "RoadToDragons",
  "DivineGate": 33, "33": "DivineGate",
  "SummonsBoard": 34, "34": "SummonsBoard",
  "Picotto": 35, "35": "Picotto",
  "Bikkuriman": 36, "36": "Bikkuriman",
  "AngryBirdsEpic": 37, "37": "AngryBirdsEpic",
  "DC": 38, "38": "DC",
  "Chibis1": 39, "39": "Chibis1",
  "NorthStar": 40, "40": "NorthStar",
  "Chibis2": 41, "41": "Chibis2",
  "UNKNOWN42": 42, "42": "UNKNOWN42",
  "UNKNOWN43": 43, "43": "UNKNOWN43",
  "Chibis3": 44, "44": "Chibis3",
  "FinalFantasy": 45, "45": "FinalFantasy",
  "GhostInTheShell": 46, "46": "GhostInTheShell",
  "DuelMasters": 47, "47": "DuelMasters",
  "AttackOnTitan": 48, "48": "AttackOnTitan",
  "NinjaHattori": 49, "49": "NinjaHattori",
  "ShohenSunday": 50, "50": "ShohenSunday",
  "UNKNOWN51": 51, "51": "UNKNOWN51",
  "Bleach": 52, "52": "Bleach",
  "BatmanVSuperman": 53, "53": "BatmanVSuperman",
  "UNKNOWN54": 54, "54": "UNKNOWN54",
  "PhoenixWright": 55, "55": "PhoenixWright",
  "Kenshin": 56, "56": "Kenshin",
  "Pepper": 57, "57": "Pepper",
  "Kinnikuman": 58, "58": "Kinnikuman",
  "NappingPrincess": 59, "59": "NappingPrincess",
  "Magazine": 60, "60": "Magazine",
  "MonsterHunter": 61, "61": "MonsterHunter",
  "CoroCoroMagaize": 62, "62": "CoroCoroMagaize",
  "Voltron": 63, "63": "Voltron",
  "DCUniverse": 64, "64": "DCUniverse",
  "FMA": 65, "65": "FMA",
  "KOF": 66, "66": "KOF",
  "YuYuHakusho": 67, "67": "YuYuHakusho",
  "Persona": 68, "68": "Persona",
  "CocaCola": 69, "69": "CocaCola",
  "MTG": 70, "70": "MTG",
  "ChronoMaGia": 71, "71": "ChronoMaGia",
  "SeventhRebirth": 72, "72": "SeventhRebirth",
  "CalcioFantasista": 73, "73": "CalcioFantasista",
  "PowerPro": 74, "74": "PowerPro",
  "Gintama": 75, "75": "Gintama",
  "SAO": 76, "76": "SAO",
  "KamenRider": 77, "77": "KamenRider",
  "YokaiWatch": 78, "78": "YokaiWatch",
  "Fate": 79, "79": "Fate",
  "StreetFighterV": 80, "80": "StreetFighterV",
  "UNKNOWN81": 81, "81": "UNKNOWN81",
  "UNKNOWN82": 82, "82": "UNKNOWN82",
  "ShamanKing": 83, "83": "ShamanKing",
  "UNKNOWN84": 84, "84": "UNKNOWN84",
  "Samsho": 85, "85": "Samsho",
  "PowerRangers": 86, "86": "PowerRangers",
  "Fujimi": 87, "87": "Fujimi",
  "UNKNOWN88": 88, "88": "UNKNOWN88",
  "UNKNOWN89": 89, "89": "UNKNOWN89",
  "Alts": 999, "999": "Alts",
  "DragonboundsDragoncallers": 10001, "10001": "DragonboundsDragoncallers",
};
const ColorAttribute: Record<string, number | string> = {
  "None": -1,
  "Fire": 0,
  "Water": 1,
  "Wood": 2,
  "Light": 3,
  "Dark": 4,
  "Heal": 5,
  "Jammer": 6,
  "Poison": 7,
  "MortalPoison": 8,
  "Bomb": 9,
  '-1': "None",
  '0': "Fire",
  '1': "Water",
  '2': "Wood",
  '3': "Light",
  '4': "Dark",
  '5': "Heal",
  '6': "Jammer",
  '7': "Poison",
  '8': "MortalPoison",
  '9': "Bomb",
};
class EnemySkill {
  id: number = -1;
  name: string = '';
  usageText: string = '';
  internalEffectId: number = -1;
  skillArgs: number[] = [];
  ratio: number = 100;
  aiArgs: number[] = [100, 100, 10000, 0, 0];
}
class EvolutionTreeDetails {
  cards: Card[] = [];
  baseId: number;
  constructor(baseId: number) {
    this.baseId = baseId;
  }
}
const EvolutionType: Record<string, string | number> = {
  "Normal": 0, "0": "Normal",
  "Ultimate": 1, "1": "Ultimate",
  "Reincarnated": 2, "2": "Reincarnated",
  "Assist": 3, "3": "Assist",
  "Pixel": 4, "4": "Pixel",
  "SuperReincarnated": 5, "5": "SuperReincarnated",
};
const LatentAwakening = {
  // WARNING: There are official IDs that you can extract from player_info; however, I don't know what those are
  // Do not rely on any of these IDs being correct without doing research. For now they're arbitrary.
  "None": -1, "-1": "None",
  "AllStats": 0, "0": "AllStats",
  "EvoKiller": 1, "1": "EvoKiller",
  "AwakenKiller": 2, "2": "AwakenKiller",
  "EnhancerKiller": 3, "3": "EnhancerKiller",
  "RedeemableKiller": 4, "4": "RedeemableKiller",
  "GodKiller": 5, "5": "GodKiller",
  "DragonKiller": 6, "6": "DragonKiller",
  "DevilKiller": 7, "7": "DevilKiller",
  "MachineKiller": 8, "8": "MachineKiller",
  "BalancedKiller": 9, "9": "BalancedKiller",
  "AttackerKiller": 10, "10": "AttackerKiller",
  "PhysicalKiller": 11, "11": "PhysicalKiller",
  "HealerKiller": 12, "12": "HealerKiller",
  "HpPlus": 13, "13": "HpPlus",
  "AtkPlus": 14, "14": "AtkPlus",
  "RcvPlus": 15, "15": "RcvPlus",
  "TimeExtendPlus": 16, "16": "TimeExtendPlus",
  "FireResistPlus": 17, "17": "FireResistPlus",
  "WaterResistPlus": 18, "18": "WaterResistPlus",
  "WoodResistPlus": 19, "19": "WoodResistPlus",
  "LightResistPlus": 20, "20": "LightResistPlus",
  "DarkResistPlus": 21, "21": "DarkResistPlus",
  "Hp": 22, "22": "Hp",
  "Atk": 23, "23": "Atk",
  "Rcv": 24, "24": "Rcv",
  "TimeExtend": 25, "25": "TimeExtend",
  "AutoHeal": 26, "26": "AutoHeal",
  "FireResist": 27, "27": "FireResist",
  "WaterResist": 28, "28": "WaterResist",
  "WoodResist": 29, "29": "WoodResist",
  "LightResist": 30, "30": "LightResist",
  "DarkResist": 31, "31": "DarkResist",
  "SkillDelayResist": 32, "32": "SkillDelayResist",
};
class Model {
  cards: Record<number, Card> = {};
  cardMetadata: Record<number, any> = {};
  apkMetadata: Record<string, { width: number, height: number }> = {};
  evoTrees: Record<number, EvolutionTreeDetails> = {};
  enemySkills: Record<number, EnemySkill> = {};
  playerSkills: PlayerSkill[] = [];
  cardGroups: { aliases: string[], cards: number[] }[] = [];
  usedCollabs = [];
  allExchanges = [];
  dungeons = {};
}
class DateConverter {
  static date: number = new Date().getTime();
  static limit = (90 * 24 * 60 * 60 * 1000);

  static now(dt: number | undefined = undefined): number {
    if (dt) {
      DateConverter.date = dt;
    }
    return DateConverter.date;
  }

  static updateTime() {
    DateConverter.now(new Date().getTime());
  }
  static isForever(time: Date): boolean {
    if (time.getUTCFullYear() > 2036) {
      return true;
    }
    return false;
  }
  static convertToDate(input: string): Date | null {
    if (input == "") {
      return null;
    }
    const year = "20" + input.substr(0, 2);
    const month = input.substr(2, 2);
    const day = input.substr(4, 2);
    const hour = input.substr(6, 2);
    const minute = input.substr(8, 2);
    const second = input.substr(10, 2);
    const utcOffset = Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second), 0);
    return new Date(utcOffset + 8 * 60 * 60 * 1000);
  }
  static shouldDisplayCountdown(end: Date): boolean {
    const time = end.getTime();
    const now = new Date().getTime(); // Using this to avoid recalculating if we should or shouldn't
    if (now > time) {
      // Already ended
      return false;
    }
    if (time > now + this.limit) {
      // More than 1 week
      return false;
    }
    return true;
  }
  static getCountdown(end: Date): string {
    let time = end.getTime();
    time -= DateConverter.now();
    if (time < 0 || time > this.limit) {
      return "--:--:--";
    }
    let ret = "";
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const days = Math.floor(time / day);
    time -= day * days;
    const hours = Math.floor(time / hour);
    time -= hour * hours;
    const minutes = Math.floor(time / minute);
    time -= minute * minutes;
    const seconds = Math.floor(time / second);
    time -= second * seconds;
    if (days > 0) {
      ret += days;
      if (days == 1) {
        ret += " day";
      }
      else {
        ret += " days";
      }
      if (hour > 0) {
        ret += " and ";
        ret += hours;
        if (hour == 1) {
          ret += " hour";
        }
        else {
          ret += " hours";
        }
      }
      return ret;
    }
    function pad(time: number) {
      return ("00" + String(time)).slice(-2);
    }
    return pad(hours) + ":" + pad(minutes) + ":" + pad(seconds);
  }
}
class PlayerSkill {
  id: number = -1;
  name: string = '';
  maxLevel: number = -1;
  description: string = '';
  internalEffectId: number = -1;
  initialCooldown: number = -1;
  maxCooldown: number = -1;
  cardIds: number[] = [];
  parsedEffects = [];
  internalEffectArguments: number[] = [];
  // Deprecated
  Effects = [];
  orbColours = []; //dumb attribute to cater to orbchangers without redoing the skill system
}
class ModelBuilder {
  cardIdsBySkillId: Record<number, number[]> = {};
  model: Model = new Model();

  buildCard(cardData: any) {
    try {
      const card = this.buildCardInternal(cardData);
      if (!card.name) {
        return;
      }
      this.buildEvoTree(card);
    }
    catch (e) {
      throw "Failed to parse card data (" + JSON.stringify(cardData) + ") - " + e;
    }
  }
  buildPlayerSkillData(playerSkillData: string[]): void {
    const playerSkills = new Array(playerSkillData.length) as PlayerSkill[];
    for (let i = this.model.playerSkills.length; i < playerSkillData.length; i++) {
      const reader = new RawDataReader(playerSkillData[i]);
      const skill = new PlayerSkill();
      skill.id = i;
      skill.name = reader.readString();
      skill.description = reader.readString();
      skill.internalEffectId = reader.readNumber();
      skill.maxLevel = reader.readNumber();
      skill.initialCooldown = reader.readNumber();
      skill.maxCooldown = skill.initialCooldown - skill.maxLevel + 1;
      reader.readString(); // Seems always empty
      const data = new Array(reader.countRemaining());
      for (let j = 0; j < data.length; j++) {
        data[j] = reader.readNumber();
      }
      skill.internalEffectArguments = data;
      playerSkills[i] = skill;
    }

    this.model.playerSkills = this.model.playerSkills.concat(playerSkills);
  }
  pushIfNotZero(ary: number[], val: number): void {
    if (val == 0) {
      return;
    }
    ary.push(val);
  }
  buildEvoTree(card: Card) {
    let evoTree = this.model.evoTrees[card.evoTreeBaseId];
    if (evoTree == null) {
      evoTree = new EvolutionTreeDetails(card.evoTreeBaseId);
      this.model.evoTrees[card.evoTreeBaseId] = evoTree;
    }
    evoTree.cards.push(card);
  }
  buildCardInternal(cardData: string): Card {
    const c = new Card();
    const reader = new RawDataReader(cardData);
    // const unknownData = [];
    c.id = reader.readNumber(); // 0
    if (this.model.cards[c.id]) {
      return c;
    }
    // this.model.cards[c.id] = c;

    c.name = reader.readString(); // 1
    c.attribute = ColorAttribute[ColorAttribute[reader.readNumber()]] as number; // 2
    c.subattribute = ColorAttribute[ColorAttribute[reader.readNumber()]] as number; // 3
    c.isEvoReversable = reader.readNumber() == 1; // 4
    c.types.push(CardType[CardType[String(reader.readNumber())]] as number); // 5
    const type2: number = CardType[CardType[String(reader.readNumber())]] as number; // 6
    if (type2 != CardType.None) {
      c.types.push(type2);
    }
    c.starCount = reader.readNumber(); // 7
    c.cost = reader.readNumber(); // 8
    // These values are 0-5.
    // Higher correlation seems to be higher valued, but unclear why.
    // e.g. Cloud evolution is 5, 5, 5, 3, 4.
    // This is probably an enum to the relative size of the monster.
    c.monsterSize = reader.readNumber(); // 9
    c.maxLevel = reader.readNumber(); // 10
    c.feedExpPerLevel = reader.readNumber() / 4; // 11
    // 100: Far more common.
    // 1 seems to be related to not being released in NA.
    const usually100 = reader.readNumber(); // u1 12 // ??? Seems to always be 100
    if (usually100 != 100 && usually100 != 1) {
      console.error(`Slot 12 is different!  Time to handle it.\nid: ${c.id} value: ${usually100}`);
    }
    c.sellPricePerLevel = reader.readNumber() / 10; // 13
    c.minHp = reader.readNumber(); // 14
    c.maxHp = reader.readNumber(); // 15
    c.hpGrowth = reader.readNumber(); // 16
    c.minAtk = reader.readNumber(); // 17
    c.maxAtk = reader.readNumber(); // 18
    c.atkGrowth = reader.readNumber(); // 19
    c.minRcv = reader.readNumber(); // 20
    c.maxRcv = reader.readNumber(); // 21
    c.rcvGrowth = reader.readNumber(); // 22
    c.expCurve = reader.readNumber(); // 23
    // 2.5: Far more common
    // 1 happens at the exact same time that unknownData[1] is 1.
    const usually25 = reader.readNumber(); // u2 24 // ??? Mostly 2.
    if (usually25 != 2.5 && usually25 != 1) {
      console.error(`Slot 24 is different!  Time to handle it.\nid: ${c.id} value: ${usually25}`);
    }
    if ((usually100 == 100) != (usually25 == 2.5)) {
      console.error(`Anomaly detected in slot 12 and 24. ${usually100} - ${usually25}`);
    }
    c.activeSkillId = reader.readNumber(); // 25
    c.leaderSkillId = reader.readNumber(); // 26
    c.turnTimer = reader.readNumber(); // 27
    c.enemyHpAtLv1 = reader.readNumber(); // 28
    c.enemyHpAtLv10 = reader.readNumber(); // 29
    c.enemyHpCurve = reader.readNumber(); // 30
    c.enemyAtkAtLv1 = reader.readNumber(); // 31
    c.enemyAtkAtLv10 = reader.readNumber(); // 32
    c.enemyAtkCurve = reader.readNumber(); // 33
    c.enemyDefAtLv1 = reader.readNumber(); // 34
    c.enemyDefAtLv10 = reader.readNumber(); // 35
    c.enemyDefCurve = reader.readNumber(); // 36
    c.maxEnemyLevel = reader.readNumber(); // 37
    c.enemyCoinsAtLv2 = reader.readNumber(); // 38
    c.enemyExpAtLv2 = reader.readNumber(); // 39
    c.evoFromId = reader.readNumber(); // 40
    this.pushIfNotZero(c.evoMaterials, reader.readNumber()); // 41
    this.pushIfNotZero(c.evoMaterials, reader.readNumber()); // 42
    this.pushIfNotZero(c.evoMaterials, reader.readNumber()); // 43
    this.pushIfNotZero(c.evoMaterials, reader.readNumber()); // 44
    this.pushIfNotZero(c.evoMaterials, reader.readNumber()); // 45
    this.pushIfNotZero(c.devoMaterials, reader.readNumber()); // 46
    this.pushIfNotZero(c.devoMaterials, reader.readNumber()); // 47
    this.pushIfNotZero(c.devoMaterials, reader.readNumber()); // 48
    this.pushIfNotZero(c.devoMaterials, reader.readNumber()); // 49
    this.pushIfNotZero(c.devoMaterials, reader.readNumber()); // 50
    // If it's not 0, then this is the Technical Dungeon turnTimer.
    c.technicalTurnTimer = reader.readNumber(); // 51
    // 0s and 1s, unclear. Obviously a flag, but for what?
    c.aiVersion = reader.readNumber(); // 52
    c.charges = reader.readNumber(); // 53
    c.chargeGain = reader.readNumber(); // 54
    // 0 for all monsters except:
    //  *    1 - [#495] Love Deity, Feline Bastet
    //  * 1000 - [#111] Vampire Lord
    // For all purposes, we should ignore this.
    const usuallyZero = reader.readNumber();
    if (usuallyZero) {
      if (!(usuallyZero == 1 && c.id == 495) && !(usuallyZero == 1000 && c.id == 111)) {
        console.error(`Slot 55 is different, time to handle it!\nid: ${c.id} value: ${usuallyZero}`);
      }
    }
    // unknownData.push(reader.readNumber()); // 55 // ??? u4
    // Currently *always* 0.  Probably a reserved area for future changes/flags.
    const alwaysZero = reader.readNumber();
    if (alwaysZero) {
      console.error(`Slot 56 is non-zero, time to handle it!\n id: ${c.id} value: ${alwaysZero}`);
    }
    // unknownData.push(alwaysZero); // 56 // ??? u5

    const skillCount = reader.readNumber(); // 57
    for (let i = 0; i < skillCount; i++) {
      const enemySkill = new CardEnemySkill();
      enemySkill.enemySkillId = reader.readNumber();
      enemySkill.ai = reader.readNumber();
      enemySkill.rnd = reader.readNumber();
      c.enemySkills.push(enemySkill);
    }
    const awakeningCount = reader.readNumber();
    for (let i = 0; i < awakeningCount; i++) {
      c.awakenings.push(Awakening[Awakening[String(reader.readNumber())]] as number);
    }
    const superAwakenings = reader.readString();
    if (superAwakenings != "") {
      const superAwakenings2 = superAwakenings.split(",");
      for (let i = 0; i < superAwakenings2.length; i++) {
        const superAwakening = superAwakenings2[i];
        c.superAwakenings.push(Awakening[Awakening[superAwakening]] as number);
      }
    }
    c.evoTreeBaseId = reader.readNumber();
    c.groupingKey = reader.readNumber();
    const type3 = CardType[CardType[String(reader.readNumber())]] as number;
    if (type3 != CardType.None) {
      c.types.push(type3);
    }
    c.monsterPoints = reader.readNumber();
    c.latentId = reader.readNumber();
    c.collab = CollabGroup[CollabGroup[reader.readNumber()]] as number;
    c.inheritanceType = reader.readNumber();
    c.isInheritable = ((c.inheritanceType & 1) == 1);
    c.extraSlottable = ((c.inheritanceType & 32) == 32);
    c.japaneseName = reader.readString();
    c.limitBreakStatGain = reader.readNumber();
    c.isLimitBreakable = c.limitBreakStatGain > 0;
    c.voiceId = reader.readNumber();
    c.orbSkin = reader.readNumber();
    const maybeTransform = reader.read();
    if (maybeTransform.length) {
      c.transformsTo = parseInt(maybeTransform.substring(5));
    }
    // c.unknownData = unknownData;
    if (!reader.isEmpty()) {
      //throw "Excess data detected";
      console.log("excess data detected");
    }
    // Handle aliases
    this.registerSkillOwnedByCard(c.activeSkillId, c.id);
    this.registerSkillOwnedByCard(c.leaderSkillId, c.id);
    this.model.cards[c.id] = c;
    if (CardAssets.isAlt(c)) {
      c.isAlt = true;
      c.altBaseCardId = CardAssets.getAltBaseId(c);
      // For now this works. This may not work in the future.
      const baseCard = this.model.cards[c.altBaseCardId];
      if (baseCard) {
        baseCard.alternateVersions.push(c.id);
      }
      else {
        console.error("Alt " + c.id + " can't find base " + c.altBaseCardId);
      }
    }
    // Set latent killers
    const isBalanced = c.types.indexOf(CardType.Balanced as number) >= 0;
    if (isBalanced || c.types.indexOf(CardType.Healer as number) >= 0) {
      c.latentKillers.push(LatentAwakening.DragonKiller);
    }
    if (isBalanced || c.types.indexOf(CardType.God as number) >= 0 || c.types.indexOf(CardType.Attacker as number) >= 0) {
      c.latentKillers.push(LatentAwakening.DevilKiller);
    }
    if (isBalanced || c.types.indexOf(CardType.Dragon as number) >= 0 || c.types.indexOf(CardType.Physical as number) >= 0) {
      c.latentKillers.push(LatentAwakening.MachineKiller);
    }
    if (isBalanced || c.types.indexOf(CardType.Devil as number) >= 0 || c.types.indexOf(CardType.Machine as number) >= 0) {
      c.latentKillers.push(LatentAwakening.GodKiller);
    }
    if (isBalanced || c.types.indexOf(CardType.Machine as number) >= 0) {
      c.latentKillers.push(LatentAwakening.BalancedKiller);
    }
    if (isBalanced || c.types.indexOf(CardType.Healer as number) >= 0) {
      c.latentKillers.push(LatentAwakening.AttackerKiller);
    }
    if (isBalanced || c.types.indexOf(CardType.Attacker as number) >= 0) {
      c.latentKillers.push(LatentAwakening.PhysicalKiller);
    }
    if (isBalanced || c.types.indexOf(CardType.Dragon as number) >= 0 || c.types.indexOf(CardType.Physical as number) >= 0) {
      c.latentKillers.push(LatentAwakening.HealerKiller);
    }
    // All done
    return c;
  }
  registerSkillOwnedByCard(skillId: number, cardId: number) {
    let ary = this.cardIdsBySkillId[skillId];
    if (!ary) {
      ary = [];
      this.cardIdsBySkillId[skillId] = ary;
    }
    ary.push(cardId);
  }
  buildApkMetadata(data: any) {
    const apkMetadata: Record<string, any> = {};
    if (data) {
      for (let key in data) {
        const dataArray = data[key].images;
        dataArray.forEach((data: { filename: string, width: number, height: number }) => {
          const metadata = new ImageMetadata();
          metadata.filename = data.filename;
          metadata.width = data.width;
          metadata.height = data.height;
          apkMetadata[metadata.filename] = metadata;
        });
      }
    }
    this.model.apkMetadata = apkMetadata;
  }
  buildEnemySkillsData(data: any) {
    if (!data) {
      return;
    }
    const rawData = data.enemy_skills;
    if (!rawData) {
      console.error("Unexpected enemy skill data");
      console.error(data);
      return;
    }
    //skill params are id, name, effectid, param identifier, params...
    //param identifier determines what params you'll get
    //hex number, resolving to a set of params from 0-14
    //0 - small textbox text on use
    //1-8 - skill parameters 0-7
    //9 - ratio?
    //10-14 - AI parameters 0-4
    this.splitEvilRawData(rawData, (lineSplit) => {
      try {
        if (lineSplit[0] == "c") {
          // Ignore the checksum
          return;
        }
        const currentSkill = new EnemySkill();
        currentSkill.id = parseInt(lineSplit[0]);
        if (this.model.enemySkills[currentSkill.id]) {
          // Ignore already defined skills.
          return;
        }
        currentSkill.name = lineSplit[1];
        currentSkill.internalEffectId = parseInt(lineSplit[2]);
        const dec = parseInt(lineSplit[3], 16); //parse the paramidentifiers. It's in hex bitflags
        const skillParamsPresent = [];
        //skillparamspresent will result in an array of numbers from 0-14
        //determining what is given in the rest of the line
        for (let i = 0; i < 16; i++) {
          if (((dec >> i) & 1) == 1) {
            skillParamsPresent.push(i);
          }
        }
        if (lineSplit.length != skillParamsPresent.length + 4) {
          throw "Unexpected split";
        }
        //default values for arguments 0-14
        const args = ['', 0, 0, 0, 0, 0, 0, 0, 0, 100, 100, 100, 10000, 0, 0];
        for (let i = 0; i < skillParamsPresent.length; i++) {
          args[skillParamsPresent[i]] = lineSplit[i + 4];
        }
        currentSkill.usageText = args[0] as string;
        for (let i = 1; i < 9; i++) {
          if (typeof (args[i]) == "string") {
            currentSkill.skillArgs[i - 1] = parseInt(args[i] as string);
          }
        }
        currentSkill.ratio = parseInt(args[9] as string);
        for (let i = 10; i < 15; i++) {
          currentSkill.aiArgs[i - 10] = parseInt(args[i] as string);
        }
        this.model.enemySkills[currentSkill.id] = currentSkill;
      }
      catch (e) {
        console.error("Failed to parse enemy skill line...");
        console.error(lineSplit);
        console.error(e);
      }
    });
  }
  splitEvilRawData(rawData: any, callback: (data: any) => any) {
    let currentLine = [];
    let cellBuffer = "";
    let inQuote = false;
    for (let i = 0; i < rawData.length; i++) {
      const currentCharacter = rawData[i];
      if (inQuote) {
        // You're allowed to have single quotes inside of the text :Nao:
        // Can only tell if you're done by looking ahead
        if (currentCharacter == "'" && i + 1 < rawData.length && (rawData[i + 1] == "," || rawData[i + 1] == "\n")) {
          inQuote = false;
          continue;
        }
        cellBuffer += currentCharacter;
        continue;
      }
      if (currentCharacter == "'") {
        inQuote = true;
        continue;
      }
      if (currentCharacter == ",") {
        currentLine.push(cellBuffer);
        cellBuffer = "";
        continue;
      }
      if (currentCharacter == "\n") {
        currentLine.push(cellBuffer);
        callback(currentLine);
        currentLine = [];
        cellBuffer = "";
        continue;
      }
      cellBuffer += currentCharacter;
    }
    currentLine.push(cellBuffer);
    callback(currentLine);
  }
  buildMonsMetadata(data: any) {
    if (typeof data != "object") {
      throw "Unexpected data: " + JSON.stringify(data);
    }
    const ret: Record<number, ImageMetadata[]> = {};
    if (data) {
      for (let key in data) {
        // format: mons_001.bc
        let stringId = key.replace("mons_", "").replace(".bc", "");
        while (stringId.length > 1 && stringId[0] == "0") {
          stringId = stringId.substring(1);
        }
        const id = parseInt(stringId);
        const data2 = data[key].images;
        const metadata = [];
        for (let i = 0; i < data2.length; i++) {
          const meta = new ImageMetadata();
          meta.filename = data2[i].filename;
          meta.width = parseInt(data2[i].width);
          meta.height = parseInt(data2[i].height);
          metadata.push(meta);
        }
        ret[id] = metadata;
      }
    }
    this.model.cardMetadata = ret;
  }
  connectMetadataToCards() {
    for (let id in this.model.cardMetadata) {
      const card = this.model.cards[id];
      if (!card) {
        console.error("Id not found: " + id);
        continue;
      }
      card.imageMetadata = this.model.cardMetadata[id];
      // Alternate versions have the same metadata as their bases
      for (let altIndx in card.alternateVersions) {
        const altId = card.alternateVersions[altIndx];
        const altCard = this.model.cards[altId];
        altCard.imageMetadata = card.imageMetadata;
      }
    }
  }
  connectCardIdsToSkills() {
    for (let skillId in this.cardIdsBySkillId) {
      this.model.playerSkills[skillId].cardIds = this.cardIdsBySkillId[skillId];
    }
  }
  build() {
    this.connectMetadataToCards();
    this.connectCardIdsToSkills();
    const ret = this.model;
    return ret;
  }
}
class RawDataReader {
  data: string;
  index: number;
  constructor(data: string) {
    this.index = 0;
    this.data = data;
  }
  read(): string {
    if (this.index >= this.data.length) {
      throw "Nothing left to read";
    }
    const ret = this.data[this.index];
    this.index++;
    return ret;
  }
  readNumber(): number {
    const ret = this.read();
    if (typeof ret !== "number") {
      throw "Expected number, found " + typeof (ret) + " (" + ret + ") (index " + this.index + ")";
    }
    return ret;
  }
  readString(): string {
    const ret = this.read();
    if (typeof ret !== "string") {
      throw "Expected string, found " + typeof (ret) + " (" + ret + ") (index " + this.index + ")";
    }
    return ret;
  }
  countRemaining(): number {
    return this.data.length - this.index;
  }
  isEmpty(): boolean {
    return this.index >= this.data.length;
  }
}

const floof = new Ilmina();

declare global {
  interface Window { floof: Ilmina; }
}
window.floof = floof;

export {
  floof,
  Card,
  CardUiAssets,
  CardAssets,
  EnemySkill,
  compress,
  decompress,
};
