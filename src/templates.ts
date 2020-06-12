/**
 * Rendering tools for other classes to reference.
 * These take relatively pure data and update that way.
 * TODO: Split this into files corresponding to the classes they are templated
 * for.
 * TODO: Consider making some of these into proper soy templates and then
 * compiling them here so that the structure is more consistent.
 */

import {
  BASE_URL, COLORS, DEFAULT_CARD,
  Attribute, AttributeToFontColor, FontColor, AttributeToName,
  Awakening, AwakeningToName, Latent,
  MonsterType, TypeToName,
  addCommas, removeCommas,
  Shape, LetterToShape,
  TeamBadge, TEAM_BADGE_ORDER, TeamBadgeToName,
} from './common';
import { CardAssets, CardUiAssets, floof, Card } from './ilmina_stripped';
import { fuzzySearch, fuzzyMonsterSearch, prioritizedMonsterSearch, prioritizedInheritSearch, prioritizedEnemySearch } from './fuzzy_search';
import { DUNGEON_ALIASES } from './fuzzy_search_aliases';
// import { debug } from './debugger';

function create(tag: string, cls = ''): HTMLElement {
  const el = document.createElement(tag);
  if (cls) {
    el.className = cls;
  }
  return el;
}

enum ClassNames {
  HALF_OPACITY = 'valeria-half-opacity',
  MONSTER_TYPE = 'valeria-monster-type',
  LAYERED_ASSET = 'valeria-layered-asset',

  ICON = 'valeria-monster-icon',
  ICON_SELECTED = 'valeria-monster-icon-selected',
  ICON_ATTR = 'valeria-monster-icon-attribute',
  ICON_SUB = 'valeria-monster-icon-subattribute',
  ICON_INFO = 'valeria-monster-icon-info',
  ICON_PLUS = 'valeria-monster-icon-plus',
  ICON_AWAKE = 'valeria-monster-icon-awakening',
  ICON_SUPER = 'valeria-monster-icon-sa',
  ICON_LEVEL = 'valeria-monster-icon-level',
  ICON_ID = 'valeria-monster-icon-id',
  INHERIT = 'valeria-monster-inherit',
  INHERIT_ICON = 'valeria-monster-inherit-icon',
  INHERIT_ATTR = 'valeria-monster-inherit-attribute',
  INHERIT_SUB = 'valeria-monster-inherit-subattribute',
  INHERIT_ID = 'valeria-monster-inherit-id',
  INHERIT_LEVEL = 'valeria-monster-inherit-level',
  INHERIT_PLUS = 'valeria-monster-inherit-plus',
  MONSTER_LATENTS = 'valeria-monster-latents',
  MONSTER_LATENT = 'valeria-monster-latent',
  MONSTER_LATENT_SUPER = 'valeria-monster-latent-super',
  MONSTER_LATENT_HYPER = 'valeria-monster-latent-hyper',

  COMBO_EDITOR = 'valeria-combo-editor',
  COMBO_COMMAND = 'valeria-combo-command',
  COMBO_TABLE = 'valeria-combo-table',
  COMBO_ORB = 'valeria-combo-orb',

  TABBED = 'valeria-tabbed',
  TABBED_LABEL = 'valeria-tabbed-label',
  TABBED_LABEL_SELECTED = 'valeria-tabbed-label-selected',
  TABBED_TAB = 'valeria-tabbed-tab',
  TABBED_TAB_SELECTED = 'valeria-tabbed-tab-selected',

  TEAM_STORAGE = 'valeria-team-storage',
  TEAM_STORAGE_SAVE = 'valeria-team-storage-save',
  TEAM_STORAGE_LOAD_AREA = 'valeria-team-load-area',
  TEAM_STORAGE_LOAD_ACTIVE = 'valeria-team-load-active',
  TEAM_STORAGE_LOAD_INACTIVE = 'valeria-team-load-inactive',

  STAT_TABLE = 'valeria-team-stat-table',
  STAT_LABEL = 'valeria-team-stat-label',
  STAT_VALUE = 'valeria-team-stat-value',

  STAT_TOTAL_VALUE = 'valeria-team-stat-total-value',

  AWAKENING_TABLE = 'valeria-team-awakening-table',
  HP_DIV = 'valeria-hp',
  HP_SLIDER = 'valeria-hp-slider',
  HP_INPUT = 'valeria-hp-input',
  HP_MAX = 'valeria-hp-max',
  HP_PERCENT = 'valeria-hp-percent',

  TEAM_CONTAINER = 'valeria-team-container',
  BADGE = 'valeria-team-badge',
  MONSTER_CONTAINER = 'valeria-monster-container',
  MONSTER_CONTAINER_SELECTED = 'valeria-monster-container-selected',
  TEAM_TITLE = 'valeria-team-title',
  TEAM_DESCRIPTION = 'valeria-team-description',

  MONSTER_SELECTOR = 'valeria-monster-selector',
  PLAYER_MODE_SELECTOR = 'valeria-player-mode-selector',
  SELECTOR_OPTIONS_CONTAINER = 'valeria-monster-selector-options-container',
  SELECTOR_OPTIONS_INACTIVE = 'valeria-monster-selector-options-inactive',
  SELECTOR_OPTIONS_ACTIVE = 'valeria-monster-selector-options-active',
  SELECTOR_OPTION_INACTIVE = 'valeria-monster-selector-option-inactive',
  SELECTOR_OPTION_ACTIVE = 'valeria-monster-selector-option-active',

  MONSTER_EDITOR = 'valeria-monster-editor',
  PDCHU_IO = 'valeria-pdchu-io',
  LEVEL_EDITOR = 'valeria-level-editor',
  LEVEL_INPUT = 'valeria-level-input',
  PLUS_EDITOR = 'valeria-plus-editor',
  AWAKENING = 'valeria-monster-awakening',
  AWAKENING_SUPER = 'valeria-monster-awakening-super',
  AWAKENING_HYPER = 'valeria-monster-awakening-hyper',
  CHANGE_AREA = 'valeria-change-area',
  SWAP_ICON = 'valeria-swap-icon',
  TRANSFORM_ICON = 'valeria-transform-icon',
  DAMAGE_TABLE = 'valeria-team-damage-table',

  ENEMY_PICTURE = 'valeria-enemy-picture-container',
  DUNGEON_EDITOR_FLOORS = 'valeria-dungeon-edit-floors',

  FLOOR_NAME = 'valeria-floor-name',
  FLOOR_CONTAINER = 'valeria-floor-container',
  FLOOR_ADD = 'valeria-floor-add',
  FLOOR_DELETE = 'valeria-floor-delete',
  FLOOR_ENEMIES = 'valeria-floor-enemies',
  FLOOR_ENEMY = 'valeria-floor-enemy',
  FLOOR_ENEMY_ADD = 'valeria-floor-enemy-add',
  FLOOR_ENEMY_DELETE = 'valeria-floor-delete',
  ENEMY_STAT_TABLE = 'valeria-enemy-stat-table',
  ENEMY_SKILL_AREA = 'valeria-enemy-skill-area',

  VALERIA = 'valeria',
}

// enum Ids {
//   COMBO_TABLE_PREFIX = 'valeria-combo-table-',
// }

enum StatIndex {
  HP = 0,
  ATK = 1,
  RCV = 2,
  CD = 3
}

const TEAM_SCALING = 0.6;

function show(el: HTMLElement): void {
  el.style.visibility = 'visible';
}

function hide(el: HTMLElement): void {
  el.style.visibility = 'hidden';
}

function superShow(el: HTMLElement): void {
  el.style.display = '';
  show(el);
}

function superHide(el: HTMLElement): void {
  el.style.display = 'none';
  hide(el);
}

function getAwakeningOffsets(awakeningNumber: number): number[] {
  const result = [-2, -360];
  if (awakeningNumber < 0 || awakeningNumber > 81) {
    console.warn('Invalid awakening, returning unknown.');
    return result;
  }
  result[0] -= (awakeningNumber % 11) * 36;
  result[1] -= Math.floor(awakeningNumber / 11) * 36;
  return result;
}

function updateAwakening(el: HTMLElement, awakening: number, scale: number, unavailableReason = ''): void {
  const [x, y] = getAwakeningOffsets(awakening);
  el.style.backgroundPosition = `${x * scale}px ${y * scale}px`;
  el.style.opacity = `${unavailableReason ? 0.5 : 1}`;
  el.title = unavailableReason;
}

type AssetInfoRecord = { offsetX: number, offsetY: number, width: number, height: number };
enum AssetEnum {
  NUMBER_0 = 0,
  NUMBER_1,
  NUMBER_2,
  NUMBER_3,
  NUMBER_4,
  NUMBER_5,
  NUMBER_6,
  NUMBER_7,
  NUMBER_8,
  NUMBER_9,

  GUARD_BREAK,
  TIME,
  POISON,
  ENRAGE,
  STATUS_SHIELD,
  TIME_BUFF,
  TIME_DEBUFF,
  RESOLVE,
  BURST,
  DEF_OVERLAY,
  FIXED_HP,
  AWOKEN_BIND,
  SKILL_BIND,
  INVINCIBLE,

  SHIELD_BASE,

  PLAYER_HP_LEFT,
  PLAYER_HP_MIDDLE,
  PLAYER_HP_RIGHT,

  ENEMY_HP_LEFT,
  ENEMY_HP_MIDDLE,
  ENEMY_HP_RIGHT,

  // Overlays SHIELD_BASE for attribute resists.
  FIRE_TRANSPARENT,
  WATER_TRANSPARENT,
  WOOD_TRANSPARENT,
  LIGHT_TRANSPARENT,
  DARK_TRANSPARENT,

  COMBO_ABSORB,

  // Overlays [attr]_TRANSPARENT for attribute absorb.
  TWINKLE,
  // Overlays SHIELD_BASE for Damage Void.
  VOID_OVERLAY,
  // Overlays SHIELD_BASES for Damage Absorb.
  ABSORB_OVERLAY,
  // DAMAGE_NULL,

  SWAP,
  TRANSFROM,
  // Overlays absorbs and voids as player buffs..
  VOID,
  COLOR_WHEEL,
}

const ASSET_INFO: Map<AssetEnum, AssetInfoRecord> = new Map([
  [AssetEnum.NUMBER_0, { offsetX: 186, offsetY: 180, width: 19, height: 25 }],
  [AssetEnum.NUMBER_1, { offsetX: 217, offsetY: 180, width: 14, height: 25 }],
  [AssetEnum.NUMBER_2, { offsetX: 247, offsetY: 180, width: 19, height: 25 }],
  [AssetEnum.NUMBER_3, { offsetX: 279, offsetY: 180, width: 18, height: 26 }],
  [AssetEnum.NUMBER_4, { offsetX: 310, offsetY: 180, width: 20, height: 25 }],
  [AssetEnum.NUMBER_5, { offsetX: 343, offsetY: 180, width: 18, height: 25 }],
  [AssetEnum.NUMBER_6, { offsetX: 374, offsetY: 180, width: 19, height: 25 }],
  [AssetEnum.NUMBER_7, { offsetX: 407, offsetY: 180, width: 18, height: 25 }],
  [AssetEnum.NUMBER_8, { offsetX: 438, offsetY: 180, width: 19, height: 25 }],
  [AssetEnum.NUMBER_9, { offsetX: 470, offsetY: 180, width: 20, height: 25 }],
  [AssetEnum.GUARD_BREAK, { offsetY: 1, offsetX: 3, width: 34, height: 30 }],
  [AssetEnum.TIME, { offsetY: 0, offsetX: 2 + 36 * 1, width: 36, height: 36 }],
  [AssetEnum.POISON, { offsetY: 0, offsetX: 2 + 36 * 2, width: 36, height: 36 }],
  [AssetEnum.ENRAGE, { offsetY: 0, offsetX: 116, width: 32, height: 32 }],
  [AssetEnum.STATUS_SHIELD, { offsetY: 1, offsetX: 156, width: 32, height: 29 }],
  [AssetEnum.SKILL_BIND, { offsetY: 40, offsetX: 141, width: 32, height: 32 }],
  [AssetEnum.AWOKEN_BIND, { offsetY: 73, offsetX: 140, width: 32, height: 32 }],
  [AssetEnum.RESOLVE, { offsetY: 144, offsetX: 132, width: 32, height: 32 }],
  [AssetEnum.BURST, { offsetY: 208, offsetX: 132, width: 32, height: 32 }],
  [AssetEnum.SHIELD_BASE, { offsetY: 55, offsetX: 327, width: 34, height: 34 }],
  [AssetEnum.FIRE_TRANSPARENT, { offsetY: 289, offsetX: 0 + 32 * 0, width: 32, height: 32 }],
  [AssetEnum.WATER_TRANSPARENT, { offsetY: 289, offsetX: 0 + 32 * 1, width: 32, height: 32 }],
  [AssetEnum.WOOD_TRANSPARENT, { offsetY: 289, offsetX: 0 + 32 * 2, width: 32, height: 32 }],
  [AssetEnum.LIGHT_TRANSPARENT, { offsetY: 289, offsetX: 0 + 32 * 3, width: 32, height: 32 }],
  [AssetEnum.DARK_TRANSPARENT, { offsetY: 289, offsetX: 0 + 32 * 4, width: 32, height: 32 }],
  [AssetEnum.TWINKLE, { offsetY: 248, offsetX: 85, width: 36, height: 36 }],
  [AssetEnum.VOID_OVERLAY, { offsetY: 49, offsetX: 372, width: 32, height: 32 }],
  [AssetEnum.ABSORB_OVERLAY, { offsetY: 49, offsetX: 452, width: 32, height: 32 }],
  [AssetEnum.FIXED_HP, { offsetY: 256, offsetX: 131, width: 32, height: 32 }],
  [AssetEnum.SWAP, { offsetY: 84, offsetX: 376, width: 23, height: 25 }],
  [AssetEnum.TRANSFROM, { offsetY: 84, offsetX: 485, width: 23, height: 25 }],
  [AssetEnum.VOID, { offsetY: 90, offsetX: 416, width: 19, height: 18 }],
  [AssetEnum.COLOR_WHEEL, { offsetY: 208, offsetX: 131, width: 32, height: 32 }],
  [AssetEnum.INVINCIBLE, { offsetY: 241, offsetX: 314, width: 28, height: 30 }],
  [AssetEnum.COMBO_ABSORB, { offsetY: 113, offsetX: 133, width: 30, height: 30 }],
  // [AssetEnum., {offsetY: , offsetX: , width: , height: }],
]);

const UI_ASSET_SRC: string = `url(${BASE_URL}assets/UIPAT1.PNG)`;

class LayeredAsset {
  assets: AssetEnum[];
  element: HTMLDivElement = create('div', ClassNames.LAYERED_ASSET) as HTMLDivElement;
  private elements: HTMLAnchorElement[];
  active: boolean = true;
  onClick: (active: boolean) => void;

  constructor(assets: AssetEnum[], onClick: (active: boolean) => void, active = true, scale: number = 1) {
    this.assets = assets;

    const maxSizes = {
      width: 0,
      height: 0,
    };

    this.elements = assets
      .filter((asset) => ASSET_INFO.has(asset))
      .map((asset) => {
        const assetInfo = ASSET_INFO.get(asset);
        const el = create('a') as HTMLAnchorElement;
        if (assetInfo) {
          el.style.width = String(assetInfo.width * scale);
          el.style.height = String(assetInfo.height * scale);
          el.style.backgroundSize = `${512 * scale}px ${512 * scale}px`;
          if (assetInfo.width * scale > maxSizes.width) {
            maxSizes.width = assetInfo.width * scale;
          }
          if (assetInfo.height * scale > maxSizes.height) {
            maxSizes.height = assetInfo.height * scale;
          }
          el.style.backgroundImage = UI_ASSET_SRC;
          el.style.backgroundPosition = `${-1 * assetInfo.offsetX * scale} ${-1 * assetInfo.offsetY * scale}`;
        }
        return el;
      });
    // Manually center each of these.
    for (const el of this.elements) {
      const elHeight = Number(el.style.height.replace('px', ''));
      const elWidth = Number(el.style.width.replace('px', ''));
      if (elHeight < maxSizes.height) {
        el.style.marginTop = String((maxSizes.height - elHeight) / 2);
      }
      if (elWidth < maxSizes.width) {
        el.style.marginLeft = String((maxSizes.width - elWidth) / 2);
      }
    }
    for (const el of this.elements) {
      this.element.appendChild(el);
    }
    this.element.style.width = String(maxSizes.width);
    this.element.style.height = String(maxSizes.height);

    this.onClick = onClick;

    this.element.onclick = () => {
      this.onClick(!this.active);
    };

    this.setActive(active)
  }

  getElement(): HTMLDivElement {
    return this.element;
  }

  getAssetPart(idx: number): HTMLAnchorElement {
    return this.elements[idx];
  }

  setActive(active: boolean) {
    this.active = active;
    if (active) {
      for (const element of this.elements) {
        element.classList.remove(ClassNames.HALF_OPACITY);
      }
    } else {
      for (const element of this.elements) {
        element.classList.add(ClassNames.HALF_OPACITY);
      }
    }
  }
}

class MonsterIcon {
  element: HTMLElement = create('a', ClassNames.ICON);
  attributeEl: HTMLElement = create('a', ClassNames.ICON_ATTR);
  subattributeEl: HTMLElement = create('a', ClassNames.ICON_SUB);
  infoTable: HTMLElement = create('table', ClassNames.ICON_INFO);
  hideInfoTable = false;
  swapIcon: LayeredAsset;
  transformIcon: LayeredAsset;
  id = -1;
  private onUpdate: OnMonsterUpdate;

  constructor(hideInfoTable = false) {
    this.hideInfoTable = hideInfoTable;
    if (this.hideInfoTable) {
      hide(this.infoTable);
    }

    const classNames = [
      ClassNames.ICON_PLUS, ClassNames.ICON_AWAKE,
      '', ClassNames.ICON_SUPER,
      ClassNames.ICON_LEVEL, ClassNames.ICON_ID];
    for (let i = 0; i < 3; i++) {
      const row = create('tr');
      for (let j = 0; j < 2; j++) {
        const cell = create('td');
        const className = classNames[i * 2 + j];
        if (className) {
          let el = create('div', className);
          if (className == ClassNames.ICON_SUPER) {
            el = create('a', className);
          }
          if (className == ClassNames.ICON_AWAKE) {
            const numberArea = create('div');
            const maxAwokenImage = create('img') as HTMLImageElement;
            maxAwokenImage.src = 'assets/max_awoken.png';
            superHide(numberArea);
            superHide(maxAwokenImage);
            el.appendChild(numberArea);
            el.appendChild(maxAwokenImage);
          }
          if (this.hideInfoTable && i * 2 + j != 5) {
            superHide(el);
          }
          cell.appendChild(el);
        }
        row.appendChild(cell);
      }
      this.infoTable.appendChild(row);
    }

    this.element.appendChild(this.attributeEl);
    this.attributeEl.appendChild(this.subattributeEl);
    this.element.appendChild(this.infoTable);

    const changeArea = create('div', ClassNames.CHANGE_AREA) as HTMLDivElement;

    this.swapIcon = new LayeredAsset(
      [AssetEnum.SWAP],
      (active: boolean) => { console.log(active); },
      true,
      0.75);
    const swapElement = this.swapIcon.getElement();
    swapElement.classList.add(ClassNames.SWAP_ICON);
    changeArea.appendChild(swapElement);
    // this.element.appendChild(swapElement);
    hide(swapElement);

    this.transformIcon = new LayeredAsset([AssetEnum.TRANSFROM], (active: boolean) => {
      this.onUpdate({
        transformActive: active,
      });
    }, false, 0.75);
    const transformElement = this.transformIcon.getElement();
    transformElement.classList.add(ClassNames.TRANSFORM_ICON);
    // this.element.appendChild(transformElement);
    changeArea.appendChild(transformElement);
    hide(transformElement);
    this.element.appendChild(changeArea);
    if (this.hideInfoTable) {
      superHide(swapElement);
      superHide(transformElement);
    }
    this.onUpdate = () => { };
  }

