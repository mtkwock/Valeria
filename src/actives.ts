import { Round, Attribute, idxsFromBits, TeamBadge } from './common';
import { MonsterInstance } from './monster_instance'
import { DamagePing } from './damage_ping';
import { Team } from './player_team';
import { EnemyInstance } from './enemy_instance';
import { ComboContainer } from './combo_container';
import { floof } from './ilmina_stripped';
import { debug } from './debugger';

interface DamageContext {
  source: MonsterInstance;
  enemy: EnemyInstance;
  awakeningsActive: boolean;
  playerMode: number;
  team: MonsterInstance[];
  currentHp: number;
  maxHp: number;
  badge: TeamBadge;
}

interface EnemyEffectContext {
  source: MonsterInstance;
  enemy: EnemyInstance;
  awakeningsActive: boolean;
  playerMode: number;
}

interface TeamEffectContext {
  source: MonsterInstance;
  team: Team;
  enemy: EnemyInstance;
  comboContainer: ComboContainer,
}

interface MonsterActive {
  damage?: (params: number[], ctx: DamageContext) => DamagePing[];
  teamEffect?: (params: number[], ctx: TeamEffectContext) => void;
  enemyEffect?: (params: number[], ctx: EnemyEffectContext) => void;
  boardEffect?: (params: number[], comboContainer: ComboContainer) => void;
}

// 0
const scalingAttackToAllEnemies: MonsterActive = {
  damage: ([attr, atk100], { source, awakeningsActive, playerMode }) => {
    const ping = new DamagePing(source, attr);
    ping.isActive = true;
    ping.damage = source.getAtk(playerMode, awakeningsActive);
    ping.multiply(atk100 / 100, Round.UP);
    return [ping];
  },
}

// 1
const flatAttackToAllEnemies: MonsterActive = {
  damage: ([attr, damage], { source }) => {
    const ping = new DamagePing(source, attr);
    ping.isActive = true;
    ping.damage = damage;
    return [ping];
  },
};

// 2
const scalingAttackRandomToSingleEnemy: MonsterActive = {
  damage: ([atk100base, atk100max], { source, awakeningsActive, playerMode }) => {
    atk100max = atk100max || atk100base;
    const ping = new DamagePing(source, source.getAttribute());
    ping.isActive = true;
    ping.damage = source.getAtk(playerMode, awakeningsActive);
    const multiplier100 = atk100base + Math.floor(Math.random() * (atk100max - atk100base));
    ping.multiply(multiplier100 / 100, Round.UP);
    if (atk100base != atk100max) {
      debug.print('Random scaling active used. Damage is inconsistent');
    }
    return [ping];
  },
};

// 3
const shield: MonsterActive = {
  teamEffect: ([_, shieldPercent], { team }) => {
    team.state.shieldPercent = shieldPercent;
    team.update();
  },
};

// 4
const poison: MonsterActive = {
  enemyEffect: ([poisonMultiplier100], { source, enemy, awakeningsActive, playerMode }) => {
    if (enemy.statusShield) {
      enemy.poison = 0;
      return;
    }
    enemy.poison = Math.ceil(source.getAtk(playerMode, awakeningsActive) * poisonMultiplier100 / 100);
  },
};

// 5
const changeTheWorld: MonsterActive = {
};

// 6
const gravity: MonsterActive = {
  damage: ([percentGravity], { source, enemy }) => {
    const ping = new DamagePing(source, Attribute.FIXED);
    ping.isActive = true;
    ping.damage = Math.round(enemy.currentHp * percentGravity / 100);
    return [ping];
  },
};

// 8
const flatHeal: MonsterActive = {
  teamEffect: ([amount], { team }) => {
    team.heal(amount);
    team.update();
  },
};

// 9
const orbChange: MonsterActive = {
};

// 10
const orbRefresh: MonsterActive = {
};

// 18
const delay: MonsterActive = {
  enemyEffect: ([turns], { enemy }) => {
    if (enemy.statusShield) {
      return;
    }
    enemy.turnsRemaining += turns;
  },
};

// 19
const defenseBreak: MonsterActive = {
  enemyEffect: ([_, defenseBreakPercent], { enemy }) => {
    if (enemy.statusShield) {
      enemy.ignoreDefensePercent = 0;
      return;
    }
    enemy.ignoreDefensePercent = defenseBreakPercent;
  },
};

