/**
 * Rendering tools for other classes to reference.
 * These take relatively pure data and update that way.
 * TODO: Split this into files corresponding to the classes they are templated
 * for.
 * TODO: Consider making some of these into proper soy templates and then
 * compiling them here so that the structure is more consistent.
 */

import { BASE_URL, COLORS, DEFAULT_CARD, Attribute, Awakening, Latent, MonsterType, AttributeToFontColor, addCommas, removeCommas } from './common';
import { CardAssets, CardUiAssets, floof, Card } from './ilmina_stripped';
import { fuzzySearch, fuzzyMonsterSearch, prioritizedMonsterSearch, prioritizedInheritSearch, prioritizedEnemySearch } from './fuzzy_search';

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

  COMBO_EDITOR = 'valeria-combo-editor',
  COMBO_COMMAND = 'valeria-combo-command',
  COMBO_TABLE = 'valeria-combo-table',

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

  VALERIA = 'valeria',
}

enum Ids {
  COMBO_TABLE_PREFIX = 'valeria-combo-table-',
}

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
  const result = [0, -324];
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
  [AssetEnum.NUMBER_0, { offsetY: 182 + 0 * 32, offsetX: 180, width: 20, height: 26 }],
  [AssetEnum.NUMBER_1, { offsetY: 182 + 1 * 32, offsetX: 180, width: 20, height: 26 }],
  [AssetEnum.NUMBER_2, { offsetY: 182 + 2 * 32, offsetX: 180, width: 20, height: 26 }],
  [AssetEnum.NUMBER_3, { offsetY: 182 + 3 * 32, offsetX: 180, width: 20, height: 26 }],
  [AssetEnum.NUMBER_4, { offsetY: 182 + 4 * 32, offsetX: 180, width: 20, height: 26 }],
  [AssetEnum.NUMBER_5, { offsetY: 182 + 5 * 32, offsetX: 180, width: 20, height: 26 }],
  [AssetEnum.NUMBER_6, { offsetY: 182 + 6 * 32, offsetX: 180, width: 20, height: 26 }],
  [AssetEnum.NUMBER_7, { offsetY: 182 + 7 * 32, offsetX: 180, width: 20, height: 26 }],
  [AssetEnum.NUMBER_8, { offsetY: 182 + 8 * 32, offsetX: 180, width: 20, height: 26 }],
  [AssetEnum.NUMBER_9, { offsetY: 182 + 9 * 32, offsetX: 180, width: 20, height: 26 }],
  [AssetEnum.GUARD_BREAK, { offsetY: 0, offsetX: 2 + 36 * 0, width: 36, height: 36 }],
  [AssetEnum.TIME, { offsetY: 0, offsetX: 2 + 36 * 1, width: 36, height: 36 }],
  [AssetEnum.POISON, { offsetY: 0, offsetX: 2 + 36 * 2, width: 36, height: 36 }],
  [AssetEnum.ENRAGE, { offsetY: 0, offsetX: 114, width: 36, height: 36 }],
  [AssetEnum.STATUS_SHIELD, { offsetY: 0, offsetX: 154, width: 36, height: 36 }],
  [AssetEnum.SKILL_BIND, { offsetY: 40, offsetX: 141, width: 32, height: 32 }],
  [AssetEnum.AWOKEN_BIND, { offsetY: 73, offsetX: 140, width: 32, height: 32 }],
  [AssetEnum.RESOLVE, { offsetY: 144, offsetX: 132, width: 32, height: 32 }],
  [AssetEnum.BURST, { offsetY: 208, offsetX: 132, width: 32, height: 32 }],
  [AssetEnum.SHIELD_BASE, { offsetY: 55, offsetX: 326, width: 36, height: 36 }],
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
          if (assetInfo.width > maxSizes.width * scale) {
            maxSizes.width = assetInfo.width * scale;
          }
          if (assetInfo.height > maxSizes.height * scale) {
            maxSizes.height = assetInfo.height * scale;
          }
          el.style.backgroundImage = UI_ASSET_SRC;
          el.style.backgroundPosition = `${-1 * assetInfo.offsetX * scale} ${-1 * assetInfo.offsetY * scale}`;
        }
        return el;
      });
    if (this.elements.length == 3) {
      console.log('here');
    }
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
      awakeningEl.innerText = `(${d.awakening})`;
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
    for (let i = 0; i < 6; i++) {
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
    for (let i = 0; i < 6; i++) {
      if (i >= latents.length) {
        hide(this.latentEls[i]);
        continue;
      }
      show(this.latentEls[i]);
      let offsetX: number;
      let offsetY: number;
      if (latents[i] < 11) {
        offsetX = (latents[i] * 36) * scale;
        offsetY = 36 * scale;
        this.latentEls[i].className = ClassNames.MONSTER_LATENT;
      } else {
        const idx = latents[i] - 11;
        offsetX = ((idx % 5) * 80 + 2) * scale;
        offsetY = (Math.floor(idx / 5) + 2) * 36 * scale;
        this.latentEls[i].className = ClassNames.MONSTER_LATENT_SUPER;
      }
      this.latentEls[i].style.backgroundPosition = `-${offsetX}px -${offsetY}px`;
    }
  }
}

class ComboEditor {
  public static maxVisibleCombos: number = 14;
  public commandInput: HTMLInputElement = create('input', ClassNames.COMBO_COMMAND) as HTMLInputElement;

  private element: HTMLElement = create('div', ClassNames.COMBO_EDITOR);
  private colorTables: Record<string, HTMLTableElement> = {};

  constructor() {
    this.commandInput.placeholder = 'Combo Commands';
    this.element.appendChild(this.commandInput);

    for (const c of COLORS) {
      const colorTable = create('table', ClassNames.COMBO_TABLE) as HTMLTableElement;
      colorTable.id = Ids.COMBO_TABLE_PREFIX + c;
      const headerRow = create('tr');
      const countRow = create('tr');
      const enhanceRow = create('tr');
      for (let i = -1; i < ComboEditor.maxVisibleCombos; i++) {
        const headerCell = create('th');
        const countCell = create('td');
        const enhanceCell = create('td');
        if (i == -1) {
          headerCell.innerText = c.toUpperCase();
          countCell.innerText = '#';
          enhanceCell.innerText = '+';
        } else {
          headerCell.innerText = `${i}`;
          const countInput = create('input') as HTMLInputElement;
          countInput.id = `valeria-combo-count-${c}-${i}`;
          countInput.value = '';
          countCell.appendChild(countInput);
          const enhanceInput = create('input') as HTMLInputElement;
          enhanceInput.id = `valeria-combo-enhance-${c}-${i}`;
          enhanceInput.value = '';
          enhanceCell.appendChild(enhanceInput);
        }
        headerRow.appendChild(headerCell);
        countRow.appendChild(countCell);
        enhanceRow.appendChild(enhanceCell);
      }
      colorTable.appendChild(headerRow);
      colorTable.appendChild(countRow);
      colorTable.appendChild(enhanceRow);
      this.colorTables[c] = colorTable;
      this.element.appendChild(colorTable);
    }
  }

  getElement(): HTMLElement {
    return this.element;
  }

  getInputElements(): Record<string, { shapeCountEl: HTMLInputElement, enhanceEl: HTMLInputElement }[]> {
    const out: Record<string, { shapeCountEl: HTMLInputElement, enhanceEl: HTMLInputElement }[]> = {};

    for (const c of COLORS) {
      out[c] = [];
      const [shapeCountRow, enhanceRow] = [...this.colorTables[c].getElementsByTagName('tr')].slice(1);
      const shapeCountEls = shapeCountRow.getElementsByTagName('input');
      const enhanceEls = enhanceRow.getElementsByTagName('input');
      for (let i = 0; i < ComboEditor.maxVisibleCombos; i++) {
        const shapeCountEl = shapeCountEls[i] as HTMLInputElement;
        const enhanceEl = enhanceEls[i] as HTMLInputElement;
        out[c].push({
          shapeCountEl,
          enhanceEl,
        });
      }
    }

    return out;
  }

  update(data: Record<string, { shapeCount: string, enhance: number }[]>) {
    for (const c in data) {
      const vals = data[c];
      for (let i = 0; i < ComboEditor.maxVisibleCombos; i++) {
        const countEl = document.getElementById(`valeria-combo-count-${c}-${i}`) as HTMLInputElement;
        const enhanceEl = document.getElementById(`valeria-combo-enhance-${c}-${i}`) as HTMLInputElement;
        if (i >= vals.length) {
          countEl.value = '';
          enhanceEl.value = '';
        } else {
          const { shapeCount, enhance } = vals[i];
          countEl.value = shapeCount;
          enhanceEl.value = enhance > 0 ? `${enhance}` : '';
        }
      }
    }
  }
}

class TabbedComponent {
  tabNames_: string[];
  element_: HTMLElement;
  labels_: Record<string, HTMLTableColElement>;
  tabs_: Record<string, HTMLElement>;

  constructor(tabNames: string[], defaultTab: string = '') {
    if (!tabNames.length) {
      throw 'Need at least one tab name.';
    }
    if (!defaultTab || !tabNames.some((name) => name == defaultTab)) {
      defaultTab = tabNames[0];
    }
    this.element_ = create('div', ClassNames.TABBED);
    this.tabNames_ = [...tabNames];

    const labelTable = create('table') as HTMLTableElement;
    const labelRow = create('tr') as HTMLTableRowElement;
    labelTable.appendChild(labelRow);
    this.element_.appendChild(labelTable);

    this.labels_ = {};
    this.tabs_ = {};

    for (const tabName of tabNames) {
      const labelClassName = tabName == defaultTab ? ClassNames.TABBED_LABEL_SELECTED : ClassNames.TABBED_LABEL;
      const label = create('td', labelClassName) as HTMLTableColElement;
      label.innerText = tabName;
      label.onclick = () => this.setActiveTab(tabName);
      labelRow.appendChild(label);
      this.labels_[tabName] = label;

      const tabClassName = tabName == defaultTab ? ClassNames.TABBED_TAB_SELECTED : ClassNames.TABBED_TAB;
      const tab = create('div', tabClassName);
      this.element_.appendChild(tab);
      this.tabs_[tabName] = tab;
    }
  }

