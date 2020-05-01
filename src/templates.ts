/**
 * Rendering tools for other classes to reference.
 * These take relatively pure data and update that way.
 */

import {COLORS, DEFAULT_CARD, Awakening, Latent} from './common';
import {CardAssetInterface, CardUiAssetInterface, KnockoutVM, Card} from '../typings/ilmina';
import {fuzzyMonsterSearch, prioritizedMonsterSearch, prioritizedInheritSearch, prioritizedEnemySearch} from './fuzzy_search';

declare var vm: KnockoutVM;
declare var CardAssets:CardAssetInterface;
declare var CardUiAssets:CardUiAssetInterface;

function create(tag: string, cls: string = ''): HTMLElement {
  const el = document.createElement(tag);
  if (cls) {
    el.className = cls;
  }
  return el;
}

enum ClassNames {
  ICON = 'valeria-monster-icon',
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

  TEAM_CONTAINER = 'valeria-team-container',
  MONSTER_CONTAINER = 'valeria-monster-container',
  TEAM_TITLE = 'valeria-team-title',
  TEAM_DESCRIPTION = 'valeria-team-description',

  MONSTER_SELECTOR = 'valeria-monster-selector',
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

  ENEMY_PICTURE = 'valeria-enemy-picture-container',
  DUNGEON_EDITOR_FLOORS = 'valeria-dungeon-edit-floors',

  FLOOR_NAME = 'valeria-floor-name',
  FLOOR_DELETE = 'valeria-floor-delete',
  FLOOR_ENEMIES = 'valeria-floor-enemies',
  FLOOR_ENEMY = 'valeria-floor-enemy',
  FLOOR_ENEMY_ADD = 'valeria-floor-enemy-add',
  FLOOR_ENEMY_DELETE = 'valeria-floor-delete',

  VALERIA = 'valeria',
}

enum Ids {
  COMBO_TABLE_PREFIX = 'valeria-combo-table-',
}

const TEAM_SCALING = 0.6;
// const AWAKENING_NUMBERS = '0123456789';
// const MONSTER_AWAKENING_SCALE = 0.43;

function show(el: HTMLElement) {
  el.style.visibility = 'visible';
}

function hide(el: HTMLElement) {
  el.style.visibility = 'hidden';
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

function updateAwakening(el: HTMLElement, awakening: number, scale: number, available: boolean = true): void {
  const [x, y] = getAwakeningOffsets(awakening);
  el.style.backgroundPosition = `${x * scale}px ${y * scale}px`;
  el.style.opacity = `${available ? 1 : 0}`;create('div') as HTMLDivElement
}

class MonsterIcon {
  element: HTMLElement = create('a', ClassNames.ICON);
  attributeEl: HTMLElement = create('a', ClassNames.ICON_ATTR);
  subattributeEl: HTMLElement = create('a', ClassNames.ICON_SUB);
  infoTable: HTMLElement = create('table', ClassNames.ICON_INFO);
  hideInfoTable: boolean = false;

  constructor(hideInfoTable: boolean = false) {
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
          cell.appendChild(el);
        }
        row.appendChild(cell);
      }
      this.infoTable.appendChild(row);
    }

    this.element.appendChild(this.attributeEl);
    this.attributeEl.appendChild(this.subattributeEl);
    this.element.appendChild(this.infoTable);
  }

  getElement(): HTMLElement {
    return this.element;
  }

  update(id: number, plusses: number, awakening: number,
      superAwakeningIdx: number, saAvailable: boolean, level: number) {
    if (id == -1) {
      hide(this.element);
      hide(this.attributeEl);
      hide(this.subattributeEl);
      hide(this.infoTable);
      return;
    }
    show(this.element);
    if (!this.hideInfoTable) {
      const card = vm.model.cards[id] || DEFAULT_CARD;
    }
    const card = vm.model.cards[id] || DEFAULT_CARD;

    const descriptor = CardAssets.getIconImageData(card);
    if (descriptor) {
      this.element.style.backgroundSize = `${TEAM_SCALING * descriptor.baseWidth}px ${descriptor.baseHeight * TEAM_SCALING}px`;
      this.element.style.backgroundImage = `url(${descriptor.url})`;
      this.element.style.backgroundPosition = `-${descriptor.offsetX * TEAM_SCALING}px -${descriptor.offsetY * TEAM_SCALING}`;
    }

    const attrDescriptor = CardUiAssets.getIconFrame(card.attribute, false, vm);
    if (attrDescriptor) {
      show(this.attributeEl);
      this.attributeEl.style.backgroundImage = `url(${attrDescriptor.url})`;
      this.attributeEl.style.backgroundPosition = `-${attrDescriptor.offsetX * TEAM_SCALING}px -${attrDescriptor.offsetY * TEAM_SCALING}px`;
    } else {
      hide(this.attributeEl);
    }

    const subDescriptor = CardUiAssets.getIconFrame(card.subattribute, true, vm);
    if (subDescriptor) {
      show(this.subattributeEl);
      this.subattributeEl.style.backgroundImage = `url(${subDescriptor.url})`;
      this.subattributeEl.style.backgroundPosition = `-${subDescriptor.offsetX * TEAM_SCALING}px -${subDescriptor.offsetY * TEAM_SCALING}px`;
    } else {
      hide(this.subattributeEl);
    }

    const plusEl = this.element.getElementsByClassName(ClassNames.ICON_PLUS)[0] as HTMLElement;
    plusEl.innerText = `+${plusses}`;

    const awakeningEl = this.element.getElementsByClassName(ClassNames.ICON_AWAKE)[0] as HTMLElement;
    if (awakening != 0) {
      show(awakeningEl);
      awakeningEl.innerText = `(${awakening})`;
    } else {
      hide(awakeningEl);
    }

    const superAwakeningEl = this.element.getElementsByClassName(ClassNames.ICON_SUPER)[0] as HTMLElement;
    if (superAwakeningIdx >= 0) {
      show(superAwakeningEl);
      updateAwakening(superAwakeningEl, card.superAwakenings[superAwakeningIdx], 0.5, saAvailable);
    } else {
      hide(superAwakeningEl);
    }

    const levelEl = this.element.getElementsByClassName(ClassNames.ICON_LEVEL)[0] as HTMLElement;
    levelEl.innerText = `Lv${level}`;

    const idEl = this.element.getElementsByClassName(ClassNames.ICON_ID)[0] as HTMLElement;
    idEl.innerText = `${id}`;
  }
}

class MonsterInherit {
  element: HTMLElement;
  icon: HTMLElement;
  attr: HTMLElement;
  sub: HTMLElement;
  idEl: HTMLElement;
  levelEl: HTMLElement;
  plusEl: HTMLElement;