// 20
const orbChangeDouble: MonsterActive = {
}

function simulateDamage(ping: DamagePing, ctx: TeamEffectContext): number {
  return ctx.enemy.calcDamage(ping, [ping], ctx.comboContainer, ctx.team.playerMode, {
    attributeAbsorb: ctx.team.state.voidAttributeAbsorb,
    damageAbsorb: ctx.team.state.voidDamageAbsorb,
    damageVoid: ctx.team.state.voidDamageVoid,
  });
}

// 35
const scalingAttackAndHeal: MonsterActive = {
  damage: ([atk100], ctx) => {
    const baseSkill = scalingAttackToAllEnemies.damage;
    return baseSkill ? baseSkill([ctx.source.getAttribute(), atk100], ctx) : [];
  },
  teamEffect: (params, ctx) => {
    const skill = scalingAttackAndHeal.damage;
    if (!skill) return;

    const ping = skill(params, {
      source: ctx.source,
      enemy: ctx.enemy,
      awakeningsActive: ctx.team.state.awakenings,
      playerMode: ctx.team.playerMode,
      team: ctx.team.getActiveTeam(),
      currentHp: ctx.team.state.currentHp,
      maxHp: ctx.team.getHp(),
      badge: ctx.team.badges[ctx.team.activeTeamIdx],
    })[0];

    const healAmount = Math.ceil(simulateDamage(ping, ctx) * params[1] / 100);
    ctx.team.heal(healAmount);
    ctx.team.update();
  },
};

// 37
// Effectively the same as single target.
const scalingAttackToOneEnemy: MonsterActive = scalingAttackToAllEnemies;

// 42
const flatAttackToAttribute: MonsterActive = {
  damage: ([targetAttr, attackAttr, damage], ctx) => {
    if (ctx.enemy.getAttribute() != targetAttr) {
      return [];
    }

    const skill = flatAttackToAllEnemies.damage;
    if (!skill) return [];

    return skill([attackAttr, damage], ctx);
  },
};

// 50
const attrOrRcvBurst: MonsterActive = {
  teamEffect: ([_, attr, mult100], { team }) => {
    if (attr == 5) {
      team.state.rcvMult = mult100 / 100;
    } else {
      team.state.burst = {
        attrRestrictions: [attr],
        typeRestrictions: [],
        multiplier: mult100 / 100,
        awakeningScale: 0,
        awakenings: [],
      };
    }
    team.update();
  },
};

// 51
const massAttack: MonsterActive = {};

// 52
const enhanceOrbs: MonsterActive = {};

// 55
const fixedDamageToOneEnemy: MonsterActive = {
  damage: ([amount], { source }) => {
    const ping = new DamagePing(source, Attribute.FIXED);
    ping.isActive = true;
    ping.damage = amount;
    return [ping];
  },
};

// 56
const fixedDamageToAllEnemies: MonsterActive = fixedDamageToOneEnemy;

// 58
const scalingAttackRandomToAllEnemies: MonsterActive = {
  damage: ([attr, ...args], ctx) => {
    const skill = scalingAttackRandomToSingleEnemy.damage;
    if (!skill) {
      return [];
    }

    const [ping] = skill(args, ctx);
    ping.attribute = attr;
    return [ping];
  },
};

// 59
const scalingAttackRandomToOneEnemy = scalingAttackRandomToAllEnemies;

// 71
const fullBoard: MonsterActive = {};

// 84
const scalingAttackAndSuicideSingle: MonsterActive = {
  damage: ([attr, atk100base, atk100max], ctx) => {
    const skill = scalingAttackRandomToAllEnemies.damage;
    if (!skill) return [];

    return skill([attr, atk100base, atk100max], ctx);
  },
  teamEffect: ([_, _a, _b, suicideTo], { team }) => {
    suicideTo = suicideTo || 0;
    team.state.currentHp = Math.max(1, Math.floor(team.state.currentHp * suicideTo / 100));
    team.update();
  },
};

// 85
const scalingAttackAndSuicideMass = scalingAttackAndSuicideSingle;

// 86
const flatAttackAndSuicideSingle: MonsterActive = {
  damage: flatAttackToAllEnemies.damage,
  teamEffect: scalingAttackAndSuicideSingle.teamEffect,
};