  getElement(): HTMLElement {
    return this.element_;
  }

  setActiveTab(activeTabName: string): void {
    for (const tabName of this.tabNames_) {
      if (tabName == activeTabName) {
        this.labels_[tabName].className = ClassNames.TABBED_LABEL_SELECTED;
        this.tabs_[tabName].className = ClassNames.TABBED_TAB_SELECTED;
      } else {
        this.labels_[tabName].className = ClassNames.TABBED_LABEL;
        this.tabs_[tabName].className = ClassNames.TABBED_TAB;
      }
    }
  }

  getTab(tabName: string): HTMLElement {
    if (!(tabName in this.tabs_)) {
      throw 'Invalid tab name: ' + tabName;
    }
    return this.tabs_[tabName];
  }
}

// Partial update values.
interface MonsterUpdate {
  playerMode?: number,

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
  id: number,
  level: number,
  hpPlus: number,
  atkPlus: number,
  rcvPlus: number,
  awakeningLevel: number,
  superAwakeningIdx: number,

  inheritId: number,
  inheritLevel: number,
  inheritPlussed: boolean,
  latents: Latent[],
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
    return fuzzySearch(text, GenericSelector.MAX_OPTIONS * 3, this.searchArray);
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
        this.options[i].innerText = `${fuzzyMatches[i]} - ${this.getName(Number(fuzzyMatches[i]))}`;
        this.options[i].setAttribute('value', String(fuzzyMatches[i]));
      }
      this.activeOptions = Math.min(fuzzyMatches.length, this.options.length);
    };
  }

  optionOnClick(option: HTMLElement): () => void {
    return () => {
      const id = Number(option.getAttribute('value'));
      this.updateCb(id);
      // TODO: Clean this up.
      this.selector.value = this.getName(id);
      this.optionsContainer.className = ClassNames.SELECTOR_OPTIONS_INACTIVE;
    };
  }

  constructor(searchArray: { s: string, value: T }[], updateCb: (value: number) => void) {
    this.searchArray = searchArray;
    this.updateCb = updateCb;

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
      return floof.model.cards[id].name;
    }
  }

  getFuzzyMatches(text: string): number[] {
    return fuzzyMonsterSearch(text, GenericSelector.MAX_OPTIONS * 3, this.cardArray);
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
    this.el.appendChild(maxPlusButton);

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
    this.el.appendChild(minPlusButton);

    this.el.appendChild(create('br'));

    this.hpEl.type = 'number';
    this.hpEl.onchange = () => {
      this.onUpdate({ hpPlus: Number(this.hpEl.value) });
    };
    this.el.appendChild(document.createTextNode('HP+ '));
    this.el.appendChild(this.hpEl);

    this.atkEl.type = 'number';
    this.atkEl.onchange = () => {
      this.onUpdate({ atkPlus: Number(this.atkEl.value) });
    };
    this.el.appendChild(document.createTextNode('ATK+ '));
    this.el.appendChild(this.atkEl);

    this.rcvEl.type = 'number';
    this.rcvEl.onchange = () => {
      this.onUpdate({ rcvPlus: Number(this.rcvEl.value) });
    };
    this.el.appendChild(document.createTextNode('RCV+ '));
    this.el.appendChild(this.rcvEl);

    this.inheritEl.type = 'checkbox';
    this.inheritEl.onclick = () => {
      this.onUpdate({ inheritPlussed: this.inheritEl.checked });
    };
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

class LatentEditor {
  private el: HTMLDivElement = create('div') as HTMLDivElement;
  latentRemovers: HTMLAnchorElement[] = [];
  latentSelectors: HTMLAnchorElement[] = [];
  onUpdate: OnMonsterUpdate;
  currentLatents: Latent[] = [];
  static PER_ROW = 11;

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
    let j = 1;
    let x = 0;
    for (let i = 0; i < 33; i++) {
      const isSuper = i >= LatentEditor.PER_ROW;
      currentWidth += isSuper ? 2 : 1;
      x++;
      if (currentWidth > LatentEditor.PER_ROW) {
        selectorArea.appendChild(create('br'));
        currentWidth = isSuper ? 2 : 1;
        x = 0;
        j++;
      }
      const cls = isSuper ? ClassNames.AWAKENING_SUPER : ClassNames.AWAKENING;
      const selector = create('a', cls) as HTMLAnchorElement;
      const offsetX = (j > 1 ? (80 * x + 2) : 36 * x - 36) * AwakeningEditor.SCALE;
      selector.style.backgroundPosition = `-${offsetX}px -${36 * j * AwakeningEditor.SCALE}px`;
      selector.onclick = () => {
        this.onUpdate({ addLatent: i });
      };
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
        remover.style.backgroundPosition = '0px 0px';
        remover.className = ClassNames.AWAKENING;
        totalLatents++;
        continue;
      }
      remover.style.display = ''
      const latent = activeLatents[i];
      const isSuper = latent >= 11;
      totalLatents += isSuper ? 2 : 1;
      let offsetWidth, offsetHeight;
      const x = isSuper ? (latent - 11) % 5 : latent;
      const y = isSuper ? Math.floor((latent - 11) / 5 + 2) : 1;
      if (isSuper) {
        offsetWidth = x * -80 - 2;
        offsetHeight = -36 * y;
      } else {
        offsetWidth = x * -36;
        offsetHeight = -36;
      }
      remover.className = isSuper ? ClassNames.AWAKENING_SUPER : ClassNames.AWAKENING;
      remover.style.backgroundPosition = `${offsetWidth * AwakeningEditor.SCALE}px ${offsetHeight * AwakeningEditor.SCALE}px`;
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
  monsterSelector: MonsterSelector;
  inheritSelector: MonsterSelector;
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
    this.el.appendChild(playerModeArea);

    this.monsterSelector = new MonsterSelector(prioritizedMonsterSearch, onUpdate);
    this.inheritSelector = new MonsterSelector(prioritizedInheritSearch, onUpdate, true);
    this.inheritSelector.selector.placeholder = 'Inherit Search';

    this.el.appendChild(this.monsterSelector.getElement());
    this.el.appendChild(this.inheritSelector.getElement());

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
    this.monsterSelector.setId(ctx.id);
    this.inheritSelector.setId(ctx.inheritId);
    let maxLevel = 1;
    if (ctx.id in floof.model.cards) {
      maxLevel = floof.model.cards[ctx.id].isLimitBreakable ? 110 : floof.model.cards[ctx.id].maxLevel;
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
    if (ctx.id in floof.model.cards) {
      awakenings = floof.model.cards[ctx.id].awakenings;
      superAwakenings = floof.model.cards[ctx.id].superAwakenings;
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
      latentKillers = floof.model.cards[ctx.id].latentKillers;
    }
    const maybeCard = floof.model.cards[ctx.id];
    let maxLatents = 6;
    if (!maybeCard) {
      maxLatents = 0;
    } else if (maybeCard.inheritanceType & 32) {
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
  hps: number[],
  atks: number[],
  rcvs: number[],
  cds: string[],
  totalHp: number,
  totalRcv: number,
  totalTime: number,
  counts: Map<Awakening, number>,
}

interface TeamBattle {
  maxHp: number,
  currentHp: number,
  fixedHp: number,
  leadSwap: number,

  voids: boolean[],
}

interface TeamUpdate {
  teamIdx?: number,
  monsterIdx?: number,
  title?: string,
  description?: string,

  currentHp?: number,
  fixedHp?: number,
  leadSwap?: number,

  voidDamageAbsorb?: boolean,
  voidAttributeAbsorb?: boolean,
  voidDamageVoid?: boolean,
  voidAwakenings?: boolean,
}

class TeamPane {
  element_: HTMLElement = create('div');
  teamDivs: HTMLDivElement[] = [];
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
  private metaTabs: TabbedComponent = new TabbedComponent(['Team', 'Save/Load']);
  private detailTabs: TabbedComponent = new TabbedComponent(['Stats', 'Description', 'Battle'], 'Stats');
  private onTeamUpdate: (ctx: TeamUpdate) => void;
  private hpBar: HpBar;
  private fixedHpEl: LayeredAsset = new LayeredAsset([], () => { });
  private fixedHpInput: HTMLInputElement = create('input') as HTMLInputElement;
  private leadSwapInput = create('select') as HTMLSelectElement;
  private voidEls: LayeredAsset[] = [];
  private pingCells: HTMLTableCellElement[] = [];
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
    this.descriptionEl.placeholder = 'Team Description';
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
        Awakening.L_GUARD
      ],
      [
        Awakening.SBR,
        Awakening.RESIST_POISON,
        Awakening.RESIST_BLIND,
        Awakening.RESIST_JAMMER,
        Awakening.RESIST_CLOUD,
        Awakening.RESIST_TAPE
      ],
      [
        Awakening.OE_FIRE,
        Awakening.OE_WATER,
        Awakening.OE_WOOD,
        Awakening.OE_LIGHT,
        Awakening.OE_DARK,
        Awakening.OE_HEART
      ],
      [
        Awakening.ROW_FIRE,
        Awakening.ROW_WATER,
        Awakening.ROW_WOOD,
        Awakening.ROW_LIGHT,
        Awakening.ROW_DARK,
        Awakening.RECOVER_BIND
      ]
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
  }

  private populateBattle(): void {
    // HP Element
    const hpEl = this.hpBar.getElement();
    hpEl.appendChild(this.hpDamage);
    this.battleEl.appendChild(hpEl);

    this.fixedHpEl = new LayeredAsset([AssetEnum.FIXED_HP], () => {
      this.fixedHpInput.value = '0';
      this.onTeamUpdate({ fixedHp: 0 });
    }, false, 0.7);
    this.fixedHpInput.onchange = () => {
      console.log('Fixed HP');
      this.onTeamUpdate({ fixedHp: removeCommas(this.fixedHpInput.value) });
    }
    this.battleEl.appendChild(this.fixedHpEl.getElement());
    this.battleEl.appendChild(this.fixedHpInput);

    // Choose combos or active.
    const leadSwapLabel = create('span') as HTMLDivElement;
    leadSwapLabel.innerText = 'Lead Swap: ';
    this.battleEl.appendChild(leadSwapLabel);
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
    this.battleEl.appendChild(this.leadSwapInput);


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

    this.battleEl.appendChild(toggleArea);

    const damageTable = create('table', ClassNames.DAMAGE_TABLE) as HTMLTableElement;
    const mainRow = create('tr') as HTMLTableRowElement;
    const subRow = create('tr') as HTMLTableRowElement;

    this.pingCells = Array(12);

    for (let i = 0; i < 6; i++) {
      const mainPingCell = create('td') as HTMLTableCellElement;
      const subPingCell = create('td') as HTMLTableCellElement;

      mainPingCell.id = `valeria-ping-main-${i}`;
      subPingCell.id = `valeria-ping-sub-${i}`;

      mainRow.appendChild(mainPingCell);
      subRow.appendChild(subPingCell);
      this.pingCells[i] = mainPingCell;
      this.pingCells[i + 6] = subPingCell;
    }

    damageTable.appendChild(mainRow);
    damageTable.appendChild(subRow);
    this.battleEl.appendChild(damageTable);
  }

  // TODO
  update(playerMode: number, title: string, description: string): void {
    for (let i = 1; i < this.teamDivs.length; i++) {
      if (i < playerMode) {
        this.teamDivs[i].style.display = '';
      } else {
        this.teamDivs[i].style.display = 'none';
      }
    }
    this.titleEl.value = title;
    this.descriptionEl.value = description;
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
  }

  updateBattle(teamBattle: TeamBattle): void {
    this.hpBar.setHp(teamBattle.currentHp, teamBattle.maxHp);
    this.leadSwapInput.value = `${teamBattle.leadSwap}`;

    for (const idx in teamBattle.voids) {
      this.voidEls[idx].setActive(teamBattle.voids[idx]);
    }

    this.fixedHpEl.setActive(teamBattle.fixedHp > 0);
    this.fixedHpInput.value = addCommas(teamBattle.fixedHp);
  }

  updateDamage(pings: { attribute: Attribute; damage: number }[], healing: number): void {
    for (let i = 0; i < 12; i++) {
      const { attribute, damage } = pings[i];
      this.pingCells[i].innerText = addCommas(damage);
      this.pingCells[i].style.color = AttributeToFontColor[attribute];
    }
    this.hpDamage.innerText = `+${addCommas(healing)}`;
  }
}

/**
// createSkillsetEditor(i) {
//   const el = document.createElement('div');
//   el.style.marginTop = '5px';
//
//   let skillset;
//   if (i == -1) {
//     skillset = this.getActiveEnemy().preemptiveSkillset;
//     el.className = 'idc-enemy-skill-preemptive';
//   } else {
//     skillset = this.getActiveEnemy().skillsets[i];
//   }
//
//   const removeSkillset = document.createElement('div');
//   if (i != -1) {
//     removeSkillset.style.display = 'inline-block';
//     removeSkillset.innerText = '[-]';
//     removeSkillset.style.fontSize = 'medium';
//     removeSkillset.style.cursor = 'pointer';
//     removeSkillset.onclick = () => {
//       this.getActiveEnemy().skillsets.splice(i, 1);
//       this.reloadEditorElement();
//     };
//   }
//
//   const skillsetNameEditor = document.createElement('input');
//   skillsetNameEditor.placeholder = 'Skillset Name';
//   skillsetNameEditor.value = skillset.name;
//   skillsetNameEditor.onchange = () => {
//     skillset.name = skillsetNameEditor.value;
//     this.reloadBattleElement();
//   };
//   const addSkill = document.createElement('span');
//   addSkill.innerText = 'Add Skill';
//   addSkill.style.border = BORDER_COLOR;
//   addSkill.style.marginLeft = '10px';
//   addSkill.style.padding = '2px';
//   addSkill.style.cursor = 'pointer';
//   addSkill.onclick = () => {
//     skillset.skills.push(new EnemySkill());
//     this.reloadEditorElement();
//   }
//   const skillsetTable = document.createElement('table');
//   skillsetTable.style.fontSize = 'small';
//   skillsetTable.style.marginLeft = '5px';
//   for (let j = 0; j < skillset.skills.length; j++) {
//     const row = document.createElement('tr');
//
//     const removeSkillCell = document.createElement('td');
//     removeSkillCell.innerText = '[-]';
//     removeSkillCell.style.cursor = 'pointer';
//     removeSkillCell.onclick = () => {
//       skillset.skills.splice(j, 1);
//       this.reloadEditorElement();
//     }
//     row.appendChild(removeSkillCell);
//
//     const skillTypeCell = document.createElement('td');
//     const skillTypeSelect = document.createElement('select');
//
//     skillTypeSelect.style.fontSize = 'small';
//     for (const skillEffectType of Object.values(EnemySkillEffect)) {
//       const skillOption = document.createElement('option');
//       skillOption.innerText = skillEffectType;
//       skillOption.value = skillEffectType;
//       skillTypeSelect.appendChild(skillOption);
//     }
//     skillTypeSelect.value = skillset.skills[j].effect;
//     skillTypeSelect.onchange = () => {
//       skillset.skills[j].effect = skillTypeSelect.value;
//       this.reloadBattleElement();
//       this.reloadEditorElement();
//     }
//     skillTypeCell.appendChild(skillTypeSelect);
//     row.appendChild(skillTypeCell)
//
//     const skillConfigCell = document.createElement('td');
//     switch(skillset.skills[j].effect) {
//       case EnemySkillEffect.NONE:
//       case EnemySkillEffect.STATUS_SHIELD:
//         break;
//       case EnemySkillEffect.ATTRIBUTE_ABSORB:
//         const absorbed = idxsFromBits(Number(skillset.skills[j].config));
//         for (let attr = 0; attr < 5; attr++) {
//           const configEl = document.createElement('span');
//           configEl.innerText = COLORS[attr].toUpperCase();
//           configEl.style.border = absorbed.includes(attr) ? BORDER_COLOR : '';
//           configEl.onclick = () => {
//             skillset.skills[j].config ^= 1 << attr;
//             this.reloadEditorElement();
//           };
//           skillConfigCell.appendChild(configEl);
//         }
//         break;
//       default:
//         const skillConfigInput = document.createElement('input');
//         skillConfigInput.style.width = '100px';
//         skillConfigInput.type = 'number';
//         skillConfigInput.onchange = () => {
//           skillset.skills[j].config = Number(skillConfigInput.value);
//           this.reloadBattleElement();
//       }
//       skillConfigInput.style.fontSize = 'small';
//       skillConfigInput.value = skillset.skills[j].config;
//       skillConfigCell.appendChild(skillConfigInput);
//     }
//     row.appendChild(skillConfigCell);
//
//     skillsetTable.appendChild(row);
//   }
//
//   if (i != -1) {
//     el.appendChild(removeSkillset);
//   }
//   el.appendChild(skillsetNameEditor);
//   el.appendChild(addSkill);
//   // el.appendChild(removeSkill);
//   el.appendChild(skillsetTable);
//   return el;
// }

// createEnemyEditor() {
//   const enemyEditor = document.createElement('div');
//   enemyEditor.style.marginTop = '5px';
//   enemyEditor.appendChild(this.createEnemySelector());
//
//   const enemyStatEditTable = document.createElement('table');
//   enemyStatEditTable.style.fontSize = 'small';
//   const hpRow = document.createElement('tr');
//   const hpLabel = document.createElement('td');
//   hpLabel.innerText = 'Max HP';
//   hpRow.appendChild(hpLabel);
//   const hpValue = document.createElement('td');
//   const maxHpEditor = document.createElement('input');
//   maxHpEditor.id = 'idc-enemy-maxhp';
//   maxHpEditor.type = 'number';
//   maxHpEditor.onchange = () => {
//     this.getActiveEnemy().maxHp = Number(maxHpEditor.value);
//     this.getActiveEnemy().currentHp = Number(maxHpEditor.value);
//     this.reloadBattleElement();
//   }
//   hpValue.appendChild(maxHpEditor);
//   hpRow.appendChild(hpValue);
//   enemyStatEditTable.appendChild(hpRow);
//   // Attack setter.
//   const atkRow = document.createElement('tr');
//   const atkLabel = document.createElement('td');
//   atkLabel.innerText = 'Attack';
//   atkRow.appendChild(atkLabel);
//   const atkValue = document.createElement('td');
//   const atkEditor = document.createElement('input');
//   atkEditor.id = 'idc-enemy-attack';
//   atkEditor.type = 'number';
//   atkEditor.onchange = () => {
//     this.getActiveEnemy().attack = atkEditor.value;
//     this.reloadBattleElement();
//   }
//   atkValue.appendChild(atkEditor);
//   atkRow.appendChild(atkValue);
//   enemyStatEditTable.appendChild(atkRow);
//   // Defense setter.
//   const defenseRow = document.createElement('tr');
//   const defenseLabel = document.createElement('td');
//   defenseLabel.innerText = 'Defense';
//   defenseRow.appendChild(defenseLabel);
//   const defenseValue = document.createElement('td');
//   const defenseEditor = document.createElement('input');
//   defenseEditor.id = 'idc-enemy-defense';
//   defenseEditor.type = 'number';
//   defenseEditor.onchange = () => {
//     this.getActiveEnemy().defense = Number(defenseEditor.value);
//     this.reloadBattleElement();
//   }
//   defenseValue.appendChild(defenseEditor);
//   defenseRow.appendChild(defenseValue);
//   enemyStatEditTable.appendChild(defenseRow);
//   // Resolve setter.
//   const resolveRow = document.createElement('tr');
//   const resolveLabel = document.createElement('td');
//   resolveLabel.innerText = 'Resolve (%)';
//   resolveRow.appendChild(resolveLabel);
//   const resolveValue = document.createElement('td');
//   const resolveEditor = document.createElement('input');
//   resolveEditor.id = 'idc-enemy-resolve';
//   resolveEditor.type = 'number';
//   resolveEditor.onchange = () => {
//     this.getActiveEnemy().resolvePercent = resolveEditor.value;
//     this.reloadBattleElement();
//   }
//   resolveValue.appendChild(resolveEditor);
//   resolveRow.appendChild(resolveValue);
//   enemyStatEditTable.appendChild(resolveRow);
//   // Resist Attribute Setter.
//   const resistAttributeRow = document.createElement('tr');
//   const resistAttributeLabel = document.createElement('td');
//   resistAttributeLabel.innerText = 'Resist Attr';
//   resistAttributeRow.appendChild(resistAttributeLabel);
//   const resistAttributeValue = document.createElement('td');
//   const resistAttributeEditor = document.createElement('table');
//   const resistAttributesActualValues = document.createElement('tr');
//   const resistAttributesLabelValues = document.createElement('tr');
//   for (let i = 0; i < 5; i++) {
//     const cellUp = document.createElement('td');
//     const elCheckbox = document.createElement('input');
//     elCheckbox.id = `idc-enemy-resist-attributes-${i}`;
//     elCheckbox.className = 'idc-enemy-resist-attributes';
//     elCheckbox.value = i;
//     elCheckbox.type = 'checkbox';
//     elCheckbox.onclick = () => {
//       this.getActiveEnemy().attributesResisted.length = 0;
//       for (const checkbox of document.getElementsByClassName('idc-enemy-resist-attributes')) {
//         if (checkbox.checked) {
//           this.getActiveEnemy().attributesResisted.push(Number(checkbox.value));
//         }
//       }
//       this.reloadBattleElement();
//     }
//     cellUp.appendChild(elCheckbox);
//     resistAttributesActualValues.appendChild(cellUp);
//     const cellDown = document.createElement('td');
//     cellDown.innerText = COLORS[i].toUpperCase();
//     resistAttributesLabelValues.appendChild(cellDown);
//   }
//
//   const resistTypesRow = document.createElement('tr');
//   const resistTypesLabel = document.createElement('td');
//   resistTypesLabel.innerText = 'Resist Type';
//   resistTypesRow.appendChild(resistTypesLabel);
//   const resistTypesCell = document.createElement('td');
//   const resistType1Select = document.createElement('select');
//   resistType1Select.id = 'idc-enemy-resist-type-1';
//   const resistType2Select = document.createElement('select');
//   resistType2Select.id = 'idc-enemy-resist-type-2';
//   resistType1Select.onchange = () => {
//     const resists = [Number(resistType1Select.value), Number(resistType2Select.value)];
//     this.getActiveEnemy().typesResisted = resists.filter((value) => value > -1);
//     this.reloadBattleElement();
//   }
//   for (const type of [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 12, 14, 15]) {
//     const typeOption1 = document.createElement('option');
//     typeOption1.value = type;
//     typeOption1.innerText = TypeToName[type];
//     resistType1Select.appendChild(typeOption1);
//     const typeOption2 = document.createElement('option');
//     typeOption2.value = type;
//     typeOption2.innerText = TypeToName[type];
//     resistType2Select.appendChild(typeOption2);
//   }
//   resistTypesCell.appendChild(resistType1Select);
//   resistTypesCell.appendChild(resistType2Select);
//   resistTypesRow.appendChild(resistTypesCell);
//
//   resistAttributeEditor.appendChild(resistAttributesActualValues);
//   resistAttributeEditor.appendChild(resistAttributesLabelValues);
//   resistAttributeValue.appendChild(resistAttributeEditor);
//   resistAttributeRow.appendChild(resistAttributeValue);
//   enemyStatEditTable.appendChild(resistAttributeRow);
//   enemyStatEditTable.appendChild(resistTypesRow);
//   // this.preemptiveSkillset = null; // Used when loading the monster.
//   // this.skillsets = [];
//   // this.turnCounter = 1; // Not to be used yet.
//   enemyEditor.appendChild(enemyStatEditTable);
//
//   const preemptiveLabel = document.createElement('div');
//   preemptiveLabel.style.marginTop = '5px';
//   preemptiveLabel.style.fontSize = 'medium';
//   preemptiveLabel.innerText = 'Preemptive';
//   preemptiveLabel.title = 'Skills activated upon loading this monster.';
//   enemyEditor.appendChild(preemptiveLabel);
//   enemyEditor.appendChild(this.createSkillsetEditor(-1));
//
//   const skillsetEditorLabel = document.createElement('div');
//   skillsetEditorLabel.style.fontSize = 'medium';
//   skillsetEditorLabel.style.marginTop = '5px';
//   skillsetEditorLabel.innerText = 'Skillsets';
//   enemyEditor.appendChild(skillsetEditorLabel);
//
//   const addSkillset = document.createElement('div');
//   addSkillset.style.fontSize = 'normal';
//   addSkillset.innerText = 'Add Skillset';
//   addSkillset.style.border = BORDER_COLOR;
//   addSkillset.style.padding = '2px';
//   addSkillset.style.cursor = 'pointer';
//   addSkillset.onclick = () => {
//     this.getActiveEnemy().skillsets.push(new EnemySkillset());
//     this.reloadEditorElement();
//   }
//   enemyEditor.appendChild(addSkillset);
//   const skillEditorEl = document.createElement('div');
//   skillEditorEl.id = 'idc-enemy-skills';
//   enemyEditor.appendChild(skillEditorEl);
//
//   return enemyEditor
// }

// reloadEditorElement() {
//   document.getElementById('idc-dungeon-editor-title').value = this.title;
//   const floorsEditor = document.getElementById('idc-dungeon-editor-floors');
//   while (floorsEditor.firstChild) {
//     floorsEditor.removeChild(floorsEditor.firstChild);
//   }
//
//   for (let i = 0; i < this.floors.length; i++) {
//     const floorEditor = this.floors[i].createEditorElement(i, i == this.activeFloor);
//     floorEditor.onclick = () => {
//       this.activeFloor = i;
//       this.getActiveEnemy().reset();
//       this.reloadEditorElement();
//       this.reloadBattleElement();
//     }
//     floorsEditor.appendChild(floorEditor);
//     const floorDelete = floorEditor.getElementsByClassName('idc-dungeon-floor-delete')[0];
//     if (floorDelete) {
//       floorDelete.onclick = () => {
//         this.deleteFloor(i);
//       }
//     }
//   }
//
//   const enemy = this.getActiveEnemy();
//   document.getElementById('idc-selector-enemy').value = enemy.getName();
//   document.getElementById('idc-enemy-maxhp').value = enemy.maxHp;
//   document.getElementById('idc-enemy-attack').value = enemy.attack;
//   document.getElementById('idc-enemy-defense').value = enemy.defense;
//   document.getElementById('idc-enemy-resolve').value = enemy.resolvePercent;
//   for (const el of document.getElementsByClassName('idc-enemy-resist-attributes')) {
//     el.checked = enemy.attributesResisted.includes(Number(el.value));
//   }
//   document.getElementById('idc-enemy-resist-type-1').value = enemy.typesResisted.length ? enemy.typesResisted[0] : -1;
//   document.getElementById('idc-enemy-resist-type-2').value = enemy.typesResisted.length > 1 ? enemy.typesResisted[1] : -1;
//
//   const preemptiveEl = document.getElementsByClassName('idc-enemy-skill-preemptive')[0];
//   preemptiveEl.parentElement.insertBefore(this.createSkillsetEditor(-1), preemptiveEl);
//   preemptiveEl.parentElement.removeChild(preemptiveEl);
//
//   const skillsetEl = document.getElementById('idc-enemy-skills');
//   while (skillsetEl.firstChild) {
//     skillsetEl.removeChild(skillsetEl.firstChild);
//   }
//   for (let i = 0; i < enemy.skillsets.length; i++) {
//     skillsetEl.appendChild(this.createSkillsetEditor(i));
//   }
// }

// createEnemyHpEl() {
//   const el = createHpEl();
//   const slider = el.getElementsByClassName('idc-hp-slider')[0]
//   slider.id = 'idc-battle-opponent-hp-slider';
//   slider.onchange = () => {
//     this.getActiveEnemy().currentHp = Math.round(Number(slider.value));
//     this.reloadBattleElement();
//   };
//   const hpInput = el.getElementsByClassName('idc-hp-input')[0];
//   hpInput.id = 'idc-battle-opponent-hp-input';
//   hpInput.onchange = () => {
//     const enemy = this.getActiveEnemy();
//     enemy.currentHp = Number(hpInput.value);
//     if (enemy.currentHp > enemy.maxHp) {
//       enemy.currentHp = enemy.maxHp;
//     }
//     if (enemy.currentHp < 0) {
//       enemy.currentHp = 0;
//     }
//     this.reloadBattleElement();
//   };
//
//   const hpMax = el.getElementsByClassName('idc-hp-max')[0];
//   hpMax.id = 'idc-battle-opponent-hp-max';
//
//   const hpPercent = el.getElementsByClassName('idc-hp-percent')[0];
//   hpPercent.id = 'idc-battle-opponent-hp-percent';
//   return el;
// }

// createOpponentSetter() {
//   const opponentSetterTable = document.createElement('table');
//   opponentSetterTable.style.fontSize = 'small';
//   for (let i = 0; i < 3; i++) {
//     const row = document.createElement('tr');
//     for (let j = 0; j < 6; j++) {
//       const cell = document.createElement('td');
//       row.appendChild(cell);
//     }
//     opponentSetterTable.appendChild(row);
//   }
//   const opponentSetterCells = opponentSetterTable.getElementsByTagName('td');
//   // Status Shield, Damage Shield, Current Attribute
//   const statusCheckbox = document.createElement('input');
//   statusCheckbox.id = 'idc-battle-opponent-status';
//   statusCheckbox.type = 'checkbox';
//   statusCheckbox.onclick = () => {
//     this.getActiveEnemy().statusShield = statusCheckbox.checked;
//     this.reloadBattleElement();
//   };
//   const shieldInput = document.createElement('input');
//   shieldInput.id = 'idc-battle-opponent-shield';
//   shieldInput.type = 'number';
//   shieldInput.value = 0;
//   shieldInput.style.width = '45px';
//   shieldInput.onchange = () => {
//     let value = Number(shieldInput.value);
//     if (value < 0) {
//       value = 0;
//     }
//     if (value > 100) {
//       value = 100;
//     }
//     this.getActiveEnemy().shieldPercent = value;
//     this.reloadBattleElement();
//   };
//   const opponentAttributeSetter = document.createElement('select');
//   opponentAttributeSetter.id = 'idc-battle-opponent-attribute';
//   opponentAttributeSetter.onchange = () => {
//     this.getActiveEnemy().currentAttribute = opponentAttributeSetter.value;
//     this.reloadBattleElement();
//   }
//   const optionMain = document.createElement('option');
//   optionMain.innerText = 'Main';
//   optionMain.value = -1;
//   optionMain.selected = true;
//   opponentAttributeSetter.appendChild(optionMain);
//   const optionSub = document.createElement('option');
//   optionSub.innerText = 'Sub';
//   optionSub.value = -2;
//   opponentAttributeSetter.appendChild(optionSub);
//   const optionFire = document.createElement('option');
//   optionFire.innerText = 'Fire';
//   optionFire.value = 0;
//   opponentAttributeSetter.appendChild(optionFire);
//   const optionWater = document.createElement('option');
//   optionWater.innerText = 'Water';
//   optionWater.value = 1;
//   opponentAttributeSetter.appendChild(optionWater);
//   const optionWood = document.createElement('option');
//   optionWood.innerText = 'Wood';
//   optionWood.value = 2;
//   opponentAttributeSetter.appendChild(optionWood);
//   const optionLight = document.createElement('option');
//   optionLight.innerText = 'Light';
//   optionLight.value = 3;
//   opponentAttributeSetter.appendChild(optionLight);
//   const optionDark = document.createElement('option');
//   optionDark.innerText = 'Dark';
//   optionDark.value = 4;
//   opponentAttributeSetter.appendChild(optionDark);
//
//   opponentSetterCells[0].innerText = 'St. Shield';
//   opponentSetterCells[1].appendChild(statusCheckbox);
//   opponentSetterCells[2].innerText = 'Shield';
//   opponentSetterCells[3].appendChild(shieldInput);
//   opponentSetterCells[4].innerText = 'Attribute';
//   opponentSetterCells[5].appendChild(opponentAttributeSetter);
//   // Damage, Combo, Attribute Absorb
//   const damageAbsorbInput = document.createElement('input');
//   damageAbsorbInput.id = 'idc-battle-opponent-absorb-damage';
//   damageAbsorbInput.type = 'number';
//   damageAbsorbInput.value = -1;
//   damageAbsorbInput.style.width = '100px';
//
//   damageAbsorbInput.onchange = () => {
//     let value = Number(damageAbsorbInput.value);
//     if (value <= 0) {
//       value = -1;
//     }
//     this.getActiveEnemy().damageAbsorb = value;
//     this.reloadBattleElement();
//   };
//
//   const comboAbsorbInput = document.createElement('input');
//   comboAbsorbInput.type = 'number';
//   comboAbsorbInput.id = 'idc-battle-opponent-absorb-combo';
//   comboAbsorbInput.type = 'number';
//   comboAbsorbInput.value = 0;
//   comboAbsorbInput.style.width = '45px';
//   comboAbsorbInput.onchange = () => {
//     let value = Number(comboAbsorbInput.value);
//     if (value <= 0) {
//       value = -1;
//     }
//     this.getActiveEnemy().comboAbsorb = value;
//     this.reloadBattleElement();
//   };
//
//   const attrAbsorbEl = document.createElement('div');
//   for (let i = 0; i < 5; i++) {
//     const absorbSpan = document.createElement('span');
//     absorbSpan.id = `idc-battle-opponent-absorb-attr-${i}`;
//     absorbSpan.style.cursor = 'pointer';
//     absorbSpan.selected = false;
//     absorbSpan.innerText = COLORS[i].toUpperCase();
//     absorbSpan.onmouseover = () => {
//       absorbSpan.style.backgroundColor = 'darkgray';
//     };
//     absorbSpan.onmouseleave = () => {
//       absorbSpan.style.backgroundColor = '';
//     };
//     absorbSpan.onclick = () => {
//       const absorbed = this.getActiveEnemy().attributeAbsorb;
//       if (absorbed.includes(i)) {
//         absorbed.splice(absorbed.indexOf(i), 1);
//       } else {
//         absorbed.push(i);
//       }
//       this.reloadBattleElement();
//     };
//     attrAbsorbEl.appendChild(absorbSpan);
//   }
//
//   opponentSetterCells[6].innerText = '>=Absorb';
//   opponentSetterCells[7].appendChild(damageAbsorbInput);
//   opponentSetterCells[8].innerText = '<=Combo';
//   opponentSetterCells[9].appendChild(comboAbsorbInput)
//   opponentSetterCells[10].innerText = 'Attr Absorb';
//   opponentSetterCells[11].appendChild(attrAbsorbEl);
//   // Damage Void, Defense Break, Enrage
//   const voidInput = document.createElement('input');
//   voidInput.id = 'idc-battle-opponent-void';
//   voidInput.type = 'number';
//   voidInput.value = 0;
//   voidInput.style.width = '100px';
//   voidInput.onchange = () => {
//     let value = Number(voidInput.value);
//     if (value <= 0) {
//       value = -1;
//     }
//     this.getActiveEnemy().damageVoid = value;
//     this.reloadBattleElement();
//   };
//   const defBreakInput = document.createElement('input');
//   defBreakInput.id = 'idc-battle-opponent-defbreak';
//   defBreakInput.type = 'number';
//   defBreakInput.style.width = '45px';
//   defBreakInput.value = 0;
//   defBreakInput.onchange = () => {
//     let value = Number(defBreakInput.value);
//     if (value < 0) {
//       value = 0;
//     }
//     if (value > 100) {
//       value = 100;
//     }
//     this.getActiveEnemy().ignoreDefensePercent = value;
//     this.reloadBattleElement();
//   };
//
//   const enrageInput = document.createElement('input');
//   enrageInput.id = 'idc-battle-opponent-enrage';
//   enrageInput.type = 'number';
//   enrageInput.style.width = '45px';
//   enrageInput.value = 100;
//   enrageInput.onchange = () => {
//     console.warn('Enrage set to ' + enrageInput.value + ' but not used!');
//   };
//
//   opponentSetterCells[12].innerText = '>=Void';
//   opponentSetterCells[13].appendChild(voidInput);
//   opponentSetterCells[14].innerText = 'DefBreak%';
//   opponentSetterCells[15].appendChild(defBreakInput);
//   opponentSetterCells[16].innerText = 'Enrage%';
//   opponentSetterCells[17].appendChild(enrageInput);
//   return opponentSetterTable;
// }

// createDamageTable() {
//   const damageTable = document.createElement('table');
//   damageTable.style.fontSize = 'small';
//   damageTable.style.textAlign = 'right';
//   damageTable.style.marginTop = '5px';
//   const damageHeader = document.createElement('tr');
//   const idHeader = document.createElement('th');
//   idHeader.innerText = 'id';
//   damageHeader.appendChild(idHeader);
//   const boundHeader = document.createElement('th');
//   boundHeader.innerText = 'Bound';
//   damageHeader.appendChild(boundHeader);
//   const attrHeader = document.createElement('th');
//   attrHeader.innerText = 'Attr';
//   damageHeader.appendChild(attrHeader);
//   const baseDamageHeader = document.createElement('th');
//   baseDamageHeader.innerText = 'Base';
//   baseDamageHeader.style.minWidth = '70px';
//   damageHeader.appendChild(baseDamageHeader);
//   const hitDamageHeader = document.createElement('th');
//   hitDamageHeader.innerText = 'Hit';
//   hitDamageHeader.style.minWidth = '70px';
//   damageHeader.appendChild(hitDamageHeader);
//   const actualDamageHeader = document.createElement('th');
//   actualDamageHeader.innerText = 'Actual';
//   actualDamageHeader.style.minWidth = '70px';
//   damageHeader.appendChild(actualDamageHeader);
//   damageTable.appendChild(damageHeader);
//   for (let i = 0; i < 6; i++) {
//     const damageRow = document.createElement('tr');
//     const idCell = document.createElement('td');
//     idCell.id = `idc-battle-damage-id-${i}`;
//     idCell.innerText = '-';
//     idCell.style.height = '32px';
//     damageRow.appendChild(idCell);
//     const bindCell = document.createElement('td');
//     const bindCheckbox = document.createElement('input');
//     bindCheckbox.id = `idc-battle-damage-bound-${i}`;
//     bindCheckbox.type = 'checkbox';
//     bindCheckbox.onclick = () => {
//       this.idc.getActiveTeam()[i].bound = bindCheckbox.checked;
//       this.reloadBattleElement();
//     }
//     bindCell.appendChild(bindCheckbox);
//     damageRow.appendChild(bindCell);
//     const attributeOverride = document.createElement('td');
//     const attributeSelector = document.createElement('select');
//     attributeSelector.id = `idc-battle-damage-attr-${i}`;
//     attributeSelector.style.fontSize = 'small';
//     attributeSelector.onchange = () => {
//       this.idc.getActiveTeam()[i].attribute = Number(attributeSelector.value);
//       this.reloadBattleElement();
//     }
//     const optionNone = document.createElement('option');
//     optionNone.selected = true;
//     const optionFire = document.createElement('option');
//     const optionWater = document.createElement('option');
//     const optionWood = document.createElement('option');
//     const optionLight = document.createElement('option');
//     const optionDark = document.createElement('option');
//     optionNone.innerText = 'Self';
//     optionFire.innerText = 'Fire';
//     optionWater.innerText = 'Water';
//     optionWood.innerText = 'Wood';
//     optionLight.innerText = 'Light';
//     optionDark.innerText = 'Dark';
//     optionNone.value = -1;
//     optionFire.value = 0;
//     optionWater.value = 1;
//     optionWood.value = 2;
//     optionLight.value = 3;
//     optionDark.value = 4;
//     attributeSelector.appendChild(optionNone);
//     attributeSelector.appendChild(optionFire);
//     attributeSelector.appendChild(optionWater);
//     attributeSelector.appendChild(optionWood);
//     attributeSelector.appendChild(optionLight);
//     attributeSelector.appendChild(optionDark);
//     attributeOverride.appendChild(attributeSelector);
//     damageRow.appendChild(attributeOverride);
//
//     const preDamageCell = document.createElement('td');
//     const postDamageCell = document.createElement('td');
//     const effectiveDamageCell = document.createElement('td');
//
//     preDamageCell.id = `idc-battle-damage-pre-${i}`;
//     postDamageCell.id = `idc-battle-damage-post-${i}`;
//     effectiveDamageCell.id = `idc-battle-damage-effective-${i}`;
//
//     preDamageCell.style.padding = '3px';
//     postDamageCell.style.padding = '3px';
//     effectiveDamageCell.style.padding = '3px';
//
//     preDamageCell.style.border = '1px solid white';
//     postDamageCell.style.border = '1px solid white';
//     effectiveDamageCell.style.border = '1px solid white';
//
//     const preDamageMain = document.createElement('div');
//     const postDamageMain = document.createElement('div');
//     const effectiveDamageMain = document.createElement('div');
//     preDamageMain.id = `idc-battle-damage-pre-main-${i}`;
//     postDamageMain.id = `idc-battle-damage-post-main-${i}`;
//     effectiveDamageMain.id = `idc-battle-damage-effective-main-${i}`;
//     preDamageMain.innerText = '0';
//     postDamageMain.innerText = '0';
//     effectiveDamageMain.innerText = '0';
//     preDamageCell.appendChild(preDamageMain);
//     postDamageCell.appendChild(postDamageMain);
//     effectiveDamageCell.appendChild(effectiveDamageMain);
//
//     const preDamageSub = document.createElement('div');
//     const postDamageSub = document.createElement('div');
//     const effectiveDamageSub = document.createElement('div');
//     preDamageSub.id = `idc-battle-damage-pre-sub-${i}`;
//     postDamageSub.id = `idc-battle-damage-post-sub-${i}`;
//     effectiveDamageSub.id = `idc-battle-damage-effective-sub-${i}`;
//     preDamageSub.innerText = '0';
//     postDamageSub.innerText = '0';
//     effectiveDamageSub.innerText = '0';
//     preDamageCell.appendChild(preDamageSub);
//     postDamageCell.appendChild(postDamageSub);
//     effectiveDamageCell.appendChild(effectiveDamageSub);
//
//     damageRow.appendChild(preDamageCell);
//     damageRow.appendChild(postDamageCell);
//     damageRow.appendChild(effectiveDamageCell);
//
//     damageTable.appendChild(damageRow);
//   }
//
//   const totalRow = document.createElement('tr');
//   // Unused padding cells.
//   const td1 = document.createElement('td');
//   totalRow.appendChild(td1);
//   const td2 = document.createElement('td');
//   totalRow.appendChild(td2);
//   const td3 = document.createElement('td');
//   totalRow.appendChild(td3);
//   const preDamageTotal = document.createElement('td');
//   const postDamageTotal = document.createElement('td');
//   const effectiveDamage = document.createElement('td');
//   const effectiveDamageTotal = document.createElement('div');
//   const effectiveDamagePercent = document.createElement('div');
//   preDamageTotal.id = 'idc-battle-damage-pre-total';
//   postDamageTotal.id = 'idc-battle-damage-post-total';
//   effectiveDamageTotal.id = 'idc-battle-damage-effective-total';
//   effectiveDamagePercent.id = 'idc-battle-damage-effective-percent';
//   preDamageTotal.innerText = '0';
//   postDamageTotal.innerText = '0';
//   effectiveDamageTotal.innerText = '0';
//   effectiveDamagePercent.innerText = '(0%)';
//   totalRow.appendChild(preDamageTotal);
//   totalRow.appendChild(postDamageTotal);
//   effectiveDamage.appendChild(effectiveDamageTotal);
//   effectiveDamage.appendChild(effectiveDamagePercent);
//   totalRow.appendChild(effectiveDamage);
//   damageTable.appendChild(totalRow);
//   return damageTable;
// }

// createBattleElement() {
//   const el = document.createElement('div');
//   el.id = 'idc-battle-opponent';
//   el.style.width = '400px';
//   // Opponent Name.
//   const opponentName = document.createElement('div');
//   opponentName.id = 'idc-battle-opponent-name';
//   opponentName.style.fontSize = 'large';
//   opponentName.innerText = 'Battle Master Dragon Caller, Valeria';
//   el.appendChild(opponentName);
//
//   // Opponent Image.
//   const opponentImage = document.createElement('img');
//   opponentImage.id = 'idc-battle-opponent-img';
//   const enemyId = this.getActiveEnemy().id;
//   opponentImage.src = CardAssets.getCroppedPortrait(floof.model.cards[(enemyId in floof.model.cards) ? enemyId : 4800]);
//   opponentImage.style.maxWidth = '350px';
//   opponentImage.style.display = 'block';
//   opponentImage.style.marginLeft = 'auto';
//   opponentImage.style.marginRight = 'auto';
//   el.appendChild(opponentImage);
//
//   const typeEl = document.createElement('div');
//   typeEl.id = 'idc-enemy-type';
//   typeEl.style.display = 'block';
//   typeEl.style.marginLeft = 'auto';
//   typeEl.style.marginRight = 'auto';
//   typeEl.style.textAlign = 'center';
//   if (enemyId in floof.model.cards) {
//     typeEl.innerText = floof.model.cards[enemyId].types.map((t) => TypeToName[t]).join(' / ');
//   }
//   el.appendChild(typeEl);
//
//   // HP Controller
//   el.appendChild(this.createEnemyHpEl());
//
//   // Setter for various opponent values
//   el.appendChild(this.createOpponentSetter());
//
//   // Ping by ping damage.
//   el.appendChild(this.createDamageTable());
//   return el;
// }

// reloadBattleElement() {
//   // Update image.
//   let enemy = this.getActiveEnemy();
//   if (!(enemy.id in floof.model.cards)) {
//     enemy = new EnemyInstance();
//     enemy.setId(4800);
//   }
//   document.getElementById('idc-battle-opponent-name').innerText = enemy.getCard().name;
//   const opponentImage = document.getElementById('idc-battle-opponent-img');
//   opponentImage.src = CardAssets.getCroppedPortrait(floof.model.cards[enemy.id]);
//
//   const typeEl = document.getElementById('idc-enemy-type');
//   typeEl.innerText = enemy.getCard().types.map((t) => TypeToName[t]).join(' / ');
//
//   // Update HP elements.
//   const hpSlider = document.getElementById('idc-battle-opponent-hp-slider');
//   hpSlider.style.background = FontColors[enemy.getAttribute()];
//   hpSlider.max = enemy.maxHp;
//   hpSlider.value = enemy.currentHp;
//   const hpInput = document.getElementById('idc-battle-opponent-hp-input');
//   hpInput.value = enemy.currentHp;
//   const hpMax = document.getElementById('idc-battle-opponent-hp-max');
//   hpMax.innerText = numberWithCommas(enemy.maxHp);
//   const hpPercent = document.getElementById('idc-battle-opponent-hp-percent');
//   hpPercent.innerText = `${enemy.currentHp * 100 / enemy.maxHp}`.substring(0, 5) + '%';
//
//   // Update opponent setters.
//   const statusShield = document.getElementById('idc-battle-opponent-status');
//   statusShield.checked = enemy.statusShield;
//   const damageShield = document.getElementById('idc-battle-opponent-shield');
//   damageShield.value = enemy.shieldPercent;
//   const attributeInput = document.getElementById('idc-battle-opponent-attribute');
//   attributeInput.value = enemy.currentAttribute;
//   const damageAbsorbInput = document.getElementById('idc-battle-opponent-absorb-damage');
//   damageAbsorbInput.value = enemy.damageAbsorb;
//   document.getElementById('idc-battle-opponent-absorb-combo');
//   const comboAbsorbInput = document.getElementById('idc-battle-opponent-absorb-combo');
//   comboAbsorbInput.value = enemy.comboAbsorb;
//   for (let i = 0; i < 5; i++) {
//     const attributeAbsorbEl = document.getElementById(`idc-battle-opponent-absorb-attr-${i}`);
//     if (enemy.attributeAbsorb.includes(i)) {
//       attributeAbsorbEl.selected = true;
//       attributeAbsorbEl.style.border = BORDER_COLOR;
//     } else {
//       attributeAbsorbEl.selected = false;
//       attributeAbsorbEl.style.border = '';
//     }
//   }
//   const damageVoid = document.getElementById('idc-battle-opponent-void');
//   damageVoid.value = enemy.damageVoid;
//   const defBreak = document.getElementById('idc-battle-opponent-defbreak');
//   defBreak.value = enemy.ignoreDefensePercent;
//
//   const activeTeam = this.idc.getActiveTeam();
//
//   // Reload Damage Table.
//   const {pings, bonusAttacks, healing, trueBonusAttack} = this.idc.getDamagePre();
//   if (DEBUG) {
//     console.log(healing);
//     console.log(bonusAttacks);
//   }
//   if (trueBonusAttack) {
//     const bonusAttack = new DamagePing();
//     bonusAttack.amount = trueBonusAttack;
//     bonusAttack.attribute = -1;
//     bonusAttack.isActive = true;
//     bonusAttack.isSub = true;
//     bonusAttack.source = activeTeam[5];
//     pings.push(bonusAttack);
//   }
//
//   let currentHp = enemy.currentHp;
//   // TODO: Figure out this precisely.
//   const resolveActive = enemy.resolvePercent > 0 && (100 * enemy.currentHp / enemy.maxHp) > enemy.resolvePercent;
//   for (const ping of pings) {
//     ping.rawDamage = enemy.calcDamage(ping, pings, this.idc.combos, this.idc.isMultiplayer(), {
//       attributeAbsorb: this.idc.effects.ignoreAttributeAbsorb,
//       damageAbsorb: this.idc.effects.ignoreDamageAbsorb,
//       damageVoid: this.idc.effects.ignoreDamageVoid,
//     });
//     let next = currentHp - ping.rawDamage;
//     if (next < 0) { next = 0; }
//     if (next < 1 && resolveActive) {
//       next = 1;
//       ping.resolveTriggered = true;
//     }
//     if (next > enemy.maxHp) { next = enemy.maxHp; }
//     ping.actualDamage = currentHp - next;
//     currentHp = next;
//   }
//
//   if (trueBonusAttack) {
//     const bonusAttack = pings[pings.length - 1];
//     if (bonusAttack.resolveTriggered) {
//       bonusAttack.actualDamage++;
//       currentHp = 0;
//     }
//   }
//
//   for (let i = 0; i < 6; i++) {
//     // const mainColor = FontColors[activeTeam[i].getAttribute()];
//     // const subColor = FontColors[activeTeam[i].getSubattribute()] ;
//
//     const idEl = document.getElementById(`idc-battle-damage-id-${i}`);
//     idEl.innerText = activeTeam[i].id in floof.model.cards ? activeTeam[i].id : '-';
//     const boundEl = document.getElementById(`idc-battle-damage-bound-${i}`);
//     boundEl.checked = activeTeam[i].bound;
//     const attrEl = document.getElementById(`idc-battle-damage-attr-${i}`);
//     attrEl.value = String(activeTeam[i].attribute);
//
//     const preDamageMain = document.getElementById(`idc-battle-damage-pre-main-${i}`);
//     preDamageMain.innerText = '';
//     preDamageMain.style.color = FontColors[5];
//     const postDamageMain = document.getElementById(`idc-battle-damage-post-main-${i}`);
//     postDamageMain.innerText = '';
//     postDamageMain.style.color = FontColors[5];
//     const effectiveDamageMain = document.getElementById(`idc-battle-damage-effective-main-${i}`);
//     effectiveDamageMain.innerText = '';
//     effectiveDamageMain.style.color = FontColors[5];
//
//     const preDamageSub = document.getElementById(`idc-battle-damage-pre-sub-${i}`);
//     preDamageSub.innerText = '';
//     preDamageSub.style.color = FontColors[5];
//     const postDamageSub = document.getElementById(`idc-battle-damage-post-sub-${i}`);
//     postDamageSub.innerText = '';
//     postDamageSub.style.color = FontColors[5];
//     const effectiveDamageSub = document.getElementById(`idc-battle-damage-effective-sub-${i}`);
//     effectiveDamageSub.innerText = '';
//     effectiveDamageSub.style.color = FontColors[5];
//
//     for (const ping of pings.filter((ping) => ping.source == activeTeam[i])) {
//       const preDamage = ping.isSub ? preDamageSub : preDamageMain;
//       const postDamage = ping.isSub ? postDamageSub : postDamageMain;
//       const effectiveDamage = ping.isSub ? effectiveDamageSub : effectiveDamageMain;
//
//       preDamage.style.color = FontColors[ping.attribute];
//       postDamage.style.color = FontColors[ping.attribute];
//       effectiveDamage.style.color = FontColors[ping.attribute];
//
//       if (preDamage.innerText) {
//         preDamage.innerText += ' +' + numberWithCommas(ping.amount);
//         postDamage.innerText += ' +' + numberWithCommas(ping.rawDamage);
//         if (ping.actualDamage != ping.rawDamage) {
//           effectiveDamage.innerText += ' +' + (ping.actualDamage == 0 ? '0' : numberWithCommas(ping.actualDamage));
//         }
//       } else {
//         preDamage.innerText = numberWithCommas(ping.amount);
//         postDamage.innerText = numberWithCommas(ping.rawDamage);
//         if (ping.actualDamage != ping.rawDamage) {
//           effectiveDamage.innerText = (ping.actualDamage == 0 ? '0' : numberWithCommas(ping.actualDamage));
//         }
//       }
//     }
//   }
//
//   const preDamageTotal = document.getElementById('idc-battle-damage-pre-total');
//   const postDamageTotal = document.getElementById('idc-battle-damage-post-total');
//   const effectiveDamageTotal = document.getElementById('idc-battle-damage-effective-total');
//   const effectiveDamagePercent = document.getElementById('idc-battle-damage-effective-percent');
//   preDamageTotal.innerText = numberWithCommas(pings.reduce((total, ping) => total + ping.amount, 0));
//   postDamageTotal.innerText = numberWithCommas(pings.reduce((total, ping) => total + ping.rawDamage, 0));
//   effectiveDamageTotal.innerText = `${numberWithCommas(enemy.currentHp - currentHp)}`;
//   effectiveDamagePercent.innerText = `(${String((enemy.currentHp - currentHp) * 100 / enemy.maxHp).substring(0, 5)}%)`;
// }
**/

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

  addPreemptiveSkill?: boolean;
  removePreemptiveSkill?: number;

  dungeonHpMultiplier?: string;
  dungeonAtkMultiplier?: string;
  dungeonDefMultiplier?: string;

  enemyLevel?: number;
  enemyHp?: number;
  enemyAtk?: number;
  enemyDef?: number;
  resolve?: number;
  superResolve?: number;
  addAttrResist?: Attribute;
  removeAttrResist?: Attribute;
  addTypeResist?: MonsterType;
  removeTypeResist?: MonsterType;
  resistPercent?: number;
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

  constructor(monsterType: MonsterType) {
    this.setType(monsterType);
  }

  private getTypeOffsets(): { offsetX: number; offsetY: number } {
    const { offsetX, offsetY } = CardAssets.getTypeImageData(Number(this.type));
    return { offsetX, offsetY };
  }

  setType(type: MonsterType): void {
    this.type = type;
    const { offsetX, offsetY } = this.getTypeOffsets();
    this.element.style.backgroundPosition = `-${offsetX} -${offsetY}`;
  }

  getElement(): HTMLAnchorElement {
    return this.element;
  }
}

