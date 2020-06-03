/**
 * Main File for Valeria.
 */

import { Latent, Attribute, MonsterType, waitFor } from './common';
import { ComboContainer } from './combo_container';
import { DamagePing } from './damage_ping';
import { DungeonInstance } from './dungeon';
import { SearchInit } from './fuzzy_search';
import { Team } from './player_team';
import { MonsterEditor, ValeriaDisplay, MonsterUpdate, ClassNames } from './templates';
import { debug } from './debugger';
import { floof } from './ilmina_stripped';
import { ValeriaEncode, ValeriaDecodeToPdchu } from './custom_base64';
import { textifyEnemySkills, textifyEnemySkill, effect as enemyEffect, toSkillContext } from './enemy_skills';
import { getUrlParameter } from './url_handler';
import { damage as activeDamage, teamEffect, enemyEffect as activeEnemyEffect, boardEffect } from './actives';
import { FancyPhoto } from './team_photo';
// import { testTestTestTest } from './team_test';

class Valeria {
  display: ValeriaDisplay = new ValeriaDisplay();
  comboContainer: ComboContainer = new ComboContainer();
  monsterEditor: MonsterEditor;
  team: Team;
  dungeon: DungeonInstance;
  fancyPhoto: FancyPhoto;

  constructor() {
    this.display.leftTabs.getTab('Combo Editor').appendChild(this.comboContainer.getElement());

    this.comboContainer.onUpdate.push(() => {
      this.team.action = -1;
      this.updateDamage();
    });

    this.monsterEditor = new MonsterEditor((ctx: MonsterUpdate) => {
      if (ctx.playerMode) {
        this.team.setPlayerMode(ctx.playerMode);
        this.team.update();
        return;
      }
      if (ctx.badge != undefined) {
        this.team.badges[this.team.activeTeamIdx] = ctx.badge;
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
    }
    this.team.teamPane.applyActionButton.onclick = () => {
      const action = this.team.action;
      const { endEnemyHp, healing } = this.updateDamage();
      if (action == -1) {
        this.dungeon.getActiveEnemy().setHp(endEnemyHp);
        this.team.heal(healing);
        this.team.update();
        this.dungeon.update(false);
        return;
      }
      this.team.setAction(-1);
      this.dungeon.getActiveEnemy().setHp(endEnemyHp);

      const team = this.team.getActiveTeam();
      const source = team[Math.floor(action / 2)];
      const activeId = floof.model.cards[action & 1 ? source.inheritId : source.getId()].activeSkillId;
      const enemy = this.dungeon.getActiveEnemy();

      teamEffect(activeId, {
        source,
        enemy,
        team: this.team,
        comboContainer: this.comboContainer,
      });

      activeEnemyEffect(activeId, {
        source,
        enemy,
        awakeningsActive: this.team.state.awakenings,
        playerMode: this.team.playerMode,
      });

      boardEffect(activeId, this.comboContainer);
      this.comboContainer.update();

      this.updateDamage();
      this.team.update();
      this.dungeon.update(false);
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

    debug.addButton('Simulate Next Skill', () => {
      const attributes = new Set<Attribute>();
      const types = new Set<MonsterType>();
      for (const m of this.team.getActiveTeam()) {
        for (const type of m.getCard().types) {
          types.add(type);
        }
        attributes.add(m.getAttribute());
        attributes.add(m.getSubattribute());
      }
      this.dungeon.useEnemySkill(
        this.team.getActiveTeam().map((m) => m.getId()), // teamIds
        attributes,
        types,
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
      enemyEffect(skillCtx, { enemy, team: this.team, comboContainer: this.comboContainer });
      enemy.charges -= floof.model.enemySkills[enemy.getCard().enemySkills[idx].enemySkillId].aiArgs[3];
      enemy.charges += enemy.getCard().chargeGain;
      this.dungeon.update(true);
      this.team.updateState({});
    }
    this.dungeon.onEnemyChange = () => {
      this.usePreempt();
      this.updateDamage();
    };
    this.dungeon.onEnemyUpdate = () => {
      this.updateDamage();
    }

    this.fancyPhoto = new FancyPhoto();
  }

  drawTeam(): void {
    this.fancyPhoto.loadTeam(this.team);
    this.fancyPhoto.redraw();
  }

  usePreempt() {
    const attributes = new Set<Attribute>();
    const types = new Set<MonsterType>();
    for (const m of this.team.getActiveTeam()) {
      for (const type of m.getCard().types) {
        types.add(type);
      }
      attributes.add(m.getAttribute());
      attributes.add(m.getSubattribute());
    }
    this.dungeon.useEnemySkill(
      this.team.getActiveTeam().map((m) => m.getId()), // teamIds
      attributes,
      types,
      this.comboContainer.comboCount(), // combo
      this.team.getBoardWidth() == 7, // bigBoard
      true, // isPreempt
    );
  }

  updateMonsterEditor(): void {
    const monster = this.team.monsters[this.team.activeMonster];
    this.monsterEditor.update({
      mode: this.team.playerMode,
      badge: this.team.getBadge(),
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

  updateDamage(): { endEnemyHp: number; healing: number } {
    let pings: DamagePing[] = []
    let healing: number = 0
    let trueBonusAttack = 0;
    if (this.team.action == -1) {
      const damageCombosInfo = this.team.getDamageCombos(this.comboContainer);
      pings = damageCombosInfo.pings;
      healing = damageCombosInfo.healing;
      trueBonusAttack = damageCombosInfo.trueBonusAttack;
    } else {
      const team = this.team.getActiveTeam();
      const source = team[Math.floor(this.team.action / 2)];
      const id = this.team.action & 1 ? source.inheritId : source.getId();
      const activeId = floof.model.cards[id].activeSkillId;
      pings = activeDamage(activeId, {
        source,
        team,
        enemy: this.dungeon.getActiveEnemy(),
        awakeningsActive: this.team.state.awakenings,
        playerMode: this.team.playerMode,
        currentHp: this.team.state.currentHp,
        maxHp: this.team.getHp(),
        badge: this.team.badges[this.team.activeTeamIdx],
      });
    }

    if (!this.dungeon) return { endEnemyHp: 0, healing: 0 };
    const enemy = this.dungeon.getActiveEnemy();
    let currentHp = enemy.currentHp;
    const maxHp = enemy.getHp();
    let minHp = enemy.getResolve() && enemy.getHpPercent() >= enemy.getResolve() ? 1 : 0;
    const superResolve = enemy.getSuperResolve().triggersAt < enemy.getHpPercent() ? enemy.getSuperResolve().minHp * maxHp / 100 : 0;
    if (superResolve) {
      minHp = superResolve;
    }
    for (const ping of pings) {
      let oldHp = currentHp;
      ping.rawDamage = enemy.calcDamage(ping, pings, this.comboContainer, this.team.playerMode, {
        attributeAbsorb: this.team.state.voidAttributeAbsorb,
        damageVoid: this.team.state.voidDamageVoid,
        damageAbsorb: this.team.state.voidDamageAbsorb,
      });

      currentHp -= ping.rawDamage;
      if (currentHp < minHp) {
        currentHp = minHp;
      }
      if (currentHp > maxHp) {
        currentHp = maxHp;
      }

      ping.actualDamage = oldHp - currentHp;
    }

    const specialPing = new DamagePing(this.team.getActiveTeam()[0], Attribute.FIXED, false);
    specialPing.damage = trueBonusAttack;
    specialPing.isActive = true;
    specialPing.rawDamage = enemy.calcDamage(specialPing, [], this.comboContainer, this.team.playerMode, {
      attributeAbsorb: this.team.state.voidAttributeAbsorb,
      damageVoid: this.team.state.voidDamageVoid,
      damageAbsorb: this.team.state.voidDamageAbsorb,
    });

    minHp = enemy.getResolve() && (100 * currentHp / maxHp) >= enemy.getResolve() ? 1 : 0;
    const superResolveRound2 = enemy.getSuperResolve().triggersAt < (currentHp / maxHp * 100) ? superResolve : 0;
    minHp = superResolveRound2 || minHp;

    const oldHp = currentHp;
    currentHp -= specialPing.rawDamage;
    if (currentHp < minHp) {
      currentHp = minHp;
    }
    if (currentHp > maxHp) {
      currentHp = maxHp;
    }
    specialPing.actualDamage = oldHp - currentHp;
    if (specialPing.actualDamage) {
      pings = [...pings, specialPing];
    }

    this.team.teamPane.updateDamage(
      this.team.action,
      pings.map((ping) => ({ attribute: ping ? ping.attribute : Attribute.NONE, damage: ping ? ping.damage : 0 })),
      pings.map((ping) => ({ attribute: ping ? ping.attribute : Attribute.NONE, damage: ping ? ping.rawDamage : 0 })),
      pings.map((ping) => ({ attribute: ping ? ping.attribute : Attribute.NONE, damage: ping ? ping.actualDamage : 0 })),
      maxHp,
      healing,
    );

    return { endEnemyHp: currentHp, healing };
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
  document.body.appendChild(valeria.dungeon.skillArea.getElement());
  valeria.team.teamPane.metaTabs.getTab('Photo').appendChild(valeria.fancyPhoto.getElement());
  const photoTabLabel = valeria.team.teamPane.metaTabs.getTabLabel('Photo');
  photoTabLabel.onclick = (): void => {
    valeria.team.teamPane.metaTabs.setActiveTab('Photo');
    valeria.drawTeam();
  }
  // document.body.appendChild(valeria.teamPhotoCanvas);
  if (localStorage.debug) {
    document.body.appendChild(debug.getElement());
  }
  window.valeria = valeria;
  const el = document.getElementById(`valeria-player-mode-${valeria.team.playerMode}`) as HTMLInputElement;
  el.checked = true;
}

init();