// 87
const flatAttackAndSuicideMass = flatAttackAndSuicideSingle;

// 88
const burstForOneType: MonsterActive = {
  teamEffect: ([_, type, mult100], { team }) => {
    team.state.burst = {
      multiplier: mult100 / 100,
      typeRestrictions: [type],
      attrRestrictions: [],
      awakenings: [],
      awakeningScale: 0,
    };
    team.update();
  },
};

// 90
const burstForTwoAttributes: MonsterActive = {
  teamEffect: ([_, attr1, attr2, mult100], { team }) => {
    team.state.burst = {
      multiplier: mult100 / 100,
      typeRestrictions: [],
      attrRestrictions: [attr1, attr2],
      awakenings: [],
      awakeningScale: 0,
    };
    team.update();
  },
};

// 92
const burstForTwoTypes: MonsterActive = {
  teamEffect: ([_, type1, type2, mult100], { team }) => {
    team.state.burst = {
      multiplier: mult100 / 100,
      typeRestrictions: [type1, type2],
      attrRestrictions: [],
      awakenings: [],
      awakeningScale: 0,
    };
  },
};

// 93
const leadSwap: MonsterActive = {
  teamEffect: (_, { team }) => {
    team.updateState({
      leadSwap: Math.floor(team.action / 2),
    });
  },
};

// 110
const grudgeStrike: MonsterActive = {
  damage: ([_, attr, baseMult, maxMult, scaling], { source, playerMode, awakeningsActive, currentHp, maxHp }) => {
    const ping = new DamagePing(source, attr);
    ping.isActive = true;
    ping.damage = source.getAtk(playerMode, awakeningsActive);
    const multiplierScale = (maxMult - baseMult) * ((1 - (currentHp - 1) / maxHp) ** (scaling / 100));
    ping.multiply(baseMult + multiplierScale, Round.NEAREST);
    return [ping];
  },
};

// 115
const elementalScalingAttackAndHeal: MonsterActive = {
  damage: ([attr, atk100], ctx) => {
    const skill = scalingAttackAndHeal.damage;
    if (!skill) return [];

    const [ping] = skill([atk100], ctx);
    ping.attribute = attr;
    return [ping];
  },
  teamEffect: (params, ctx) => {
    const skill = elementalScalingAttackAndHeal.damage;
    if (!skill) return;

    const ping = skill(params, {
      source: ctx.source,
      enemy: ctx.enemy,
      awakeningsActive: ctx.team.state.awakenings,
      playerMode: ctx.team.playerMode,
      team: ctx.team.getActiveTeam(),
      currentHp: ctx.team.state.currentHp,
      maxHp: ctx.team.getHp(),
      badge: ctx.team.badges[ctx.team.activeTeamIdx],
    })[0];

    const healAmount = Math.ceil(simulateDamage(ping, ctx) * params[1] / 100);
    ctx.team.heal(healAmount);
    ctx.team.update();
  },
};

// 116 + 138
const multipleActiveSkills: MonsterActive = {
  damage: (activeIds, ctx) => {
    const ret: DamagePing[] = [];
    return ret.concat(...activeIds.map((id) => damage(id, ctx)));
  },
  teamEffect: (activeIds, ctx) => {
    for (const id of activeIds) {
      teamEffect(id, ctx);
    }
  },
  enemyEffect: (activeIds, ctx) => {
    for (const id of activeIds) {
      enemyEffect(id, ctx);
    }
  },
  boardEffect: (activeIds, ctx) => {
    for (const id of activeIds) {
      boardEffect(id, ctx);
    }
  },
}

// 117
const catchAllCleric: MonsterActive = {
  teamEffect: ([bindReduce, rcv100, flatHeal, percentHeal, awokenBindReduce], { source, team }) => {
    let healing = 0;
    if (bindReduce) {
      for (const monster of team.monsters) {
        monster.bound = false;
      }
    }
    if (awokenBindReduce) {
      team.state.awakenings = true;
    }
    if (flatHeal) {
      healing += flatHeal;
    }
    if (rcv100) {
      healing += Math.ceil(source.getRcv(team.playerMode, team.state.awakenings));
    }
    if (percentHeal) {
      healing += Math.ceil(team.getHp() * percentHeal / 100);
    }
    if (healing) {
      team.heal(healing);
    }
    team.update();
  },
};