class DungeonEditor {
  element: HTMLElement = create('div');
  dungeonFloorTable: HTMLTableElement = create('table', ClassNames.DUNGEON_EDITOR_FLOORS) as HTMLTableElement;
  dungeonFloorEls: HTMLTableRowElement[] = [];
  addEnemyBtns: HTMLButtonElement[] = [];
  dungeonEnemies: MonsterIcon[][] = [];
  addFloorBtn: HTMLButtonElement = create('button', ClassNames.FLOOR_ADD) as HTMLButtonElement
  importer: HTMLTextAreaElement = create('textarea') as HTMLTextAreaElement;
  onUpdate: OnDungeonUpdate;
  monsterSelector: MonsterSelector;
  enemyPicture: MonsterIcon = new MonsterIcon(true);
  enemyLevelInput: HTMLInputElement = create('input') as HTMLInputElement;
  dungeonHpInput: HTMLInputElement = create('input') as HTMLInputElement;
  dungeonAtkInput: HTMLInputElement = create('input') as HTMLInputElement;
  dungeonDefInput: HTMLInputElement = create('input') as HTMLInputElement;
  enemyHpInput: HTMLInputElement = create('input') as HTMLInputElement;
  enemyAtkInput: HTMLInputElement = create('input') as HTMLInputElement;
  enemyDefInput: HTMLInputElement = create('input') as HTMLInputElement;
  enemyResolveInput: HTMLInputElement = create('input') as HTMLInputElement;
  enemyResistTypesInputs: Map<MonsterType, ToggleableImage> = new Map();
  enemyResistTypePercentInput: HTMLInputElement = create('input') as HTMLInputElement;
  enemyResistAttrInputs: Map<Attribute, LayeredAsset> = new Map();
  enemyResistAttrPercentInput: HTMLInputElement = create('input') as HTMLInputElement;
  activeFloorIdx = 0;
  activeEnemyIdx = 0;
  dungeonSelector: GenericSelector<number>;

