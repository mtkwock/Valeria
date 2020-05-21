/**
 * Main File for Valeria.
 */

import { Latent, Attribute, waitFor } from './common';
import { ComboContainer } from './combo_container';
import { DungeonInstance } from './dungeon';
import { SearchInit } from './fuzzy_search';
import { Team } from './player_team';
import { MonsterEditor, ValeriaDisplay, MonsterUpdate, ClassNames } from './templates';
import { debug } from './debugger';
import { floof } from './ilmina_stripped';
import { ValeriaEncode, ValeriaDecodeToPdchu } from './custom_base64';
import { textifyEnemySkills, textifyEnemySkill, effect as enemyEffect, toSkillContext } from './enemy_skills';
import { getUrlParameter } from './url_handler';

class Valeria {
  display: ValeriaDisplay = new ValeriaDisplay();
  comboContainer: ComboContainer = new ComboContainer();
  monsterEditor: MonsterEditor;
  team: Team;
  dungeon: DungeonInstance;
  constructor() {
    this.display.leftTabs.getTab('Combo Editor').appendChild(this.comboContainer.getElement());

    this.comboContainer.onUpdate.push(() => {
      this.updateDamage();
    });

    this.monsterEditor = new MonsterEditor((ctx: MonsterUpdate) => {
      if (ctx.playerMode) {
        this.team.setPlayerMode(ctx.playerMode);
        this.team.update();
        return;
      }
      const monster = this.team.monsters[this.team.activeMonster];

      if (ctx.level) {
        monster.level = ctx.level;
      }
      if (ctx.inheritLevel) {
        monster.inheritLevel = ctx.inheritLevel;
      }
      if (ctx.hpPlus != undefined) {
        monster.setHpPlus(ctx.hpPlus);
      }
      if (ctx.atkPlus != undefined) {
        monster.setAtkPlus(ctx.atkPlus);
      }
      if (ctx.rcvPlus != undefined) {
        monster.setRcvPlus(ctx.rcvPlus);
      }
      if (ctx.inheritPlussed != undefined) {
        monster.inheritPlussed = ctx.inheritPlussed;
      }
      if (ctx.awakeningLevel != undefined) {
        monster.awakenings = ctx.awakeningLevel;
      }
      if (ctx.superAwakeningIdx != undefined) {
        monster.superAwakeningIdx = ctx.superAwakeningIdx;
      }
      if (ctx.id != undefined) {
        monster.setId(ctx.id);
      }
      if (ctx.inheritId != undefined) {
        monster.inheritId = ctx.inheritId;
      }
      if (ctx.addLatent != undefined) {
        monster.addLatent(ctx.addLatent as Latent);
      }
      if (ctx.removeLatent != undefined) {
        monster.removeLatent(ctx.removeLatent)
      }
      this.team.update();
      this.updateMonsterEditor();
    });
    this.monsterEditor.pdchu.importButton.onclick = (): void => {
      this.team.fromPdchu(this.monsterEditor.pdchu.io.value);
    };
    this.monsterEditor.pdchu.exportButton.onclick = (): void => {
      this.monsterEditor.pdchu.io.value = this.team.toPdchu();
      const els = document.getElementsByClassName(ClassNames.PDCHU_IO);
      if (els.length) {
        const el = els[0] as HTMLInputElement;
        el.focus();
        el.select();
      }
    }
    this.monsterEditor.pdchu.exportUrlButton.onclick = (): void => {
      const searchlessUrl = location.href.replace(location.search, '');
      this.monsterEditor.pdchu.io.value = `${searchlessUrl}?team=${ValeriaEncode(this.team)}&dungeon=${this.dungeon.id}`;
      const els = document.getElementsByClassName(ClassNames.PDCHU_IO);
      if (els.length) {
        const el = els[0] as HTMLInputElement;
        el.focus();
        el.select();
      }
    }
    this.display.leftTabs.getTab('Monster Editor').appendChild(this.monsterEditor.getElement());

    this.team = new Team();
    this.team.updateCb = (): void => {
      this.updateMonsterEditor();
      this.updateDamage();
      // console.log(healing);
      // console.log(trueBonusAttack);
    }
    let team = getUrlParameter('team');
    if (team) {
      team = ValeriaDecodeToPdchu(team);
    } else {
      team = '';
    }
    this.team.fromPdchu(team);

    this.display.panes[1].appendChild(this.team.teamPane.getElement());

    this.dungeon = new DungeonInstance();
    const dungeonId = getUrlParameter('dungeon');
    if (dungeonId) {
      this.dungeon.loadDungeon(Number(dungeonId));
    }
    this.display.panes[2].appendChild(this.dungeon.getPane());

    debug.addButton('Print Skills', () => {
      const enemy = this.dungeon.getActiveEnemy();
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
      this.dungeon.useEnemySkill(
        [], // teamIds
        this.comboContainer.comboCount(), // combo
        this.team.getBoardWidth() == 7, // bigBoard
        true, // isPreempt
      );
    });

    debug.addButton('Print next skill', () => {
      this.dungeon.useEnemySkill(
        [], // teamIds
        this.comboContainer.comboCount(), // combo
        this.team.getBoardWidth() == 7, // bigBoard
      );
    });

    this.dungeon.onEnemySkill = (idx, otherIdxs) => {
      if (idx < 0) {
        debug.print('No skill to use');
        return;
      }
      const enemy = this.dungeon.getActiveEnemy();
      if (otherIdxs.length) {
        debug.print(`  * Not using potential skills: ${otherIdxs}`);
      }
      debug.print('** Using the following skill **');
      debug.print(textifyEnemySkill({ id: enemy.id, atk: enemy.getAtk() }, idx));
      const skillCtx = toSkillContext(enemy.id, idx);
      enemyEffect(skillCtx, { enemy, team: this.team });
      enemy.charges -= floof.model.enemySkills[enemy.getCard().enemySkills[idx].enemySkillId].aiArgs[3];
      enemy.charges += enemy.getCard().chargeGain;
      this.dungeon.update(true);
      this.team.updateState({});
    }

  }

