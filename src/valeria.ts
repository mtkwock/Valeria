/**
 * Main File for Valeria.
 */

import {Latent} from './common';
import {MonsterInstance} from './monster_instance';
import {KnockoutVM} from '../typings/ilmina';
import {ComboContainer} from './combo_container';
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

function testRoche(): MonsterInstance {
  const roche = new MonsterInstance(4799);
  roche.setLevel(110);
  roche.addLatent(Latent.ATK_PLUS);
  roche.addLatent(Latent.ATK_PLUS);
  roche.addLatent(Latent.ATK_PLUS);
  roche.inheritId = 4204;
  roche.inheritLevel = 110;
  roche.inheritPlussed = true;
  roche.setHpPlus(99);
  roche.setAtkPlus(99);
  roche.setRcvPlus(99);
  roche.awakenings = 7;
  roche.superAwakeningIdx = 2;
  console.log(roche);
  if (roche.getHp() != 6698) {
    throw 'Roche\'s hp is wrong.';
  }
  if (roche.getAtk() != 5165) {
    throw 'Roche\'s atk is wrong.';
  }
  if (roche.getRcv() != 916) {
    throw 'Roche\'s rcv is wrong.';
  }
  // document.body.appendChild(roche.getElement());
  roche.update();
  // console.log('Roche is good!');
  return roche;
}

function testAnother() {
  const another = new MonsterInstance(2568);
  another.setLevel(110);
  another.inheritId = 4723;
  another.inheritPlussed = true;
  another.awakenings = 9;
  another.addLatent(Latent.TIME_PLUS); another.addLatent(Latent.DEVIL);
  another.addLatent(Latent.DEVIL);
  another.setHpPlus(99);
  another.setAtkPlus(99);
  another.setRcvPlus(99);
  console.log(another);
  if (another.getHp(false) != 6259) {
    throw 'Athena\'s hp is wrong.';
  }
  if (another.getAtk(false) != 4926) {
    throw 'Athena\'s atk is wrong.';
  }
  if (another.getRcv(false) != 363) {
    throw 'Athena\'s rcv is wrong.';
  }
  console.log('Athena Another is okay!');
}

class Valeria {
  display: ValeriaDisplay;
  comboContainer: ComboContainer;
  monsterEditor: MonsterEditor;
  team: Team;
  _testRocheDeleteLater: MonsterInstance;
  constructor() {
    this.comboContainer = new ComboContainer();

    this.display = new ValeriaDisplay();

    this._testRocheDeleteLater = testRoche();
    this.display.leftTabs.getTab('Combo Editor').appendChild(this.comboContainer.getElement());

    // TODO: Latents
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
    this.display.leftTabs.getTab('Monster Editor').appendChild(this.monsterEditor.getElement());

    this.team = new Team();
    this.team.updateIdxCb = () => {
      this.updateMonsterEditor();
    }
    this.team.fromPdchu('3298 (5414 | lv99 +297) | lv110  sa3 / 2957 (5212) | lv103  sa1 / 5521 (5417 | lv99 +297) | lv110  sa3 / 5382 (5239) | lv110  sa5 / 5141 (5411) | lv110  sa3 / 5209 (5190) | lv110 sa2');
    console.log(this.team.getHp());
    console.log(this.team.getRcv());
    this.display.panes[1].appendChild(this.team.teamPane.getElement());

    this.display.panes[2].appendChild(this._testRocheDeleteLater.getElement())
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
  if (window.location.hash != '#/Valeria') {
    return;
  }
  await waitFor(() => vm.page() != 0);

  annotateMonsterScaling();
  SearchInit();
  // testRoche();
  testAnother();
  const valeria = new Valeria();

  document.body.appendChild(valeria.getElement());
  for (const el of document.getElementsByClassName('main-site-div')) {
    (el as HTMLElement).style.display = 'none';
  }
}

init();