  getElement(): HTMLElement {
    return this.element;
  }

  setOnUpdate(onUpdate: OnMonsterUpdate) {
    this.onUpdate = onUpdate;
  }

  updateId(id: number) {
    this.update({
      id,
      plusses: 0,
      awakening: 0,
      superAwakeningIdx: -1,
      unavailableReason: '',
      level: 0,
      showSwap: false,
      showTransform: false,
      activeTransform: false,
    });
  }

  update(d: {
    id: number,
    plusses: number,
    awakening: number,
    superAwakeningIdx: number,
    unavailableReason: string,
    level: number,
    showSwap: boolean,
    showTransform: boolean,
    activeTransform: boolean,
  }) {
    this.id = d.id;
    if (d.id == -1) {
      hide(this.element);
      hide(this.attributeEl);
      hide(this.subattributeEl);
      superHide(this.infoTable);
      return;
    }
    show(this.element);
    if (!this.hideInfoTable) {
      superShow(this.infoTable);
    }

    const card = floof.model.cards[d.id] || DEFAULT_CARD;

    const descriptor = CardAssets.getIconImageData(card);
    if (descriptor) {
      this.element.style.backgroundSize = `${TEAM_SCALING * descriptor.baseWidth}px ${descriptor.baseHeight * TEAM_SCALING}px`;
      this.element.style.backgroundImage = `url(${descriptor.url})`;
      this.element.style.backgroundPosition = `-${descriptor.offsetX * TEAM_SCALING}px -${descriptor.offsetY * TEAM_SCALING}`;
    }

    const attrDescriptor = CardUiAssets.getIconFrame(card.attribute, false, floof.model);
    if (attrDescriptor) {
      show(this.attributeEl);
      this.attributeEl.style.backgroundImage = `url(${attrDescriptor.url})`;
      this.attributeEl.style.backgroundPosition = `-${attrDescriptor.offsetX * TEAM_SCALING}px -${attrDescriptor.offsetY * TEAM_SCALING}px`;
    } else {
      hide(this.attributeEl);
    }

    const subDescriptor = CardUiAssets.getIconFrame(card.subattribute, true, floof.model);
    if (subDescriptor) {
      show(this.subattributeEl);
      this.subattributeEl.style.backgroundImage = `url(${subDescriptor.url})`;
      this.subattributeEl.style.backgroundPosition = `-${subDescriptor.offsetX * TEAM_SCALING}px -${subDescriptor.offsetY * TEAM_SCALING}px`;
    } else {
      hide(this.subattributeEl);
    }

    const plusEl = this.element.getElementsByClassName(ClassNames.ICON_PLUS)[0] as HTMLElement;
    if (d.plusses) {
      show(plusEl);
      plusEl.innerText = `+${d.plusses}`;
    } else {
      hide(plusEl);
    }

    const awakeningEl = this.element.getElementsByClassName(ClassNames.ICON_AWAKE)[0] as HTMLElement;
    if (d.awakening != 0) {
      show(awakeningEl);
      const maxAwokenImage = awakeningEl.getElementsByTagName('img')[0] as HTMLImageElement;
      const numberArea = awakeningEl.getElementsByTagName('div')[0] as HTMLDivElement;
      if (d.awakening >= floof.model.cards[d.id].awakenings.length || d.activeTransform) {
        superShow(maxAwokenImage);
        superHide(numberArea);
      } else {
        superHide(maxAwokenImage);
        superShow(numberArea);
        numberArea.innerText = `(${d.awakening})`;
      }
    } else {
      hide(awakeningEl);
    }

    const superAwakeningEl = this.element.getElementsByClassName(ClassNames.ICON_SUPER)[0] as HTMLElement;
    if (d.superAwakeningIdx >= 0) {
      show(superAwakeningEl);
      updateAwakening(superAwakeningEl, card.superAwakenings[d.superAwakeningIdx], 0.5, d.unavailableReason);
    } else {
      hide(superAwakeningEl);
    }

    const levelEl = this.element.getElementsByClassName(ClassNames.ICON_LEVEL)[0] as HTMLElement;
    levelEl.innerText = `Lv${d.level}`;

    const idEl = this.element.getElementsByClassName(ClassNames.ICON_ID)[0] as HTMLElement;
    idEl.innerText = `${d.id}`;

    (d.showSwap ? show : hide)(this.swapIcon.getElement());
    (d.showTransform ? show : hide)(this.transformIcon.getElement());
    this.transformIcon.setActive(d.activeTransform);
  }
}

class MonsterInherit {
  private element: HTMLElement = create('table', ClassNames.INHERIT);
  icon: HTMLElement = create('a', ClassNames.INHERIT_ICON);
  attr: HTMLElement = create('a', ClassNames.INHERIT_ATTR);
  sub: HTMLElement = create('a', ClassNames.INHERIT_SUB);
  idEl: HTMLElement = create('div', ClassNames.INHERIT_ID);
  levelEl: HTMLElement = create('div', ClassNames.INHERIT_LEVEL);
  plusEl: HTMLElement = create('div', ClassNames.INHERIT_PLUS);

  constructor() {
    const row = create('tr');

    const iconCell = create('td');
    this.icon.appendChild(this.attr);
    this.attr.appendChild(this.sub);
    iconCell.appendChild(this.icon);
    row.appendChild(iconCell);

    const detailCell = create('td');
    detailCell.appendChild(this.idEl);
    detailCell.appendChild(create('br'));
    detailCell.appendChild(this.levelEl);
    detailCell.appendChild(create('br'));
    detailCell.appendChild(this.plusEl);
    row.appendChild(detailCell);
    this.element.appendChild(row);
  }

  getElement(): HTMLElement {
    return this.element;
  }

  update(id: number, level: number, plussed: boolean): void {
    if (id == -1) {
      hide(this.element);
      hide(this.icon);
      hide(this.attr);
      hide(this.sub);
      hide(this.idEl);
      hide(this.levelEl);
      hide(this.plusEl);
      return;
    }

    const card = floof.model.cards[id] || DEFAULT_CARD;
    const desInherit = CardAssets.getIconImageData(card);
    if (desInherit) {
      show(this.icon);
      this.icon.style.backgroundImage = `url(${desInherit.url})`;
      this.icon.style.backgroundSize = `${desInherit.baseWidth / 2 * TEAM_SCALING}px ${desInherit.baseHeight / 2 * TEAM_SCALING}px`;
      this.icon.style.backgroundPosition = `-${desInherit.offsetX / 2 * TEAM_SCALING}px -${desInherit.offsetY / 2 * TEAM_SCALING}px`;
    } else {
      hide(this.icon);
    }
    const desAttr = CardUiAssets.getIconFrame(card.attribute, false, floof.model);
    if (desAttr) {
      show(this.attr);
      this.attr.style.backgroundImage = `url(${desAttr.url})`;
      this.attr.style.backgroundPosition = `-${desAttr.offsetX / 2 * TEAM_SCALING}px -${desAttr.offsetY / 2 * TEAM_SCALING}px`;
    } else {
      hide(this.attr);
    }
    const desSub = CardUiAssets.getIconFrame(card.subattribute, true, floof.model);
    if (desSub) {
      show(this.attr);
      this.sub.style.backgroundImage = `url(${desSub.url})`;
      this.sub.style.backgroundPosition = `-${desSub.offsetX / 2 * TEAM_SCALING}px -${desSub.offsetY / 2 * TEAM_SCALING}px`;
    } else {
      hide(this.sub);
    }

    show(this.idEl);
    show(this.levelEl);
    show(this.plusEl);
    this.idEl.innerText = `${id}`;
    this.levelEl.innerText = `Lv${level}`;
    this.plusEl.innerText = plussed ? '+297' : '+0';
  }
}

class MonsterLatent {
  private el: HTMLElement = create('div', ClassNames.MONSTER_LATENTS);
  latentEls: HTMLElement[] = [];

  constructor() {
    for (let i = 0; i < 8; i++) {
      const latentEl = create('a', ClassNames.MONSTER_LATENT);
      this.latentEls.push(latentEl);
      this.el.appendChild(latentEl);
    }
  }

  getElement(): HTMLElement {
    return this.el;
  }

  update(latents: Latent[]): void {
    const scale = TEAM_SCALING * 0.43;
    for (let i = 0; i < 8; i++) {
      if (i >= latents.length) {
        hide(this.latentEls[i]);
        continue;
      }
      show(this.latentEls[i]);
      if (latents[i] < 11) {
        this.latentEls[i].className = ClassNames.MONSTER_LATENT;
      } else if (latents[i] < 33) {
        this.latentEls[i].className = ClassNames.MONSTER_LATENT_SUPER;
      } else {
        this.latentEls[i].className = ClassNames.MONSTER_LATENT_HYPER;
      }
      const { x, y } = getLatentPosition(latents[i]);
      this.latentEls[i].style.backgroundPosition = `-${x * scale}px -${y * scale}px`;
    }
  }
}

class ComboPiece {
  private element = create('div');
  static width = 20;

  static makeOrb(src: string): HTMLImageElement {
    const img = create('img', ClassNames.COMBO_ORB) as HTMLImageElement;
    img.src = src;
    return img;
  }

  constructor(attribute: Attribute, shape = Shape.AMORPHOUS, count = 0, boardWidth = 6) {
    this.element.style.display = 'inline-block';
    this.element.style.margin = '5px';
    const srcName = `assets/orb${attribute}.png`;
    let positions: number[][] = [];
    if (shape == Shape.CROSS) {
      positions = [
        [1],
        [0, 1, 2],
        [1],
      ]
    }
    if (shape == Shape.COLUMN) {
      for (let i = 0; i < count; i++) {
        positions[i] = [0];
      }
    } else if (shape == Shape.L) {
      positions = [
        [0],
        [0],
        [0, 1, 2],
      ]
    } else if (shape == Shape.BOX) {
      positions = [
        [0, 1, 2],
        [0, 1, 2],
        [0, 1, 2],
      ]
    } else {
      let width = shape == Shape.ROW ? boardWidth : boardWidth - 1;
      let remainder = count;
      let vertical = 0;
      while (remainder > 0) {
        let toAdd = width;
        if (toAdd > remainder) {
          toAdd = remainder;
        }
        positions[vertical] = new Array(toAdd);
        for (let i = 0; i < toAdd; i++) {
          positions[vertical][i] = i;
        }

        remainder -= toAdd;
        vertical++;
      }
    }

    const height = Object.keys(positions).length;
    const width = Math.max(...Object.values(positions).map(p => p.length));

    this.element.style.width = `${width * (ComboPiece.width + 2)}px`;
    this.element.style.height = `${height * (ComboPiece.width + 2)}px`;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const orb = ComboPiece.makeOrb(srcName);
        if (!positions[y].includes(x)) {
          orb.style.opacity = '0';
        }
        this.element.appendChild(orb);
      }
    }
  }

  getElement(): HTMLElement {
    return this.element;
  }
}

class ComboEditor {
  public static maxVisibleCombos: number = 16;
  public commandInput: HTMLInputElement = create('input', ClassNames.COMBO_COMMAND) as HTMLInputElement;

  private element: HTMLElement = create('div', ClassNames.COMBO_EDITOR);
  // private colorTables: Record<string, HTMLTableElement> = {};
  public totalCombo = create('div');
  private pieceArea = create('div');

  constructor() {
    this.commandInput.placeholder = 'Combo Commands';
    const guideAnchor = create('a') as HTMLAnchorElement;
    guideAnchor.href = 'https://github.com/mtkwock/Valeria#command-editor-syntax';
    guideAnchor.innerText = 'Combo Command Usage Guide';
    guideAnchor.target = '_blank';
    this.element.appendChild(guideAnchor);
    this.element.appendChild(this.commandInput);
    this.totalCombo.innerText = 'Total Combos: 0';
    this.element.appendChild(this.totalCombo);
    this.element.appendChild(this.pieceArea);
  }

  getElement(): HTMLElement {
    return this.element;
  }

  getInputElements(): Record<string, { shapeCountEl: HTMLInputElement, enhanceEl: HTMLInputElement }[]> {
    const out: Record<string, { shapeCountEl: HTMLInputElement, enhanceEl: HTMLInputElement }[]> = {};
    return out;
  }

  update(data: Record<string, { shapeCount: string, enhance: number }[]>) {
    while (this.pieceArea.firstChild) {
      this.pieceArea.removeChild(this.pieceArea.firstChild);
    }
    for (const c in data) {
      const vals = data[c];
      for (const { shapeCount } of vals) {
        let shape: Shape;
        let count: number;
        if (shapeCount.startsWith('R')) {
          shape = Shape.ROW;
          count = parseInt(shapeCount.slice(1));
        } else if (shapeCount.startsWith('C')) {
          shape = Shape.COLUMN;
          count = parseInt(shapeCount.slice(1));
        } else if (shapeCount.match(/^\d+$/)) {
          shape = Shape.AMORPHOUS;
          count = parseInt(shapeCount);
        } else {
          shape = LetterToShape[shapeCount[0]];
          count = 0;
        }
        const comboPiece = new ComboPiece(COLORS.indexOf(c) as Attribute, shape, count, 6);
        this.pieceArea.appendChild(comboPiece.getElement());
      }
      if (vals.length) {
        this.pieceArea.appendChild(create('br'));
      }
    }
  }
}

class TabbedComponent {
  private tabNames: string[];
  private element: HTMLElement;
  private labels: Record<string, HTMLTableColElement>;
  private tabs: Record<string, HTMLElement>;

  constructor(tabNames: string[], defaultTab: string = '') {
    if (!tabNames.length) {
      throw 'Need at least one tab name.';
    }
    if (!defaultTab || !tabNames.some((name) => name == defaultTab)) {
      defaultTab = tabNames[0];
    }
    this.element = create('div', ClassNames.TABBED);
    this.tabNames = [...tabNames];

    const labelTable = create('table') as HTMLTableElement;
    const labelRow = create('tr') as HTMLTableRowElement;
    labelTable.appendChild(labelRow);
    this.element.appendChild(labelTable);

    this.labels = {};
    this.tabs = {};

    for (const tabName of tabNames) {
      const labelClassName = tabName == defaultTab ? ClassNames.TABBED_LABEL_SELECTED : ClassNames.TABBED_LABEL;
      const label = create('td', labelClassName) as HTMLTableColElement;
      label.innerText = tabName;
      label.onclick = () => this.setActiveTab(tabName);
      labelRow.appendChild(label);
      this.labels[tabName] = label;

      const tabClassName = tabName == defaultTab ? ClassNames.TABBED_TAB_SELECTED : ClassNames.TABBED_TAB;
      const tab = create('div', tabClassName);
      this.element.appendChild(tab);
      this.tabs[tabName] = tab;
    }
  }

  getElement(): HTMLElement {
    return this.element;
  }

  getTabLabel(tabName: string): HTMLElement {
    return this.labels[tabName];
  }

  setActiveTab(activeTabName: string): void {
    for (const tabName of this.tabNames) {
      if (tabName == activeTabName) {
        this.labels[tabName].className = ClassNames.TABBED_LABEL_SELECTED;
        this.tabs[tabName].className = ClassNames.TABBED_TAB_SELECTED;
      } else {
        this.labels[tabName].className = ClassNames.TABBED_LABEL;
        this.tabs[tabName].className = ClassNames.TABBED_TAB;
      }
    }
  }

  getTab(tabName: string): HTMLElement {
    if (!(tabName in this.tabs)) {
      throw 'Invalid tab name: ' + tabName;
    }
    return this.tabs[tabName];
  }
}

// Partial update values.
interface MonsterUpdate {
  playerMode?: number,
  badge?: TeamBadge,

  id?: number,
  level?: number,
  hpPlus?: number,
  atkPlus?: number,
  rcvPlus?: number,
  awakeningLevel?: number,
  superAwakeningIdx?: number,

  inheritId?: number,
  inheritLevel?: number,
  inheritPlussed?: boolean,
  addLatent?: Latent,
  removeLatent?: number,

  transformActive?: boolean,
}

// Partial update values.
interface MonsterUpdateAll {
  mode: number;
  badge: TeamBadge;
  id: number;
  level: number;
  hpPlus: number;
  atkPlus: number;
  rcvPlus: number;
  awakeningLevel: number;
  superAwakeningIdx: number;

  inheritId: number;
  inheritLevel: number;
  inheritPlussed: boolean;
  latents: Latent[];
}

type OnMonsterUpdate = (ctx: MonsterUpdate) => void;

class GenericSelector<T> {
  static MAX_OPTIONS: number = 15;
  protected el: HTMLDivElement = create('div') as HTMLDivElement;
  public selector: HTMLInputElement = create('input', ClassNames.MONSTER_SELECTOR) as HTMLInputElement;
  protected optionsContainer: HTMLElement = create('div', ClassNames.SELECTOR_OPTIONS_INACTIVE);
  protected options: HTMLElement[] = [];
  protected selectedOption: number = 0;
  protected activeOptions: number = 0;
  protected updateCb: (value: number) => void;
  protected searchArray: { s: string, value: T }[];
  private aliases: Record<string, T> = {};

  onKeyDown(): (e: KeyboardEvent) => void {
    return (e: KeyboardEvent) => {
      this.options[this.selectedOption].style.border = '';
      switch (e.keyCode) {
        case 27: // Escape key
          this.selectedOption = 0;
          this.optionsContainer.className = ClassNames.SELECTOR_OPTIONS_INACTIVE;
          return;
        case 13: // Enter
          this.options[this.selectedOption].click();
          return;
        case 38: // Up Arrow
          if (this.selectedOption > 0) {
            this.selectedOption--;
          }
          this.options[this.selectedOption].style.border = '1px solid white';
          // this.options[this.selectedOption].style.border = '1px solid white';
          e.preventDefault();
          return;
        case 40: // Down Arrow
          if (this.selectedOption < this.activeOptions - 1) {
            this.selectedOption++;
          }
          this.options[this.selectedOption].style.border = '1px solid white';
          e.preventDefault();
          return;
      }
      // Left and right arrows.
      if (e.keyCode != 37 && e.keyCode != 39) {
        this.selectedOption = 0;
      }
      this.options[this.selectedOption].style.border = '1px solid white';
    };
  }