  constructor(dungeonNames: { s: string; value: number }[], onUpdate: OnDungeonUpdate) {
    this.onUpdate = onUpdate;
    this.dungeonSelector = new GenericSelector<number>(dungeonNames, (id: number) => {
      this.onUpdate({ loadDungeon: id });
    });
    const selectorEl = this.dungeonSelector.getElement();
    this.dungeonSelector.selector.placeholder = 'Dungeon Search';
    selectorEl.style.padding = '6px';
    this.element.appendChild(selectorEl);

    const dungeonFloorContainer = create('div', ClassNames.FLOOR_CONTAINER) as HTMLDivElement;
    dungeonFloorContainer.appendChild(this.dungeonFloorTable);
    this.element.appendChild(dungeonFloorContainer);
    this.element.appendChild(create('br'));
    // TODO: Remove line when dungeon customization is necessary.
    superHide(this.addFloorBtn);

    this.addFloorBtn.innerText = 'Add Floor';
    this.addFloorBtn.onclick = (): void => {
      this.onUpdate({ addFloor: true });
    };
    this.element.appendChild(this.addFloorBtn);

    this.addFloor();

    this.setupDungeonMultiplierTable();

    this.monsterSelector = new MonsterSelector(prioritizedEnemySearch, ({ id }: MonsterUpdate) => {
      if (!id) {
        return;
      }
      this.onUpdate({ activeEnemyId: id });
    });

    this.element.appendChild(this.enemyPicture.getElement());
    this.element.appendChild(this.monsterSelector.getElement());

    this.setupEnemyStatTable();
  }