// 127
const orbChangeColumn: MonsterActive = {};

// 132
const timeExtend: MonsterActive = {
  teamEffect: ([_, seconds10, mult100], { team }) => {
    if (mult100) {
      team.state.timeBonus = mult100 / 100;
      team.state.timeIsMult = true;
    } else {
      team.state.timeBonus = seconds10 / 10;
      team.state.timeIsMult = false;
    }
    team.update();
  },
};

// 141
const randomOrbSpawn: MonsterActive = {};

// 142
const selfAttributeChange: MonsterActive = {
  teamEffect: ([_, attr], { source, team }) => {
    source.attribute = attr;
    team.update();
  },
};

// 144
const scalingAttackFromTeam: MonsterActive = {
  damage: ([attrBits, atk100, _, attr], { source, playerMode, awakeningsActive, team, badge }) => {
    const ping = new DamagePing(source, attr);
    const attrs = new Set(idxsFromBits(attrBits));
    for (const m of team) {
      const atk = m.getAtk(playerMode, awakeningsActive);
      if (attrs.has(m.getAttribute())) {
        ping.add(atk);
      }
      if (attrs.has(m.getSubattribute())) {
        if (m.getAttribute() == m.getSubattribute()) {
          ping.add(Math.ceil(atk / 10));
        } else {
          ping.add(Math.ceil(atk / 3));
        }
      }
    }
    ping.multiply(atk100 / 100, Round.UP);
    if (badge == TeamBadge.ATK) {
      ping.multiply(1.05, Round.UP);
    } else if (badge == TeamBadge.ATK_PLUS) {
      ping.multiply(1.15, Round.UP);
    }
    return [ping];
  },
};

// 146
const haste: MonsterActive = {};

// 153
const enemyAttributeChange: MonsterActive = {
  enemyEffect: ([attr], { enemy }) => {
    enemy.currentAttribute = attr;
  },
};

// 156
const effectFromAwakeningCount: MonsterActive = {
  teamEffect: ([_, awakening1, awakening2, awakening3, effect, mult100], { team }) => {
    const awakenings = [awakening1, awakening2, awakening3].filter(Boolean);

    const count = awakenings.map((a) => team.countAwakening(a)).reduce((t, a) => t + a, 0);

    if (effect == 1) {
      const healing = Math.ceil(mult100 * count);
      team.heal(healing);
    } else if (effect == 2) {
      mult100 -= 100;
      team.state.burst = {
        awakenings: awakenings,
        awakeningScale: mult100 / 100,
        multiplier: 1,
        typeRestrictions: [],
        attrRestrictions: [],
      };
    } else if (effect == 3) {
      const shieldPercent = Math.min(100, count * mult100);
      team.state.shieldPercent = shieldPercent;
    }
    team.update();
  },
};

// 160
const addCombos: MonsterActive = {
  boardEffect: ([_, combos], comboContainer) => {
    comboContainer.bonusCombosActive = combos;
  },
};

// 161
const trueGravity: MonsterActive = {
  damage: ([percentGravity], { source, enemy }) => {
    const ping = new DamagePing(source, Attribute.FIXED);
    ping.isActive = true;
    ping.damage = Math.ceil(enemy.getHp() * percentGravity / 100);
    return [ping];
  },
};

// 168
const burstFromAwakeningCount: MonsterActive = {
  teamEffect: ([_turns, awakening1, awakening2, awakening3, awakening4, awakening5, awakening6, mult100], { team }) => {
    const awakenings = [awakening1, awakening2, awakening3, awakening4, awakening5, awakening6].filter(Boolean);
    team.state.burst = {
      awakenings,
      awakeningScale: mult100 / 100,
      multiplier: 1,
      typeRestrictions: [],
      attrRestrictions: [],
    };
    team.update();
  },
};

// 173
const voidAbsorb: MonsterActive = {
  teamEffect: ([_, includeAttribute, _a, includeDamage], { team }) => {
    team.state.voidAttributeAbsorb = team.state.voidAttributeAbsorb || Boolean(includeAttribute);
    team.state.voidDamageAbsorb = team.state.voidDamageAbsorb || Boolean(includeDamage);
    team.update();
  },
};

// 184
const noSkyfall: MonsterActive = {};