  postFilter(matches: T[]): T[] {
    return matches;
  }

  getFuzzyMatches(text: string): T[] {
    return fuzzySearch(text, GenericSelector.MAX_OPTIONS * 3, this.searchArray, this.aliases);
  }

  onKeyUp(): (e: KeyboardEvent) => void {
    return (e: KeyboardEvent) => {
      this.options[this.selectedOption].style.border = '1px solid white';
      if ([27, 13, 38, 40].indexOf(e.keyCode) >= 0) {
        return;
      }
      this.optionsContainer.className = ClassNames.SELECTOR_OPTIONS_ACTIVE;
      const currentText = this.selector.value.trim();
      if (currentText == '') {
        this.options[0].setAttribute('value', '-1');
        this.optionsContainer.style.display = 'none';
        return;
      }
      this.optionsContainer.style.display = '';
      let fuzzyMatches = this.getFuzzyMatches(currentText);
      fuzzyMatches = this.postFilter(fuzzyMatches);
      for (let i = 0; i < this.options.length; i++) {
        if (i >= fuzzyMatches.length) {
          this.options[i].className = ClassNames.SELECTOR_OPTION_INACTIVE;
          continue;
        }
        this.options[i].className = ClassNames.SELECTOR_OPTION_ACTIVE;
        this.options[i].innerText = `${this.getName(Number(fuzzyMatches[i]))}`;
        this.options[i].setAttribute('value', String(fuzzyMatches[i]));
      }
      this.activeOptions = Math.min(fuzzyMatches.length, this.options.length);
    };
  }

  optionOnClick(option: HTMLElement): () => void {
    return () => {
      const id = Number(option.getAttribute('value'));
      this.updateCb(id);
      this.selector.value = this.getName(id);
      this.optionsContainer.className = ClassNames.SELECTOR_OPTIONS_INACTIVE;
    };
  }

  constructor(
    searchArray: { s: string, value: T }[],
    updateCb: (value: number) => void,
    aliases: Record<string, T> = {},
  ) {
    this.searchArray = searchArray;
    this.updateCb = updateCb;
    this.aliases = aliases;

    this.selector.placeholder = 'Search';
    this.selector.onkeydown = this.onKeyDown();
    this.selector.onkeyup = this.onKeyUp();
    this.selector.onfocus = () => { this.selector.select(); }
    this.el.appendChild(this.selector);
    const container = create('div', ClassNames.SELECTOR_OPTIONS_CONTAINER);
    container.appendChild(this.optionsContainer);
    for (let i = 0; i < GenericSelector.MAX_OPTIONS; i++) {
      const option = create('div', ClassNames.SELECTOR_OPTION_INACTIVE);
      option.setAttribute('value', '-1');
      option.onclick = this.optionOnClick(option);
      this.optionsContainer.appendChild(option);
      this.options.push(option);
    }
    this.el.appendChild(container);
  }

  getName(value: number): string {
    for (const entry of this.searchArray) {
      if (Number(entry.value) == value) {
        return entry.s;
      }
    }
    return 'None';
  }

  getElement(): HTMLElement {
    return this.el;
  }
}

class MonsterSelector extends GenericSelector<number> {
  private isInherit: boolean = false;
  protected cardArray: Card[];

  getName(id: number): string {
    if (id == -1) {
      return 'None';
    } else {
      return `${id}: ${floof.model.cards[id].name}`;
    }
  }

  getFuzzyMatches(text: string): number[] {
    const splits = text.split(':');
    return fuzzyMonsterSearch(splits[splits.length - 1].trim(), GenericSelector.MAX_OPTIONS * 3, this.cardArray);
  }

  postFilter(matches: number[]): number[] {
    if (this.isInherit) {
      return matches.filter((match) => floof.model.cards[match].inheritanceType & 1);
    }
    return matches;
  }

  constructor(cards: Card[], updateCb: OnMonsterUpdate, isInherit: boolean = false) {
    super([], (id: number) => {
      if (isInherit) {
        updateCb({ inheritId: id });
      } else {
        updateCb({ id: id });
      }
    });

    this.cardArray = cards;

    this.selector.placeholder = 'Monster Search';
  }

  setId(id: number) {
    this.optionsContainer.style.display = 'none';
    this.selector.value = this.getName(id);
    if (this.selector == document.activeElement) {
      this.selector.select();
      this.options[0].setAttribute('value', String(id));
    }
  }
}

class LevelEditor {
  el: HTMLElement = create('div', ClassNames.LEVEL_EDITOR);
  inheritRow: HTMLTableRowElement = create('tr') as HTMLTableRowElement;
  levelInput: HTMLInputElement = create('input', ClassNames.LEVEL_INPUT) as HTMLInputElement;
  inheritInput: HTMLInputElement = create('input', ClassNames.LEVEL_INPUT) as HTMLInputElement;
  maxLevel: number = 1;
  inheritMaxLevel: number = 1;
  maxLevelEl: Text = document.createTextNode('/ 1');
  inheritMaxLevelEl: Text = document.createTextNode('/ 1');
  onUpdate: OnMonsterUpdate

  static levelLimit(lv: number): number {
    if (lv < 1) {
      return 1;
    }
    if (lv > 110) {
      return 110;
    }
    return lv;
  }

  constructor(onUpdate: OnMonsterUpdate) {
    this.onUpdate = onUpdate;

    const table = create('table');
    table.style.fontSize = 'small';
    const monsterLevelRow = create('tr');

    const levelLabel = create('td');
    levelLabel.innerText = 'Monster';
    monsterLevelRow.appendChild(levelLabel);
    const inheritLabel = create('td');
    inheritLabel.innerText = 'Inherit';
    this.inheritRow.appendChild(inheritLabel);

    const levelCell = create('td');
    levelCell.appendChild(document.createTextNode('Lv'));
    this.levelInput.type = 'number';
    this.levelInput.value = '0';
    this.levelInput.onchange = () => {
      let lv = Number(this.levelInput.value);
      lv = LevelEditor.levelLimit(lv);
      if (lv > this.maxLevel) {
        lv = this.maxLevel;
      }
      this.onUpdate({ level: lv });
    };
    levelCell.appendChild(this.levelInput);
    levelCell.appendChild(this.maxLevelEl);
    monsterLevelRow.appendChild(levelCell);

    const monsterLevel1Cell = create('td') as HTMLTableCellElement;
    const monsterLevel1Button = create('button') as HTMLButtonElement;
    monsterLevel1Button.innerText = 'Lv1';
    monsterLevel1Button.onclick = () => {
      this.onUpdate({ level: 1 });
    };
    monsterLevel1Cell.appendChild(monsterLevel1Button);
    monsterLevelRow.appendChild(monsterLevel1Cell);

    const monsterLevelMaxCell = create('td') as HTMLTableCellElement;
    const monsterLevelMaxButton = create('button') as HTMLButtonElement;
    monsterLevelMaxButton.innerText = 'Lv MAX';
    monsterLevelMaxButton.onclick = () => {
      this.onUpdate({ level: this.maxLevel });
    };
    monsterLevelMaxCell.appendChild(monsterLevelMaxButton);
    monsterLevelRow.appendChild(monsterLevelMaxCell);

    const inheritCell = create('td');
    inheritCell.appendChild(document.createTextNode('Lv'));
    this.inheritInput.type = 'number';
    this.inheritInput.value = '1';
    this.inheritInput.onchange = () => {
      let lv = Number(this.inheritInput.value);
      lv = LevelEditor.levelLimit(lv);
      if (lv > this.inheritMaxLevel) {
        lv = this.inheritMaxLevel;
      }
      this.onUpdate({ inheritLevel: lv });
    };
    inheritCell.appendChild(this.inheritInput);
    inheritCell.appendChild(this.inheritMaxLevelEl);
    this.inheritRow.appendChild(inheritCell);

    const inheritLevel1Cell = create('td') as HTMLTableCellElement;
    const inheritLevel1Button = create('button') as HTMLButtonElement;
    inheritLevel1Button.innerText = 'Lv1';
    inheritLevel1Button.onclick = () => {
      this.onUpdate({ inheritLevel: 1 });
    };
    inheritLevel1Cell.appendChild(inheritLevel1Button);
    this.inheritRow.appendChild(inheritLevel1Cell);

    const inheritLevelMaxCell = create('td') as HTMLTableCellElement;
    const inheritLevelMaxButton = create('button') as HTMLButtonElement;
    inheritLevelMaxButton.innerText = 'Lv MAX';
    inheritLevelMaxButton.onclick = () => {
      this.onUpdate({ inheritLevel: this.inheritMaxLevel });
    };
    inheritLevelMaxCell.appendChild(inheritLevelMaxButton);
    this.inheritRow.appendChild(inheritLevelMaxCell);

    table.appendChild(monsterLevelRow);
    table.appendChild(this.inheritRow);
    this.inheritRow.style.display = 'none';

    this.el.appendChild(table);
  }

  getElement() {
    return this.el;
  }

  update({ level, inheritLevel, maxLevel, inheritMaxLevel }: {
    level: number, maxLevel: number, inheritLevel: number, inheritMaxLevel: number
  }) {
    this.maxLevel = maxLevel;
    this.maxLevelEl.data = `/ ${maxLevel}`;

    if (inheritMaxLevel) {
      this.inheritMaxLevel = inheritMaxLevel;
      this.levelInput.value = String(level);
      this.inheritInput.value = String(inheritLevel);
      this.inheritMaxLevelEl.data = `/ ${inheritMaxLevel}`;
      this.inheritRow.style.display = '';
    } else {
      this.inheritRow.style.display = 'none';
    }
  }
}

class PlusEditor {
  private el: HTMLElement = create('div');
  onUpdate: OnMonsterUpdate;
  private hpEl: HTMLInputElement = create('input', ClassNames.PLUS_EDITOR) as HTMLInputElement;
  private atkEl: HTMLInputElement = create('input', ClassNames.PLUS_EDITOR) as HTMLInputElement;
  private rcvEl: HTMLInputElement = create('input', ClassNames.PLUS_EDITOR) as HTMLInputElement;
  private inheritEl: HTMLInputElement = create('input') as HTMLInputElement;

  constructor(onUpdate: OnMonsterUpdate) {
    this.onUpdate = onUpdate;

    const maxPlusButton = create('button') as HTMLButtonElement;
    // maxPlusButton.id = 'idc-297-plus-monster';
    maxPlusButton.type = 'button';
    maxPlusButton.innerText = '+297';
    maxPlusButton.onclick = () => {
      this.onUpdate({
        hpPlus: 99,
        atkPlus: 99,
        rcvPlus: 99,
      });
      this.hpEl.value = '99';
      this.atkEl.value = '99';
      this.rcvEl.value = '99';
    };

    const minPlusButton = create('button') as HTMLButtonElement;
    // minPlusButton.id = 'idc-0-plus-monster';
    minPlusButton.type = 'button';
    minPlusButton.innerText = '+0';
    minPlusButton.onclick = () => {
      this.onUpdate({
        hpPlus: 0,
        atkPlus: 0,
        rcvPlus: 0,
      });
      this.hpEl.value = '0';
      this.atkEl.value = '0';
      this.rcvEl.value = '0';
    };

    this.hpEl.type = 'number';
    this.hpEl.onchange = () => {
      this.onUpdate({ hpPlus: Number(this.hpEl.value) });
    };

    this.atkEl.type = 'number';
    this.atkEl.onchange = () => {
      this.onUpdate({ atkPlus: Number(this.atkEl.value) });
    };

    this.rcvEl.type = 'number';
    this.rcvEl.onchange = () => {
      this.onUpdate({ rcvPlus: Number(this.rcvEl.value) });
    };

    this.inheritEl.type = 'checkbox';
    this.inheritEl.onclick = () => {
      this.onUpdate({ inheritPlussed: this.inheritEl.checked });
    };
    const inheritLabel = create('span')
    inheritLabel.innerText = 'Inherit Plussed';
    inheritLabel.onclick = () => this.inheritEl.click();

    this.el.appendChild(document.createTextNode('HP+ '));
    this.el.appendChild(this.hpEl);
    this.el.appendChild(document.createTextNode('ATK+ '));
    this.el.appendChild(this.atkEl);
    this.el.appendChild(document.createTextNode('RCV+ '));
    this.el.appendChild(this.rcvEl);
    this.el.appendChild(this.inheritEl);
    this.el.appendChild(inheritLabel);
    this.el.appendChild(create('br'));
    this.el.appendChild(document.createTextNode('Quick Plus: '));
    this.el.appendChild(maxPlusButton);
    this.el.appendChild(minPlusButton);
  }

  update(hpPlus: number, atkPlus: number, rcvPlus: number, inheritPlussed: boolean): void {
    this.hpEl.value = String(hpPlus);
    this.atkEl.value = String(atkPlus);
    this.rcvEl.value = String(rcvPlus);
    this.inheritEl.checked = inheritPlussed;
  }

  getElement(): HTMLElement {
    return this.el;
  }
}

class AwakeningEditor {
  static MAX_AWAKENINGS = 10;
  static SCALE = 0.7;
  private el: HTMLElement = create('div');

  awakeningArea: HTMLDivElement = create('div') as HTMLDivElement;
  inheritAwakeningArea: HTMLDivElement = create('div') as HTMLDivElement;
  superAwakeningArea: HTMLDivElement = create('div') as HTMLDivElement;

  awakeningSelectors: HTMLAnchorElement[] = [];
  superAwakeningSelectors: HTMLAnchorElement[] = [];
  inheritDisplays: HTMLAnchorElement[] = [];
  onUpdate: OnMonsterUpdate;

  constructor(onUpdate: OnMonsterUpdate) {
    this.el.style.fontSize = 'small';
    this.onUpdate = onUpdate;

    this.awakeningArea.appendChild(document.createTextNode('Awakenings'));
    this.awakeningArea.appendChild(create('br'));
    for (let i = 0; i < AwakeningEditor.MAX_AWAKENINGS; i++) {
      const el = create('a', ClassNames.AWAKENING) as HTMLAnchorElement;
      el.onclick = () => {
        this.onUpdate({ awakeningLevel: i });
      };
      if (i > 0) {
        hide(el);
      }
      this.awakeningSelectors.push(el);
      this.awakeningArea.appendChild(el);
    }
    this.el.appendChild(this.awakeningArea);

    for (let i = 0; i < 10; i++) {
      const el = create('a', ClassNames.AWAKENING) as HTMLAnchorElement;
      el.style.cursor = 'default';
      this.inheritDisplays.push(el);
      if (i > 0) {
        hide(el);
      }
      this.inheritAwakeningArea.appendChild(el);
    }
    this.el.appendChild(this.inheritAwakeningArea);

    this.superAwakeningArea.appendChild(document.createTextNode('Super Awakening'));
    this.superAwakeningArea.appendChild(create('br'));
    for (let i = 0; i < AwakeningEditor.MAX_AWAKENINGS; i++) {
      const el = create('a', ClassNames.AWAKENING) as HTMLAnchorElement;
      el.onclick = () => {
        this.onUpdate({ superAwakeningIdx: i - 1 });
      };
      if (i > 0) {
        hide(el);
      }
      this.superAwakeningSelectors.push(el);
      this.superAwakeningArea.appendChild(el);
    }
    this.el.appendChild(this.superAwakeningArea);
  }

  getElement() {
    return this.el;
  }

  // TODO
  update(
    awakenings: Awakening[], // All awakenings of the current monster.
    superAwakenings: Awakening[], // All super awakenings of the current monster.
    inheritAwakenings: Awakening[], // All awakenings of the inherit monster.
    awakeningLevel: number, // Current awakening level [0, awakenings.length]
    superAwakeningIdx: number, // Current Super Awakening selected
    inheritAwakeningLevel = -1) { // UNSUPPORTED RIGHT NOW.
    if (awakeningLevel > awakenings.length) {
      awakeningLevel = awakenings.length;
    }
    if (!awakenings.length) {
      this.awakeningArea.style.display = 'none';
    } else {
      this.awakeningArea.style.display = '';
      for (let i = 1; i < AwakeningEditor.MAX_AWAKENINGS; i++) {
        const el = this.awakeningSelectors[i];
        if (i > awakenings.length) {
          hide(el);
        } else {
          show(el);
          el.style.opacity = i > awakeningLevel ? '0.5' : '1';
          const [x, y] = getAwakeningOffsets(awakenings[i - 1]);
          el.style.backgroundPosition = `${AwakeningEditor.SCALE * x}px ${AwakeningEditor.SCALE * y}px`;
        }
      }
    }


    if (!inheritAwakenings.length || inheritAwakenings[0] != Awakening.AWOKEN_ASSIST) {
      this.inheritAwakeningArea.style.display = 'none';
    } else {
      this.inheritAwakeningArea.style.display = '';
      for (let i = 1; i < AwakeningEditor.MAX_AWAKENINGS; i++) {
        const el = this.inheritDisplays[i];
        if (i > inheritAwakenings.length) {
          hide(el);
        } else {
          show(el);
          el.style.opacity = i <= inheritAwakeningLevel || inheritAwakeningLevel == -1 ? '1' : '0.5';
          const [x, y] = getAwakeningOffsets(inheritAwakenings[i - 1]);
          el.style.backgroundPosition = `${AwakeningEditor.SCALE * x}px ${AwakeningEditor.SCALE * y}px`;
        }
      }
    }

    if (superAwakeningIdx >= superAwakenings.length) {
      superAwakeningIdx = -1;
    }
    if (!awakenings.length) {
      this.superAwakeningArea.style.display = 'none';
    } else {
      this.superAwakeningArea.style.display = '';
      for (let i = 0; i < AwakeningEditor.MAX_AWAKENINGS; i++) {
        const el = this.superAwakeningSelectors[i];
        if (i > superAwakenings.length) {
          hide(el);
        } else {
          show(el);
          el.style.opacity = (i - 1) == superAwakeningIdx ? '1' : '0.5';
          if (i > 0) {
            const [x, y] = getAwakeningOffsets(superAwakenings[i - 1]);
            el.style.backgroundPosition = `${AwakeningEditor.SCALE * x}px ${AwakeningEditor.SCALE * y}px`;
          }
        }
      }
    }
  }
}