  private setupDungeonMultiplierTable(): void {
    const multiplierTable = create('table', ClassNames.ENEMY_STAT_TABLE) as HTMLTableElement;
    const hpRow = create('tr') as HTMLTableRowElement;
    const atkRow = create('tr') as HTMLTableRowElement;
    const defRow = create('tr') as HTMLTableRowElement;

    const hpLabel = create('td') as HTMLTableCellElement;
    const atkLabel = create('td') as HTMLTableCellElement;
    const defLabel = create('td') as HTMLTableCellElement;

    hpLabel.innerText = 'HP multiplier';
    atkLabel.innerText = 'Attack multiplier';
    defLabel.innerText = 'Defense multiplier';

    hpRow.appendChild(hpLabel);
    atkRow.appendChild(atkLabel);
    defRow.appendChild(defLabel);

    hpRow.appendChild(this.dungeonHpInput);
    atkRow.appendChild(this.dungeonAtkInput);
    defRow.appendChild(this.dungeonDefInput);

    this.dungeonHpInput.onchange = (): void => {
      this.onUpdate({ dungeonHpMultiplier: this.dungeonHpInput.value });
    };
    this.dungeonAtkInput.onchange = (): void => {
      this.onUpdate({ dungeonAtkMultiplier: this.dungeonAtkInput.value });
    };
    this.dungeonDefInput.onchange = (): void => {
      this.onUpdate({ dungeonDefMultiplier: this.dungeonDefInput.value });
    };

    multiplierTable.appendChild(hpRow);
    multiplierTable.appendChild(atkRow);
    multiplierTable.appendChild(defRow);

    this.element.appendChild(multiplierTable);
  }

