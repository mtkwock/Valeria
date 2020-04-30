/**
 * Rendering tools for other classes to reference.
 * These take relatively pure data and update that way.
 */

import {COLORS, DEFAULT_CARD, Awakening, Latent} from './common';
import {CardAssetInterface, CardUiAssetInterface, KnockoutVM, Card} from '../typings/ilmina';
import {fuzzyMonsterSearch, prioritizedMonsterSearch, prioritizedInheritSearch} from './fuzzy_search';

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
  element: HTMLElement;
  attributeEl: HTMLElement;
  subattributeEl: HTMLElement;
  infoTable: HTMLElement;

  constructor() {
    this.element = create('a', ClassNames.ICON);
    this.attributeEl = create('a', ClassNames.ICON_ATTR);
    this.subattributeEl = create('a', ClassNames.ICON_SUB);
    this.infoTable = create('table', ClassNames.ICON_INFO);

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
    show(this.infoTable);
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
      const fuzzyMatches = fuzzyMonsterSearch(currentText, MonsterSelector.MAX_OPTIONS, cards);
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
  el_: HTMLElement;
  inheritRow: HTMLTableRowElement;
  levelInput: HTMLInputElement;
  inheritInput: HTMLInputElement;
  maxLevel: number;
  inheritMaxLevel: number;
  maxLevelEl: Text;
  inheritMaxLevelEl: Text;
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
    this.maxLevel = 1;
    this.inheritMaxLevel = 1;
    this.el_ = create('div', ClassNames.LEVEL_EDITOR);

    const table = create('table');
    table.style.fontSize = 'small';
    const monsterLevelRow = create('tr');
    this.inheritRow = create('tr') as HTMLTableRowElement;

    const levelLabel = create('td');
    levelLabel.innerText = 'Monster';
    monsterLevelRow.appendChild(levelLabel);
    const inheritLabel = create('td');
    inheritLabel.innerText = 'Inherit';
    this.inheritRow.appendChild(inheritLabel);

    const levelCell = create('td');
    levelCell.appendChild(document.createTextNode('Lv'));
    this.levelInput = create('input', ClassNames.LEVEL_INPUT) as HTMLInputElement;
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
    this.maxLevelEl = document.createTextNode('/ 1');
    levelCell.appendChild(this.maxLevelEl);
    monsterLevelRow.appendChild(levelCell);

    const inheritCell = create('td');
    inheritCell.appendChild(document.createTextNode('Lv'));
    this.inheritInput = create('input', ClassNames.LEVEL_INPUT) as HTMLInputElement;
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
    this.inheritMaxLevelEl = document.createTextNode('/ 1');
    inheritCell.appendChild(this.inheritMaxLevelEl);
    this.inheritRow.appendChild(inheritCell);

    // this.maxLevelCell = create('td');
    // this.maxLevelCell.innerText = '/ 1';
    // monsterLevelRow.appendChild(this.maxLevelCell);
    // this.inheritMaxLevelCell = create('td');
    // this.inheritMaxLevelCell.innerText = '/ 1';
    // this.inheritRow.appendChild(this.inheritMaxLevelCell);

    // TODO: Add Max + Min level for monster and inherit.

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
  el_: HTMLElement;

  awakeningArea: HTMLDivElement;
  inheritAwakeningArea: HTMLDivElement;
  superAwakeningArea: HTMLDivElement;

  awakeningSelectors: HTMLAnchorElement[];
  superAwakeningSelectors: HTMLAnchorElement[];
  inheritDisplays: HTMLAnchorElement[];
  onUpdate: OnMonsterUpdate;

  constructor(onUpdate: OnMonsterUpdate) {
    this.el_ = create('div');
    this.el_.style.fontSize = 'small';
    this.onUpdate = onUpdate;

    this.awakeningArea = create('div') as HTMLDivElement;
    this.awakeningArea.appendChild(document.createTextNode('Awakenings'));
    this.awakeningArea.appendChild(create('br'));
    this.awakeningSelectors = [];
    for (let i = 0; i < AwakeningEditor.MAX_AWAKENINGS; i++) {
      const el = create('a', ClassNames.AWAKENING) as HTMLAnchorElement;
      el.onclick = () => {
        this.onUpdate({awakeningLevel: i});
      };
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
  private aggregatedAwakeningCounts: Map<Awakening, HTMLSpanElement> = new Map();
  private metaTabs: TabbedComponent = new TabbedComponent(['Team', 'Save/Load']);
  private detailTabs: TabbedComponent = new TabbedComponent(['Description', 'Stats', 'Battle']);

  constructor(storageDisplay: HTMLElement, monsterDivs: HTMLElement[], onSelectIdx: (idx: number) => any) {
    const teamTab = this.metaTabs.getTab('Team');

    teamTab.appendChild(this.titleEl);

    for (let i = 0; i < 3; i++) {
      this.teamDivs.push(create('div', ClassNames.TEAM_CONTAINER) as HTMLDivElement);
      for (let j = 0; j < 6; j++) {
        const d = create('div', ClassNames.MONSTER_CONTAINER);
        d.appendChild(monsterDivs[i * 6 + j]);
        d.onclick = () => onSelectIdx(i * 6 + j);
        this.monsterDivs.push(d);
        this.teamDivs[i].appendChild(d);
      }
      teamTab.appendChild(this.teamDivs[i]);
    }

    const descriptionTab = this.detailTabs.getTab('Description');
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
    totalBaseStatEl.appendChild(totalHpLabel);
    totalBaseStatEl.appendChild(this.totalHpValue);
    totalBaseStatEl.appendChild(totalRcvLabel);
    totalBaseStatEl.appendChild(this.totalRcvValue);
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
      statsByIdx[1].innerText = String(0);
      statsByIdx[2].innerText = String(stats.rcvs[i]);
      statsByIdx[3].innerText = stats.cds[i];
    }
    this.totalHpValue.innerText = String(stats.totalHp);
    this.totalRcvValue.innerText = String(stats.totalRcv);
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

class DungeonEditor {
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
  ValeriaDisplay,
  create,
  MonsterUpdate, OnMonsterUpdate,
}