function getLatentPosition(latent: number): { x: number; y: number } {
  if (latent < 11) {
    return {
      x: 36 * latent + 2,
      y: 38,
    };
  } else if (latent < 33) {
    const x = latent % 6;
    const y = Math.floor(latent / 6)
    return {
      x: (80 * x + 2),
      y: (36 * y + 2),
    };
  } else {
    const x = latent % 2;
    const y = Math.floor(latent / 2) - 11;
    return {
      x: (238 * x + 2),
      y: (36 * y + 2),
    }
  }
}

class LatentEditor {
  private el: HTMLDivElement = create('div') as HTMLDivElement;
  latentRemovers: HTMLAnchorElement[] = [];
  latentSelectors: HTMLAnchorElement[] = [];
  onUpdate: OnMonsterUpdate;
  currentLatents: Latent[] = [];
  static PER_ROW = 13;

  constructor(onUpdate: OnMonsterUpdate) {
    this.onUpdate = onUpdate;
    this.el.appendChild(document.createTextNode('Latents'));
    this.el.appendChild(create('br'));

    const removerArea = create('div');
    for (let i = 0; i < 8; i++) {
      const remover = create('a', ClassNames.AWAKENING) as HTMLAnchorElement;
      remover.style.backgroundPosition = '0px 0px';
      remover.onclick = () => {
        this.onUpdate({ removeLatent: i });
      }
      this.latentRemovers.push(remover);
      removerArea.appendChild(remover);
    }
    this.el.appendChild(removerArea);

    const selectorArea = create('div');
    let currentWidth = 0;
    for (let i = 0; i < 38; i++) {
      let className, addedWidth;
      if (i < 11) {
        addedWidth = 1;
        className = ClassNames.AWAKENING;
      } else if (i < 33) {
        addedWidth = 2;
        className = ClassNames.AWAKENING_SUPER;
      } else {
        addedWidth = 6;
        className = ClassNames.AWAKENING_HYPER;
      }
      currentWidth += addedWidth;
      if (currentWidth > LatentEditor.PER_ROW) {
        selectorArea.appendChild(create('br'));
        currentWidth = addedWidth;
      }
      const { x, y } = getLatentPosition(i);
      const selector = create('a', className) as HTMLAnchorElement;
      selector.style.backgroundPosition = `-${x * AwakeningEditor.SCALE}px -${y * AwakeningEditor.SCALE}px`;
      selector.onclick = () => this.onUpdate({ addLatent: i });
      this.latentSelectors.push(selector);
      selectorArea.appendChild(selector);
    }
    this.el.appendChild(selectorArea);
  }

  getElement() {
    return this.el;
  }

  update(activeLatents: Latent[], latentKillers: Latent[], maxLatents: number = 6) {
    if (!latentKillers.length) {
      this.el.style.display = 'none';
      return;
    }
    this.el.style.display = '';

    let totalLatents = 0;
    for (let i = 0; i < 8; i++) {
      const remover = this.latentRemovers[i];
      if (totalLatents >= maxLatents) {
        remover.style.display = 'none'
        continue;
      } else if (i >= activeLatents.length) {
        remover.style.display = '';
        remover.style.backgroundPosition = `${-2 * AwakeningEditor.SCALE}px ${-2 * AwakeningEditor.SCALE}px`;
        remover.className = ClassNames.AWAKENING;
        totalLatents++;
        continue;
      }
      remover.style.display = ''
      const latent = activeLatents[i];
      let className;
      if (latent < 11) {
        className = ClassNames.AWAKENING;
        totalLatents += 1;
      } else if (latent < 33) {
        className = ClassNames.AWAKENING_SUPER;
        totalLatents += 2;
      } else {
        className = ClassNames.AWAKENING_HYPER;
        totalLatents += 6;
      }
      // const isSuper = latent >= 11;
      // let offsetWidth, offsetHeight;
      // const x = isSuper ? (latent - 11) % 5 : latent;
      // const y = isSuper ? Math.floor((latent - 11) / 5 + 2) : 1;
      // if (isSuper) {
      //   offsetWidth = x * -80 - 2;
      //   offsetHeight = -36 * y;
      // } else {
      //   offsetWidth = x * -36;
      //   offsetHeight = -36;
      // }
      const { x, y } = getLatentPosition(latent);
      remover.className = className;
      remover.style.backgroundPosition = `-${x * AwakeningEditor.SCALE}px -${y * AwakeningEditor.SCALE}px`;
    }

    // Enable/Disable Generic Killers. (Evo, Awakening, Enhance, Redeemable.)
    for (let i = 12; i < 16; i++) {
      this.latentSelectors[i].style.opacity = latentKillers.length > 0 ? '1.0' : '0.5';
    }

    for (let i = 16; i <= 23; i++) {
      this.latentSelectors[i].style.opacity = latentKillers.some((l) => l == i - 11) ? '1' : '0.5';
    }
  }
}

class MonsterEditor {
  private el: HTMLElement = create('div', ClassNames.MONSTER_EDITOR);
  pdchu: {
    io: HTMLTextAreaElement;
    importButton: HTMLElement;
    exportButton: HTMLElement;
    exportUrlButton: HTMLElement;
  }
  playerModeSelectors: HTMLInputElement[] = [];
  badgeSelector: HTMLSelectElement;
  monsterSelector: MonsterSelector;
  inheritSelector: MonsterSelector;
  types: MonsterTypeEl[] = [];
  levelEditor: LevelEditor;
  plusEditor: PlusEditor;
  awakeningEditor: AwakeningEditor;
  latentEditor: LatentEditor;

  constructor(onUpdate: OnMonsterUpdate) {
    const pdchuArea = create('div');
    this.pdchu = {
      io: create('textarea', ClassNames.PDCHU_IO) as HTMLTextAreaElement,
      importButton: create('button'),
      exportButton: create('button'),
      exportUrlButton: create('button'),
    };
    this.pdchu.io.placeholder = 'pdchu Import + Export';
    this.pdchu.exportButton.innerText = 'Export pdchu';
    this.pdchu.importButton.innerText = 'Import pdchu';
    this.pdchu.exportUrlButton.innerText = 'Get Link';
    pdchuArea.appendChild(this.pdchu.io);
    pdchuArea.appendChild(this.pdchu.importButton);
    pdchuArea.appendChild(this.pdchu.exportButton);
    pdchuArea.appendChild(this.pdchu.exportUrlButton);
    this.el.appendChild(pdchuArea);

    const playerModeArea = create('div', ClassNames.PLAYER_MODE_SELECTOR) as HTMLDivElement;
    const playerModeName = 'valeria-player-mode';
    for (let mode = 1; mode < 4; mode++) {
      const modeId = `valeria-player-mode-${mode}`;
      const playerModeLabel = create('label') as HTMLLabelElement;
      playerModeLabel.innerText = `${mode}P`;
      playerModeLabel.setAttribute('for', modeId);
      const playerModeSelector = create('input') as HTMLInputElement;
      playerModeSelector.id = modeId;
      playerModeSelector.type = 'radio';
      playerModeSelector.value = String(mode);
      playerModeSelector.name = playerModeName;
      playerModeSelector.onchange = () => {
        onUpdate({ playerMode: mode });
      }
      if (mode == 1) {
        playerModeSelector.checked = true;
      }
      this.playerModeSelectors.push(playerModeSelector);
      playerModeArea.appendChild(playerModeSelector);
      playerModeArea.appendChild(playerModeLabel);
    }
    this.badgeSelector = create('select') as HTMLSelectElement;
    for (const badge of TEAM_BADGE_ORDER) {
      const badgeOption = create('option') as HTMLOptionElement;
      badgeOption.value = `${badge}`;
      badgeOption.innerText = TeamBadgeToName[badge];
      this.badgeSelector.appendChild(badgeOption);
    }
    this.badgeSelector.onchange = () => {
      onUpdate({ badge: Number(this.badgeSelector.value) });
    };
    playerModeArea.appendChild(document.createTextNode('Team Badge: '));
    playerModeArea.appendChild(this.badgeSelector);
    this.el.appendChild(playerModeArea);

    this.monsterSelector = new MonsterSelector(prioritizedMonsterSearch, onUpdate);
    this.inheritSelector = new MonsterSelector(prioritizedInheritSearch, onUpdate, true);
    this.inheritSelector.selector.placeholder = 'Inherit Search';

    this.el.appendChild(this.monsterSelector.getElement());
    this.el.appendChild(this.inheritSelector.getElement());

    const monsterTypeDiv = create('div');
    for (let i = 0; i < 3; i++) {
      const monsterType = new MonsterTypeEl(MonsterType.NONE, 0.7);
      superHide(monsterType.getElement());
      this.types.push(monsterType);
      monsterTypeDiv.appendChild(monsterType.getElement());
    }
    this.el.appendChild(monsterTypeDiv);

    this.levelEditor = new LevelEditor(onUpdate);
    this.el.appendChild(this.levelEditor.getElement());

    this.plusEditor = new PlusEditor(onUpdate);
    this.el.appendChild(this.plusEditor.getElement());

    this.awakeningEditor = new AwakeningEditor(onUpdate);
    this.el.appendChild(this.awakeningEditor.getElement());

    this.latentEditor = new LatentEditor(onUpdate);
    this.el.appendChild(this.latentEditor.getElement());
  }

  update(ctx: MonsterUpdateAll) {
    this.playerModeSelectors[ctx.mode - 1].checked = true;
    this.badgeSelector.value = `${ctx.badge}`;
    this.monsterSelector.setId(ctx.id);
    this.inheritSelector.setId(ctx.inheritId);
    const c = floof.model.cards[ctx.id];
    for (let i = 0; i < 3; i++) {
      if (!c || i >= c.types.length) {
        superHide(this.types[i].getElement());
      } else {
        const monsterType = c.types[i];
        superShow(this.types[i].getElement());
        this.types[i].setType(monsterType);
      }
    }
    let maxLevel = 1;
    if (c) {
      maxLevel = c.isLimitBreakable ? 110 : c.maxLevel;
    }
    let inheritMaxLevel = 1;
    if (ctx.inheritId in floof.model.cards) {
      inheritMaxLevel = floof.model.cards[ctx.inheritId].isLimitBreakable
        ? 110
        : floof.model.cards[ctx.inheritId].maxLevel;
    }
    this.levelEditor.update({
      level: ctx.level,
      inheritLevel: ctx.inheritLevel,
      maxLevel: maxLevel,
      inheritMaxLevel: inheritMaxLevel,
    });
    this.plusEditor.update(ctx.hpPlus, ctx.atkPlus, ctx.rcvPlus, ctx.inheritPlussed);

    let awakenings: Awakening[] = [];
    let superAwakenings: Awakening[] = [];
    let inheritAwakenings: Awakening[] = [];
    if (c) {
      awakenings = c.awakenings;
      superAwakenings = c.superAwakenings;
    }
    if (ctx.inheritId in floof.model.cards) {
      inheritAwakenings = floof.model.cards[ctx.inheritId].awakenings;
    }
    this.awakeningEditor.update(
      awakenings,
      superAwakenings,
      inheritAwakenings,
      ctx.awakeningLevel,
      ctx.superAwakeningIdx,
      -1,  // TODO: Consider adding inherit awakening capability.
    );

    let latentKillers: Latent[] = [];
    if (ctx.id in floof.model.cards) {
      latentKillers = c.latentKillers;
    }
    let maxLatents = 6;
    if (!c) {
      maxLatents = 0;
    } else if (c.inheritanceType & 32) {
      maxLatents = 8;
    }
    this.latentEditor.update(
      ctx.latents,
      latentKillers,
      maxLatents,
    );
  }

  getElement(): HTMLElement {
    return this.el;
  }
}

class HpBar {
  private element: HTMLElement = create('div', ClassNames.HP_DIV) as HTMLElement;
  maxHp: number = 1;
  currentHp: number = 1;

  private sliderEl = create('input', ClassNames.HP_SLIDER) as HTMLInputElement;
  private hpInput = create('input', ClassNames.HP_INPUT) as HTMLInputElement;
  private hpMaxEl = create('span', ClassNames.HP_MAX) as HTMLSpanElement;
  private percentEl = create('span', ClassNames.HP_PERCENT) as HTMLSpanElement;
  private onUpdate: (hp: number) => void;

  constructor(onUpdate: (hp: number) => void) {
    this.onUpdate = onUpdate;
    this.sliderEl.type = 'range';
    this.sliderEl.onchange = () => {
      this.onUpdate(Number(this.sliderEl.value));
    }
    this.element.appendChild(this.sliderEl);
    this.hpInput.onchange = () => {
      this.onUpdate(removeCommas(this.hpInput.value));
    }
    this.element.appendChild(this.hpInput);
    const divisionSpan = create('span') as HTMLSpanElement;
    divisionSpan.innerText = ' / ';
    this.element.appendChild(divisionSpan);
    this.element.appendChild(this.hpMaxEl);
    this.element.appendChild(this.percentEl);
    this.percentEl.innerText = '100%';
  }

  setHp(currentHp: number, maxHp: number = -1) {
    if (maxHp > 0) {
      this.maxHp = maxHp;
      this.sliderEl.max = String(maxHp);
    }
    this.hpMaxEl.innerText = addCommas(this.maxHp);
    if (currentHp <= this.maxHp) {
      this.currentHp = currentHp;
    } else {
      this.currentHp = this.maxHp;
    }
    this.hpInput.value = addCommas(this.currentHp);
    this.sliderEl.value = String(this.currentHp);
    this.percentEl.innerText = `${Math.round(100 * this.currentHp / this.maxHp)}%`;
  }

  getElement(): HTMLElement {
    return this.element;
  }
}

class StoredTeamDisplay {
  private element: HTMLElement = create('div', ClassNames.TEAM_STORAGE);
  saveTeamEl: HTMLElement = create('div', ClassNames.TEAM_STORAGE_SAVE);
  private loadTable: HTMLTableElement = create('table', ClassNames.TEAM_STORAGE_LOAD_AREA) as HTMLTableElement;
  private teamRows: HTMLTableRowElement[] = [];
  loadFn: (name: string) => void;
  deleteFn: (name: string) => void;

  constructor(saveFn: () => void, loadFn: (name: string) => void, deleteFn: (name: string) => void) {
    this.saveTeamEl.innerText = 'Save Team';
    this.saveTeamEl.onclick = saveFn;
    this.element.appendChild(this.saveTeamEl);
    this.element.appendChild(this.loadTable);
    this.loadFn = loadFn;
    this.deleteFn = deleteFn;
  }

  getElement() {
    return this.element;
  }

  update(names: string[]): void {
    for (let i = 0; i < Math.max(names.length, this.teamRows.length); i++) {
      if (i >= names.length) {
        this.teamRows[i].className = ClassNames.TEAM_STORAGE_LOAD_INACTIVE;
        continue;
      } else if (i >= this.teamRows.length) {
        const newRow = create('tr', ClassNames.TEAM_STORAGE_LOAD_ACTIVE) as HTMLTableRowElement;
        const newLoad = create('td');
        newLoad.onclick = () => this.loadFn(newLoad.innerText);
        newRow.appendChild(newLoad);
        const newDelete = create('td');
        newDelete.innerText = 'x';
        newDelete.onclick = () => this.deleteFn(newLoad.innerText);
        newRow.appendChild(newDelete);
        this.loadTable.appendChild(newRow);
        this.teamRows.push(newRow);
      }
      this.teamRows[i].className = ClassNames.TEAM_STORAGE_LOAD_ACTIVE;
      const loadCell = this.teamRows[i].firstElementChild as HTMLTableCellElement;
      loadCell.innerText = names[i];
    }
  }
}

// Information needed to populate Stat box.
interface Stats {
  hps: number[];
  atks: number[];
  rcvs: number[];
  cds: string[];
  totalHp: number;
  totalRcv: number;
  totalTime: number;
  counts: Map<Awakening, number>;
  tests: string;
  testResult: string[],
}

interface TeamBattle {
  maxHp: number;
  currentHp: number;
  fixedHp: number;
  leadSwap: number;

  voids: boolean[];
  ids: number[];

  burst: {
    multiplier: number;
    awakenings: Awakening[];
    awakeningScale: number;
    attrRestrictions: Attribute[];
    typeRestrictions: MonsterType[];
  };
  timeBuff: number,
  timeIsMult: boolean,
  rcvBuff: number,
}

interface TeamUpdate {
  teamIdx?: number;
  monsterIdx?: number;
  title?: string;
  description?: string;
  tests?: string;

  currentHp?: number;
  fixedHp?: number;
  action?: number;
  leadSwap?: number;

  timeBuff?: number,
  timeIsMult?: boolean,
  rcvBuff?: number,

  voidDamageAbsorb?: boolean;
  voidAttributeAbsorb?: boolean;
  voidDamageVoid?: boolean;
  voidAwakenings?: boolean;

  burst?: {
    multiplier: number;
    awakenings: Awakening[];
    awakeningScale: number;
    attrRestrictions: Attribute[];
    typeRestrictions: MonsterType[];
  };
}

enum ActionOptions {
  COMBO = -1,
}

class TeamPane {
  element_: HTMLElement = create('div');
  teamDivs: HTMLDivElement[] = [];
  badges: HTMLImageElement[] = [];
  monsterDivs: HTMLElement[] = [];
  titleEl: HTMLInputElement = create('input', ClassNames.TEAM_TITLE) as HTMLInputElement;
  descriptionEl: HTMLTextAreaElement = create('textarea', ClassNames.TEAM_DESCRIPTION) as HTMLTextAreaElement;
  statsEl: HTMLDivElement = create('div') as HTMLDivElement;
  statsByIdxByIdx: HTMLDivElement[][] = [];
  private totalHpValue: HTMLSpanElement = create('span', ClassNames.STAT_TOTAL_VALUE) as HTMLSpanElement;
  private totalRcvValue: HTMLSpanElement = create('span', ClassNames.STAT_TOTAL_VALUE) as HTMLSpanElement;
  private totalTimeValue: HTMLSpanElement = create('span', ClassNames.STAT_TOTAL_VALUE) as HTMLSpanElement;
  battleEl: HTMLDivElement = create('div') as HTMLDivElement;
  private aggregatedAwakeningCounts: Map<Awakening, HTMLSpanElement> = new Map();
  private testResultDiv = create('div');
  private testTextarea = create('textarea', ClassNames.TEAM_DESCRIPTION) as HTMLTextAreaElement;

  metaTabs: TabbedComponent = new TabbedComponent(['Team', 'Save/Load', 'Photo']);
  private detailTabs: TabbedComponent = new TabbedComponent(['Stats', 'Description', 'Battle'], 'Stats');
  private onTeamUpdate: (ctx: TeamUpdate) => void;
  private hpBar: HpBar;
  private fixedHpEl: LayeredAsset = new LayeredAsset([], () => { });
  private fixedHpInput: HTMLInputElement = create('input') as HTMLInputElement;
  private actionSelect: HTMLSelectElement = create('select') as HTMLSelectElement;
  private actionOptions: HTMLOptionElement[] = [];
  public applyActionButton: HTMLButtonElement = create('button') as HTMLButtonElement;

  private leadSwapInput = create('select') as HTMLSelectElement;