  setDungeonMultipliers(hpMultText: string, atkMultText: string, defMultText: string): void {
    this.dungeonHpInput.value = hpMultText;
    this.dungeonAtkInput.value = atkMultText;
    this.dungeonDefInput.value = defMultText;
  }

  private setupEnemyStatTable(): void {
    const statTable = create('table', ClassNames.ENEMY_STAT_TABLE) as HTMLTableElement;
    const lvRow = create('tr') as HTMLTableRowElement;
    const hpRow = create('tr') as HTMLTableRowElement;
    const atkRow = create('tr') as HTMLTableRowElement;
    const defRow = create('tr') as HTMLTableRowElement;
    const resolveRow = create('tr') as HTMLTableRowElement;
    const resistTypesRow = create('tr') as HTMLTableRowElement;
    const resistTypePercentRow = create('tr') as HTMLTableRowElement;
    const resistAttrRow = create('tr') as HTMLTableRowElement;
    const resistAttrPercentRow = create('tr') as HTMLTableRowElement;

    this.enemyLevelInput.type = 'number';
    this.enemyHpInput.type = 'number';
    this.enemyAtkInput.type = 'number';
    this.enemyDefInput.type = 'number';
    this.enemyResolveInput.type = 'number';
    this.enemyResistTypePercentInput.type = 'number';
    this.enemyResistAttrPercentInput.type = 'number';

    this.enemyHpInput.disabled = true;
    this.enemyAtkInput.disabled = true;
    this.enemyDefInput.disabled = true;
    this.enemyResolveInput.disabled = true;
    this.enemyResistTypePercentInput.disabled = true;
    this.enemyResistAttrPercentInput.disabled = true;

    const lvLabel = create('td') as HTMLTableCellElement;
    const hpLabel = create('td') as HTMLTableCellElement;
    const atkLabel = create('td') as HTMLTableCellElement;
    const defLabel = create('td') as HTMLTableCellElement;
    const resolveLabel = create('td') as HTMLTableCellElement;
    const resistTypesLabel = create('td') as HTMLTableCellElement;
    const resistTypePercentLabel = create('td') as HTMLTableCellElement;
    const resistAttrLabel = create('td') as HTMLTableCellElement;
    const resistAttrPercentLabel = create('td') as HTMLTableCellElement;

    lvLabel.innerText = 'Level';
    hpLabel.innerText = 'Health';
    atkLabel.innerText = 'Attack';
    defLabel.innerText = 'Defense';
    resolveLabel.innerText = 'Resolve %';
    resistTypesLabel.innerText = 'Resist Type';
    resistTypePercentLabel.innerText = '% Resist';
    resistAttrLabel.innerText = 'Resist Attr';
    resistAttrPercentLabel.innerText = '% Resist';

    lvRow.appendChild(lvLabel);
    hpRow.appendChild(hpLabel);
    atkRow.appendChild(atkLabel);
    defRow.appendChild(defLabel);
    resolveRow.appendChild(resolveLabel);
    resistTypesRow.appendChild(resistTypesLabel);
    resistTypePercentRow.appendChild(resistTypePercentLabel);
    resistAttrRow.appendChild(resistAttrLabel);
    resistAttrPercentRow.appendChild(resistAttrPercentLabel);

    const lvCell = create('td') as HTMLTableCellElement;
    const hpCell = create('td') as HTMLTableCellElement;
    const atkCell = create('td') as HTMLTableCellElement;
    const defCell = create('td') as HTMLTableCellElement;
    const resolveCell = create('td') as HTMLTableCellElement;
    const resistTypesCell = create('td') as HTMLTableCellElement;
    const resistTypePercentCell = create('td') as HTMLTableCellElement;
    const resistAttrCell = create('td') as HTMLTableCellElement;
    const resistAttrPercentCell = create('td') as HTMLTableCellElement;

    lvCell.appendChild(this.enemyLevelInput);
    hpCell.appendChild(this.enemyHpInput);
    atkCell.appendChild(this.enemyAtkInput);
    defCell.appendChild(this.enemyDefInput);
    resolveCell.appendChild(this.enemyResolveInput);
    resistTypePercentCell.appendChild(this.enemyResistTypePercentInput);
    resistAttrPercentCell.appendChild(this.enemyResistAttrPercentInput);

    let added = 0;

    for (let i = 0; i < 16; i++) {
      if (i == 9 || i == 10 || i == 11 || i == 13) {
        continue;
      }
      added++;
      if (added == 7) {
        resistTypesCell.appendChild(create('br'));
      }
      const t = (i as unknown) as MonsterType;
      const typeImage = new MonsterTypeEl(t as MonsterType);
      const typeToggle = new ToggleableImage(
        typeImage.getElement(),
        (active: boolean) => {
          if (active) {
            this.onUpdate({ addTypeResist: t });
          } else {
            this.onUpdate({ removeTypeResist: t });
          }
        },
        false);
      this.enemyResistTypesInputs.set(t, typeToggle);
      resistTypesCell.appendChild(typeImage.getElement());
    }

    const fire = new LayeredAsset([AssetEnum.SHIELD_BASE, AssetEnum.FIRE_TRANSPARENT], (active) => {
      if (active) {
        this.onUpdate({ addAttrResist: Attribute.FIRE });
      } else {
        this.onUpdate({ removeAttrResist: Attribute.FIRE });
      }
    }, false);
    this.enemyResistAttrInputs.set(Attribute.FIRE, fire);
    resistAttrCell.appendChild(fire.getElement());
    const water = new LayeredAsset([AssetEnum.SHIELD_BASE, AssetEnum.WATER_TRANSPARENT], (active) => {
      if (active) {
        this.onUpdate({ addAttrResist: Attribute.WATER });
      } else {
        this.onUpdate({ removeAttrResist: Attribute.WATER });
      }
    }, false);
    this.enemyResistAttrInputs.set(Attribute.WATER, water);
    resistAttrCell.appendChild(water.getElement());
    const wood = new LayeredAsset([AssetEnum.SHIELD_BASE, AssetEnum.WOOD_TRANSPARENT], (active) => {
      if (active) {
        this.onUpdate({ addAttrResist: Attribute.WOOD });
      } else {
        this.onUpdate({ removeAttrResist: Attribute.WOOD });
      }
    }, false);
    this.enemyResistAttrInputs.set(Attribute.WOOD, wood);
    resistAttrCell.appendChild(wood.getElement());
    const light = new LayeredAsset([AssetEnum.SHIELD_BASE, AssetEnum.LIGHT_TRANSPARENT], (active) => {
      if (active) {
        this.onUpdate({ addAttrResist: Attribute.LIGHT });
      } else {
        this.onUpdate({ removeAttrResist: Attribute.LIGHT });
      }
    }, false);
    this.enemyResistAttrInputs.set(Attribute.LIGHT, light);
    resistAttrCell.appendChild(light.getElement());
    const dark = new LayeredAsset([AssetEnum.SHIELD_BASE, AssetEnum.DARK_TRANSPARENT], (active) => {
      if (active) {
        this.onUpdate({ addAttrResist: Attribute.DARK });
      } else {
        this.onUpdate({ removeAttrResist: Attribute.DARK });
      }
    }, false);
    this.enemyResistAttrInputs.set(Attribute.DARK, dark);
    resistAttrCell.appendChild(dark.getElement());

    lvRow.appendChild(lvCell);
    hpRow.appendChild(hpCell);
    atkRow.appendChild(atkCell);
    defRow.appendChild(defCell);
    resolveRow.appendChild(resolveCell);
    resistTypesRow.appendChild(resistTypesCell);
    resistTypePercentRow.appendChild(resistTypePercentCell);
    resistAttrRow.appendChild(resistAttrCell);
    resistAttrPercentRow.appendChild(resistAttrPercentCell);

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
    statTable.appendChild(resolveRow);
    statTable.appendChild(resistTypesRow);
    statTable.appendChild(resistTypePercentRow);
    statTable.appendChild(resistAttrRow);
    statTable.appendChild(resistAttrPercentRow);

    this.element.appendChild(statTable);
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
          el.scrollIntoView({ block: 'nearest' });
          const id = this.dungeonEnemies[i][j].id;
          this.enemyPicture.updateId(id);
          this.monsterSelector.setId(id);
        } else {
          el.className = ClassNames.ICON;
        }
      }
    }
  }

  setEnemies(enemyIdsByFloor: number[][]): void {
    console.log(enemyIdsByFloor);
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

  setEnemyStats(
    lv: number,
    hp: number,
    atk: number,
    def: number,
    resolve: number,
    typeResists: { types: MonsterType[]; percent: number },
    attrResists: { attrs: Attribute[]; percent: number },
  ): void {
    this.enemyLevelInput.value = String(lv);
    this.enemyHpInput.value = String(hp);
    this.enemyAtkInput.value = String(atk);
    this.enemyDefInput.value = String(def);
    this.enemyResolveInput.value = String(resolve);
    for (const [key, toggle] of [...this.enemyResistTypesInputs.entries()]) {
      toggle.setActive(typeResists.types.includes(key));
    }
    this.enemyResistTypePercentInput.value = String(typeResists.percent);
    for (const [key, asset] of [...this.enemyResistAttrInputs.entries()]) {
      asset.setActive(attrResists.attrs.includes(key));
    }
    this.enemyResistAttrPercentInput.value = String(attrResists.percent);
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
  tabs: TabbedComponent = new TabbedComponent(['Dungeon', 'Editor', 'Save/Load'], 'Editor');
  onUpdate: OnDungeonUpdate;

  constructor(dungeonNames: { s: string; value: number }[], onUpdate: OnDungeonUpdate) {
    this.onUpdate = onUpdate;

    this.dungeonEditor = new DungeonEditor(dungeonNames, onUpdate);
    this.battleDisplay = new BattleDisplay(onUpdate);

    this.tabs.getTab('Editor').appendChild(this.dungeonEditor.getElement());
  }

  getElement(): HTMLElement {
    return this.tabs.getElement();
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
}
