import { BASE_URL, waitFor, Rational } from './common';
import { ajax } from './ajax';
import { EnemyInstance, EnemyInstanceJson } from './enemy_instance';
import { DungeonPane, DungeonUpdate } from './templates';
import { textifyEnemySkills, determineSkillset, textifyEnemySkill } from './enemy_skills';
import { debug } from './debugger';
import { floof } from './ilmina_stripped';
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

  addEnemy(): void {
    this.enemies.push(new EnemyInstance());
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

  getEnemyIds(): number[] {
    return this.enemies.map((enemy: EnemyInstance) => enemy.id);
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
  hp?: string,
  atk?: string,
  def?: string,
}

type EncounterRaw = {
  amount: number,
  enemy_id: number,
  level: number,
  stage: number, // Which floor to add it to.
  order_idx: number,

  hp: number,
  atk: number,
  defense: number,
  turns: number,
};

type SubDungeonDataRaw = {
  dungeon_id: number,
  sub_dungeon_id: number,
  name_na: string,
  floors: number,

  atk_mult: number,
  def_mult: number,
  hp_mult: number,
  encounters: EncounterRaw[],
};

// Info loaded from DadGuide
type DungeonDataRaw = {
  dungeon_id: number,
  dungeon_type: number,
  name_na: string,
  sub_dungeons: SubDungeonDataRaw[],
};

const requestUrl = BASE_URL + 'assets/DungeonsAndEncounters.json';
const DUNGEON_DATA: Map<number, DungeonInstanceJson> = new Map();
const dungeonSearchArray: { s: string, value: number }[] = [];
const request = ajax(requestUrl);
let dungeonsLoaded = false;
request.done((data) => {
  console.log('Loading Dungeon JSON data...');
  const rawData = JSON.parse(data) as DungeonDataRaw[];
  for (const datum of rawData) {
    for (const subDatum of datum.sub_dungeons) {
      const floorsJson: DungeonFloorJson[] = [];
      for (let i = 0; i < subDatum.floors; i++) {
        floorsJson.push({
          enemies: [],
        });
      }
      for (const encounter of subDatum.encounters) {
        if (encounter.stage <= 0) {
          encounter.stage = 1;
        }
        if (encounter.stage > floorsJson.length) {
          encounter.stage = floorsJson.length;
        }
        const floor = floorsJson[encounter.stage - 1];
        if (!floor) {
          console.warn('invalid floor count...');
          continue;
        }
        floor.enemies.push({
          id: encounter.enemy_id,
          lv: encounter.level,
          turnCounter: encounter.turns,
        });
      }
      const dungeonInstanceJson: DungeonInstanceJson = {
        title: `${datum.name_na} - ${subDatum.name_na}`,
        floors: floorsJson,
        hp: String(subDatum.hp_mult),
        atk: String(subDatum.atk_mult),
        def: String(subDatum.def_mult),
      };
      DUNGEON_DATA.set(subDatum.sub_dungeon_id, dungeonInstanceJson);
      dungeonSearchArray.push({ s: dungeonInstanceJson.title, value: subDatum.sub_dungeon_id });
    }
  }
  dungeonsLoaded = true;
  console.log('Dungeon Data loaded.');
});

class DungeonInstance {
  id: number = -1;
  title: string = '';
  boardWidth: number = 6;
  fixedTime: number = 0;
  isRogue: boolean = false; // UNIMPLEMENTED
  allAttributesRequired: boolean = false;
  noDupes: boolean = false;
  floors: DungeonFloor[];
  hpMultiplier: Rational = new Rational(1);
  atkMultiplier: Rational = new Rational(1);
  defMultiplier: Rational = new Rational(1);
  activeFloor: number = 0;
  activeEnemy: number = 0;

  pane: DungeonPane;
  onEnemySkill: (skillIdx: number, otherSkills: number[]) => void = () => null;

  async loadDungeon(subDungeonId: number) {
    await waitFor(() => dungeonsLoaded);
    const data = DUNGEON_DATA.get(subDungeonId);
    if (!data) {
      console.warn('invalid sub dungeon');
      return;
    }
    this.id = subDungeonId;

    this.loadJson(data);
  }

  constructor() {
    // Sets all of your monsters to level 1 temporarily.
    this.floors = [new DungeonFloor()];
    this.pane = new DungeonPane(dungeonSearchArray, this.getUpdateFunction());

    debug.addButton('Print Skills', () => {
      const enemy = this.getActiveEnemy();
      const id = enemy.id;
      const skillTexts = textifyEnemySkills({
        id,
        atk: enemy.getAtk(),
      });
      for (let i = 0; i < skillTexts.length; i++) {
        debug.print(`${i + 1}: ${skillTexts[i]} `);
      }
    });

    debug.addButton('Use Preempt', () => {
      this.useEnemySkill(
        [], // teamIds
        1, // combo
        true, // bigBoard
        true, // isPreempt
      );
    });

    debug.addButton('Print next skill', () => {
      this.useEnemySkill(
        [], // teamIds
        8, // combo
        true, // bigBoard
      );
    });

    this.onEnemySkill = (idx, otherIdxs) => {
      if (idx < 0) {
        debug.print('No skill to use');
        return;
      }
      const enemy = this.getActiveEnemy();
      if (otherIdxs.length) {
        debug.print(`  * Not using potential skills: ${otherIdxs}`);
      }
      debug.print('** Using the following skill **');
      debug.print(textifyEnemySkill({ id: enemy.id, atk: enemy.getAtk() }, idx));
      enemy.charges -= floof.model.enemySkills[enemy.getCard().enemySkills[idx].enemySkillId].aiArgs[3];
    }
  }

  useEnemySkill(teamIds: number[], combo: number, bigBoard: boolean, isPreempt = false, skillIdx = -1): void {
    const enemy = this.getActiveEnemy();
    const otherSkills = [];
    if (skillIdx < 0) {
      const possibleEffects = determineSkillset({
        cardId: enemy.id,
        lv: enemy.lv,
        attribute: enemy.getAttribute(),
        atk: enemy.getAtk(),
        hpPercent: Math.round(enemy.currentHp / enemy.getHp() * 100),
        charges: enemy.charges,
        flags: enemy.flags,
        counter: enemy.counter,
        otherEnemyHp: enemy.otherEnemyHp,

        isPreempt,
        combo,
        teamIds,
        bigBoard,
      });
      if (possibleEffects.length) {
        const totalWeight = possibleEffects.reduce((total, e) => total + e.chance, 0);
        let roll = Math.random() * totalWeight;
        for (const effect of possibleEffects) {
          if (roll < effect.chance && skillIdx < 0) {
            skillIdx = effect.idx;
            enemy.counter = effect.counter;
            enemy.flags = effect.flags;
          } else {
            otherSkills.push(effect.idx);
          }
          roll -= effect.chance;
        }
      }

      this.onEnemySkill(skillIdx, otherSkills);
    }
  }

  getUpdateFunction(): (ctx: DungeonUpdate) => void {
    return (ctx: DungeonUpdate) => {
      console.log(ctx);
      if (ctx.loadDungeon != undefined) {
        this.loadDungeon(ctx.loadDungeon);
      }
      const old = {
        floor: this.activeFloor,
        enemy: this.activeEnemy,
      };
      if (ctx.activeFloor != undefined) {
        this.activeFloor = ctx.activeFloor;
        this.setActiveEnemy(0);
      }
      if (ctx.activeEnemy != undefined) {
        // TODO: Centralize definition of activeEnemy into either DungeonInstace or DungeonFloor.
        this.setActiveEnemy(ctx.activeEnemy);
      }
      if (ctx.addFloor) {
        this.addFloor();
        this.setActiveEnemy(0);
      }
      if (ctx.removeFloor != undefined) {
        if (ctx.removeFloor == 0) {
          // Do nothing for now?
        } else {
          this.deleteFloor(ctx.removeFloor);
        }
      }
      if (ctx.dungeonHpMultiplier != undefined) {
        this.hpMultiplier = Rational.from(ctx.dungeonHpMultiplier);
        this.getActiveEnemy().dungeonMultipliers.hp = this.hpMultiplier;
      }
      if (ctx.dungeonAtkMultiplier != undefined) {
        this.atkMultiplier = Rational.from(ctx.dungeonAtkMultiplier);
        this.getActiveEnemy().dungeonMultipliers.atk = this.atkMultiplier;
      }
      if (ctx.dungeonDefMultiplier != undefined) {
        this.defMultiplier = Rational.from(ctx.dungeonDefMultiplier);
        this.getActiveEnemy().dungeonMultipliers.def = this.defMultiplier;
      }
      if (ctx.activeEnemy != undefined || ctx.activeFloor != undefined) {
        // Update other dungeon info about dungeon editor.
      }
      if (ctx.addEnemy) {
        const floor = this.floors[this.activeFloor];
        floor.addEnemy();
        this.setActiveEnemy(floor.enemies.length - 1);
      }
      if (ctx.enemyLevel) {
        this.getActiveEnemy().setLevel(ctx.enemyLevel);
      }
      if (ctx.activeEnemyId != undefined) {
        this.getActiveEnemy().id = ctx.activeEnemyId;
      }
      if (ctx.addTypeResist != undefined) {
        this.getActiveEnemy().typeResists.push(ctx.addTypeResist);
      }
      if (ctx.removeTypeResist != undefined) {
        if (this.getActiveEnemy().typeResists.includes(ctx.removeTypeResist)) {
          this.getActiveEnemy().typeResists.splice(
            this.getActiveEnemy().typeResists.indexOf(ctx.removeTypeResist),
            1);
        }
      }
      const updateActiveEnemy = old.floor != this.activeFloor || old.enemy != this.activeEnemy;
      this.update(updateActiveEnemy);
    };
  }

  getPane(): HTMLElement {
    return this.pane.getElement();
  }

  update(updateActiveEnemy: boolean) {
    this.pane.dungeonEditor.setEnemies(this.floors.map((floor) => floor.getEnemyIds()));
    if (updateActiveEnemy) {
      this.pane.dungeonEditor.setActiveEnemy(this.activeFloor, this.activeEnemy);
    }
    const enemy = this.getActiveEnemy();
    this.pane.dungeonEditor.setDungeonMultipliers(
      this.hpMultiplier.toString(),
      this.atkMultiplier.toString(),
      this.defMultiplier.toString());
    this.pane.dungeonEditor.setEnemyStats(
      enemy.lv,
      Math.round(this.hpMultiplier.multiply(enemy.getHp())),
      Math.round(this.atkMultiplier.multiply(enemy.getAtk())),
      Math.round(this.defMultiplier.multiply(enemy.getDef())),
      Math.round(enemy.getResolve()),
      enemy.getTypeResists(),
      enemy.getAttrResists(),
    );
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
  }

  setActiveEnemy(idx: number): void {
    this.activeEnemy = idx;
    this.floors[this.activeFloor].activeEnemy = idx;
    const enemy = this.getActiveEnemy();
    enemy.dungeonMultipliers = {
      hp: this.hpMultiplier,
      atk: this.atkMultiplier,
      def: this.defMultiplier,
    };
    enemy.reset();
  }

  getActiveEnemy(): EnemyInstance {
    return this.floors[this.activeFloor].getActiveEnemy();
  }

  toJson(): DungeonInstanceJson {
    const obj: DungeonInstanceJson = {
      title: this.title,
      floors: this.floors.map((floor) => floor.toJson()),
    };

    const hpString = this.hpMultiplier.toString();
    if (hpString != '1' && hpString != 'NaN') {
      obj.hp = hpString;
    }
    const atkString = this.atkMultiplier.toString();
    if (atkString != '1' && atkString != 'NaN') {
      obj.atk = atkString;
    }
    const defString = this.defMultiplier.toString();
    if (defString != '1' && defString != 'NaN') {
      obj.def = defString;
    }

    return obj;
  }

  loadJson(json: DungeonInstanceJson): void {
    this.title = json.title || '';
    this.floors = json.floors.map((floor) => DungeonFloor.fromJson(floor));
    if (!this.floors) {
      this.addFloor();
    }
    this.activeFloor = 0;
    this.setActiveEnemy(0);
    this.hpMultiplier = Rational.from(json.hp || '1');
    this.atkMultiplier = Rational.from(json.atk || '1');
    this.defMultiplier = Rational.from(json.def || '1');
    this.update(true);
  }
}

export {
  DungeonInstance,
  DungeonInstanceJson,
};