  // All elements to set regarding monster burst.
  // Note that the UI only supports 2 awakenings, types, and attributes.
  private burstMultiplierInput = create('input') as HTMLInputElement;
  private burstAwakeningScaleInput = create('input') as HTMLInputElement;
  private burstAwakeningSelect1 = create('select') as HTMLSelectElement;
  private burstAwakeningSelect2 = create('select') as HTMLSelectElement;
  private burstTypeSelect1 = create('select') as HTMLSelectElement;
  private burstTypeSelect2 = create('select') as HTMLSelectElement;
  private burstAttrSelect1 = create('select') as HTMLSelectElement;
  private burstAttrSelect2 = create('select') as HTMLSelectElement;

  private rcvMultInput = create('input') as HTMLInputElement;
  private timeBuffInput = create('input') as HTMLInputElement;
  private timeBuffIsMultCb = create('input') as HTMLInputElement;
  private voidEls: LayeredAsset[] = [];

  // All elements to set regarding damage.
  private pingCells: HTMLTableCellElement[] = [];
  private bonusPing = create('td') as HTMLTableCellElement;
  private pingTotal = create('td') as HTMLTableCellElement;
  private rawPingCells: HTMLTableCellElement[] = [];
  private rawBonusPing = create('td') as HTMLTableCellElement;
  private rawPingTotal = create('td') as HTMLTableCellElement;
  private actualPingCells: HTMLTableCellElement[] = [];
  private actualBonusPing = create('td') as HTMLTableCellElement;
  private actualPingTotal = create('td') as HTMLTableCellElement;
  private actualPingPercent = create('td') as HTMLTableCellElement;

  private hpDamage: HTMLSpanElement = create('span') as HTMLSpanElement;

  constructor(
    storageDisplay: HTMLElement,
    monsterDivs: HTMLElement[],
    onTeamUpdate: (ctx: TeamUpdate) => void,
  ) {
    this.onTeamUpdate = onTeamUpdate;
    const teamTab = this.metaTabs.getTab('Team');

    this.titleEl.placeholder = 'Team Name';
    teamTab.appendChild(this.titleEl);
    this.titleEl.onchange = () => {
      this.onTeamUpdate({ title: this.titleEl.value });
    };

    for (let i = 0; i < 3; i++) {
      this.teamDivs.push(create('div', ClassNames.TEAM_CONTAINER) as HTMLDivElement);
      const badge = create('img', ClassNames.BADGE) as HTMLImageElement;
      badge.src = 'assets/badge/0.png';
      this.badges.push(badge);
      this.teamDivs[i].appendChild(badge);

      for (let j = 0; j < 6; j++) {
        const d = create('div', ClassNames.MONSTER_CONTAINER);
        d.appendChild(monsterDivs[i * 6 + j]);
        d.onclick = () => {
          this.onTeamUpdate({
            teamIdx: i,
            monsterIdx: i * 6 + j,
          });
          this.selectMonster(i * 6 + j);
        };
        this.monsterDivs.push(d);
        this.teamDivs[i].appendChild(d);
      }
      teamTab.appendChild(this.teamDivs[i]);
    }

    const descriptionTab = this.detailTabs.getTab('Description');
    this.descriptionEl.placeholder = 'Team Description (This can displayed in Photo and saved)';
    this.descriptionEl.spellcheck = false;
    this.descriptionEl.onchange = () => {
      this.onTeamUpdate({
        description: this.descriptionEl.value,
      });
    };
    descriptionTab.appendChild(this.descriptionEl);

    const statsTab = this.detailTabs.getTab('Stats');
    this.populateStats();
    statsTab.appendChild(this.statsEl);

    const battleTab = this.detailTabs.getTab('Battle');
    this.hpBar = new HpBar((hp) => {
      this.onTeamUpdate({
        currentHp: hp,
      });
    })
    this.populateBattle();
    battleTab.appendChild(this.battleEl);

    teamTab.appendChild(this.detailTabs.getElement());

    this.metaTabs.getTab('Save/Load').appendChild(storageDisplay);

    this.element_.appendChild(this.metaTabs.getElement());
  }

  selectMonster(position: number): void {
    for (let i = 0; i < this.monsterDivs.length; i++) {
      // TODO: Enable double highlighting of 2P leads.
      if (i != position || this.monsterDivs[i].className == ClassNames.MONSTER_CONTAINER_SELECTED) {
        this.monsterDivs[i].className = ClassNames.MONSTER_CONTAINER;
      } else {
        this.monsterDivs[i].className = ClassNames.MONSTER_CONTAINER_SELECTED;
      }
    }
  }

  goToTab(s: string): void {
    this.metaTabs.setActiveTab(s);
  }

  private createStatRow(labelText: string, statIndex: number): HTMLTableRowElement {
    const row = create('tr') as HTMLTableRowElement;
    for (let i = 0; i < 6; i++) {
      const cell = create('td') as HTMLTableCellElement;

      // Label the first column
      if (i == 0) {
        const label = create('div', ClassNames.STAT_LABEL) as HTMLDivElement;
        label.innerText = labelText + ':';
        cell.appendChild(label);
      }

      const value = create('div', ClassNames.STAT_VALUE) as HTMLDivElement;
      cell.appendChild(value);
      row.appendChild(cell);

      // Save a reference to the value div for easy access
      if (!this.statsByIdxByIdx[i]) {
        this.statsByIdxByIdx[i] = [];
      }
      this.statsByIdxByIdx[i][statIndex] = value;
    }

    return row;
  }

  private populateStats(): void {
    const statsTable = create('table', ClassNames.STAT_TABLE) as HTMLTableElement;
    const hpRow = this.createStatRow('HP', StatIndex.HP);
    const atkRow = this.createStatRow('ATK', StatIndex.ATK);
    const rcvRow = this.createStatRow('RCV', StatIndex.RCV);
    const cdRow = this.createStatRow('CD', StatIndex.CD);
    statsTable.appendChild(hpRow);
    statsTable.appendChild(atkRow);
    statsTable.appendChild(rcvRow);
    statsTable.appendChild(cdRow);
    this.statsEl.appendChild(statsTable);

    const totalBaseStatEl = create('div') as HTMLDivElement;
    const totalHpLabel = create('span') as HTMLSpanElement;
    totalHpLabel.innerText = 'Total HP:';
    const totalRcvLabel = create('span') as HTMLSpanElement;
    totalRcvLabel.innerText = 'Total RCV:';
    const totalTimeLabel = create('span') as HTMLSpanElement;
    totalTimeLabel.innerText = 'Time:';
    totalBaseStatEl.appendChild(totalHpLabel);
    totalBaseStatEl.appendChild(this.totalHpValue);
    totalBaseStatEl.appendChild(totalRcvLabel);
    totalBaseStatEl.appendChild(this.totalRcvValue);
    totalBaseStatEl.appendChild(totalTimeLabel);
    totalBaseStatEl.appendChild(this.totalTimeValue);
    this.statsEl.appendChild(totalBaseStatEl);

    const awakeningsToDisplay = [
      [
        Awakening.SKILL_BOOST,
        Awakening.TIME,
        Awakening.SOLOBOOST,
        Awakening.BONUS_ATTACK,
        Awakening.BONUS_ATTACK_SUPER,
        Awakening.L_GUARD,
      ],
      [
        Awakening.SBR,
        Awakening.RESIST_POISON,
        Awakening.RESIST_BLIND,
        Awakening.RESIST_JAMMER,
        Awakening.RESIST_CLOUD,
        Awakening.RESIST_TAPE,
      ],
      [
        Awakening.OE_FIRE,
        Awakening.OE_WATER,
        Awakening.OE_WOOD,
        Awakening.OE_LIGHT,
        Awakening.OE_DARK,
        Awakening.OE_HEART,
      ],
      [
        Awakening.ROW_FIRE,
        Awakening.ROW_WATER,
        Awakening.ROW_WOOD,
        Awakening.ROW_LIGHT,
        Awakening.ROW_DARK,
        Awakening.RECOVER_BIND,
      ],
      [
        Awakening.RESIST_FIRE,
        Awakening.RESIST_WATER,
        Awakening.RESIST_WOOD,
        Awakening.RESIST_LIGHT,
        Awakening.RESIST_DARK,
        Awakening.AUTOHEAL,
      ],
    ];
    const awakeningTable = create('table', ClassNames.AWAKENING_TABLE) as HTMLTableElement;
    for (const awakeningSet of awakeningsToDisplay) {
      const awakeningRow = create('tr') as HTMLTableRowElement;
      for (const awakening of awakeningSet) {
        const container = create('td') as HTMLTableCellElement;
        const awakeningIcon = create('span', ClassNames.AWAKENING) as HTMLSpanElement;
        const [x, y] = getAwakeningOffsets(awakening);
        awakeningIcon.style.backgroundPosition = `${AwakeningEditor.SCALE * x}px ${AwakeningEditor.SCALE * y}px`;

        container.appendChild(awakeningIcon);
        const aggregatedAwakeningCount = create('span') as HTMLSpanElement;
        aggregatedAwakeningCount.innerText = 'x0';
        this.aggregatedAwakeningCounts.set(awakening, aggregatedAwakeningCount);
        container.appendChild(aggregatedAwakeningCount);
        awakeningRow.appendChild(container);
      }
      awakeningTable.appendChild(awakeningRow);
    }
    this.statsEl.appendChild(awakeningTable);

    const testArea = create('div') as HTMLDivElement;
    const docEl = create('a') as HTMLAnchorElement;
    docEl.href = 'https://github.com/mtkwock/Valeria#team-conformance-tests';
    docEl.target = '_blank';
    docEl.innerText = 'Team Testing Guide';
    testArea.appendChild(docEl);
    testArea.appendChild(this.testResultDiv);
    this.testTextarea.onchange = () => {
      this.onTeamUpdate({
        tests: this.testTextarea.value,
      });
    };
    this.testTextarea.placeholder = 'Write tests here such as "{P1.SB} >= 10"';
    this.testTextarea.spellcheck = false;
    testArea.appendChild(this.testTextarea);
    this.statsEl.appendChild(testArea);
  }

  private populateBattle(): void {
    // HP Element
    const hpEl = this.hpBar.getElement();
    hpEl.appendChild(this.hpDamage);

    this.fixedHpEl = new LayeredAsset([AssetEnum.FIXED_HP], () => {
      this.fixedHpInput.value = '0';
      this.onTeamUpdate({ fixedHp: 0 });
    }, false, 0.7);
    this.fixedHpInput.onchange = () => {
      this.onTeamUpdate({ fixedHp: removeCommas(this.fixedHpInput.value) });
    }

    // Choose combos or active.
    // const actionSelect = create('select') as HTMLSelectElement;
    this.actionSelect.style.fontSize = 'xx-small';
    this.actionSelect.onchange = () => {
      this.onTeamUpdate({ action: Number(this.actionSelect.value) });
    }
    const comboOption = create('option') as HTMLOptionElement;
    comboOption.innerText = 'Apply Combos';
    comboOption.value = String(ActionOptions.COMBO);
    this.actionSelect.appendChild(comboOption);
    for (let i = 0; i < 12; i++) {
      const activeOption = create('option') as HTMLOptionElement;
      activeOption.value = String(i);
      activeOption.innerText = `${Math.floor(i / 2) + 1}:`;
      this.actionSelect.appendChild(activeOption);
      this.actionOptions.push(activeOption);
    }
    this.applyActionButton.innerText = 'Use';

    const leadSwapArea = create('div');

    const leadSwapLabel = create('span') as HTMLDivElement;
    leadSwapLabel.innerText = 'Lead Swap: ';
    for (let i = 0; i < 5; i++) {
      const option = create('option') as HTMLOptionElement;
      option.value = String(i);
      option.innerText = `Sub ${i}`;
      if (i == 0) {
        option.selected = true;
        option.innerText = 'Lead';
      }
      this.leadSwapInput.appendChild(option);
    }
    this.leadSwapInput.onchange = () => {
      let pos = Number(this.leadSwapInput.value);
      if (pos < 0) {
        pos = 0;
      }
      if (pos > 4) {
        pos = 4;
      }
      this.onTeamUpdate({ leadSwap: pos });
    }

    leadSwapArea.appendChild(leadSwapLabel);
    leadSwapArea.appendChild(this.leadSwapInput);

    /**
    Burst [  ]  +[  ]x per    [Awakening1]
                              [Awakening2]
    Restricted  [Attribute1]  [Type1]
                [Attribute2]  [Type2]
     */
    const burstTable = create('table') as HTMLTableElement;
    burstTable.style.fontSize = 'small';
    const updateBurst = () => {
      const awakenings = [this.burstAwakeningSelect1.value, this.burstAwakeningSelect2.value].map(Number).filter(Boolean);
      const attrRestrictions = [this.burstAttrSelect1.value, this.burstAttrSelect2.value].map(Number).filter(n => n >= 0);
      const typeRestrictions = [this.burstTypeSelect1.value, this.burstTypeSelect2.value].map(Number).filter(n => n >= 0);
      this.onTeamUpdate({
        burst: {
          multiplier: Number(this.burstMultiplierInput.value) || 1,
          awakenings,
          awakeningScale: Number(this.burstAwakeningScaleInput.value) || 0,
          attrRestrictions,
          typeRestrictions,
        },
      });
    };
    const multiplierRow = create('tr') as HTMLTableRowElement;
    const baseBurstCell = create('td') as HTMLTableCellElement;
    const burstReset = create('span', 'hover-click');
    burstReset.innerText = 'X';
    burstReset.onclick = () => {
      this.onTeamUpdate({
        burst: {
          multiplier: 1,
          awakenings: [],
          awakeningScale: 0,
          attrRestrictions: [],
          typeRestrictions: [],
        }
      });
    };
    const burstMultiplierLabel = create('span');
    burstMultiplierLabel.innerText = 'Burst ';
    this.burstMultiplierInput.value = '1';
    this.burstMultiplierInput.type = 'number';
    this.burstMultiplierInput.onchange = updateBurst;
    this.burstMultiplierInput.style.width = '45px';
    baseBurstCell.appendChild(burstReset);
    baseBurstCell.appendChild(burstMultiplierLabel);
    baseBurstCell.appendChild(this.burstMultiplierInput);

    // const awakeningScaleArea = create('div');
    const burstScaleCell = create('td') as HTMLTableCellElement;
    burstScaleCell.appendChild(document.createTextNode('+ '));
    this.burstAwakeningScaleInput.onchange = updateBurst;
    this.burstAwakeningScaleInput.style.width = '35px';
    burstScaleCell.appendChild(this.burstAwakeningScaleInput);
    burstScaleCell.appendChild(document.createTextNode('x per '));

    const burstAwakeningCell = create('td') as HTMLTableCellElement;
    for (let i = 0; i < AwakeningToName.length; i++) {
      const option1 = create('option') as HTMLOptionElement;
      const option2 = create('option') as HTMLOptionElement;
      option1.innerText = i == 0 ? 'Awakening1' : AwakeningToName[i];
      option2.innerText = i == 0 ? 'Awakening2' : AwakeningToName[i];
      option1.value = String(i);
      option2.value = String(i);

      this.burstAwakeningSelect1.appendChild(option1);
      this.burstAwakeningSelect2.appendChild(option2);
    }
    this.burstAwakeningSelect1.onchange = updateBurst;
    burstAwakeningCell.appendChild(this.burstAwakeningSelect1);
    this.burstAwakeningSelect2.onchange = updateBurst;
    burstAwakeningCell.appendChild(this.burstAwakeningSelect2);

    multiplierRow.appendChild(baseBurstCell);
    multiplierRow.appendChild(burstScaleCell);
    multiplierRow.appendChild(burstAwakeningCell);

    const restrictionRow = create('tr') as HTMLTableRowElement;
    const restrictionLabelCell = create('td') as HTMLTableCellElement;
    restrictionLabelCell.innerText = 'Restrictions';

    const attrRestrictionCell = create('td') as HTMLTableCellElement;
    for (let i = -1; i < 5; i++) {
      const option1 = create('option') as HTMLOptionElement;
      const option2 = create('option') as HTMLOptionElement;
      option1.innerText = i == -1 ? 'Attr' : AttributeToName.get(i) || '';
      option2.innerText = i == -1 ? 'Attr' : AttributeToName.get(i) || '';
      option1.value = String(i);
      option2.value = String(i);
      this.burstAttrSelect1.appendChild(option1);
      this.burstAttrSelect2.appendChild(option2);
    }
    this.burstAttrSelect1.onchange = updateBurst;
    attrRestrictionCell.appendChild(this.burstAttrSelect1);
    this.burstAttrSelect2.onchange = updateBurst;
    attrRestrictionCell.appendChild(this.burstAttrSelect2);

    const typeRestrictionCell = create('td') as HTMLTableCellElement;
    for (const i of [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 12, 14, 15,]) {
      const option1 = create('option') as HTMLOptionElement;
      const option2 = create('option') as HTMLOptionElement;
      option1.innerText = i == -1 ? 'Type' : TypeToName.get(i) || '';
      option2.innerText = i == -1 ? 'Type' : TypeToName.get(i) || '';
      option1.value = String(i);
      option2.value = String(i);
      this.burstTypeSelect1.appendChild(option1);
      this.burstTypeSelect2.appendChild(option2);
    }
    this.burstTypeSelect1.onchange = updateBurst;
    typeRestrictionCell.appendChild(this.burstTypeSelect1);
    this.burstTypeSelect2.onchange = updateBurst;
    typeRestrictionCell.appendChild(this.burstTypeSelect2);

    restrictionRow.appendChild(restrictionLabelCell);
    restrictionRow.appendChild(attrRestrictionCell);
    restrictionRow.appendChild(typeRestrictionCell);

    burstTable.appendChild(multiplierRow);
    burstTable.appendChild(restrictionRow);

    const rcvTimeArea = create('div');
    const timeBuffLabel = create('span');
    timeBuffLabel.innerText = 'Time Buff: ';
    rcvTimeArea.appendChild(timeBuffLabel);
    this.timeBuffInput.type = 'number';
    this.timeBuffInput.onchange = () => {
      this.onTeamUpdate({ timeBuff: parseInt(this.timeBuffInput.value) });
    };
    rcvTimeArea.appendChild(this.timeBuffInput);
    this.timeBuffIsMultCb.type = 'checkbox';
    this.timeBuffIsMultCb.onchange = () => this.onTeamUpdate({ timeIsMult: this.timeBuffIsMultCb.checked });
    rcvTimeArea.appendChild(this.timeBuffIsMultCb);
    const timeIsMultLabel = create('span');
    timeIsMultLabel.innerText = 'Multiply';
    rcvTimeArea.appendChild(timeIsMultLabel);
    rcvTimeArea.appendChild(create('br'));
    const rcvMultLabel = create('span');
    rcvMultLabel.innerText = 'RCV Mult: ';
    rcvTimeArea.appendChild(rcvMultLabel);
    this.rcvMultInput.type = 'number';
    this.rcvMultInput.onchange = () => this.onTeamUpdate({ rcvBuff: Number(this.rcvMultInput.value) });
    rcvTimeArea.appendChild(this.rcvMultInput);

    // Player State including
    // * Void Attr, Void
    const voidDamageAbsorb = new LayeredAsset(
      [AssetEnum.SHIELD_BASE, AssetEnum.ABSORB_OVERLAY, AssetEnum.VOID],
      (active: boolean) => {
        console.log(`Setting Void Damage Absorb to ${active}`);
        this.onTeamUpdate({ voidDamageAbsorb: active });
      },
      true,
      1
    );
    const voidAttributeAbsorb = new LayeredAsset(
      [AssetEnum.COLOR_WHEEL, AssetEnum.VOID],
      (active: boolean) => {
        console.log(`Setting Void Attribute Absorb to ${active}`);
        this.onTeamUpdate({ voidAttributeAbsorb: active });
      },
      true,
      1
    );
    const voidDamageVoid = new LayeredAsset(
      [AssetEnum.SHIELD_BASE, AssetEnum.VOID_OVERLAY, AssetEnum.VOID],
      (active: boolean) => {
        console.log(`Setting Void Damage Void to ${active}`);
        this.onTeamUpdate({ voidDamageVoid: active });
      },
      true,
      1
    );
    const voidAwakenings = new LayeredAsset(
      [AssetEnum.AWOKEN_BIND],
      (active: boolean) => {
        this.onTeamUpdate({ voidAwakenings: active });
      }
    )
    this.voidEls.push(voidDamageAbsorb);
    this.voidEls.push(voidAttributeAbsorb);
    this.voidEls.push(voidDamageVoid);
    this.voidEls.push(voidAwakenings);

    const elsToManageOpacity = [
      voidDamageAbsorb.getAssetPart(2),
      voidAttributeAbsorb.getAssetPart(1),
      voidDamageVoid.getAssetPart(2),
    ];

    // Make the x blink.
    setInterval(() => {
      const d = new Date();
      const time = d.getSeconds() + d.getMilliseconds() / 1000;
      const opacity = 0.5 * (Math.sin(3.14 * time) + 1);
      for (const idx in elsToManageOpacity) {
        elsToManageOpacity[idx].style.opacity = String(
          this.voidEls[idx].active ? opacity : opacity * 0.5);
      }
    }, 75);
    const toggleArea = create('div') as HTMLDivElement;
    toggleArea.appendChild(voidDamageAbsorb.getElement());
    toggleArea.appendChild(voidAttributeAbsorb.getElement());
    toggleArea.appendChild(voidDamageVoid.getElement());
    toggleArea.appendChild(voidAwakenings.getElement());


    const damageTable = create('table', ClassNames.DAMAGE_TABLE) as HTMLTableElement;
    const rawDamageTable = create('table', ClassNames.DAMAGE_TABLE) as HTMLTableElement;
    const actualDamageTable = create('table', ClassNames.DAMAGE_TABLE) as HTMLTableElement;
    const mainRow = create('tr') as HTMLTableRowElement;
    const subRow = create('tr') as HTMLTableRowElement;
    const rawMainRow = create('tr') as HTMLTableRowElement;
    const rawSubRow = create('tr') as HTMLTableRowElement;
    const actualMainRow = create('tr') as HTMLTableRowElement;
    const actualSubRow = create('tr') as HTMLTableRowElement;

    this.pingCells = Array(12);
    this.rawPingCells = Array(12);
    this.actualPingCells = Array(1);

    for (let i = 0; i < 6; i++) {
      const mainPingCell = create('td') as HTMLTableCellElement;
      const subPingCell = create('td') as HTMLTableCellElement;
      const rawMainPingCell = create('td') as HTMLTableCellElement;
      const rawSubPingCell = create('td') as HTMLTableCellElement;
      const actualMainPingCell = create('td') as HTMLTableCellElement;
      const actualSubPingCell = create('td') as HTMLTableCellElement;

      mainPingCell.innerText = '0';
      subPingCell.innerText = '0';
      rawMainPingCell.innerText = '0';
      rawSubPingCell.innerText = '0';
      actualMainPingCell.innerText = '0';
      actualSubPingCell.innerText = '0';

      mainRow.appendChild(mainPingCell);
      subRow.appendChild(subPingCell);
      rawMainRow.appendChild(rawMainPingCell);
      rawSubRow.appendChild(rawSubPingCell);
      actualMainRow.appendChild(actualMainPingCell);
      actualSubRow.appendChild(actualSubPingCell);
      this.pingCells[i] = mainPingCell;
      this.pingCells[i + 6] = subPingCell;
      this.rawPingCells[i] = rawMainPingCell;
      this.rawPingCells[i + 6] = rawSubPingCell;
      this.actualPingCells[i] = actualMainPingCell;
      this.actualPingCells[i + 6] = actualSubPingCell;
    }

    const bonusRow = create('tr');
    const bonusAttackLabel = create('td');
    bonusAttackLabel.innerText = 'Bonus Attack';
    bonusRow.appendChild(bonusAttackLabel);
    bonusRow.appendChild(this.bonusPing);
    const totalAttackLabel = create('td');
    totalAttackLabel.innerText = 'Total';
    bonusRow.appendChild(totalAttackLabel);
    bonusRow.appendChild(this.pingTotal);

    const rawBonusRow = create('tr');
    const rawBonusAttackLabel = create('td');
    rawBonusAttackLabel.innerText = 'Bonus Attack';
    rawBonusRow.appendChild(rawBonusAttackLabel);
    rawBonusRow.appendChild(this.rawBonusPing);
    const rawTotalAttackLabel = create('td');
    rawTotalAttackLabel.innerText = 'Total';
    rawBonusRow.appendChild(rawTotalAttackLabel);
    rawBonusRow.appendChild(this.rawPingTotal);

    const actualBonusRow = create('tr');
    const actualBonusAttackLabel = create('td');
    actualBonusAttackLabel.innerText = 'Bonus Attack';
    actualBonusRow.appendChild(actualBonusAttackLabel);
    actualBonusRow.appendChild(this.actualBonusPing);
    const actualTotalAttackLabel = create('td');
    actualTotalAttackLabel.innerText = 'Total';
    actualBonusRow.appendChild(actualTotalAttackLabel);
    actualBonusRow.appendChild(this.actualPingTotal);
    const actualPercentLabel = create('td');
    actualPercentLabel.innerText = 'Max Health';
    actualBonusRow.appendChild(actualPercentLabel);
    actualBonusRow.appendChild(this.actualPingPercent);

    damageTable.appendChild(mainRow);
    damageTable.appendChild(subRow);
    damageTable.appendChild(bonusRow);
    rawDamageTable.appendChild(rawMainRow);
    rawDamageTable.appendChild(rawSubRow);
    rawDamageTable.appendChild(rawBonusRow);
    actualDamageTable.appendChild(actualMainRow);
    actualDamageTable.appendChild(actualSubRow);
    actualDamageTable.appendChild(actualBonusRow);

    this.battleEl.appendChild(hpEl);
    this.battleEl.appendChild(this.fixedHpEl.getElement());
    this.battleEl.appendChild(this.fixedHpInput);
    this.battleEl.appendChild(create('br'));
    this.battleEl.appendChild(this.actionSelect);
    this.battleEl.appendChild(this.applyActionButton);
    this.battleEl.appendChild(leadSwapArea);
    this.battleEl.appendChild(burstTable);
    this.battleEl.appendChild(rcvTimeArea);
    this.battleEl.appendChild(toggleArea);

    this.battleEl.appendChild(create('hr'));
    this.battleEl.appendChild(document.createTextNode('Base Damage'));
    this.battleEl.appendChild(damageTable);
    this.battleEl.appendChild(create('hr'));
    this.battleEl.appendChild(document.createTextNode('Damage Dealt'));
    this.battleEl.appendChild(rawDamageTable);
    this.battleEl.appendChild(create('hr'));
    this.battleEl.appendChild(document.createTextNode('Effective Damage Dealt'));
    this.battleEl.appendChild(actualDamageTable);
  }