  updateMonsterEditor(): void {
    const monster = this.team.monsters[this.team.activeMonster];
    this.monsterEditor.update({
      id: monster.getId(),
      inheritId: monster.inheritId,
      level: monster.level,
      hpPlus: monster.hpPlus,
      atkPlus: monster.atkPlus,
      rcvPlus: monster.rcvPlus,
      awakeningLevel: monster.transformedTo > 0 ? 9 : monster.awakenings,
      inheritLevel: monster.inheritLevel,
      inheritPlussed: monster.inheritPlussed,
      latents: monster.latents,
      superAwakeningIdx: monster.superAwakeningIdx,
    });
  }

  updateDamage(): void {
    const { pings, healing } = this.team.getDamageCombos(this.comboContainer);
    this.team.teamPane.updateDamage(
      pings.map((ping) => ({
        attribute: ping ? ping.attribute : Attribute.NONE,
        damage: ping ? ping.damage : 0,
      })),
      healing,
    );
  }

  getElement(): HTMLElement {
    return this.display.getElement();
  }
}

declare global {
  interface Window { valeria: Valeria }
}

async function init(): Promise<void> {
  await waitFor(() => floof.ready);
  console.log('Valeria taking over.');

  SearchInit();
  const valeria = new Valeria();

  const loadingEl = document.getElementById('valeria-load');
  if (loadingEl) {
    loadingEl.style.display = 'none';
  }
  document.body.appendChild(valeria.getElement());
  if (localStorage.debug) {
    document.body.appendChild(debug.getElement());
  }
  window.valeria = valeria;
  const el = document.getElementById(`valeria-player-mode-${valeria.team.playerMode}`) as HTMLInputElement;
  el.checked = true;
}

init();