// 191
const voidDamageVoid: MonsterActive = {
  teamEffect: (_, { team }) => {
    team.state.voidDamageVoid = true;
    team.update();
  },
};

// 195
const pureSuicide: MonsterActive = {
  teamEffect: ([suicideTo], { team }) => {
    team.state.currentHp = Math.max(1, Math.floor(team.state.currentHp * suicideTo / 100));
    team.update();
  },
};

// 202
const transform: MonsterActive = {
  teamEffect: ([id], { source, team }) => {
    source.transformedTo = id;
    team.update();
  },
};

const ACTIVE_GENERATORS: Record<number, MonsterActive> = {
  0: scalingAttackToAllEnemies,
  1: flatAttackToAllEnemies,
  2: scalingAttackRandomToSingleEnemy,
  3: shield,
  4: poison,
  5: changeTheWorld, // No effect right now.
  6: gravity,
  8: flatHeal,
  9: orbChange, // No effect right now.
  10: orbRefresh, // No effect.
  18: delay,
  19: defenseBreak,
  20: orbChangeDouble, // No effect.
  35: scalingAttackAndHeal,
  37: scalingAttackToOneEnemy,
  42: flatAttackToAttribute,
  50: attrOrRcvBurst,
  51: massAttack, // No effect
  52: enhanceOrbs, // No effect
  55: fixedDamageToOneEnemy,
  56: fixedDamageToAllEnemies,
  58: scalingAttackRandomToAllEnemies,
  59: scalingAttackRandomToOneEnemy,
  71: fullBoard, // No effect.
  84: scalingAttackAndSuicideSingle,
  85: scalingAttackAndSuicideMass,
  86: flatAttackAndSuicideSingle,
  87: flatAttackAndSuicideMass,
  88: burstForOneType,
  90: burstForTwoAttributes,
  92: burstForTwoTypes,
  93: leadSwap,
  110: grudgeStrike,
  115: elementalScalingAttackAndHeal,
  116: multipleActiveSkills,
  117: catchAllCleric,
  127: orbChangeColumn,
  132: timeExtend,
  138: multipleActiveSkills,
  141: randomOrbSpawn,
  142: selfAttributeChange,
  144: scalingAttackFromTeam,
  146: haste, // No effect
  153: enemyAttributeChange,
  156: effectFromAwakeningCount,
  160: addCombos,
  161: trueGravity,
  168: burstFromAwakeningCount,
  173: voidAbsorb,
  184: noSkyfall, // No effect.
  188: fixedDamageToOneEnemy, // Same as 55.
  191: voidDamageVoid,
  195: pureSuicide,
  202: transform,
};

function getGeneratorIfExists(activeId: number): MonsterActive | void {
  if (!floof.model.playerSkills[activeId]) {
    debug.print(`Active ID not found: ${activeId}`);
    return;
  }
  const active = floof.model.playerSkills[activeId];
  const generator = ACTIVE_GENERATORS[active.internalEffectId];
  if (!generator) {
    debug.print(`Active Internal Effect ${active.internalEffectId} not implemented`);
    return;
  }
  return generator;
}

function damage(activeId: number, ctx: DamageContext): DamagePing[] {
  const generator = getGeneratorIfExists(activeId);
  if (!generator || !generator.damage) {
    return [];
  }
  return generator.damage(floof.model.playerSkills[activeId].internalEffectArguments, ctx);
}

function teamEffect(activeId: number, ctx: TeamEffectContext): void {
  const generator = getGeneratorIfExists(activeId);
  if (!generator || !generator.teamEffect) {
    return;
  }
  return generator.teamEffect(floof.model.playerSkills[activeId].internalEffectArguments, ctx);
}

function enemyEffect(activeId: number, ctx: EnemyEffectContext): void {
  const generator = getGeneratorIfExists(activeId);
  if (!generator || !generator.enemyEffect) {
    return;
  }
  return generator.enemyEffect(floof.model.playerSkills[activeId].internalEffectArguments, ctx);
}

function boardEffect(activeId: number, ctx: ComboContainer): void {
  const generator = getGeneratorIfExists(activeId);
  if (!generator || !generator.boardEffect) {
    return;
  }
  return generator.boardEffect(floof.model.playerSkills[activeId].internalEffectArguments, ctx);
}

export {
  MonsterActive,
  damage,
  teamEffect,
  boardEffect,
  enemyEffect,
}