  // TODO
  update(playerMode: number, title: string, description: string, badges: TeamBadge[]): void {
    for (let i = 1; i < this.teamDivs.length; i++) {
      if (i < playerMode) {
        this.teamDivs[i].style.display = '';
      } else {
        this.teamDivs[i].style.display = 'none';
      }
    }
    this.titleEl.value = title;
    this.descriptionEl.value = description;

    for (let i = 0; i < 3; i++) {
      this.badges[i].src = `assets/badge/${badges[i]}.png`;
      if (playerMode != 2) {
        superShow(this.badges[i]);
      } else {
        superHide(this.badges[i]);
      }
    }
  }

  getElement(): HTMLElement {
    return this.element_;
  }

  updateStats(stats: Stats): void {
    for (let i = 0; i < 6; i++) {
      const statsByIdx = this.statsByIdxByIdx[i];
      statsByIdx[StatIndex.HP].innerText = stats.hps[i] ? String(stats.hps[i]) : '';
      statsByIdx[StatIndex.ATK].innerText = stats.atks[i] ? String(stats.atks[i]) : '';
      statsByIdx[StatIndex.RCV].innerText = stats.hps[i] ? String(stats.rcvs[i]) : '';
      statsByIdx[StatIndex.CD].innerText = stats.cds[i];
    }
    this.totalHpValue.innerText = String(stats.totalHp);
    this.totalRcvValue.innerText = String(stats.totalRcv);
    this.totalTimeValue.innerText = `${stats.totalTime}s`;
    for (const awakening of this.aggregatedAwakeningCounts.keys()) {
      const val = this.aggregatedAwakeningCounts.get(awakening)
      if (val) {
        const count = stats.counts.get(awakening) || 0;
        val.innerText = `x${count}`;
        const awakeningCell = val.parentElement || val;
        if (count == 0) {
          awakeningCell.classList.add(ClassNames.HALF_OPACITY);
        } else {
          awakeningCell.classList.remove(ClassNames.HALF_OPACITY);
        }
      }
    }
    this.testTextarea.value = stats.tests;
    if (stats.testResult.length) {
      this.testResultDiv.innerText = 'Tests Failing:\n' + stats.testResult.join('\n');
      this.testResultDiv.style.backgroundColor = 'red';
    } else {
      this.testResultDiv.innerText = 'All tests passed.';
      this.testResultDiv.style.backgroundColor = 'green';
    }
  }

  updateBattle(teamBattle: TeamBattle): void {
    this.hpBar.setHp(teamBattle.currentHp, teamBattle.maxHp);
    for (let i = 0; i < this.actionOptions.length; i++) {
      const c = floof.model.cards[teamBattle.ids[i]];
      const option = this.actionOptions[i];
      if (!c) {
        option.innerText = '';
        option.disabled = true;
        superHide(option);
      } else {
        let text = `${Math.floor(i / 2) + 1}: ${floof.model.playerSkills[c.activeSkillId].description.replace('\n', ' ')}`;
        option.innerText = text.length >= 80 ? text.substring(0, 77) + '...' : text;
        option.disabled = false;
        superShow(option);
      }
    }
    this.leadSwapInput.value = `${teamBattle.leadSwap}`;

    this.timeBuffInput.value = String(teamBattle.timeBuff);
    this.timeBuffIsMultCb.checked = teamBattle.timeIsMult;
    this.rcvMultInput.value = String(teamBattle.rcvBuff);

    this.burstMultiplierInput.value = String(teamBattle.burst.multiplier).substring(0, 4);
    this.burstAwakeningScaleInput.value = String(teamBattle.burst.awakeningScale);
    this.burstAwakeningSelect1.value = String(teamBattle.burst.awakenings[0] || 0);
    this.burstAwakeningSelect2.value = String(teamBattle.burst.awakenings[1] || 0);
    this.burstAttrSelect1.value = teamBattle.burst.attrRestrictions.length
      ? String(teamBattle.burst.attrRestrictions[0])
      : '-1';
    this.burstAttrSelect2.value = teamBattle.burst.attrRestrictions.length > 1
      ? String(teamBattle.burst.attrRestrictions[1])
      : '-1';

    this.burstTypeSelect1.value = teamBattle.burst.typeRestrictions.length
      ? String(teamBattle.burst.typeRestrictions[0])
      : '-1';
    this.burstTypeSelect2.value = teamBattle.burst.typeRestrictions.length > 1
      ? String(teamBattle.burst.typeRestrictions[1])
      : '-1';

    for (const idx in teamBattle.voids) {
      this.voidEls[idx].setActive(teamBattle.voids[idx]);
    }

    this.fixedHpEl.setActive(teamBattle.fixedHp > 0);
    this.fixedHpInput.value = addCommas(teamBattle.fixedHp);
  }

  updateDamage(
    action: number,
    pings: { attribute: Attribute; damage: number }[],
    rawPings: { attribute: Attribute; damage: number }[],
    actualPings: { attribute: Attribute; damage: number }[],
    enemyHp: number,
    healing: number): void {
    this.actionSelect.value = String(action);
    while (pings.length < 13) {
      pings.push({ attribute: Attribute.NONE, damage: 0 });
      rawPings.push({ attribute: Attribute.NONE, damage: 0 });
      actualPings.push({ attribute: Attribute.NONE, damage: 0 });
    }
    for (let i = 0; i < 12; i++) {
      this.pingCells[i].innerText = addCommas(pings[i].damage);
      this.pingCells[i].style.color = pings[i].damage ? AttributeToFontColor[pings[i].attribute] : FontColor.COLORLESS;

      this.rawPingCells[i].innerText = addCommas(rawPings[i].damage);
      this.rawPingCells[i].style.color = rawPings[i].damage ? AttributeToFontColor[rawPings[i].attribute] : FontColor.COLORLESS;

      this.actualPingCells[i].innerText = addCommas(actualPings[i].damage);
      this.actualPingCells[i].style.color = actualPings[i].damage ? AttributeToFontColor[actualPings[i].attribute] : FontColor.COLORLESS;
    }
    this.pingTotal.innerText = addCommas(pings.reduce((t, p) => t + p.damage, 0));
    this.rawPingTotal.innerText = addCommas(rawPings.reduce((t, p) => t + p.damage, 0));
    const d = actualPings.reduce((t, p) => t + p.damage, 0);
    this.actualPingTotal.innerText = addCommas(actualPings.reduce((t, p) => t + p.damage, 0));
    this.actualPingPercent.innerText = String(d / enemyHp * 100).substring(0, 5) + '%';

    if (pings.length > 12) {
      this.bonusPing.innerText = addCommas(pings[12].damage);
      this.bonusPing.style.color = pings[12].damage ? AttributeToFontColor[pings[12].attribute] : FontColor.COLORLESS;

      this.rawBonusPing.innerText = addCommas(rawPings[12].damage);
      this.rawBonusPing.style.color = rawPings[12].damage ? AttributeToFontColor[rawPings[12].attribute] : FontColor.COLORLESS;

      this.actualBonusPing.innerText = addCommas(actualPings[12].damage);
      this.actualBonusPing.style.color = actualPings[12].damage ? AttributeToFontColor[actualPings[12].attribute] : FontColor.COLORLESS;
    } else {
      this.bonusPing.innerText = '';
      this.rawBonusPing.innerText = '';
      this.actualBonusPing.innerText = '';
    }
    this.hpDamage.innerText = `+${addCommas(healing)}`;
  }
}

interface DungeonUpdate {
  loadDungeon?: number;

  // Dungeon Editor updates
  activeFloor?: number; // Set active floor index.
  addFloor?: boolean;
  removeFloor?: number;

  activeEnemy?: number; // Set active enemy index of active floor.
  activeEnemyId?: number;
  addEnemy?: boolean;
  removeEnemy?: number;

  dungeonHpMultiplier?: string;
  dungeonAtkMultiplier?: string;
  dungeonDefMultiplier?: string;

  enemyLevel?: number;
  hp?: number;
  hpPercent?: number;
  enrage?: number;
  defBreak?: number;

  charges?: number;
  counter?: number;
  flags?: number;

  statusShield?: boolean;
  invincible?: boolean;
  attribute?: Attribute;
  attributeAbsorbs?: Attribute[];
  damageVoid?: number;
  damageAbsorb?: number;
  comboAbsorb?: number;
  damageShield?: number;
}

type OnDungeonUpdate = (ctx: DungeonUpdate) => void;

class ToggleableImage {
  element: HTMLElement;
  active: boolean = true;
  onToggle: (active: boolean) => void;

  constructor(
    el: HTMLElement,
    onToggle: (active: boolean) => void,
    active = true) {
    this.element = el;
    this.onToggle = onToggle;
    this.setActive(active);
    const oldOnClick = el.onclick;
    el.onclick = (ev): void => {
      if (oldOnClick) {
        oldOnClick.apply(el, [ev]);
      }
      this.onToggle(!this.active);
    }
  }

  getElement(): HTMLElement {
    return this.element;
  }

  getActive(): boolean {
    return this.active;
  }

  setActive(active: boolean): void {
    this.active = active;
    if (this.active) {
      this.element.classList.remove(ClassNames.HALF_OPACITY);
    } else {
      this.element.classList.add(ClassNames.HALF_OPACITY);
    }
  }
}

class MonsterTypeEl {
  element: HTMLAnchorElement = create('a', ClassNames.MONSTER_TYPE) as HTMLAnchorElement;
  type: MonsterType = MonsterType.NONE;
  scale: number = 1;

  constructor(monsterType: MonsterType, scale = 1) {
    this.setType(monsterType);
    this.setScale(scale);
  }

  private getTypeOffsets(): { offsetX: number; offsetY: number } {
    return {
      offsetX: this.scale * ((this.type % 13) * 36 + 2),
      offsetY: this.scale * (36 * Math.floor(this.type / 13) + 288),
    };
  }

  setType(type: MonsterType): void {
    this.type = type;
    const { offsetX, offsetY } = this.getTypeOffsets();
    this.element.style.backgroundPosition = `-${offsetX} -${offsetY}`;
  }

  getElement(): HTMLAnchorElement {
    return this.element;
  }

  setScale(scale: number): void {
    this.scale = scale;
    this.element.style.backgroundSize = `${480 * scale}px ${612 * scale}px`;
    this.element.style.width = `${scale * 36}px`;
    this.element.style.height = `${scale * 36}px`;
    this.setType(this.type);
  }
}

// function grandparentEl(el: HTMLElement | undefined): HTMLElement {
//   el = el as HTMLElement;
//   const parent = el.parentElement as HTMLElement;
//   const grandparent = parent.parentElement as HTMLElement;
//   return grandparent;
// }

interface EnemyStatsUpdate {
  lv: number;

  currentHp: number;
  percentHp: number;
  hp: number;

  atk: number;
  enrage: number;
  baseAtk: number;

  def: number;
  ignoreDefensePercent: number;
  baseDef: number;

