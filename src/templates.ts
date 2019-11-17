/**
 * Rendering tools for other classes to reference.
 * These take relatively pure data and update that way.
 */

import {COLORS, DEFAULT_CARD, Latent} from './common';
import {CardAssetInterface, CardUiAssetInterface, KnockoutVM, Card} from '../typings/ilmina';
import {fuzzyMonsterSearch, prioritizedMonsterSearch, prioritizedInheritSearch} from './fuzzy_search';

declare var vm: KnockoutVM;
declare var CardAssets:CardAssetInterface;
declare var CardUiAssets:CardUiAssetInterface;

function create(tag: string, cls: string = ''): HTMLElement {
  const el = document.createElement(tag);
  el.className = cls;
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

  MONSTER_SELECTOR = 'valeria-monster-selector',
  SELECTOR_OPTIONS_CONTAINER = 'valeria-monster-selector-options-container',
  SELECTOR_OPTIONS_INACTIVE = 'valeria-monster-selector-options-inactive',
  SELECTOR_OPTIONS_ACTIVE = 'valeria-monster-selector-options-active',
  SELECTOR_OPTION_INACTIVE = 'valeria-monster-selector-option-inactive',
  SELECTOR_OPTION_ACTIVE = 'valeria-monster-selector-option-active',

  MONSTER_EDITOR = 'valeria-monster-editor',

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
  el.style.opacity = `${available ? 1 : 0}`;
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
      hide(this.attr);
      hide(this.sub);
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

class MonsterSelector {
  static MAX_OPTIONS: number = 15;
  el_: HTMLElement;
  optionsContainer_: HTMLElement;
  options_: HTMLElement[];
  selectedOption_: number = 0;
  activeOptions_: number = 0;

  constructor(cards: Card[], onSelect: (id: number) => any) {
    this.el_ = create('div');

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
          e.preventDefault();
          return;
        case 40: // Down Arrow
          if (this.selectedOption_ < this.activeOptions_ - 1) {
            this.selectedOption_++;
            this.options_[this.selectedOption_].style.border = '1px solid white';
          }
          e.preventDefault();
          return;
      }
      this.selectedOption_ = 0;
      this.options_[this.selectedOption_].style.border = '1px solid white';
    };
    selector.onkeyup = (e) => {
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
        this.options_[i].innerText = `${fuzzyMatches[i]} - ${vm.model.cards[fuzzyMatches[i]].name}`;
        this.options_[i].setAttribute('value', String(fuzzyMatches[i]));
      }
      this.activeOptions_ = Math.min(fuzzyMatches.length, this.options_.length);
    }

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
        onSelect(id);
        selector.value = (vm.model.cards[id] || DEFAULT_CARD).name;
        this.optionsContainer_.className = ClassNames.SELECTOR_OPTIONS_INACTIVE;
      };
      this.optionsContainer_.appendChild(option);
      this.options_.push(option);
    }
    this.el_.appendChild(container);
  }

  getElement(): HTMLElement {
    return this.el_;
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

  constructor() {
    this.el_ = create('div', ClassNames.MONSTER_EDITOR);
    const pdchuArea = create('div');
    this.pdchu = {
      io: create('textarea') as HTMLTextAreaElement,
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

    this.monsterSelector = new MonsterSelector(prioritizedMonsterSearch, console.log);
    this.inheritSelector = new MonsterSelector(prioritizedMonsterSearch, console.log);

    this.el_.appendChild(this.monsterSelector.getElement());
    this.el_.appendChild(this.inheritSelector.getElement());
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

class TeamPane {
  element_: HTMLElement;
  teamDivs: HTMLElement[];
  titleEl: HTMLInputElement;
  descriptionEl: HTMLTextAreaElement;
  metaTabs_: TabbedComponent;
  detailTabs_: TabbedComponent;

  constructor(storageDisplay: HTMLElement) {
    this.element_ = create('div');
    this.metaTabs_ = new TabbedComponent(['Team', 'Save/Load']);
    const teamTab = this.metaTabs_.getTab('Team');

    this.titleEl = create('input') as HTMLInputElement;
    teamTab.appendChild(this.titleEl);

    this.teamDivs = [];
    for (let i = 0; i < 3; i++) {
      this.teamDivs.push(create('div'));
      teamTab.appendChild(this.teamDivs[i]);
    }

    this.detailTabs_ = new TabbedComponent(['Description', 'Stats', 'Battle']);
    const descriptionTab = this.detailTabs_.getTab('Description');
    this.descriptionEl = create('textarea') as HTMLTextAreaElement;
    descriptionTab.appendChild(this.descriptionEl);

    teamTab.appendChild(this.detailTabs_.getElement());

    this.metaTabs_.getTab('Save/Load').appendChild(storageDisplay);

    this.element_.appendChild(this.metaTabs_.getElement());
  }

  // TODO
  update() {}

  getElement(): HTMLElement {
    return this.element_;
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
  TeamPane,
  ValeriaDisplay,
  create,
}
