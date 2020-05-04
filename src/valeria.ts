/**
 * Main File for Valeria.
 */

import {Latent} from './common';
import {MonsterInstance} from './monster_instance';
import {KnockoutVM} from '../typings/ilmina';
import {ComboContainer} from './combo_container';
import {DungeonInstance} from './dungeon';
import {SearchInit} from './fuzzy_search';
import {Team} from './player_team';
import {MonsterEditor, ValeriaDisplay, MonsterUpdate} from './templates';

declare var vm: KnockoutVM;

async function waitFor(conditionFn: () => boolean, waitMs = 50) {
  while (!conditionFn()) {
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }
}

function annotateMonsterScaling() {
  const VALID_SCALES = new Set([0.7, 1.0, 1, 1.5]);
  for (const id in vm.model.cards) {
    const c = vm.model.cards[id];
    const [hpGrowth, atkGrowth, rcvGrowth] = [c.unknownData[2], c.unknownData[3], c.unknownData[4]];
    if (!VALID_SCALES.has(hpGrowth)) {
      console.log(`Invalid scaling found! ${hpGrowth} Monster: ${id}`);
    } else {
      c.hpGrowth = hpGrowth;
    }
    if (!VALID_SCALES.has(atkGrowth)) {
      console.log(`Invalid scaling found! ${atkGrowth} Monster: ${id}`);
    } else {
      c.atkGrowth = atkGrowth;
    }
    if (!VALID_SCALES.has(rcvGrowth)) {
      console.log(`Invalid scaling found! ${rcvGrowth} Monster: ${id}`);
    } else {
      c.rcvGrowth = rcvGrowth;
    }
  }
}

class Valeria {
  display: ValeriaDisplay = new ValeriaDisplay();
  comboContainer: ComboContainer = new ComboContainer();
  monsterEditor: MonsterEditor;
  team: Team;
  dungeon: DungeonInstance;
  constructor() {

    // this._testRocheDeleteLater = testRoche();
    this.display.leftTabs.getTab('Combo Editor').appendChild(this.comboContainer.getElement());

    this.monsterEditor = new MonsterEditor((ctx: MonsterUpdate) => {
      const monster = this.team.monsters[this.team.activeMonster];

      if (ctx.hasOwnProperty('level')) {
        let level = Number(ctx.level);
        monster.level = level;
      }
      if (ctx.hasOwnProperty('inheritLevel')) {
        let level = Number(ctx.inheritLevel);
        monster.inheritLevel = level;
      }
      if (ctx.hasOwnProperty('hpPlus')) {
        monster.setHpPlus(Number(ctx.hpPlus));
      }
      if (ctx.hasOwnProperty('atkPlus')) {
        monster.setAtkPlus(Number(ctx.atkPlus));
      }
      if (ctx.hasOwnProperty('rcvPlus')) {
        monster.setRcvPlus(Number(ctx.rcvPlus));
      }
      if (ctx.hasOwnProperty('inheritPlussed')) {
        monster.inheritPlussed = Boolean(ctx.inheritPlussed);
      }
      if (ctx.hasOwnProperty('awakeningLevel')) {
        monster.awakenings = Number(ctx.awakeningLevel);
      }
      if (ctx.hasOwnProperty('superAwakeningIdx')) {
        monster.superAwakeningIdx = Number(ctx.superAwakeningIdx);
      }
      if (ctx.hasOwnProperty('id')) {
        monster.setId(Number(ctx.id));
      }
      if (ctx.hasOwnProperty('inheritId')) {
        monster.inheritId = Number(ctx.inheritId);
      }
      if (ctx.hasOwnProperty('addLatent')) {
        monster.addLatent(ctx.addLatent as Latent);
      }
      if (ctx.hasOwnProperty('removeLatent')) {
        monster.removeLatent(Number(ctx.removeLatent))
      }
      this.team.update();
      this.updateMonsterEditor();
      console.log(ctx);
    });
    this.monsterEditor.pdchu.importButton.onclick = () => {
      this.team.fromPdchu(this.monsterEditor.pdchu.io.value);
    };
    this.monsterEditor.pdchu.exportButton.onclick = () => {
      this.monsterEditor.pdchu.io.value = this.team.toPdchu();
    }
    this.display.leftTabs.getTab('Monster Editor').appendChild(this.monsterEditor.getElement());

    this.team = new Team();
    this.team.updateIdxCb = () => {
      this.updateMonsterEditor();
    }
    this.team.fromPdchu('3298 (5414 | lv99 +297) | lv110  sa3 / 2957 (5212) | lv103  sa1 / 5521 (5417 | lv99 +297) | lv110  sa3 / 5382 (5239) | lv110  sa5 / 5141 (5411) | lv110  sa3 / 5209 (5190) | lv110 sa2');

    this.display.panes[1].appendChild(this.team.teamPane.getElement());

    this.dungeon = new DungeonInstance();
    this.display.panes[2].appendChild(this.dungeon.getPane());
  }

  updateMonsterEditor() {
    const monster = this.team.monsters[this.team.activeMonster];
    this.monsterEditor.update({
      id: monster.id,
      inheritId: monster.inheritId,
      level: monster.level,
      hpPlus: monster.hpPlus,
      atkPlus: monster.atkPlus,
      rcvPlus: monster.rcvPlus,
      awakeningLevel: monster.awakenings,
      inheritLevel: monster.inheritLevel,
      inheritPlussed: monster.inheritPlussed,
      latents: monster.latents,
      superAwakeningIdx: monster.superAwakeningIdx,
    });
  }

  getElement(): HTMLElement {
    return this.display.getElement();
  }
}

async function init() {
  console.log("here");
  await waitFor(() => vm.page() != 0);

  annotateMonsterScaling();
  SearchInit();
  // testRoche();
  // testAnother();
  const valeria = new Valeria();

  document.body.appendChild(valeria.getElement());
  for (const el of document.getElementsByClassName('main-site-div')) {
    (el as HTMLElement).style.display = 'none';
  }
}

init();