  resolve: number;
  superResolve: number;
  typeResists: { types: MonsterType[]; percent: number };
  attrResists: { attrs: Attribute[]; percent: number };

  statusShield: boolean;
  invincible: boolean;
  attribute: Attribute;
  comboAbsorb: number;
  damageAbsorb: number;
  damageVoid: number;
  attributeAbsorb: Attribute[];
  damageShield: number;

  counter: number;
  flags: number;
  charges: number;
  maxCharges: number;
}

class EnemySkillArea {
  private static MAX_SKILLS = 75;

  private element: HTMLElement = create('div');
  private skillDescriptors: HTMLElement[] = [];
  private onSkillCb: (id: number) => void;

  constructor(onSkillCb: (id: number) => void) {
    this.onSkillCb = onSkillCb;

    const skillList = create('ol', ClassNames.ENEMY_SKILL_AREA) as HTMLOListElement;

    for (let i = 0; i < EnemySkillArea.MAX_SKILLS; i++) {
      const descriptor = create('li') as HTMLLIElement;
      descriptor.onclick = () => {
        if (descriptor.classList.contains(ClassNames.HALF_OPACITY)) {
          return;
        }
        this.onSkillCb(i);
      };
      superHide(descriptor);
      this.skillDescriptors.push(descriptor);
      skillList.appendChild(descriptor);
    }

    this.element.appendChild(skillList);
  }

  getElement(): HTMLElement {
    return this.element;
  }

  update(skills: { description: string; active: boolean }[]): void {
    for (let i = 0; i < EnemySkillArea.MAX_SKILLS; i++) {
      const descriptor = this.skillDescriptors[i];
      if (!skills[i]) {
        superHide(descriptor);
        continue;
      }
      superShow(descriptor);
      const { description, active } = skills[i];
      descriptor.innerText = description;

      if (active) {
        descriptor.classList.remove(ClassNames.HALF_OPACITY);
        // descriptor.style.cursor = 'pointer';
      } else {
        descriptor.classList.add(ClassNames.HALF_OPACITY);
        // descriptor.style.cursor = '';
      }
    }
  }
}

class DungeonEditor {
  element: HTMLElement = create('div');
  dungeonFloorTable: HTMLTableElement = create('table', ClassNames.DUNGEON_EDITOR_FLOORS) as HTMLTableElement;
  dungeonFloorEls: HTMLTableRowElement[] = [];
  addEnemyBtns: HTMLButtonElement[] = [];
  dungeonEnemies: MonsterIcon[][] = [];
  addFloorBtn: HTMLButtonElement = create('button', ClassNames.FLOOR_ADD) as HTMLButtonElement
  activeFloorIdx = 0;
  activeEnemyIdx = 0;
  dungeonSelector: GenericSelector<number>;

  importer: HTMLTextAreaElement = create('textarea') as HTMLTextAreaElement;
  onUpdate: OnDungeonUpdate;
  monsterSelector: MonsterSelector;
  enemyPicture: MonsterIcon = new MonsterIcon(true);
  enemyTypes: MonsterTypeEl[] = [];
  enemyLevelInput: HTMLInputElement = create('input') as HTMLInputElement;
  dungeonHpInput: HTMLInputElement = create('input') as HTMLInputElement;
  dungeonAtkInput: HTMLInputElement = create('input') as HTMLInputElement;
  dungeonDefInput: HTMLInputElement = create('input') as HTMLInputElement;

  hpInput: HTMLInputElement = create('input') as HTMLInputElement;
  hpPercentInput = create('input') as HTMLInputElement;
  maxHp = create('td') as HTMLTableCellElement;

  // ATK = enrage * base atk.
  atkFinal = create('td') as HTMLTableCellElement;
  rageInput = create('input') as HTMLInputElement;
  atkBase = create('td') as HTMLTableCellElement;

  // DEF = 100 - Break * Base def
  defFinal = create('td') as HTMLTableCellElement;
  defBreakInput: HTMLInputElement = create('input') as HTMLInputElement;
  defBase = create('td') as HTMLTableCellElement;

  // Passive Information.
  resolve = create('span') as HTMLSpanElement;
  superResolve = create('span') as HTMLSpanElement;
  resistTypes: Map<MonsterType, ToggleableImage> = new Map();
  resistTypePercent = create('span') as HTMLSpanElement;
  resistAttrs: Map<Attribute, LayeredAsset> = new Map();
  resistAttrPercent = create('span') as HTMLSpanElement;

  // AI Information
  counterInput = create('input') as HTMLInputElement;
  flagsInput = create('input') as HTMLInputElement;
  chargesInput = create('input') as HTMLInputElement;
  maxCharges = create('span') as HTMLSpanElement;

  // statuses
  statusShield: LayeredAsset;
  invincible: LayeredAsset;
  damageAbsorbInput = create('input') as HTMLInputElement;
  comboAbsorbInput = create('input') as HTMLInputElement;
  damageVoidInput = create('input') as HTMLInputElement;
  damageShieldInput = create('input') as HTMLInputElement;
  attributeAbsorbs: LayeredAsset[] = [];
  currentAttributeSelect = create('select') as HTMLSelectElement;

  constructor(dungeonNames: { s: string; value: number }[], onUpdate: OnDungeonUpdate) {
    this.onUpdate = onUpdate;
    this.dungeonSelector = new GenericSelector<number>(dungeonNames, (id: number) => {
      this.onUpdate({ loadDungeon: id });
    }, DUNGEON_ALIASES);
    const selectorEl = this.dungeonSelector.getElement();
    this.dungeonSelector.selector.placeholder = 'Dungeon Search';
    selectorEl.style.padding = '6px';
    this.element.appendChild(selectorEl);

    const dungeonFloorContainer = create('div', ClassNames.FLOOR_CONTAINER) as HTMLDivElement;
    dungeonFloorContainer.appendChild(this.dungeonFloorTable);
    this.element.appendChild(dungeonFloorContainer);
    // this.element.appendChild(create('br'));
    // TODO: Remove line when dungeon customization is necessary.
    superHide(this.addFloorBtn);

    this.addFloorBtn.innerText = 'Add Floor';
    this.addFloorBtn.onclick = (): void => {
      this.onUpdate({ addFloor: true });
    };
    this.element.appendChild(this.addFloorBtn);

    this.addFloor();

    // this.setupDungeonMultiplierTable();
    this.element.appendChild(create('hr'));

    this.monsterSelector = new MonsterSelector(prioritizedEnemySearch, ({ id }: MonsterUpdate) => {
      if (!id) {
        return;
      }
      this.onUpdate({ activeEnemyId: id });
    });

    this.element.appendChild(this.enemyPicture.getElement());
    for (let i = 0; i < 3; i++) {
      const typeEl = new MonsterTypeEl(MonsterType.UNKNOWN_1, 0.7);
      this.enemyTypes.push(typeEl);
      hide(typeEl.getElement());
      this.element.appendChild(typeEl.getElement());
    }
    this.element.appendChild(this.createPassivesArea());
    this.element.appendChild(this.monsterSelector.getElement());

    this.statusShield = new LayeredAsset(
      [AssetEnum.STATUS_SHIELD],
      (statusShield) => this.onUpdate({ statusShield }),
      false,
      0.7);
    this.invincible = new LayeredAsset(
      [AssetEnum.INVINCIBLE],
      (invincible) => this.onUpdate({ invincible }),
      false,
      0.7);

    this.setupEnemyStatTable();
    this.setupStatusArea();
    this.setupAiArea();
  }

  /**
  private setupDungeonMultiplierTable(): void {
    const multiplierTable = create('table', ClassNames.ENEMY_STAT_TABLE) as HTMLTableElement;
    const row = create('tr') as HTMLTableRowElement;
    // const atkRow = create('tr') as HTMLTableRowElement;
    // const defRow = create('tr') as HTMLTableRowElement;

    const hpLabel = create('td') as HTMLTableCellElement;
    const atkLabel = create('td') as HTMLTableCellElement;
    const defLabel = create('td') as HTMLTableCellElement;

    hpLabel.innerText = 'HP';
    atkLabel.innerText = 'Attack';
    defLabel.innerText = 'Defense';

    row.appendChild(hpLabel);
    row.appendChild(this.dungeonHpInput);
    row.appendChild(atkLabel);
    row.appendChild(this.dungeonAtkInput);
    row.appendChild(defLabel);
    row.appendChild(this.dungeonDefInput);

    this.dungeonHpInput.style.width = `40px`;
    this.dungeonAtkInput.style.width = `40px`;
    this.dungeonDefInput.style.width = `40px`;

    this.dungeonHpInput.onchange = (): void => {
      this.onUpdate({ dungeonHpMultiplier: this.dungeonHpInput.value });
    };
    this.dungeonAtkInput.onchange = (): void => {
      this.onUpdate({ dungeonAtkMultiplier: this.dungeonAtkInput.value });
    };
    this.dungeonDefInput.onchange = (): void => {
      this.onUpdate({ dungeonDefMultiplier: this.dungeonDefInput.value });
    };

    multiplierTable.appendChild(row);

    this.element.appendChild(multiplierTable);
  }
  */

  setDungeonMultipliers(hpMultText: string, atkMultText: string, defMultText: string): void {
    this.dungeonHpInput.value = hpMultText;
    this.dungeonAtkInput.value = atkMultText;
    this.dungeonDefInput.value = defMultText;
  }

  private createPassivesArea(): HTMLElement {
    const passivesEl = create('span') as HTMLSpanElement;

    const resolveAsset = new LayeredAsset([AssetEnum.RESOLVE], () => { }, true, 0.7);
    const resolveSpan = create('span');
    resolveSpan.appendChild(resolveAsset.getElement());
    resolveSpan.appendChild(this.resolve);

    const superResolveSpan = create('span');
    const superResolveLabel = document.createTextNode('Super Resolve:');
    superResolveSpan.appendChild(superResolveLabel);
    superResolveSpan.appendChild(this.superResolve);

    const resistTypeSpan = create('span');
    for (let i = 0; i < 16; i++) {
      if (i == 9 || i == 10 || i == 11 || i == 13) {
        continue;
      }
      const t = (i as unknown) as MonsterType;
      const typeImage = new MonsterTypeEl(t as MonsterType, 0.7);
      const typeToggle = new ToggleableImage(typeImage.getElement(), () => { }, false);
      this.resistTypes.set(t, typeToggle);
      resistTypeSpan.appendChild(typeImage.getElement());
    }
    resistTypeSpan.appendChild(this.resistTypePercent);

    const resistAttrSpan = create('span');
    for (let i = 0; i < 5; i++) {
      const asset = AssetEnum.FIRE_TRANSPARENT + i as AssetEnum;
      const resistAttr = new LayeredAsset([AssetEnum.SHIELD_BASE, asset], () => { }, true, 0.7);
      resistAttrSpan.appendChild(resistAttr.getElement());
      this.resistAttrs.set(i, resistAttr);
    }
    resistAttrSpan.appendChild(this.resistAttrPercent);

    passivesEl.appendChild(document.createTextNode('Passives:'));
    passivesEl.appendChild(resolveSpan);
    passivesEl.appendChild(superResolveSpan);
    passivesEl.appendChild(resistTypeSpan);
    passivesEl.appendChild(resistAttrSpan);
    return passivesEl;
  }

  private setupEnemyStatTable(): void {
    const statTable = create('table', ClassNames.ENEMY_STAT_TABLE) as HTMLTableElement;
    const lvRow = create('tr') as HTMLTableRowElement;
    const hpRow = create('tr') as HTMLTableRowElement;
    const atkRow = create('tr') as HTMLTableRowElement;
    const defRow = create('tr') as HTMLTableRowElement;

    this.enemyLevelInput.type = 'number';
    this.enemyLevelInput.style.width = '50px';
    this.hpInput.style.width = '100px';

    const lvLabel = create('td') as HTMLTableCellElement;
    const hpLabel = create('td') as HTMLTableCellElement;
    const atkLabel = create('td') as HTMLTableCellElement;
    const defLabel = create('td') as HTMLTableCellElement;

    lvLabel.innerText = 'Level';
    hpLabel.innerText = 'HP';
    atkLabel.innerText = 'ATK';
    defLabel.innerText = 'DEF';

    const lvCell = create('td') as HTMLTableCellElement;
    const hpCell = create('td') as HTMLTableCellElement;
    const hpPercentCell = create('td') as HTMLTableCellElement;
    const atkCell = create('td') as HTMLTableCellElement;
    const defCell = create('td') as HTMLTableCellElement;

    this.hpInput.onchange = (): void => this.onUpdate({ hp: removeCommas(this.hpInput.value) });
    this.hpPercentInput.onchange = (): void => this.onUpdate({ hpPercent: removeCommas(this.hpPercentInput.value) });
    this.rageInput.onchange = (): void => this.onUpdate({ enrage: removeCommas(this.rageInput.value) });
    this.defBreakInput.onchange = (): void => this.onUpdate({ defBreak: removeCommas(this.defBreakInput.value) });

    hpPercentCell.style.textAlign = 'right';
    const enrageAsset = new LayeredAsset([AssetEnum.ENRAGE], () => { }, true, 0.7);
    atkCell.appendChild(enrageAsset.getElement());
    const defBreakAsset = new LayeredAsset([AssetEnum.GUARD_BREAK], () => { }, true, 0.7);
    defCell.appendChild(defBreakAsset.getElement());

    lvCell.appendChild(this.enemyLevelInput);
    hpCell.appendChild(this.hpInput);
    hpPercentCell.appendChild(this.hpPercentInput);
    atkCell.appendChild(this.rageInput);
    defCell.appendChild(this.defBreakInput);

    hpPercentCell.appendChild(document.createTextNode('%'));
    atkCell.appendChild(document.createTextNode('X'));
    defCell.appendChild(document.createTextNode('%'));

    this.enemyLevelInput.onchange = (): void => {
      let v = Number(this.enemyLevelInput.value);
      if (isNaN(v)) {
        v = 10;
      }
      v = Math.round(v);
      if (v < 1) {
        v = 1;
      }
      if (v > 100) {
        v = 100;
      }
      this.onUpdate({ enemyLevel: v });
    };

    statTable.appendChild(lvRow);
    statTable.appendChild(hpRow);
    statTable.appendChild(atkRow);
    statTable.appendChild(defRow);

    lvRow.appendChild(lvLabel);
    lvRow.appendChild(lvCell);

    hpRow.appendChild(hpLabel);
    hpRow.appendChild(hpCell);
    const hpEqual = create('td');
    hpEqual.innerText = '=';
    hpRow.appendChild(hpEqual);
    hpRow.appendChild(hpPercentCell);
    hpRow.appendChild(this.maxHp);

    atkRow.appendChild(atkLabel);
    atkRow.appendChild(this.atkFinal);
    const atkEqual = create('td');
    atkEqual.innerText = '=';
    atkRow.appendChild(atkEqual);
    atkRow.appendChild(atkCell); // Enrage
    atkRow.appendChild(this.atkBase);

    defRow.appendChild(defLabel);
    defRow.appendChild(this.defFinal);
    const defEqual = create('td');
    defEqual.innerText = '=';
    defRow.appendChild(defEqual);
    defRow.appendChild(defCell);
    defRow.appendChild(this.defBase);
    this.element.appendChild(statTable);
  }

  private setupStatusArea(): void {
    const statusArea = create('div') as HTMLDivElement;

    this.comboAbsorbInput.type = 'number';
    this.comboAbsorbInput.style.width = '35px';
    this.damageShieldInput.type = 'number';
    this.damageShieldInput.style.width = '35px';
    this.damageVoidInput.style.width = '90px';
    this.damageAbsorbInput.style.width = '90px';
    this.comboAbsorbInput.value = '0';
    this.damageVoidInput.value = '0';
    this.damageAbsorbInput.value = '0';

    const attributeArea = create('span');
    const attributeLabel = create('span');
    attributeLabel.innerText = 'Attribute: ';
    for (const i of [-1, -2, 0, 1, 2, 3, 4]) {
      const option = create('option') as HTMLOptionElement;
      option.value = String(i);
      if (i == -1) {
        option.innerText = 'Main';
      } else if (i == -2) {
        option.innerText = 'Sub';
      } else {
        option.innerText = AttributeToName.get(i) as string;
      }
      this.currentAttributeSelect.appendChild(option);
    }
    this.currentAttributeSelect.onchange = () => {
      const attr = parseInt(this.currentAttributeSelect.value);
      this.onUpdate({ attribute: attr });
    };
    attributeArea.appendChild(attributeLabel);
    attributeArea.appendChild(this.currentAttributeSelect);

    const comboAbsorbArea = create('span');
    const comboAbsorbLabel = new LayeredAsset([AssetEnum.COMBO_ABSORB, AssetEnum.NUMBER_0], () => this.onUpdate({ comboAbsorb: 0 }), true, 0.7);
    comboAbsorbArea.appendChild(comboAbsorbLabel.getElement());
    this.comboAbsorbInput.onchange = () => this.onUpdate({ comboAbsorb: Number(this.comboAbsorbInput.value) });
    comboAbsorbArea.appendChild(this.comboAbsorbInput);

    const damageShieldArea = create('span');
    const damageShieldLabel = new LayeredAsset([AssetEnum.SHIELD_BASE, AssetEnum.NUMBER_0], () => this.onUpdate({ damageShield: 0 }), true, 0.7);
    damageShieldArea.appendChild(damageShieldLabel.getElement());
    this.damageShieldInput.onchange = () => this.onUpdate({ damageShield: Number(this.damageShieldInput.value) });
    damageShieldArea.appendChild(this.damageShieldInput);

    const damageAbsorbArea = create('span');
    const damageAbsorbLabel = new LayeredAsset([AssetEnum.SHIELD_BASE, AssetEnum.ABSORB_OVERLAY], () => this.onUpdate({ damageAbsorb: 0 }), true, 0.7);
    damageAbsorbArea.appendChild(damageAbsorbLabel.getElement());
    this.damageAbsorbInput.onchange = () => this.onUpdate({ damageAbsorb: Number(this.damageAbsorbInput.value) });
    damageAbsorbArea.appendChild(this.damageAbsorbInput);

    const damageVoidArea = create('span');
    const damageVoidLabel = new LayeredAsset([AssetEnum.SHIELD_BASE, AssetEnum.VOID_OVERLAY], () => this.onUpdate({ damageVoid: 0 }), true, 0.7);
    damageVoidArea.appendChild(damageVoidLabel.getElement());
    this.damageVoidInput.onchange = () => this.onUpdate({ damageVoid: Number(this.damageVoidInput.value) });
    damageVoidArea.appendChild(this.damageVoidInput);

    const attributeAbsorbArea = create('div');
    for (let i = 0; i < 5; i++) {
      const absorbAsset = new LayeredAsset([AssetEnum.FIRE_TRANSPARENT + i as AssetEnum, AssetEnum.TWINKLE], () => {
        const attributeAbsorbs: Attribute[] = [];
        for (let j = 0; j < 5; j++) {
          if (this.attributeAbsorbs[j].active !== (i == j)) {
            attributeAbsorbs.push(j);
          }
        }
        this.onUpdate({ attributeAbsorbs });
      }, false, 0.7);
      this.attributeAbsorbs.push(absorbAsset);
      attributeAbsorbArea.appendChild(absorbAsset.getElement());
    }

    statusArea.appendChild(this.statusShield.getElement());
    statusArea.appendChild(this.invincible.getElement());
    statusArea.appendChild(attributeArea);
    statusArea.appendChild(create('br'));
    statusArea.appendChild(comboAbsorbArea);
    statusArea.appendChild(damageShieldArea);
    statusArea.appendChild(damageAbsorbArea);
    statusArea.appendChild(damageVoidArea);
    statusArea.appendChild(attributeAbsorbArea);
    this.element.appendChild(statusArea);
  }