  constructor() {
    this.element = create('table', ClassNames.INHERIT);
    const row = create('tr');

    const iconCell = create('td');
    this.icon = create('a', ClassNames.INHERIT_ICON);
    this.attr = create('a', ClassNames.INHERIT_ATTR);
    this.icon.appendChild(this.attr);
    this.sub = create('a', ClassNames.INHERIT_SUB);
    this.attr.appendChild(this.sub);
    iconCell.appendChild(this.icon);
    row.appendChild(iconCell);

    const detailCell = create('td');
    this.idEl = create('div', ClassNames.INHERIT_ID);
    detailCell.appendChild(this.idEl);
    detailCell.appendChild(create('br'));
    this.levelEl = create('div', ClassNames.INHERIT_LEVEL);
    detailCell.appendChild(this.levelEl);
    detailCell.appendChild(create('br'));
    this.plusEl = create('div', ClassNames.INHERIT_PLUS);
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

    const card = vm.model.cards[id] || DEFAULT_CARD;
    const desInherit = CardAssets.getIconImageData(card);
    if (desInherit) {
      show(this.icon);
      this.icon.style.backgroundImage = `url(${desInherit.url})`;
      this.icon.style.backgroundSize = `${desInherit.baseWidth / 2 * TEAM_SCALING}px ${desInherit.baseHeight / 2 * TEAM_SCALING}px`;
      this.icon.style.backgroundPosition = `-${desInherit.offsetX / 2 * TEAM_SCALING}px -${desInherit.offsetY / 2 * TEAM_SCALING}px`;
    } else {
      hide(this.icon);
    }
    const desAttr = CardUiAssets.getIconFrame(card.attribute, false, vm);
    if (desAttr) {
      show(this.attr);
      this.attr.style.backgroundImage = `url(${desAttr.url})`;
      this.attr.style.backgroundPosition = `-${desAttr.offsetX / 2 * TEAM_SCALING}px -${desAttr.offsetY / 2 * TEAM_SCALING}px`;
    } else {
      hide(this.attr);
    }
    const desSub = CardUiAssets.getIconFrame(card.subattribute, true, vm);
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
  el: HTMLElement;
  latentEls: HTMLElement[];

  constructor() {
    this.el = create('div', ClassNames.MONSTER_LATENTS);
    this.latentEls = [];
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
  element: HTMLElement;
  commandInput: HTMLInputElement;
  colorTables: Record<string, HTMLTableElement>;
  static maxVisibleCombos: number = 14;

  constructor() {
    this.element = create('div', ClassNames.COMBO_EDITOR);

    this.commandInput = create('input', ClassNames.COMBO_COMMAND) as HTMLInputElement;
    this.commandInput.placeholder = 'Combo Commands';
    this.element.appendChild(this.commandInput);

    this.colorTables = {};
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

  getInputElements(): Record<string, {shapeCountEl: HTMLInputElement, enhanceEl: HTMLInputElement}[]> {
    const out: Record<string, {shapeCountEl: HTMLInputElement, enhanceEl: HTMLInputElement}[]> = {};

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

  update(data: Record<string, {shapeCount: string, enhance: number}[]>) {
    for (const c in data) {
      const vals = data[c];
      for (let i = 0; i < ComboEditor.maxVisibleCombos; i++) {
        const countEl = document.getElementById(`valeria-combo-count-${c}-${i}`) as HTMLInputElement;
        const enhanceEl = document.getElementById(`valeria-combo-enhance-${c}-${i}`) as HTMLInputElement;
        if (i >= vals.length) {
          countEl.value = '';
          enhanceEl.value = '';
        } else {
          const {shapeCount, enhance} = vals[i];
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

type OnMonsterUpdate = (ctx: MonsterUpdate) => any;

class MonsterSelector {
  static MAX_OPTIONS: number = 15;
  el_: HTMLElement;
  selector: HTMLInputElement;
  optionsContainer_: HTMLElement;
  options_: HTMLElement[];
  selectedOption_: number = 0;
  activeOptions_: number = 0;
  updateCb: OnMonsterUpdate;

  constructor(cards: Card[], updateCb: OnMonsterUpdate, isInherit: boolean = false) {
    this.el_ = create('div');
    this.updateCb = updateCb;

    const selector = create('input', ClassNames.MONSTER_SELECTOR) as HTMLInputElement;
    selector.placeholder = 'Monster Search';
    selector.onkeydown = (e) => {
      this.options_[this.selectedOption_].style.border = '';
      switch (e.keyCode) {
        case 27: // Escape key
          this.selectedOption_ = 0;
          this.optionsContainer_.className = ClassNames.SELECTOR_OPTIONS_INACTIVE;
          return;
        case 13: // Enter
          this.options_[this.selectedOption_].click();
          return;
        case 38: // Up Arrow
          if (this.selectedOption_ > 0) {
            this.selectedOption_--;
          }
          this.options_[this.selectedOption_].style.border = '1px solid white';
          // this.options_[this.selectedOption_].style.border = '1px solid white';
          e.preventDefault();
          return;
        case 40: // Down Arrow
          if (this.selectedOption_ < this.activeOptions_ - 1) {
            this.selectedOption_++;
          }
          this.options_[this.selectedOption_].style.border = '1px solid white';
          e.preventDefault();
          return;
      }
      // Left and right arrows.
      if (e.keyCode != 37 && e.keyCode != 39) {
        this.selectedOption_ = 0;
      }
      this.options_[this.selectedOption_].style.border = '1px solid white';
    };
    selector.onkeyup = (e) => {
      this.options_[this.selectedOption_].style.border = '1px solid white';
      if ([27, 13, 38, 40].indexOf(e.keyCode) >= 0) {
        return;
      }
      this.optionsContainer_.className = ClassNames.SELECTOR_OPTIONS_ACTIVE;
      const currentText = selector.value.trim();
      if (currentText == '') {
        this.options_[0].setAttribute('value', '-1');
        this.optionsContainer_.style.display = 'none';
        return;
      }
      this.optionsContainer_.style.display = '';
      let fuzzyMatches = fuzzyMonsterSearch(currentText, MonsterSelector.MAX_OPTIONS * 3, cards);
      if (isInherit) {
        fuzzyMatches = fuzzyMatches.filter((match) => vm.model.cards[match].inheritanceType & 1);
      }
      for (let i = 0; i < this.options_.length; i++) {
        if (i >= fuzzyMatches.length) {
          this.options_[i].className = ClassNames.SELECTOR_OPTION_INACTIVE;
          continue;
        }
        this.options_[i].className = ClassNames.SELECTOR_OPTION_ACTIVE;
        if (fuzzyMatches[i] == -1) {
          this.options_[i].innerText = 'None';
        } else {
          this.options_[i].innerText = `${fuzzyMatches[i]} - ${vm.model.cards[fuzzyMatches[i]].name}`;
        }
        this.options_[i].setAttribute('value', String(fuzzyMatches[i]));
      }
      this.activeOptions_ = Math.min(fuzzyMatches.length, this.options_.length);
    }
    this.selector = selector;

    this.el_.appendChild(selector);

    const container = create('div', ClassNames.SELECTOR_OPTIONS_CONTAINER);
    this.optionsContainer_ = create('div', ClassNames.SELECTOR_OPTIONS_INACTIVE);
    container.appendChild(this.optionsContainer_);
    this.options_ = [];
    for (let i = 0; i < MonsterSelector.MAX_OPTIONS; i++) {
      const option = create('div', ClassNames.SELECTOR_OPTION_INACTIVE);
      option.setAttribute('value', '-1');
      option.onclick = () => {
        const id = Number(option.getAttribute('value'));
        if (!isInherit) {
          this.updateCb({id});
        } else {
          this.updateCb({inheritId: id});
        }
        selector.value = (vm.model.cards[id] || DEFAULT_CARD).name;
        this.optionsContainer_.className = ClassNames.SELECTOR_OPTIONS_INACTIVE;
      };
      this.optionsContainer_.appendChild(option);
      this.options_.push(option);
    }
    this.el_.appendChild(container);
  }

  setId(id: number) {
    this.optionsContainer_.style.display = 'none';
    if (id == -1) {
      this.selector.value = '';
    } else {
      this.selector.value = vm.model.cards[id].name;
    }
  }

  getElement(): HTMLElement {
    return this.el_;
  }
}

class LevelEditor {
  el_: HTMLElement = create('div', ClassNames.LEVEL_EDITOR);
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
      this.onUpdate({level: lv});
    };
    levelCell.appendChild(this.levelInput);
    levelCell.appendChild(this.maxLevelEl);
    monsterLevelRow.appendChild(levelCell);

    const monsterLevel1Cell = create('td') as HTMLTableCellElement;
    const monsterLevel1Button = create('button') as HTMLButtonElement;
    monsterLevel1Button.innerText = 'Lv1';
    monsterLevel1Button.onclick = () => {
      this.onUpdate({level: 1});
    };
    monsterLevel1Cell.appendChild(monsterLevel1Button);
    monsterLevelRow.appendChild(monsterLevel1Cell);

    const monsterLevelMaxCell = create('td') as HTMLTableCellElement;
    const monsterLevelMaxButton = create('button') as HTMLButtonElement;
    monsterLevelMaxButton.innerText = 'Lv MAX';
    monsterLevelMaxButton.onclick = () => {
      this.onUpdate({level: this.maxLevel});
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
      this.onUpdate({inheritLevel: lv});
    };
    inheritCell.appendChild(this.inheritInput);
    inheritCell.appendChild(this.inheritMaxLevelEl);
    this.inheritRow.appendChild(inheritCell);

    const inheritLevel1Cell = create('td') as HTMLTableCellElement;
    const inheritLevel1Button = create('button') as HTMLButtonElement;
    inheritLevel1Button.innerText = 'Lv1';
    inheritLevel1Button.onclick = () => {
      this.onUpdate({inheritLevel: 1});
    };
    inheritLevel1Cell.appendChild(inheritLevel1Button);
    this.inheritRow.appendChild(inheritLevel1Cell);

    const inheritLevelMaxCell = create('td') as HTMLTableCellElement;
    const inheritLevelMaxButton = create('button') as HTMLButtonElement;
    inheritLevelMaxButton.innerText = 'Lv MAX';
    inheritLevelMaxButton.onclick = () => {
      this.onUpdate({inheritLevel: this.inheritMaxLevel});
    };
    inheritLevelMaxCell.appendChild(inheritLevelMaxButton);
    this.inheritRow.appendChild(inheritLevelMaxCell);

    table.appendChild(monsterLevelRow);
    table.appendChild(this.inheritRow);
    this.inheritRow.style.display = 'none';

    this.el_.appendChild(table);
  }

  getElement() {
    return this.el_;
  }

  update({level, inheritLevel, maxLevel, inheritMaxLevel}: {
    level: number, maxLevel: number, inheritLevel: number, inheritMaxLevel: number}) {
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
  el_: HTMLElement;
  onUpdate: OnMonsterUpdate;
  hpEl: HTMLInputElement;
  atkEl: HTMLInputElement;
  rcvEl: HTMLInputElement;
  inheritEl: HTMLInputElement;

  constructor(onUpdate: OnMonsterUpdate) {
    this.el_ = create('div');
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
    this.el_.appendChild(maxPlusButton);

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
    this.el_.appendChild(minPlusButton);

    this.el_.appendChild(create('br'));

    this.hpEl = create('input', ClassNames.PLUS_EDITOR) as HTMLInputElement;
    this.hpEl.type = 'number';
    this.hpEl.onchange = () => {
      this.onUpdate({hpPlus: Number(this.hpEl.value)});
    };
    this.el_.appendChild(document.createTextNode('HP+ '));
    this.el_.appendChild(this.hpEl);

    this.atkEl = create('input', ClassNames.PLUS_EDITOR) as HTMLInputElement;
    this.atkEl.type = 'number';
    this.atkEl.onchange = () => {
      this.onUpdate({atkPlus: Number(this.atkEl.value)});
    };
    this.el_.appendChild(document.createTextNode('ATK+ '));
    this.el_.appendChild(this.atkEl);

    this.rcvEl = create('input', ClassNames.PLUS_EDITOR) as HTMLInputElement;
    this.rcvEl.type = 'number';
    this.rcvEl.onchange = () => {
      this.onUpdate({rcvPlus: Number(this.rcvEl.value)});
    };
    this.el_.appendChild(document.createTextNode('RCV+ '));
    this.el_.appendChild(this.rcvEl);

    this.inheritEl = create('input') as HTMLInputElement;
    this.inheritEl.type = 'checkbox';
    this.inheritEl.onclick = () => {
      this.onUpdate({inheritPlussed: this.inheritEl.checked});
    };
  }

  update(hpPlus: number, atkPlus: number, rcvPlus: number, inheritPlussed: boolean): void {
    this.hpEl.value = String(hpPlus);
    this.atkEl.value = String(atkPlus);
    this.rcvEl.value = String(rcvPlus);
    this.inheritEl.checked = inheritPlussed;
  }

  getElement(): HTMLElement {
    return this.el_;
  }
}

class AwakeningEditor {
  static MAX_AWAKENINGS = 10;
  static SCALE = 0.7;
  el_: HTMLElement = create('div');

  awakeningArea: HTMLDivElement = create('div') as HTMLDivElement;
  inheritAwakeningArea: HTMLDivElement;
  superAwakeningArea: HTMLDivElement;

  awakeningSelectors: HTMLAnchorElement[];
  superAwakeningSelectors: HTMLAnchorElement[];
  inheritDisplays: HTMLAnchorElement[];
  onUpdate: OnMonsterUpdate;

  constructor(onUpdate: OnMonsterUpdate) {
    this.el_.style.fontSize = 'small';
    this.onUpdate = onUpdate;

    this.awakeningArea.appendChild(document.createTextNode('Awakenings'));
    this.awakeningArea.appendChild(create('br'));
    this.awakeningSelectors = [];
    for (let i = 0; i < AwakeningEditor.MAX_AWAKENINGS; i++) {
      const el = create('a', ClassNames.AWAKENING) as HTMLAnchorElement;
      el.onclick = () => {
        this.onUpdate({awakeningLevel: i});
      };
      if (i > 0) {
        hide(el);
      }
      this.awakeningSelectors.push(el);
      this.awakeningArea.appendChild(el);
    }
    this.el_.appendChild(this.awakeningArea);

    this.inheritDisplays = [];
    this.inheritAwakeningArea = create('div') as HTMLDivElement;
    for (let i = 0; i < 10; i++) {
      const el = create('a', ClassNames.AWAKENING) as HTMLAnchorElement;
      el.style.cursor = 'default';
      this.inheritDisplays.push(el);
      if (i > 0) {
        hide(el);
      }
      this.inheritAwakeningArea.appendChild(el);
    }
    this.el_.appendChild(this.inheritAwakeningArea);

    this.superAwakeningSelectors = [];
    this.superAwakeningArea = create('div') as HTMLDivElement;
    this.superAwakeningArea.appendChild(document.createTextNode('Super Awakening'));
    this.superAwakeningArea.appendChild(create('br'));
    for (let i = 0; i < AwakeningEditor.MAX_AWAKENINGS; i++) {
      const el = create('a', ClassNames.AWAKENING) as HTMLAnchorElement;
      el.onclick = () => {
        this.onUpdate({superAwakeningIdx: i - 1});
      };
      if (i > 0) {
        hide(el);
      }
      this.superAwakeningSelectors.push(el);
      this.superAwakeningArea.appendChild(el);
    }
    this.el_.appendChild(this.superAwakeningArea);
  }

  getElement() {
    return this.el_;
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
  el_: HTMLDivElement;
  latentRemovers: HTMLAnchorElement[];
  latentSelectors: HTMLAnchorElement[];
  onUpdate: OnMonsterUpdate;
  currentLatents: Latent[];
  static PER_ROW = 11;

  constructor(onUpdate: OnMonsterUpdate) {
    this.el_ = create('div') as HTMLDivElement;
    this.onUpdate = onUpdate;
    this.el_.appendChild(document.createTextNode('Latents'));
    this.el_.appendChild(create('br'));

    this.latentRemovers = [];
    this.currentLatents = [];
    const removerArea = create('div');
    for (let i = 0; i < 8; i++) {
      const remover = create('a', ClassNames.AWAKENING) as HTMLAnchorElement;
      remover.style.backgroundPosition = '0px 0px';
      remover.onclick = () => {
        this.onUpdate({removeLatent: i});
      }
      this.latentRemovers.push(remover);
      removerArea.appendChild(remover);
    }
    this.el_.appendChild(removerArea);

    this.latentSelectors = [];
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
        this.onUpdate({addLatent: i});
      };
      this.latentSelectors.push(selector);
      selectorArea.appendChild(selector);
    }
    this.el_.appendChild(selectorArea);
  }

  getElement() {
    return this.el_;
  }

  update(activeLatents: Latent[], latentKillers: Latent[], maxLatents: number = 6) {
    if (!latentKillers.length) {
      this.el_.style.display = 'none';
      return;
    }
    this.el_.style.display = '';

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
      const isSuper = latent > 11;
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
  el_: HTMLElement;
  pdchu: {
    io: HTMLTextAreaElement;
    importButton: HTMLElement;
    exportButton: HTMLElement;
  }
  monsterSelector: MonsterSelector;
  inheritSelector: MonsterSelector;
  levelEditor: LevelEditor;
  plusEditor: PlusEditor;
  awakeningEditor: AwakeningEditor;
  latentEditor: LatentEditor;

  constructor(onUpdate: OnMonsterUpdate) {
    this.el_ = create('div', ClassNames.MONSTER_EDITOR);
    const pdchuArea = create('div');
    this.pdchu = {
      io: create('textarea', ClassNames.PDCHU_IO) as HTMLTextAreaElement,
      importButton: create('button'),
      exportButton: create('button'),
    };
    this.pdchu.io.placeholder = 'pdchu Import + Export';
    this.pdchu.exportButton.innerText = 'Export pdchu';
    this.pdchu.importButton.innerText = 'Import pdchu';
    pdchuArea.appendChild(this.pdchu.io);
    pdchuArea.appendChild(this.pdchu.importButton);
    pdchuArea.appendChild(this.pdchu.exportButton);
    this.el_.appendChild(pdchuArea);

    this.monsterSelector = new MonsterSelector(prioritizedMonsterSearch, onUpdate);
    this.inheritSelector = new MonsterSelector(prioritizedInheritSearch, onUpdate, true);
    this.inheritSelector.selector.placeholder = 'Inherit Search';

    this.el_.appendChild(this.monsterSelector.getElement());
    this.el_.appendChild(this.inheritSelector.getElement());

    this.levelEditor = new LevelEditor(onUpdate);
    this.el_.appendChild(this.levelEditor.getElement());

    this.plusEditor = new PlusEditor(onUpdate);
    this.el_.appendChild(this.plusEditor.getElement());

    this.awakeningEditor = new AwakeningEditor(onUpdate);
    this.el_.appendChild(this.awakeningEditor.getElement());

    this.latentEditor = new LatentEditor(onUpdate);
    this.el_.appendChild(this.latentEditor.getElement());
  }

  update(ctx: MonsterUpdateAll) {
    this.monsterSelector.setId(ctx.id);
    this.inheritSelector.setId(ctx.inheritId);
    let maxLevel = 1;
    if (ctx.id in vm.model.cards) {
      maxLevel = vm.model.cards[ctx.id].isLimitBreakable ? 110 : vm.model.cards[ctx.id].maxLevel;
    }
    let inheritMaxLevel = 1;
    if (ctx.inheritId in vm.model.cards) {
      inheritMaxLevel = vm.model.cards[ctx.inheritId].isLimitBreakable ? 110 : vm.model.cards[ctx.id].maxLevel;
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
    if (ctx.id in vm.model.cards) {
      awakenings = vm.model.cards[ctx.id].awakenings;
      superAwakenings = vm.model.cards[ctx.id].superAwakenings;
    }
    if (ctx.inheritId in vm.model.cards) {
      inheritAwakenings = vm.model.cards[ctx.inheritId].awakenings;
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
    if (ctx.id in vm.model.cards) {
      latentKillers = vm.model.cards[ctx.id].latentKillers;
    }
    this.latentEditor.update(
      ctx.latents,
      latentKillers,
      vm.model.cards[ctx.id].inheritanceType & 32 ? 8 : 6,
    );
  }

  getElement(): HTMLElement {
    return this.el_;
  }
}

class StoredTeamDisplay {
  element_: HTMLElement;
  saveTeamEl: HTMLElement;
  loadTable_: HTMLTableElement;
  teamRows_: HTMLTableRowElement[];
  loadFn: (name: string) => any;
  deleteFn: (name: string) => any;

  constructor(saveFn: () => any, loadFn: (name: string) => any, deleteFn: (name: string) => any) {
    this.element_ = create('div', ClassNames.TEAM_STORAGE);
    this.saveTeamEl = create('div', ClassNames.TEAM_STORAGE_SAVE);
    this.saveTeamEl.innerText = 'Save Team';
    this.saveTeamEl.onclick = saveFn;
    this.element_.appendChild(this.saveTeamEl);
    this.loadTable_ = create('table', ClassNames.TEAM_STORAGE_LOAD_AREA) as HTMLTableElement;
    this.element_.appendChild(this.loadTable_);
    this.teamRows_ = [];
    this.loadFn = loadFn;
    this.deleteFn = deleteFn;
  }

  getElement() {
    return this.element_;
  }

  update(names: string[]): void {
    for (let i = 0; i < Math.max(names.length, this.teamRows_.length); i++) {
      if (i >= names.length) {
        this.teamRows_[i].className = ClassNames.TEAM_STORAGE_LOAD_INACTIVE;
        continue;
      } else if (i >= this.teamRows_.length) {
        const newRow = create('tr', ClassNames.TEAM_STORAGE_LOAD_ACTIVE) as HTMLTableRowElement;
        const newLoad = create('td');
        newLoad.onclick = () => this.loadFn(newLoad.innerText);
        newRow.appendChild(newLoad);
        const newDelete = create('td');
        newDelete.innerText = 'x';
        newDelete.onclick = () => this.deleteFn(newLoad.innerText);
        newRow.appendChild(newDelete);
        this.loadTable_.appendChild(newRow);
        this.teamRows_.push(newRow);
      }
      this.teamRows_[i].className = ClassNames.TEAM_STORAGE_LOAD_ACTIVE;
      const loadCell = this.teamRows_[i].firstElementChild as HTMLTableCellElement;
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

class TeamPane {
  element_: HTMLElement = create('div');
  teamDivs: HTMLDivElement[] = [];
  monsterDivs: HTMLElement[] =  [];
  titleEl: HTMLInputElement = create('input', ClassNames.TEAM_TITLE) as HTMLInputElement;
  descriptionEl: HTMLTextAreaElement = create('textarea', ClassNames.TEAM_DESCRIPTION) as HTMLTextAreaElement;
  statsEl: HTMLDivElement = create('div') as HTMLDivElement;
  statsByIdxByIdx: HTMLTableCellElement[][] = [];
  private totalHpValue: HTMLSpanElement = create('span') as HTMLSpanElement;
  private totalRcvValue: HTMLSpanElement = create('span') as HTMLSpanElement;
  private totalTimeValue: HTMLSpanElement = create('span') as HTMLSpanElement;
  private aggregatedAwakeningCounts: Map<Awakening, HTMLSpanElement> = new Map();
  private metaTabs: TabbedComponent = new TabbedComponent(['Team', 'Save/Load']);
  private detailTabs: TabbedComponent = new TabbedComponent(['Description', 'Stats', 'Battle']);

  constructor(
      storageDisplay: HTMLElement,
      monsterDivs: HTMLElement[],
      onSelectIdx: (idx: number) => any,
      onSelectTeamIdx: (idx: number) => any) {
    const teamTab = this.metaTabs.getTab('Team');

    teamTab.appendChild(this.titleEl);

    for (let i = 0; i < 3; i++) {
      this.teamDivs.push(create('div', ClassNames.TEAM_CONTAINER) as HTMLDivElement);
      for (let j = 0; j < 6; j++) {
        const d = create('div', ClassNames.MONSTER_CONTAINER);
        d.appendChild(monsterDivs[i * 6 + j]);
        d.onclick = () => {
          onSelectIdx(i * 6 + j);
          onSelectTeamIdx(i);
        };
        this.monsterDivs.push(d);
        this.teamDivs[i].appendChild(d);
      }
      teamTab.appendChild(this.teamDivs[i]);
    }

    const descriptionTab = this.detailTabs.getTab('Description');
    this.descriptionEl.spellcheck = false;
    descriptionTab.appendChild(this.descriptionEl);

    const statsTab = this.detailTabs.getTab('Stats');
    this.populateStats();
    statsTab.appendChild(this.statsEl);

    teamTab.appendChild(this.detailTabs.getElement());

    this.metaTabs.getTab('Save/Load').appendChild(storageDisplay);

    this.element_.appendChild(this.metaTabs.getElement());
  }

  private populateStats() {
    const statsTable = create('table', ClassNames.STAT_TABLE) as HTMLTableElement;
    const baseStatRow = create('tr') as HTMLTableRowElement;
    for (let i = 0; i < 6; i++) {
      const statCell = create('td') as HTMLTableCellElement;
      const statContainer = create('div') as HTMLDivElement;
      const miniStatTable = create('table') as HTMLTableElement;
      const hpRow = create('tr') as HTMLTableRowElement;
      const atkRow = create('tr') as HTMLTableRowElement;
      const rcvRow = create('tr') as HTMLTableRowElement;
      const cdRow = create('tr') as HTMLTableRowElement;
      if (i == 0) {
        const hpLabel = create('td', ClassNames.STAT_LABEL) as HTMLTableCellElement;
        const atkLabel = create('td', ClassNames.STAT_LABEL) as HTMLTableCellElement;
        const rcvLabel = create('td', ClassNames.STAT_LABEL) as HTMLTableCellElement;
        const cdLabel = create('td', ClassNames.STAT_LABEL) as HTMLTableCellElement;
        hpLabel.innerText = 'HP:';
        atkLabel.innerText = 'ATK:';
        rcvLabel.innerText = 'RCV:';
        cdLabel.innerText = 'CD:';
        hpRow.appendChild(hpLabel);
        atkRow.appendChild(atkLabel);
        rcvRow.appendChild(rcvLabel);
        cdRow.appendChild(cdLabel);
      }
      const hpValue = create('td', ClassNames.STAT_VALUE) as HTMLTableCellElement;
      const atkValue = create('td', ClassNames.STAT_VALUE) as HTMLTableCellElement;
      const rcvValue = create('td', ClassNames.STAT_VALUE) as HTMLTableCellElement;
      const cdValue = create('td', ClassNames.STAT_VALUE) as HTMLTableCellElement;
      this.statsByIdxByIdx.push([hpValue, atkValue, rcvValue, cdValue]);
      hpRow.appendChild(hpValue);
      atkRow.appendChild(atkValue);
      rcvRow.appendChild(rcvValue);
      cdRow.appendChild(cdValue);
      miniStatTable.appendChild(hpRow);
      miniStatTable.appendChild(atkRow);
      miniStatTable.appendChild(rcvRow);
      miniStatTable.appendChild(cdRow);

      statContainer.appendChild(miniStatTable);
      statCell.appendChild(statContainer);
      baseStatRow.appendChild(statCell);
    }
    statsTable.appendChild(baseStatRow);
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
      Awakening.SKILL_BOOST,
      Awakening.TIME,
      Awakening.SOLOBOOST,
      Awakening.BONUS_ATTACK,
      Awakening.BONUS_ATTACK_SUPER,
      Awakening.SBR,
      Awakening.RESIST_POISON,
      Awakening.RESIST_BLIND,
      Awakening.RESIST_JAMMER,
      Awakening.RESIST_CLOUD,
      Awakening.RESIST_TAPE,
      Awakening.OE_FIRE,
      Awakening.OE_WOOD,
      Awakening.OE_WOOD,
      Awakening.OE_LIGHT,
      Awakening.OE_DARK,
      Awakening.OE_HEART,
    ];
    for (const awakening of awakeningsToDisplay) {
      const container = create('span') as HTMLSpanElement;
      const awakeningIcon = create('span', ClassNames.AWAKENING) as HTMLSpanElement;
      const [x, y] = getAwakeningOffsets(awakening);
      awakeningIcon.style.backgroundPosition = `${AwakeningEditor.SCALE * x}px ${AwakeningEditor.SCALE * y}px`;

      container.appendChild(awakeningIcon);
      const aggregatedAwakeningCount = create('span') as HTMLSpanElement;
      aggregatedAwakeningCount.innerText = 'x0';
      this.aggregatedAwakeningCounts.set(awakening, aggregatedAwakeningCount);
      container.appendChild(aggregatedAwakeningCount);
      this.statsEl.appendChild(container);
    }
  }

  // TODO
  update(playerMode: number, title: string, description: string) {
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

  updateStats(stats: Stats) {
    for (let i = 0; i < 6; i++) {
      const statsByIdx = this.statsByIdxByIdx[i];
      statsByIdx[0].innerText = stats.hps[i] ? String(stats.hps[i]) : '';
      statsByIdx[1].innerText = String(stats.atks[i]);
      statsByIdx[2].innerText = String(stats.rcvs[i]);
      statsByIdx[3].innerText = stats.cds[i];
    }
    this.totalHpValue.innerText = String(stats.totalHp);
    this.totalRcvValue.innerText = String(stats.totalRcv);
    this.totalTimeValue.innerText = `${stats.totalTime}s`;
    for (const awakening of this.aggregatedAwakeningCounts.keys()) {
      const val = this.aggregatedAwakeningCounts.get(awakening)
      if (val) {
        val.innerText = `x${stats.counts.get(awakening) || 0}`;
      }
    }
  }
}


interface DungeonFloorUpdate {
  addEnemy?: boolean;
  deleteEnemy?: number;
  activeEnemy?: number;
  deleteFloor?: number;
}

class DungeonFloorRow {
  private readonly el: HTMLTableRowElement;
  floorNumber: number;
  onUpdate: (ctx: DungeonFloorUpdate) => any;
  enemiesTable: HTMLTableElement;
  floorNameContainer: HTMLDivElement;
  enemyRows: HTMLTableRowElement[];
  activeEnemy: number = 0;

  constructor(floorNumber: number, onUpdate: (ctx: DungeonFloorUpdate) => any) {
    this.floorNumber = floorNumber;
    this.el = create('tr') as HTMLTableRowElement;
    this.onUpdate = onUpdate;
    const floorCell = create('td');
    this.floorNameContainer = create('div', ClassNames.FLOOR_NAME) as HTMLDivElement;
    //   floorName.style.minWidth = '25px';
    this.floorNameContainer.innerText = `F${floorNumber}`;
    floorCell.appendChild(this.floorNameContainer);
    const addMonsterDiv = create('div', ClassNames.FLOOR_ENEMY_ADD);
    //   addMonster.className = 'idc-dungeon-floor-add-enemy';
    //   addMonster.style.cursor = 'pointer';
    //   addMonster.onmouseover = () => {
    //     addMonster.style.border = BORDER_COLOR;
    //   };
    //   addMonster.onmouseleave = () => {
    //     addMonster.style.border = '';
    //   };
    addMonsterDiv.innerText = '[+]';
    addMonsterDiv.onclick = () => {
      this.onUpdate({addEnemy: true});
      //   addMonster.onclick = () => {
      //     this.enemies.length += 1;
      //     this.activeEnemy = this.enemies.length - 1;
      //     this.enemies[this.activeEnemy] = new EnemyInstance();
      //   }
    };
    floorCell.appendChild(addMonsterDiv);
    this.el.appendChild(floorCell);

    const enemies = create('td') as HTMLTableCellElement;
    this.enemiesTable = create('table', ClassNames.FLOOR_ENEMIES) as HTMLTableElement;
    enemies.appendChild(this.enemiesTable);
    const firstRow = this.createEnemyRow(0);
    this.enemyRows = [firstRow];
    this.enemiesTable.appendChild(firstRow);
    this.el.appendChild(enemies);
    // enemiesTable.className = 'idc-dungeon-floor-enemies';
    //   enemiesTable.style.fontSize = 'x-small';

    const deleteEl = create('td', ClassNames.FLOOR_DELETE);
    //     deleteEl.className = 'idc-dungeon-floor-delete';
    //     deleteEl.style.cursor = 'pointer';
    if (floorNumber != 0) {
      deleteEl.innerText = '[-]';
    }
    deleteEl.onclick = () => {
      this.onUpdate({deleteFloor: this.floorNumber});
    }
    this.el.appendChild(deleteEl);
  }

  createEnemyRow(idx: number, name: string = 'UNSET'): HTMLTableRowElement {
    const row = create('tr', ClassNames.FLOOR_ENEMY) as HTMLTableRowElement;
    //     enemyRow.className = 'idc-dungeon-floor-enemy';
    const deleteCell = create('td', ClassNames.FLOOR_ENEMY_DELETE) as HTMLTableCellElement;
    //       deleteCell.style.cursor = 'pointer';
    deleteCell.innerText = '[-]';
    deleteCell.onclick = () => {
      this.onUpdate({deleteEnemy: idx});
    };
    row.appendChild(deleteCell);
    const enemyCell = create('td') as HTMLTableCellElement;
    enemyCell.innerText = name;
    enemyCell.onclick = () => {
      this.onUpdate({activeEnemy: idx});
    }
    row.appendChild(enemyCell);
    return row;
  }

  update(floorNumber: number, enemyNames: string[], activeEnemy: number) {
    this.floorNumber = floorNumber;
    this.activeEnemy = activeEnemy;
    this.floorNameContainer.innerText = `F${floorNumber}`;

    for (let i = 0; i < enemyNames.length; i++) {
      if (i >= this.enemyRows.length) {
        this.enemyRows.push(this.createEnemyRow(i, enemyNames[i]));
        this.enemiesTable.appendChild(this.enemyRows[i]);
      } else {
        this.enemyRows[i].cells[1].innerText = enemyNames[i];
        this.enemyRows[i].style.display = '';
      }
      if (i == activeEnemy) {
        // TODO: Cleanup?
        this.enemyRows[i].style.border = '1px solid white';
      }
    }
    // Hide extraneous ones.
    for (let i = enemyNames.length; i < this.enemyRows.length; i++) {
      this.enemyRows[i].style.display = 'none';
    }
  }

  getElement(): HTMLTableRowElement {
    return this.el;
  }
}

// createEnemySelector() {
//   const maxResults = 15;
//   const enemySelection = document.createElement('div');
//   const enemySelector = document.createElement('input');
//   enemySelector.style.width = '100%';
//   enemySelector.placeholder = 'Monster Search';
//   const options = document.createElement('div');
//   options.display = 'none';
//   for (let i = 0; i < maxResults; i++) {
//     const option = document.createElement('div');
//     option.id = `idc-enemy-select-option-${i}`;
//     option.value = '0';
//     option.style.display = 'none';
//     options.style.fontSize = 'x-small';
//     option.onmouseover = () => {
//       option.style.border = BORDER_COLOR;
//     }
//     option.onmouseleave = () => {
//       option.style.border = '';
//     }
//     option.onclick = () => {
//       options.style.display = 'none';
//       let value = Number(option.value);
//       enemySelector.value = value;
//       const enemy = this.getActiveEnemy();
//       enemy.setId(enemySelector.value);
//       if (value in vm.model.cards) {
//         const card = vm.model.cards[value];
//         // Hopefully good defaults.  May change!
//         enemy.maxHp = card.unknownData[7];
//         enemy.attack = card.unknownData[10];
//         enemy.defense = card.unknownData[13];
//       }
//       enemy.reset();
//       this.reloadEditorElement();
//       this.reloadBattleElement();
//     }
//     options.appendChild(option);
//   }
//   enemySelector.id = 'idc-selector-enemy';
//   enemySelector.onkeyup = (e) => {
//     if (e.keyCode == 13) {
//       let value = Number(document.getElementById(`idc-enemy-select-option-0`).value);
//       const enemy = this.getActiveEnemy();
//       enemy.setId(value);
//       if (value in vm.model.cards) {
//         const card = vm.model.cards[value];
//         // Hopefully good defaults.  May change!
//         enemy.maxHp = card.unknownData[7];
//         enemy.attack = card.unknownData[10];
//         enemy.defense = card.unknownData[13];
//       }
//       options.style.display = 'none';
//       enemy.reset();
//       this.reloadEditorElement();
//       this.reloadBattleElement();
//       return;
//     }
//     const currentText = e.target.value.toLowerCase();
//     if (currentText == '') {
//       options.style.display = 'none';
//       return;
//     }
//     options.style.display = 'block';
//     const fuzzyMatches = fuzzyMonsterSearch(currentText, maxResults, prioritizedEnemySearch);
//     for (let i = 0; i < fuzzyMatches.length && i < maxResults; i++) {
//       const option = document.getElementById(`idc-enemy-select-option-${i}`);
//       const key = fuzzyMatches[i];
//       option.innerText = `${key} - ${vm.model.cards[key].name}`;
//       option.value = key;
//       option.style.display = 'block';
//     }
//     for (let i = fuzzyMatches.length; i < maxResults; i++) {
//       const option = document.getElementById(`idc-enemy-select-option-${i}`);
//       option.style.display = 'none';
//     }
//   }
//   enemySelection.onblur = () => {
//     options.style.display = 'none';
//   }
//   enemySelection.appendChild(enemySelector);
//   enemySelection.appendChild(document.createElement('br'));
//   enemySelection.appendChild(options);
//   return enemySelection;
// }

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

// createEditorElement() {
//   const dungeonContainer = document.createElement('div');
//   dungeonContainer.id = 'idc-dungeon-editor';
//   dungeonContainer.style.padding = '5px';
//
//   const ioArea = document.createElement('textarea');
//   ioArea.style.height = '30px';
//   ioArea.style.width = '100%';
//   ioArea.onclick = () => {
//     ioArea.select();
//   };
//   dungeonContainer.appendChild(ioArea);
//   dungeonContainer.appendChild(document.createElement('br'));
//
//   const exportButton = document.createElement('button');
//   exportButton.innerText = 'Export Dungeon';
//   exportButton.onclick = () => {
//     ioArea.value = JSON.stringify(this.toJson());
//     ioArea.select();
//   };
//   const importButton = document.createElement('button');
//   importButton.innerText = 'Import Dungeon';
//   importButton.onclick = () => {
//     const json = JSON.parse(ioArea.value);
//     this.loadJson(json);
//     this.reloadEditorElement();
//     this.reloadBattleElement();
//   };
//   dungeonContainer.appendChild(exportButton);
//   dungeonContainer.appendChild(importButton);
//
//   const titleSetter = document.createElement('input');
//   titleSetter.placeholder = 'Dungeon Name';
//   titleSetter.id = 'idc-dungeon-editor-title'
//   titleSetter.style.width = '100%';
//   titleSetter.onkeyup = () => {
//     this.title = titleSetter.value;
//   };
//   dungeonContainer.appendChild(titleSetter);
//
//   const floorsEditor = document.createElement('table');
//   floorsEditor.id = 'idc-dungeon-editor-floors'
//   floorsEditor.style.fontSize = 'small';
//   for (let i = 0; i < this.floors.length; i++) {
//     const floorEditor = this.floors[i].createEditorElement(i, i == this.activeFloor);
//     floorEditor.onclick = () => {
//       // this.getActiveEnemy().reset();
//       this.activeFloor = i;
//       this.getActiveEnemy().reset();
//       this.reloadEditorElement();
//       this.reloadBattleElement();
//     }
//     const floorDelete = floorEditor.getElementsByClassName('idc-dungeon-floor-delete')[0];
//     if (floorDelete) {
//       floorDelete.onclick = () => {
//         this.deleteFloor(i, idc);
//       }
//     }
//
//     floorsEditor.appendChild(floorEditor);
//   }
//   dungeonContainer.appendChild(floorsEditor);
//
//   const floorAdder = document.createElement('div');
//   floorAdder.id = 'idc-dungeon-editor-addfloor';
//   floorAdder.style.cursor = 'pointer';
//   floorAdder.innerText = 'Add Floor';
//   floorAdder.onclick = () => {
//     this.addFloor();
//   };
//   floorAdder.onmouseover = () => {
//     floorAdder.style.border = BORDER_COLOR;
//   };
//   floorAdder.onmouseleave = () => {
//     floorAdder.style.border = '';
//   };
//   dungeonContainer.appendChild(floorAdder);
//
//   dungeonContainer.appendChild(this.createEnemyEditor());
//
//   return dungeonContainer;
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
//   opponentImage.src = CardAssets.getCroppedPortrait(vm.model.cards[(enemyId in vm.model.cards) ? enemyId : 4800]);
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
//   if (enemyId in vm.model.cards) {
//     typeEl.innerText = vm.model.cards[enemyId].types.map((t) => TypeToName[t]).join(' / ');
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
//   if (!(enemy.id in vm.model.cards)) {
//     enemy = new EnemyInstance();
//     enemy.setId(4800);
//   }
//   document.getElementById('idc-battle-opponent-name').innerText = enemy.getCard().name;
//   const opponentImage = document.getElementById('idc-battle-opponent-img');
//   opponentImage.src = CardAssets.getCroppedPortrait(vm.model.cards[enemy.id]);
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
//     idEl.innerText = activeTeam[i].id in vm.model.cards ? activeTeam[i].id : '-';
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

interface DungeonUpdate {
  // Dungeon Editor updates
  activeFloor?: number, // Set active floor index.
  addFloor?: boolean,
  removeFloor?: number,

  activeEnemy?: number, // Set active enemy index of active floor.
  activeEnemyId?: number,
  addEnemy?: boolean,
  removeEnemy?: number,

  addPreemptiveSkill?: boolean,
  removePreemptiveSkill?: number,

  resolve?: number,
  superResolve?: number,
  attributeResists?: number[],
  resistPercent?: number,
}

type OnDungeonUpdate = (ctx: DungeonUpdate) => any;

class DungeonEditor {
  element: HTMLElement = create('div');
  dungeonFloorTable: HTMLTableElement = create('table', ClassNames.DUNGEON_EDITOR_FLOORS) as HTMLTableElement;
  dungeonFloorEls: HTMLTableRowElement[] = [];
  dungeonEnemies: MonsterIcon[][] = [];
  importer: HTMLTextAreaElement = create('textarea') as HTMLTextAreaElement;
  onUpdate: OnDungeonUpdate;
  monsterSelector: MonsterSelector;
  enemyPictureContainer: HTMLDivElement = create('div', ClassNames.ENEMY_PICTURE) as HTMLDivElement;
  enemyPicture: HTMLImageElement = create('img') as HTMLImageElement;

  addFloor(): void {
    const floor = create('tr') as HTMLTableRowElement;
    this.dungeonFloorEls.push(floor);
    const label = create('td') as HTMLTableCellElement;
    const floorName = create('span') as HTMLDivElement;
    floorName.innerText = `F${this.dungeonFloorEls.length}`;
    label.appendChild(floorName);
    floor.appendChild(label);

    const firstEnemy = new MonsterIcon(true);
    firstEnemy.update(4014, 0, 0, -1, false, 0);

    this.dungeonEnemies.push([firstEnemy]);

    const enemies = create('td') as HTMLTableCellElement;
    enemies.appendChild(firstEnemy.getElement());

    floor.appendChild(enemies);
    this.dungeonFloorTable.appendChild(floor);
  }

  constructor(onUpdate: OnDungeonUpdate) {
    this.element.appendChild(document.createTextNode('Dungeon Editor Area Placeholder'));
    this.onUpdate = onUpdate;

    this.element.appendChild(this.dungeonFloorTable)

    this.addFloor();

    this.monsterSelector = new MonsterSelector(prioritizedEnemySearch, ({id}: MonsterUpdate) => {
      if (!id) {
        return;
      }
      this.onUpdate({activeEnemyId: id});
      this.enemyPicture.src = CardAssets.getCroppedPortrait(vm.model.cards[id]);
    });
    this.element.appendChild(this.monsterSelector.getElement());
    this.enemyPictureContainer.appendChild(this.enemyPicture);
    this.element.appendChild(this.enemyPictureContainer);
  }

  getElement(): HTMLElement {
    return this.element;
  }
}

class DungeonDisplay {
  enemyPicture: HTMLElement = create('img');
  enemySelectors: MonsterIcon[][] = [];
  onUpdate: OnDungeonUpdate;

  constructor(onUpdate: OnDungeonUpdate) {
    this.onUpdate = onUpdate;
  }
}

class DungeonPane {
  dungeonEditor: DungeonEditor;
  tabs: TabbedComponent = new TabbedComponent(['Dungeon', 'Editor', 'Save/Load']);
  onUpdate: OnDungeonUpdate;

  constructor(onUpdate: OnDungeonUpdate) {
    this.onUpdate = onUpdate;

    this.dungeonEditor = new DungeonEditor(onUpdate);

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

  getElement() {
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
  Stats, TeamPane,
  DungeonEditor,
  DungeonPane,
  DungeonUpdate, OnDungeonUpdate,
  ValeriaDisplay,
  create,
  MonsterUpdate, OnMonsterUpdate,
}
