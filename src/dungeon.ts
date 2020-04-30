import {EnemyInstance, EnemyInstanceJson} from './enemy_instance';
// import {DungeonEditor} from './templates';

// function createHpEl() {
//   const hpEl = document.createElement('div');
//   hpEl.style.paddingTop = '5px';
//   hpEl.style.paddingBottom = '10px';
//   hpEl.style.paddingLeft = '5%';
//   hpEl.style.paddingRight = '5%';
//   const hpSlider = document.createElement('input');
//   hpSlider.className = 'idc-hp-slider';
//   hpSlider.type = 'range';
//   hpSlider.min = 0;
//   hpSlider.max = 1;
//   hpSlider.style.webkitAppearance = 'none';
//   hpSlider.style.width = '100%';
//   hpSlider.style.height = '5px';
//   hpSlider.style.marginBottom = '5px';
//   hpEl.appendChild(hpSlider);
//
//   const hpInput = document.createElement('input');
//   hpInput.className = 'idc-hp-input';
//   hpInput.type = 'number';
//   hpInput.style.width = '100px';
//   hpEl.appendChild(hpInput);
//
//   const divisionSpan = document.createElement('span');
//   divisionSpan.innerText = '/';
//   hpEl.appendChild(divisionSpan);
//
//   const hpMax = document.createElement('span');
//   hpMax.className = 'idc-hp-max';
//   hpMax.innerText = '1';
//   hpMax.style.marginRight = '15px';
//   hpEl.appendChild(hpMax);
//
//   const hpPercent = document.createElement('span');
//   hpPercent.className = 'idc-hp-percent';
//   hpPercent.innerText = '100%';
//   hpEl.appendChild(hpPercent);
//   return hpEl;
// }

interface DungeonFloorJson {
  enemies: EnemyInstanceJson[];
}

class DungeonFloor {
  enemies: EnemyInstance[];
  activeEnemy: number = 0;
  // dungeonEditor: DungeonEditor;
  // combinations: number[][];
  constructor() {
    this.enemies = [new EnemyInstance()];
    this.activeEnemy = 0;
  }

  deleteEnemy(idx: number): void {
    if (this.enemies.length <= 1 || !(idx in this.enemies)) {
      console.log('Unable to delete enemy from floor.');
      return;
    }
    this.enemies.splice(idx, 1);
  }

  getActiveEnemy(): EnemyInstance {
    return this.enemies[this.activeEnemy];
  }

  toJson(): DungeonFloorJson {
    return {
      enemies: this.enemies.map((enemy) => enemy.toJson()),
    };
  }

  static fromJson(json: DungeonFloorJson): DungeonFloor {
    const floor = new DungeonFloor();
    floor.enemies = json.enemies.map((enemy) => EnemyInstance.fromJson(enemy));
    return floor;
  }
}

interface DungeonInstanceJson {
  title: string;
  floors: DungeonFloorJson[];
}

class DungeonInstance {
  title: string = '';
  boardWidth: number = 6;
  fixedTime: number = 0;
  isRogue: boolean = false; // UNIMPLEMENTED
  allAttributesRequired: boolean = false;
  floors: DungeonFloor[];
  activeFloor: number = 0;

  constructor(/** idc */) {
    // this.idc = idc;
    // Sets all of your monsters to level 1 temporarily.
    this.floors = [new DungeonFloor()];
    // this.editorElement = this.createEditorElement();
  }

  addFloor(): void {
    this.floors.push(new DungeonFloor());
    this.activeFloor = this.floors.length - 1;
    // this.reloadEditorElement();
  }

  deleteFloor(idx: number): void {
    if (this.floors.length <= 1 || !(idx in this.floors)) {
      console.log('Unable to delete floor.');
      return;
    }
    this.floors.splice(idx, 1);
    if (this.activeFloor >= idx) {
      this.activeFloor = idx - 1;
    }
    // this.reloadEditorElement();
    // this.reloadBattleElement();
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

  getActiveEnemy(): EnemyInstance {
    return this.floors[this.activeFloor].getActiveEnemy();
  }

  toJson(): DungeonInstanceJson {
    return {
      title: this.title,
      floors: this.floors.map((floor) => floor.toJson()),
    };
  }

  loadJson(json: DungeonInstanceJson) {
    this.title = json.title || '';
    this.floors = json.floors.map((floor) => DungeonFloor.fromJson(floor));
    this.activeFloor = 0;
    // this.reloadEditorElement();
    // this.reloadBattleElement();
  }
}

export {
  DungeonInstance,
  DungeonInstanceJson,
};