  private setupAiArea(): void {
    const aiEl = create('div') as HTMLDivElement;

    const chargesSpan = create('span') as HTMLSpanElement;
    const chargesLabel = create('span') as HTMLSpanElement;
    chargesLabel.innerText = 'Charges: ';
    chargesSpan.appendChild(chargesLabel);
    this.chargesInput.style.width = '40px';
    this.chargesInput.onchange = (): void => this.onUpdate({ charges: Number(this.chargesInput.value) });
    chargesSpan.appendChild(this.chargesInput);
    chargesSpan.appendChild(this.maxCharges);

    const counterSpan = create('span') as HTMLSpanElement;
    const counterLabel = create('span') as HTMLSpanElement;
    counterLabel.innerText = 'Counter: ';
    counterSpan.appendChild(counterLabel);
    this.counterInput.style.width = '40px';
    this.counterInput.onchange = (): void => this.onUpdate({ counter: Number(this.counterInput.value) });
    counterSpan.appendChild(this.counterInput);

    const flagsSpan = create('span') as HTMLSpanElement;
    const flagsLabel = create('span') as HTMLSpanElement;
    flagsLabel.innerText = 'Flags: ';
    flagsSpan.appendChild(flagsLabel);
    this.flagsInput.style.width = '80px';
    this.flagsInput.onchange = (): void => this.onUpdate({ flags: parseInt(this.flagsInput.value, 2) });
    flagsSpan.appendChild(this.flagsInput);

    aiEl.appendChild(chargesSpan);
    aiEl.appendChild(counterSpan);
    aiEl.appendChild(flagsSpan);

    this.element.appendChild(aiEl);
  }

  private addFloor(): void {
    const floorIdx = this.dungeonFloorEls.length;
    const floor = create('tr') as HTMLTableRowElement;
    const label = create('td') as HTMLTableCellElement;
    const floorMonsters = create('td') as HTMLTableCellElement;
    const floorName = create('div') as HTMLDivElement;
    floorName.innerText = `F${this.dungeonFloorEls.length + 1}`;
    label.appendChild(floorName);
    const deleteFloorBtn = create('button', ClassNames.FLOOR_DELETE) as HTMLButtonElement;
    // TODO: Remove line when dungeon customization is necessary.
    superHide(deleteFloorBtn);
    deleteFloorBtn.innerText = '[-]';
    deleteFloorBtn.onclick = (): void => {
      this.onUpdate({ removeFloor: floorIdx });
    };
    floor.appendChild(label);
    label.appendChild(deleteFloorBtn);

    const addEnemyBtn = create('button', ClassNames.FLOOR_ENEMY_ADD) as HTMLButtonElement;
    // TODO: Remove line when dungeon customization is necessary.
    superHide(addEnemyBtn);
    addEnemyBtn.innerText = '+';
    addEnemyBtn.onclick = (): void => {
      this.onUpdate({ activeFloor: floorIdx, addEnemy: true });
    }
    this.addEnemyBtns.push(addEnemyBtn);
    floorMonsters.appendChild(addEnemyBtn);
    this.addEnemy(this.dungeonFloorEls.length);
    floor.appendChild(floorMonsters);
    this.dungeonFloorTable.appendChild(floor);
    this.dungeonFloorEls.push(floor);
  }

  private addEnemy(floorIdx: number): void {
    const enemy = new MonsterIcon(true);
    enemy.updateId(4014);
    if (floorIdx >= this.dungeonEnemies.length) {
      this.dungeonEnemies.push([]);
    }
    this.dungeonEnemies[floorIdx].push(enemy);
    const enemyIdx = this.dungeonEnemies[floorIdx].length - 1;
    enemy.getElement().onclick = (): void => {
      this.onUpdate({ activeFloor: floorIdx, activeEnemy: enemyIdx });
    }
    const node = this.addEnemyBtns[floorIdx].parentNode;
    if (node) {
      node.insertBefore(enemy.getElement(), this.addEnemyBtns[floorIdx]);
    }
  }

  setActiveEnemy(floor: number, monster: number): void {
    for (let i = 0; i < this.dungeonEnemies.length; i++) {
      for (let j = 0; j < this.dungeonEnemies[i].length; j++) {
        const el = this.dungeonEnemies[i][j].getElement();
        if (i == floor && j == monster) {
          el.className = ClassNames.ICON_SELECTED;
          // el.scrollIntoView({ block: 'nearest' });
          const id = this.dungeonEnemies[i][j].id;
          this.enemyPicture.updateId(id);
          const card = floof.model.cards[id];
          for (let i = 0; i < this.enemyTypes.length; i++) {
            if (card && card.types && i < card.types.length) {
              show(this.enemyTypes[i].getElement())
              this.enemyTypes[i].setType(card.types[i] as MonsterType);
            } else {
              hide(this.enemyTypes[i].getElement())
            }
          }
          this.monsterSelector.setId(id);
        } else {
          el.className = ClassNames.ICON;
        }
      }
    }
  }

  setEnemies(enemyIdsByFloor: number[][]): void {
    while (this.dungeonFloorEls.length < enemyIdsByFloor.length) {
      this.addFloor();
    }
    for (let i = 0; i < Math.max(enemyIdsByFloor.length, this.dungeonFloorEls.length); i++) {
      if (i >= enemyIdsByFloor.length) {
        superHide(this.dungeonFloorEls[i]);
        continue;
      }
      superShow(this.dungeonFloorEls[i]);
      const enemyIds = enemyIdsByFloor[i];
      const floorEnemies = this.dungeonEnemies[i];
      while (floorEnemies.length < enemyIds.length) {
        this.addEnemy(i);
      }
      for (let j = 0; j < Math.max(enemyIds.length, floorEnemies.length); j++) {
        if (j >= enemyIds.length) {
          superHide(floorEnemies[j].getElement());
          continue;
        }
        superShow(floorEnemies[j].getElement());
        floorEnemies[j].updateId(enemyIds[j]);
      }
    }
  }

  setEnemyStats(s: EnemyStatsUpdate): void {
    this.enemyLevelInput.value = String(s.lv);

    this.hpInput.value = addCommas(s.currentHp);
    this.hpPercentInput.value = String(s.percentHp);
    this.maxHp.innerText = `${addCommas(s.hp)}`;

    this.atkBase.innerText = `${addCommas(s.baseAtk)}`;
    this.rageInput.value = addCommas(s.enrage);
    this.atkFinal.innerText = `${addCommas(s.atk)}`;

    this.defFinal.innerText = addCommas(s.def);
    this.defBreakInput.value = addCommas(s.ignoreDefensePercent);
    this.defBase.innerText = addCommas(s.baseDef);

    if (s.resolve <= 0) {
      superHide(this.resolve.parentElement as HTMLElement);
    } else {
      superShow(this.resolve.parentElement as HTMLElement);
      this.resolve.innerText = `${s.resolve}%`;
    }
    if (s.superResolve <= 0) {
      superHide(this.superResolve.parentElement as HTMLElement);
    } else {
      superShow(this.superResolve.parentElement as HTMLElement);
      this.superResolve.innerText = `${s.superResolve}%`;
    }
    if (s.typeResists.types.length) {
      // superShow(grandparentEl((this.resistTypes.get(0) as ToggleableImage).getElement()))
      superShow(this.resistTypePercent.parentElement as HTMLElement);
      for (const [key, toggle] of [...this.resistTypes.entries()]) {
        if (s.typeResists.types.includes(key)) {
          superShow(toggle.getElement());
        } else {
          superHide(toggle.getElement());
        }
        toggle.setActive(s.typeResists.types.includes(key));
      }
      this.resistTypePercent.innerText = `${s.typeResists.percent}%`;
    } else {
      // superHide(grandparentEl((this.resistTypes.get(0) as ToggleableImage).getElement()))
      superHide(this.resistTypePercent.parentElement as HTMLElement);
    }
    if (s.attrResists.attrs.length) {
      // superShow(grandparentEl((this.resistAttrs.get(0) as LayeredAsset).getElement()));
      superShow(this.resistAttrPercent.parentElement as HTMLElement);
      for (const [key, asset] of [...this.resistAttrs.entries()]) {
        if (s.attrResists.attrs.includes(key)) {
          superShow(asset.getElement());
        } else {
          superHide(asset.getElement());
        }
        asset.setActive(s.attrResists.attrs.includes(key));
      }
      this.resistAttrPercent.innerText = `${s.attrResists.percent}%`;
    } else {
      // superHide(grandparentEl((this.resistAttrs.get(0) as LayeredAsset).getElement()));
      superHide(this.resistAttrPercent.parentElement as HTMLElement);
    }

    this.statusShield.setActive(s.statusShield);
    this.invincible.setActive(s.invincible);
    this.currentAttributeSelect.value = String(s.attribute);
    this.damageVoidInput.value = addCommas(s.damageVoid);
    this.damageAbsorbInput.value = addCommas(s.damageAbsorb);
    this.comboAbsorbInput.value = `${s.comboAbsorb}`;
    this.damageShieldInput.value = `${s.damageShield}`;
    for (let i = 0; i < this.attributeAbsorbs.length; i++) {
      this.attributeAbsorbs[i].setActive(s.attributeAbsorb.includes(i));
    }

    this.maxCharges.innerText = ` / ${s.maxCharges} `;
    this.chargesInput.value = String(s.charges);
    this.counterInput.value = String(s.counter);
    this.flagsInput.value = s.flags.toString(2).padStart(8, '0');
  }

  getElement(): HTMLElement {
    return this.element;
  }
}

class BattleDisplay {
  enemyPicture: HTMLElement = create('img') as HTMLImageElement;
  enemySelectors: MonsterIcon[][] = [];
  onUpdate: OnDungeonUpdate;

  constructor(onUpdate: OnDungeonUpdate) {
    this.onUpdate = onUpdate;
  }
}

class DungeonPane {
  dungeonEditor: DungeonEditor;
  battleDisplay: BattleDisplay;
  tabs: TabbedComponent = new TabbedComponent(['Dungeon']);
  onUpdate: OnDungeonUpdate;

  constructor(dungeonNames: { s: string; value: number }[], onUpdate: OnDungeonUpdate) {
    this.onUpdate = onUpdate;

    this.dungeonEditor = new DungeonEditor(dungeonNames, onUpdate);
    this.battleDisplay = new BattleDisplay(onUpdate);

    this.tabs.getTab('Dungeon').appendChild(this.dungeonEditor.getElement());
  }

  getElement(): HTMLElement {
    return this.tabs.getElement();
  }
}

interface FancyPhotoOptions {
  drawTitle?: boolean;
  drawBadge?: boolean;
  useTransform?: boolean;
  useLeadswap?: boolean;
  showCooldowns?: boolean;
  awakenings: number[];
  showTeamStats?: boolean;
  showDescription?: boolean;
  transparentBackground?: boolean;
}

class PhotoArea {
  private element = create('div');
  private canvas: HTMLCanvasElement = create('canvas') as HTMLCanvasElement;
  private options: FancyPhotoOptions;
  private awakeningAnchors: HTMLAnchorElement[] = [];
  private onUpdate: () => void;

  constructor(opts: FancyPhotoOptions, onUpdate: () => void) {
    this.options = opts;
    this.canvas.style.width = '100%';
    this.onUpdate = onUpdate;
    this.createToggle('Display Title', (checked) => this.options.drawTitle = checked, this.options.drawTitle || false);
    this.createToggle('Display Badges (1P and 3P)', (checked) => this.options.drawBadge = checked, this.options.drawBadge || false);
    this.createToggle('Display Cooldowns', (checked) => this.options.showCooldowns = checked, this.options.showCooldowns || false);
    this.createToggle('Display Transformed', (checked) => this.options.useTransform = checked, this.options.useTransform || false);
    this.createToggle('Display Description', (checked) => this.options.showDescription = checked, this.options.showDescription || false);
    this.createToggle('Transparent Background', (checked) => this.options.transparentBackground = checked, this.options.transparentBackground || false);

    this.setupAwakeningToggles();
    this.element.appendChild(this.canvas);
  }

  private createToggle(label: string, onChange: (checked: boolean) => void, initialCheck: boolean) {
    const div = create('div');
    const toggle = create('input') as HTMLInputElement;
    toggle.type = 'checkbox';
    toggle.checked = initialCheck;
    toggle.onchange = () => {
      onChange(toggle.checked);
      this.onUpdate();
    }
    div.appendChild(toggle);
    div.appendChild(document.createTextNode(label));
    this.element.appendChild(div);
  }

  private setupAwakeningToggles(): void {
    const awakeningDiv = create('div');
    const awakeningRows: Awakening[][] = [
      [
        Awakening.SKILL_BOOST, Awakening.SBR, Awakening.TIME, Awakening.GUARD_BREAK, Awakening.SOLOBOOST, Awakening.OE_HEART,
        Awakening.OE_FIRE, Awakening.OE_WATER, Awakening.OE_WOOD, Awakening.OE_LIGHT, Awakening.OE_DARK,
      ],
      [
        Awakening.RESIST_BLIND, Awakening.RESIST_JAMMER, Awakening.RESIST_POISON, Awakening.BONUS_ATTACK, Awakening.BONUS_ATTACK_SUPER, Awakening.RECOVER_BIND,
        Awakening.ROW_FIRE, Awakening.ROW_WATER, Awakening.ROW_WOOD, Awakening.ROW_LIGHT, Awakening.ROW_DARK,
      ],
      [
        Awakening.RESIST_CLOUD, Awakening.RESIST_TAPE, Awakening.AUTOHEAL, Awakening.L_UNLOCK, Awakening.L_GUARD, Awakening.COMBO_ORB,
        Awakening.RESIST_FIRE, Awakening.RESIST_WATER, Awakening.RESIST_WOOD, Awakening.RESIST_LIGHT, Awakening.RESIST_DARK,
      ],
      [
        Awakening.DRAGON, Awakening.GOD, Awakening.DEVIL, Awakening.MACHINE, Awakening.VDP, Awakening.COMBO_7,
        Awakening.COMBO_10, Awakening.SKILL_CHARGE, Awakening.MULTIBOOST, Awakening.HP, Awakening.HP_MINUS,
      ],
      [
        Awakening.BALANCED, Awakening.ATTACKER, Awakening.PHYSICAL, Awakening.HEALER, Awakening.TPA, Awakening.HP_GREATER,
        Awakening.HP_LESSER, Awakening.RESIST_BIND, Awakening.TEAM_HP, Awakening.ATK, Awakening.ATK_MINUS,
      ],
      [
        Awakening.EVO, Awakening.AWOKEN, Awakening.ENHANCED, Awakening.REDEEMABLE, Awakening.JAMMER_BOOST, Awakening.POISON_BOOST,
        Awakening.AWOKEN_ASSIST, Awakening.VOICE, Awakening.TEAM_RCV, Awakening.RCV, Awakening.RCV_MINUS,
      ],
    ];
    for (const awakeningRow of awakeningRows) {
      for (const awakening of awakeningRow) {
        const awakeningAnchor = create('a', ClassNames.AWAKENING) as HTMLAnchorElement;
        const [x, y] = getAwakeningOffsets(awakening);
        awakeningAnchor.style.backgroundPositionX = `${x * AwakeningEditor.SCALE}px`;
        awakeningAnchor.style.backgroundPositionY = `${y * AwakeningEditor.SCALE}px`;

        if (!this.options.awakenings || !this.options.awakenings.includes(awakening)) {
          awakeningAnchor.classList.add(ClassNames.HALF_OPACITY);
        }

        awakeningAnchor.onclick = () => {
          if (awakeningAnchor.classList.contains(ClassNames.HALF_OPACITY)) {
            this.options.awakenings.push(awakening);
            awakeningAnchor.classList.remove(ClassNames.HALF_OPACITY);
          } else {
            this.options.awakenings.splice(this.options.awakenings.indexOf(awakening), 1);
            awakeningAnchor.classList.add(ClassNames.HALF_OPACITY);
          }
          // this.options.awakenings = this.awakeningAnchors.map((a, idx) => ({ a, idx })).filter(({ a }) => !a.classList.contains(ClassNames.HALF_OPACITY)).map(({ idx }) => idx);
          this.onUpdate();
        }
        this.awakeningAnchors.push(awakeningAnchor);
        if (awakening > 0) {
          awakeningDiv.appendChild(awakeningAnchor);
        }
      }
      awakeningDiv.appendChild(create('br'));
    }
    this.element.appendChild(awakeningDiv);
  }

  getElement(): HTMLElement {
    return this.element;
  }

  getCanvas(): HTMLCanvasElement {
    return this.canvas;
  }

  getOptions(): FancyPhotoOptions {
    return this.options;
  }
}

class ValeriaDisplay {
  element_: HTMLElement;
  panes: HTMLTableCellElement[];
  leftTabs: TabbedComponent;

  constructor() {
    this.element_ = create('div', ClassNames.VALERIA);

    const table = create('table');
    const row = create('tr');
    this.panes = [];

    for (let i = 0; i < 3; i++) {
      const pane = create('td') as HTMLTableCellElement;
      this.panes.push(pane);
      row.appendChild(pane);
    }

    this.leftTabs = new TabbedComponent(['Monster Editor', 'Combo Editor']);
    this.panes[0].appendChild(this.leftTabs.getElement());

    table.appendChild(row);

    this.element_.appendChild(table);
  }

  getElement(): HTMLElement {
    return this.element_;
  }
}

export {
  ClassNames,
  MonsterIcon,
  MonsterInherit,
  MonsterLatent,

  ComboEditor,
  TabbedComponent,
  StoredTeamDisplay,
  MonsterEditor,
  Stats, TeamPane, TeamUpdate,
  DungeonEditor,
  DungeonPane,
  DungeonUpdate, OnDungeonUpdate,
  ValeriaDisplay,
  create,
  MonsterUpdate, OnMonsterUpdate,
  LayeredAsset, AssetEnum,
  EnemySkillArea,
  getLatentPosition,
  getAwakeningOffsets,
  PhotoArea, FancyPhotoOptions
}
