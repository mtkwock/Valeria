import {EnemyInstance, EnemyInstanceJson} from './enemy_instance';
import {DungeonPane, DungeonUpdate, OnDungeonUpdate} from './templates';
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
  noDupes: boolean = false;
  floors: DungeonFloor[];
  activeFloor: number = 0;

  pane: DungeonPane;

  constructor(/** idc */) {
    // this.idc = idc;
    // Sets all of your monsters to level 1 temporarily.
    this.floors = [new DungeonFloor()];
    // this.editorElement = this.createEditorElement();
    this.pane = new DungeonPane((ctx: DungeonUpdate) => {
      console.log('Updating Dungeon Instance');
      console.log(ctx);
    });
  }

  getPane(): HTMLElement {
    return this.pane.getElement();
  }

  update() {

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
