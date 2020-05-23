import { floof } from './ilmina_stripped';
import { EnemyInstance } from './enemy_instance';
import { idxsFromBits, AttributeToName, TypeToName, addCommas } from './common';
import { Team } from './player_team';

interface SkillContext {
  ai: number;
  id: number;
  rnd: number;

  aiArgs: number[];
  effectId: number;
  name: string;
  text: string;
  skillArgs: number[];
  ratio: number;
}

interface AiContext {
  cardId: number;
  isPreempt: boolean;
  lv: number;
  atk: number;
  attribute: number;
  hpPercent: number;
  teamIds: number[];
  teamAttributes: Set<number>;
  teamTypes: Set<number>;
  bigBoard: boolean;

  // If another enemy exists alongside this monster, set to positive.
  // If this is 0, then allows resurrect.
  otherEnemyHp: number;

  combo: number;

  charges: number;
  flags: number;
  counter: number;
}

interface GameContext {
  enemy: EnemyInstance,
  team: Team,
}

enum SkillType {
  EFFECT = 0,
  LOGIC = 1,
}

interface EnemySkillEffect {
  textify: (skillCtx: SkillContext, ctx: AiContext) => string,
  condition: (skillCtx: SkillContext, ctx: AiContext) => boolean,
  aiEffect: (skillCtx: SkillContext, ctx: AiContext) => void,
  effect: (skillCtx: SkillContext, ctx: GameContext) => void,
  // 0 is terminate,
  // -1 is go to next.
  // >= 1 is go to index.
  goto: (skillCtx: SkillContext, ctx: AiContext) => number,
  type?: SkillType,
}

const TO_NEXT = -1;
const TERMINATE = 0;

function rangeTurns(begin: number, end: number): string {
  begin = begin || 0;
  const suffix = end == 1 ? ' turn' : ' turns';
  if (begin == end) {
    return addCommas(end) + suffix;
  }
  return `${addCommas(begin)}-${addCommas(end)}${suffix}`;
}

// 1
const bindRandom: EnemySkillEffect = {
  textify: ({ skillArgs }) => {
    const [count, min, max] = skillArgs;
    return `Binds ${count} of all monsters for ${rangeTurns(min, max)}.`
  },
  condition: () => true,
  aiEffect: () => { },
  effect: () => {
    // let [count, min, max] = skillArgs;
    console.warn('Bind not yet supported');
    // team.bind(count, Boolean(positionMask & 1), Boolean(positionMask & 2), Boolean(positionMask & 4));
  },
  goto: () => TERMINATE,
};

// 2
const bindAttr: EnemySkillEffect = {
  textify: ({ skillArgs }, { atk }) => {
    const [color, min, max] = skillArgs;
    return `Binds ${AttributeToName.get(color || 0)} monsters for ${rangeTurns(min, max)}. If none exist and part of skillset, hits for ${addCommas(atk)}. Else continue.`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { team, enemy }) => {
    const a = skillArgs[0];
    if (team.getActiveTeam().every((m) => !m.isAttribute(a))) {
      team.damage(enemy.getAtk(), enemy.getAttribute());
      return;
    }
    console.warn('Bind not yet supported');
    // team.bind(count, Boolean(positionMask & 1), Boolean(positionMask & 2), Boolean(positionMask & 4));
  },
  goto: ({ skillArgs }, { teamAttributes }) => teamAttributes.has(skillArgs[0] || 0) ? TERMINATE : TO_NEXT,
};

// 3
const bindType: EnemySkillEffect = {
  textify: ({ skillArgs }, { atk }) => {
    const [type, min, max] = skillArgs;
    return `Binds ${TypeToName.get(type)} monsters for ${rangeTurns(min, max)}. If none exist, hits for ${addCommas(atk)}.`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { enemy, team }) => {
    const t = skillArgs[0];
    if (team.getActiveTeam().every((m) => !m.isType(t))) {
      team.damage(enemy.getAtk(), enemy.getAttribute());
      return;
    }
    console.warn('Bind not yet supported');
    // team.bind(count, Boolean(positionMask & 1), Boolean(positionMask & 2), Boolean(positionMask & 4));
  },
  goto: ({ skillArgs }, { teamTypes }) => teamTypes.has(skillArgs[0] || 0) ? TERMINATE : TO_NEXT,
};

// 4
const orbChange: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Convert ${AttributeToName.get(skillArgs[0] || 0)} to ${AttributeToName.get(skillArgs[1])}. If none exists, Continue.`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  // TODO: Change this to TO_NEXT if there are no convertible orbs.
  goto: () => TERMINATE,
}

// 5
const blindBoard: EnemySkillEffect = {
  textify: () => 'Blind board.',
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TERMINATE,
};

// 6
const dispelBuffs: EnemySkillEffect = {
  textify: () => 'Dispel player buffs',
  condition: () => true,
  aiEffect: () => { },
  effect: (_, { team }) => {
    team.resetState();
  },
  goto: () => TERMINATE,
};

// 7
const healOrAttack: EnemySkillEffect = {
  textify: ({ skillArgs }, { atk }) => `If player health less than ${addCommas(atk)}, deal ${addCommas(atk)}, otherwise heal for ${skillArgs[0]}-${skillArgs[1]}%`,
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { team, enemy }) => {
    if (team.state.currentHp <= enemy.getAtk()) {
      team.damage(enemy.getAtk(), enemy.getAttribute());
      return;
    }
    const [min, max] = skillArgs;
    const healAmount = Math.ceil((Math.random() * (max - min) + min) * enemy.getHp() / 100);
    if (enemy.currentHp + healAmount > enemy.getHp()) {
      enemy.currentHp = enemy.getHp();
    } else {
      enemy.currentHp += healAmount;
    }
  },
  goto: () => TERMINATE,
};

// 8
const enhanceBasicAttack: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Force next move to be a ${100 + skillArgs[0]}-${100 + skillArgs[1]}% basic attack`,
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { enemy }) => {
    const [min, max] = skillArgs;
    const enhance = Math.ceil(Math.random() * (max - min)) + min;
    enemy.attackMultiplier = enhance / 100 + 1;
    enemy.forceAttack = true;
  },
  goto: () => TERMINATE,
}

// 12
const singleOrbToJammer: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Convert ${skillArgs[0] == -1 ? 'Random' : AttributeToName.get(skillArgs[0])} color into Jammer.`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TERMINATE,
};

// 13
const multiOrbToJammer: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Randomly convert ${skillArgs[0]} colors into Jammer`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TERMINATE,
};

// 14
const skillBind: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Skill bind for ${rangeTurns(skillArgs[0], skillArgs[1])}.`,
  condition: () => true,
  aiEffect: () => { },
  effect: (_, { team }) => {
    team.skillBind();
  },
  goto: () => TERMINATE,
};

// 15
const multihit: EnemySkillEffect = {
  textify: ({ skillArgs }, { atk }) => {
    const [min, max, percent] = skillArgs;
    if (min == max) {
      return `Hit ${max}x${percent}% for ${addCommas(max * Math.ceil(percent / 100 * atk))}`;
    }
    return `Hit ${min}-${max}x${percent}% for ${addCommas(min * Math.ceil(percent / 100 * atk))}-${addCommas(max * Math.ceil(percent / 100 * atk))}`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { enemy, team }) => {
    const [min, max, percent] = skillArgs;
    const hitTimes = Math.floor(Math.random() * (max - min)) + min;
    const damage = Math.ceil(percent / 100 * enemy.getAtk());
    for (let i = 0; i < hitTimes; i++) {
      team.damage(damage, enemy.getAttribute());
    }
  },
  goto: () => TERMINATE,
}

// 17
const enrage: EnemySkillEffect = {
  textify: ({ skillArgs }) => {
    return `Attack set to ${skillArgs[2]}% for ${skillArgs[1]} when alone.`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { enemy }) => {
    enemy.attackMultiplier = skillArgs[2] / 100;
  },
  goto: (_, { otherEnemyHp }) => otherEnemyHp == 0 ? TERMINATE : TO_NEXT,
};

// 18
const enrageFromStatusAilment: EnemySkillEffect = {
  textify: ({ skillArgs }) => {
    return `Attack set to ${skillArgs[1]}% for ${skillArgs[0]} turns when afflicted with status ailment.`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { enemy }) => {
    enemy.attackMultiplier = skillArgs[1] / 100;
  },
  goto: () => {
    // TODO: Determine if monster already buffed or monster afflicted with status.
    // return TERMINATE;
    return TO_NEXT;
  },
};

// 17
const enrageFromMinimumAttacks: EnemySkillEffect = {
  textify: ({ skillArgs }) => {
    return `Attack set to ${skillArgs[2]}% for ${skillArgs[1]} after ${skillArgs[0]} turns. Unclear`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { enemy }) => {
    enemy.attackMultiplier = skillArgs[2] / 100;
  },
  goto: () => {
    // TODO: Determine if monster already buffed and if condition has happened.
    return TERMINATE;
  },
};

// 20
const statusShield: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Void status ailments for ${skillArgs[0]} turns`,
  condition: () => true,
  aiEffect: () => { },
  effect: (_, { enemy }) => {
    enemy.statusShield = true;
    enemy.poison = 0;
    enemy.delayed = false;
    enemy.ignoreDefensePercent = 0;
  },
  goto: () => TERMINATE,
};

// 22
const setFlagAndContinue: EnemySkillEffect = {
  textify: (skillCtx) => {
    const flagPositions = idxsFromBits(skillCtx.ai);
    return `Set Flag(s) ${flagPositions} and Continue.`;
  },
  condition: () => true,
  aiEffect: (skillCtx, ctx) => {
    ctx.flags |= skillCtx.ai;
  },
  effect: () => { },
  goto: () => TO_NEXT,
  type: SkillType.LOGIC,
}

// 23
const goto0IndexIfFlag: EnemySkillEffect = {
  textify: ({ ai, rnd }) => {
    return `If Flag ${idxsFromBits(ai)}, go to skill at index ${rnd - 1}`;
  },
  condition: ({ ai }, { flags }) => {
    return Boolean(flags & ai);
  },
  aiEffect: () => { },
  effect: () => { },
  goto: (skillCtx, ctx) => {
    return gotoIfFlag.condition(skillCtx, ctx) ? skillCtx.rnd : TO_NEXT;
  },
  type: SkillType.LOGIC,
};

// 24
const unsetFlagAndContinue: EnemySkillEffect = {
  textify: (skillCtx) => {
    const flagPositions = idxsFromBits(skillCtx.ai);
    return `Unset Flag(s) ${flagPositions} and Continue.`;
  },
  condition: () => true,
  aiEffect: (skillCtx, ctx) => {
    ctx.flags &= ~skillCtx.ai;
  },
  effect: () => { },
  goto: () => TO_NEXT,
  type: SkillType.LOGIC,
};

// 25
const setCounterToAiAndContinue: EnemySkillEffect = {
  textify: ({ ai }) => `Set counter to ${ai} and Continue.`,
  condition: () => true,
  aiEffect: ({ ai }, ctx) => {
    ctx.counter = ai;
  },
  effect: () => { },
  goto: () => TO_NEXT,
  type: SkillType.LOGIC,
};

// 26
const incrementCounterAndContinue: EnemySkillEffect = {
  textify: () => `Increment counter and continue`,
  condition: () => true,
  aiEffect: (_, ctx) => {
    ctx.counter++;
  },
  effect: () => { },
  goto: () => TO_NEXT,
  type: SkillType.LOGIC,
};

// 27
const decrementCounterAndContinue: EnemySkillEffect = {
  textify: () => `Decrement counter and continue`,
  condition: () => true,
  aiEffect: (_, ctx) => {
    ctx.counter--;
  },
  effect: () => { },
  goto: () => TO_NEXT,
  type: SkillType.LOGIC,
};

// 28
const gotoIfHpBelow: EnemySkillEffect = {
  textify: ({ ai, rnd }) => `If HP <= ${ai}, go to skill ${rnd}`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: ({ ai, rnd }, { hpPercent }) => hpPercent < ai ? rnd - 1 : TO_NEXT,
  type: SkillType.LOGIC,
};

// 29
const gotoIfHpAbove: EnemySkillEffect = {
  textify: ({ ai, rnd }) => `If HP >= ${ai}, go to skill ${rnd}`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: ({ ai, rnd }, { hpPercent }) => hpPercent >= ai ? rnd - 1 : TO_NEXT,
  type: SkillType.LOGIC,
};

// 30
const gotoIfCounterLesser: EnemySkillEffect = {
  textify: ({ ai, rnd }) => `If counter < ${ai}, go to skillset ${rnd}`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: ({ ai, rnd }, { counter }) => counter <= ai ? rnd - 1 : TO_NEXT,
  type: SkillType.LOGIC,
};

// 31
const gotoIfCounterEqual: EnemySkillEffect = {
  textify: ({ ai, rnd }) => `If counter = ${ai}, go to skillset ${rnd}`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: ({ ai, rnd }, { counter }) => counter == ai ? rnd - 1 : TO_NEXT,
  type: SkillType.LOGIC,
};

// 32
const gotoIfCounterGreater: EnemySkillEffect = {
  textify: ({ ai, rnd }) => `If counter >= ${ai}, go to skillset ${rnd}`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: ({ ai, rnd }, { counter }) => counter >= ai ? rnd - 1 : TO_NEXT,
  type: SkillType.LOGIC,
};

// 33
const gotoIfLvLesser: EnemySkillEffect = {
  textify: ({ ai, rnd }) => `If enemy level <${ai}, go to skill at ${rnd}`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: ({ ai, rnd }, { lv }) => lv < ai ? rnd - 1 : TO_NEXT,
  type: SkillType.LOGIC,
};

// 34
const gotoIfLvEqual: EnemySkillEffect = {
  textify: ({ ai, rnd }) => `If enemy level is ${ai}, go to skill at ${rnd}`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: ({ ai, rnd }, { lv }) => lv == ai ? rnd - 1 : TO_NEXT,
  type: SkillType.LOGIC,
};

// 35
const gotoIfLvGreater: EnemySkillEffect = {
  textify: ({ ai, rnd }) => `If enemy level >${ai}, go to skill at ${rnd}`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: ({ ai, rnd }, { lv }) => lv > ai ? rnd - 1 : TO_NEXT,
  type: SkillType.LOGIC,
};

// 36
const fallbackAttack: EnemySkillEffect = {
  textify: (_, { atk }) => {
    return `Attack of ${addCommas(atk)} used if none of the above are available.`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TERMINATE,
};

// 37
const displayCounterOrContinue: EnemySkillEffect = {
  textify: () => 'Decrement counter by 1. If positive, display and terminate, else if 0, continue.',
  condition: () => true,
  aiEffect: (_, ctx) => {
    ctx.counter--;
  },
  effect: (_, { enemy }) => {
    if (enemy.counter) {
      console.log(`Countdown: ${enemy.counter}`);
    }
  },
  goto: (_, { counter }) => {
    return counter > 0 ? TERMINATE : TO_NEXT;
  },
  type: SkillType.LOGIC,
};

// 38
const setCounterAndContinue: EnemySkillEffect = {
  textify: ({ rnd }) => `If counter = 0, set counter to ${rnd}`,
  condition: () => true,
  aiEffect: ({ rnd }, ctx) => {
    if (!ctx.counter) {
      ctx.counter = rnd;
    }
  },
  effect: () => { },
  goto: () => TO_NEXT,
  type: SkillType.LOGIC,
};

// 39
const timeDebuff: EnemySkillEffect = {
  textify: ({ skillArgs }) => {
    const [turns, flatDebuff, timePercent] = skillArgs;
    if (flatDebuff) {
      if (flatDebuff > 0) {
        return `Reduce time by ${flatDebuff / 10}s for ${turns} turns`;
      } else {
        return `Increase time by ${flatDebuff / -10}s for ${turns} turns`;
      }
    }
    return `Time set to ${timePercent}% for ${turns} turns`;
  },
  // Determine if already debuffed by opponent?!
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { team }) => {
    const [flatDebuff, timePercent] = skillArgs.slice(1);
    team.state.timeBonus = flatDebuff ? flatDebuff / -0.1 : timePercent / 100;
    team.state.timeIsMult = !flatDebuff;
  },
  goto: () => TERMINATE,
};

// 40
const suicide: EnemySkillEffect = {
  textify: () => `Set own health to 0.`,
  condition: () => true,
  aiEffect: () => { },
  effect: (_, { enemy }) => {
    enemy.currentHp = 0;
  },
  // Currently never occurs in simulations.
  goto: () => TERMINATE,
}

// 43
const gotoIfFlag: EnemySkillEffect = {
  textify: ({ ai, rnd }) => {
    return `If Flag ${idxsFromBits(ai)}, go to skill at index ${rnd}`;
  },
  condition: ({ ai }, { flags }) => {
    return Boolean(flags & ai);
  },
  aiEffect: () => { },
  effect: () => { },
  goto: (skillCtx, ctx) => {
    return gotoIfFlag.condition(skillCtx, ctx) ? skillCtx.rnd - 1 : TO_NEXT;
  },
  type: SkillType.LOGIC,
};

// 44
const orFlagsAndContinue: EnemySkillEffect = {
  textify: ({ ai }) => {
    return `OR flags ${idxsFromBits(ai)}, and Continue.`;
  },
  condition: () => true,
  aiEffect: ({ ai }, ctx) => {
    ctx.flags |= ai;
  },
  effect: () => { },
  goto: () => TO_NEXT,
  type: SkillType.LOGIC,
};

// 45
const toggleFlagsAndContinue: EnemySkillEffect = {
  textify: ({ ai }) => {
    return `Toggle flags ${idxsFromBits(ai)}, and Continue.`;
  },
  condition: ({ ai }, { flags }) => {
    return Boolean(flags & ai);
  },
  aiEffect: ({ ai }, ctx) => {
    ctx.flags ^= ai;
  },
  effect: () => { },
  goto: () => TO_NEXT,
  type: SkillType.LOGIC,
};

// 46
const changeAttribute: EnemySkillEffect = {
  textify: ({ skillArgs }) => {
    if (!skillArgs.length) {
      skillArgs.push(0);
    }
    if (!skillArgs.every(Boolean)) {
      skillArgs = skillArgs.filter(Boolean);
      skillArgs.push(0);
    }
    const attrs = [...(new Set(skillArgs))].map(i => AttributeToName.get(i)).join(',');
    return `Change attribute to one of [${attrs}]`;
  },
  condition: (skillCtx, ctx) => {
    return ctx.attribute != skillCtx.skillArgs[0];
  },
  aiEffect: () => { },
  effect: ({ skillArgs }, { enemy }) => {
    if (!skillArgs.length) {
      skillArgs.push(0);
    }
    if (!skillArgs.every(Boolean)) {
      skillArgs = skillArgs.filter(Boolean);
      skillArgs.push(0);
    }
    const available = skillArgs.filter((c) => c != enemy.getAttribute());
    enemy.currentAttribute = available[Math.floor(Math.random() * available.length)];
  },
  goto: () => TERMINATE,
};

// 47
const oldPreemptiveAttack: EnemySkillEffect = {
  textify: ({ skillArgs }, { atk }) => {
    return `Preemptive: Do ${skillArgs[0]}% (${addCommas(Math.ceil(skillArgs[1] / 100 * atk))})`;
  },
  condition: () => true,
  effect: ({ skillArgs }, { team, enemy }) => {
    team.damage(Math.ceil(enemy.getAtk() * skillArgs[1] / 100), enemy.getAttribute());
  },
  aiEffect: () => { },
  goto: (_, ctx: AiContext) => ctx.isPreempt ? TERMINATE : TO_NEXT,
};

// 48
const attackAndSingleOrbChange: EnemySkillEffect = {
  textify: ({ skillArgs }, { atk }) => {
    const [percent, from, to] = skillArgs;
    const damage = addCommas(Math.ceil(percent / 100 * atk));
    const fromString = from == -1 ? 'Random Color' : AttributeToName.get(from);
    const toString = to == -1 ? 'Random Color' : AttributeToName.get(to);
    return `Hit for ${skillArgs[0]}% (${damage}) and convert ${fromString} to ${toString}`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { team, enemy }) => {
    team.damage(Math.ceil(skillArgs[0] * enemy.getAtk() / 100), enemy.getAttribute());
    // Convert orbs?!
  },
  goto: () => TERMINATE,
};

// 49
const preemptiveMarker: EnemySkillEffect = {
  condition: (skillCtx, conditionContext) => {
    return conditionContext.lv >= skillCtx.skillArgs[0];
  },
  effect: () => { },
  aiEffect: () => { },
  textify: ({ skillArgs }) => {
    return `Preemptive: If level at least ${skillArgs[0]}, do next skillset.`;
  },
  goto: (skillCtx, ctx: AiContext) => {
    if (!ctx.isPreempt || preemptiveMarker.condition(skillCtx, ctx)) {
      return TO_NEXT;
    }
    return TERMINATE;
  },
  type: SkillType.LOGIC,
};

// 50
const gravity: EnemySkillEffect = {
  textify: ({ skillArgs }) => `${skillArgs[0]}% gravity of player's current health (rounded down)`,
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { team, enemy }) => {
    team.damage(Math.floor(team.state.currentHp * skillArgs[0] / 100), enemy.getAttribute());
  },
  goto: () => TERMINATE,
};

// 52
const resurrect: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Revive ally with ${skillArgs[0]}% HP. If not alone, Continue`,
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { enemy }) => {
    enemy.otherEnemyHp = skillArgs[0];
  },
  // Currently never occurs in simulations.
  goto: (_, { otherEnemyHp }) => otherEnemyHp ? TO_NEXT : TERMINATE,
};

// 53
const attributeAbsorb: EnemySkillEffect = {
  textify: ({ skillArgs }) => {
    const [minTurns, maxTurns, attrIdxs] = skillArgs;
    const attrs = idxsFromBits(attrIdxs).map((c) => AttributeToName.get(c)).join(', ');
    return `For ${rangeTurns(minTurns, maxTurns)}, absorb ${attrs}.`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { enemy }) => {
    enemy.attributeAbsorb = idxsFromBits(skillArgs[2]);
  },
  goto: () => TERMINATE,
};

// 54
const directedBindAll: EnemySkillEffect = {
  textify: ({ skillArgs }) => {
    const [positionMask, min, max] = skillArgs;
    let text = ['All Monsters'];
    if (positionMask) {
      text = [];
      if (positionMask & 1) {
        text.push('Leader');
      }
      if (positionMask & 2) {
        text.push('Helper');
      }
      if (positionMask & 4) {
        text.push('Subs');
      }
    }
    return `Binds ${text.join(' and ')} for ${min} to ${max} turns`
  },
  condition: () => true,
  aiEffect: () => { },
  effect: () => {
    // let [positionMask, min, max] = skillArgs;
    console.warn('Bind not yet supported');
    // positionMask = positionMask || 7;
    // team.bind(count, Boolean(positionMask & 1), Boolean(positionMask & 2), Boolean(positionMask & 4));
  },
  goto: () => TERMINATE,
};

// 55
const healPlayer: EnemySkillEffect = {
  textify: ({ skillArgs }) => {
    const [min, max] = skillArgs;
    return `Heal player for ${min}-${max}% HP`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { team }) => {
    const [min, max] = skillArgs;
    const percent = Math.floor(Math.random() * (max - min)) + min;
    const maxHp = team.getHp();
    const toHp = (maxHp * percent / 100 + team.state.currentHp);
    team.state.currentHp = toHp < maxHp ? toHp : maxHp;
  },
  goto: () => TERMINATE,
};

// 56
const singleOrbToPoison: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Convert ${skillArgs[0] == -1 ? 'Random' : AttributeToName.get(skillArgs[0])} color into Poison`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TERMINATE,
};

// 57
const multiOrbToPoison: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Randomly convert ${skillArgs[0]} colors into Poison`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TERMINATE,
};

// 60
const randomPoisonSpawn: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Randomly spawn ${skillArgs[0]}x Poison orbs${skillArgs[1] ? ' excluding hearts' : ''}`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { }, // Implement later?!
  goto: () => TERMINATE,
};

// 62
const attackAndBlind: EnemySkillEffect = {
  textify: ({ skillArgs }, { atk }) => {
    return `Hits once for ${skillArgs[0]} % (${addCommas(Math.ceil(skillArgs[0] / 100 * atk))}) and blinds the board.`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { team, enemy }) => {
    let [percent] = skillArgs;
    team.damage(Math.ceil(enemy.getAtk() * percent / 100), enemy.getAttribute());
  },
  goto: () => TERMINATE,
};

// 63
const attackAndBind: EnemySkillEffect = {
  textify: ({ skillArgs }, { atk }) => {
    const [percent, min, max, positionMask, count] = skillArgs;
    let text = ['All Monsters'];
    if (positionMask) {
      text = [];
      if (positionMask & 1) {
        text.push('Leader');
      }
      if (positionMask & 2) {
        text.push('Helper');
      }
      if (positionMask & 4) {
        text.push('Subs');
      }
    }
    return `Hits once for ${percent} % (${addCommas(Math.ceil(percent / 100 * atk))}) and binds ${count} of ${text.join(' and ')} for ${rangeTurns(min, max)}.`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { team, enemy }) => {
    // let [percent, _min, _max, positionMask, count] = skillArgs;
    team.damage(Math.ceil(enemy.getAtk() * skillArgs[0] / 100), enemy.getAttribute());
    console.warn('Bind not yet supported');
    // positionMask = positionMask || 7;
    // team.bind(count, Boolean(positionMask & 1), Boolean(positionMask & 2), Boolean(positionMask & 4));
  },
  goto: () => TERMINATE,
};

// 64
const attackAndPoisonSpawn: EnemySkillEffect = {
  textify: ({ skillArgs }, { atk }) => {
    const [percent, count, excludeHearts] = skillArgs;
    const damage = addCommas(Math.ceil(percent / 100 * atk));
    return `Hit for ${skillArgs[0]}% (${damage}) and spawn ${count} Poison Orbs${excludeHearts ? ' ignoring hearts' : ''}`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { team, enemy }) => {
    team.damage(Math.ceil(skillArgs[0] * enemy.getAtk() / 100), enemy.getAttribute());
    // Convert orbs?!
  },
  goto: () => TERMINATE,
}

// 65
const bindSubs: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Binds ${skillArgs[0]} for ${rangeTurns(skillArgs[1], skillArgs[2])}.`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => {
    console.warn('Binds not yet supported');
  },
  goto: () => TERMINATE,
}

// 66
const skipTurn: EnemySkillEffect = {
  textify: () => 'Skip Turn',
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TERMINATE,
};

// 67
const comboAbsorb: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Absorb ${skillArgs[2]} or fewer combos for ${rangeTurns(skillArgs[0], skillArgs[1])}.`,
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { enemy }) => {
    enemy.comboAbsorb = skillArgs[2];
  },
  goto: () => TERMINATE,
};

// 68
const skyfall: EnemySkillEffect = {
  textify: ({ skillArgs }) => {
    const orbs = idxsFromBits(skillArgs[0]).map((c) => AttributeToName.get(c));
    return `For ${skillArgs[1]} to ${skillArgs[2]} turns, set ${orbs} skyfall bonus to ${skillArgs[3]}% `;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TERMINATE,
};

// 69
const transformAnimation: EnemySkillEffect = {
  textify: () => `[Passive] On death, transform.`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TO_NEXT,
};

// 71
const voidDamage: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Void Damage of >= ${addCommas(skillArgs[2])} for ${skillArgs[0]}} turns.`,
  // Add conditional that this can't happen again.
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { enemy, team }) => {
    if (enemy.damageVoid) {
      team.damage(enemy.getAtk(), enemy.getAttribute());
      return;
    }
    enemy.damageVoid = skillArgs[2];
  },
  goto: () => TERMINATE,
}

// 72
const attributeResist: EnemySkillEffect = {
  textify: ({ skillArgs }) => `[Passive] ${skillArgs[1]}% ${idxsFromBits(skillArgs[0]).map(c => AttributeToName.get(c))} Resist.`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TO_NEXT,
};

// 73
const resolve: EnemySkillEffect = {
  textify: ({ skillArgs }) => `[Passive] ${skillArgs[0]}% Resolve.`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TO_NEXT,
};

// 74
const shield: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Damage reduced by ${skillArgs[1]}% for ${skillArgs[0]} turns`,
  // TODO: skip if active.
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { enemy }) => {
    enemy.shieldPercent = skillArgs[1];
  },
  goto: () => TERMINATE,
};

// 75
const leadSwap: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Lead swap for ${skillArgs[0]} turns`,
  // TODO: skip if active.
  condition: () => true,
  aiEffect: () => { },
  effect: (_, { team, enemy }) => {
    // Cannot swap an already swapped team.
    const subs = team.getActiveTeam().slice(1, 5).filter(m => m.getId() > 0).length;
    if (team.state.leadSwaps[team.activeTeamIdx] || !subs) {
      team.damage(enemy.getAtk(), enemy.getAttribute());
      return;
    }
    team.updateState({
      leadSwap: 1 + Math.floor(Math.random() * subs),
    });
  },
  goto: () => TERMINATE,
};

// 76
const columnChange: EnemySkillEffect = {
  textify: ({ skillArgs }) => {
    const [c1, o1, c2, o2, c3, o3, c4, o4, c5, o5] = skillArgs;
    let text = 'Convert '
    let columns = [];
    for (const [c, o] of [[c1, o1], [c2, o2], [c3, o3], [c4, o4], [c5, o5]]) {
      if (c == undefined) {
        continue;
      }
      columns.push(`column(s) ${idxsFromBits(c)} into ${idxsFromBits(o).map(i => AttributeToName.get(i))}`);
    }
    text += columns.join(' and ');
    return text + '.';
  }, condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TERMINATE,
};

// 77
const attackAndColumnChange: EnemySkillEffect = {
  textify: ({ skillArgs }, { atk }) => {
    const [c1, o1, c2, o2, c3, o3, percent] = skillArgs;
    let text = `Deal ${percent}% (${addCommas(Math.ceil(percent * atk / 100))}), Convert `
    let columns = [];
    for (const [c, o] of [[c1, o1], [c2, o2], [c3, o3]]) {
      if (c == undefined) {
        continue;
      }
      columns.push(`column(s) ${idxsFromBits(c)} into ${idxsFromBits(o).map(i => AttributeToName.get(i))}`);
    }
    text += columns.join(' and ');
    return text + '.';
  },
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { team, enemy }) => {
    const damage = Math.ceil(enemy.getAtk() / 100 * skillArgs[6]);
    team.damage(damage, enemy.getAttribute());
  },
  goto: () => TERMINATE,
};

// 78
const rowChange: EnemySkillEffect = {
  textify: ({ skillArgs }) => {
    const [r1, o1, r2, o2, r3, o3, r4, o4, r5, o5] = skillArgs;
    let text = 'Convert '
    let columns = [];
    for (const [r, o] of [[r1, o1], [r2, o2], [r3, o3], [r4, o4], [r5, o5]]) {
      if (r == undefined) {
        continue;
      }
      columns.push(`row(s) ${idxsFromBits(r)} into ${idxsFromBits(o).map(i => AttributeToName.get(i))}`);
    }
    text += columns.join(' and ');
    return text + '.';
  },
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TERMINATE,
};

// 79
const attackAndRowChange: EnemySkillEffect = {
  textify: ({ skillArgs }, { atk }) => {
    const [r1, o1, r2, o2, r3, o3, percent] = skillArgs;
    let text = `Deal ${percent}% (${addCommas(Math.ceil(percent * atk / 100))}), Convert `
    let columns = [];
    for (const [r, o] of [[r1, o1], [r2, o2], [r3, o3]]) {
      if (!r == undefined) {
        continue;
      }
      columns.push(`row(s) ${idxsFromBits(r)} into ${idxsFromBits(o).map(i => AttributeToName.get(i))}`);
    }
    text += columns.join(' and ');
    return text + '.';
  },
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { team, enemy }) => {
    const damage = Math.ceil(enemy.getAtk() / 100 * skillArgs[6]);
    team.damage(damage, enemy.getAttribute());
  },
  goto: () => TERMINATE,
};

// 81
const attackAndChangeBoardOld: EnemySkillEffect = {
  textify: ({ skillArgs }, { atk }) => {
    const colors = [];
    for (let i = 1; i < skillArgs.length; i++) {
      if (skillArgs[i] == -1) {
        break;
      }
      colors.push(AttributeToName.get(skillArgs[i]));
    }
    return `Attack of ${skillArgs[0]}% (${addCommas(Math.ceil(skillArgs[0] * atk / 100))}) and change board to ${colors.join(', ')}`;
  },
  // TODO: Add conditional depending on board.
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { enemy, team }) => {
    const damage = Math.ceil(skillArgs[0] / 100 * enemy.getAtk());
    team.damage(damage, enemy.getAttribute());
  },
  goto: () => TERMINATE,
}

// 82
const attackWithoutName: EnemySkillEffect = {
  textify: (_, { atk }) => {
    return `Attack of ${addCommas(atk)}.`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TERMINATE,
};

// 83
const skillset: EnemySkillEffect = {
  textify: (skillCtx, ctx) => {
    const subEffects = skillCtx.skillArgs.map((skillId) => {
      const effect = floof.model.enemySkills[skillId];
      const newContext: SkillContext = {
        id: skillId,
        ai: skillCtx.ai,
        rnd: skillCtx.rnd,

        ratio: effect.ratio,
        effectId: effect.internalEffectId,
        name: effect.name,
        text: effect.usageText,
        aiArgs: [...effect.aiArgs],
        skillArgs: [...effect.skillArgs],
      }
      return ` * ${textify(ctx, newContext)} `;
    }).join('\n');
    return `Use all of the following: \n` + subEffects;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: (skillCtx, ctx) => {
    for (const skillId of skillCtx.skillArgs) {
      const eff = floof.model.enemySkills[skillId];
      const newContext: SkillContext = {
        id: skillId,
        ai: skillCtx.ai,
        rnd: skillCtx.rnd,

        ratio: eff.ratio,
        effectId: eff.internalEffectId,
        name: eff.name,
        text: eff.usageText,
        aiArgs: [...eff.aiArgs],
        skillArgs: [...eff.skillArgs],
      }
      effect(newContext, ctx);
    }
  },
  goto: () => TERMINATE,
};

// 84
const boardChange: EnemySkillEffect = {
  textify: ({ skillArgs }) => {
    return `Change board to ${idxsFromBits(skillArgs[0]).map(c => AttributeToName.get(c))} `;
  },
  // TODO: Add conditional depending on board.
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TERMINATE,
}

// 85
const attackAndChangeBoard: EnemySkillEffect = {
  textify: ({ skillArgs }, { atk }) => {
    return `Attack of ${skillArgs[0]}% (${addCommas(Math.ceil(skillArgs[0] * atk / 100))}) and change board to ${idxsFromBits(skillArgs[1]).map(c => AttributeToName.get(c))} `;
  },
  // TODO: Add conditional depending on board.
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { enemy, team }) => {
    const damage = Math.ceil(skillArgs[0] / 100 * enemy.getAtk());
    team.damage(damage, enemy.getAttribute());
  },
  goto: () => TERMINATE,
}

// 86
const healPercent: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Heal for ${skillArgs[0]}-${skillArgs[1]}% of max HP.`,
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { enemy }) => {
    const [min, max] = skillArgs;
    const percentHealed = Math.floor(Math.random() * (max - min)) + min;
    const healAmount = Math.ceil(percentHealed * enemy.getHp() / 100);
    if (enemy.currentHp + healAmount > enemy.getHp()) {
      enemy.currentHp = enemy.getHp();
    } else {
      enemy.currentHp += healAmount;
    }
  },
  goto: () => TERMINATE,
}

// 87
const damageAbsorb: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Absorb damage of ${addCommas(skillArgs[1])} or more for ${skillArgs[0]} turns`,
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { enemy }) => {
    enemy.damageAbsorb = skillArgs[1];
  },
  goto: () => TERMINATE,
};

// 88
const awokenBind: EnemySkillEffect = {
  textify: ({ skillArgs }, { atk }) => {
    return `Awoken Bind for ${skillArgs[0]} turn(s). If awoken bound and part of a skillset, attack for ${addCommas(atk)}, else Continue.`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: (_, { team, enemy }) => {
    if (team.state.awakenings) {
      team.state.awakenings = false;
    } else {
      // Should we do a basic attack here?
      team.damage(enemy.getAtk(), enemy.getAttribute());
    }
  },
  // TODO: If player is awoken bound, this should be TO_NEXT
  goto: () => TERMINATE,
};

// 89
const skillDelay: EnemySkillEffect = {
  textify: ({ skillArgs }) => {
    return `Skill Delay for ${skillArgs[0]}-${skillArgs[1]} turn(s)`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TERMINATE,
};

// 90
const gotoIfCardOnTeam: EnemySkillEffect = {
  textify: ({ rnd, skillArgs }) => {
    return `If any of ${skillArgs.filter(Boolean).map(id => floof.model.cards[id].name)} are on the team, go to skill at ${rnd}`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: ({ skillArgs, rnd }, { teamIds }) => skillArgs.some((id) => teamIds.includes(id)) ? rnd - 1 : TO_NEXT,
  type: SkillType.LOGIC,
};

// 92
const randomOrbSpawn: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Randomly spawn ${skillArgs[0]}x ${idxsFromBits(skillArgs[1]).map(c => AttributeToName.get(c))} orbs from non-[${idxsFromBits(skillArgs[2]).map((c) => AttributeToName.get(c))}], If Unable, Continue`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { }, // Implement later?!
  goto: () => TERMINATE,
};

// 93
const finalFantasyAndContinue: EnemySkillEffect = {
  textify: () => `Final Fantasy Nonsense according to Ilmina. Continue.`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { }, // Implement later?!
  goto: () => TO_NEXT,
};

// 94
const lockOrbs: EnemySkillEffect = {
  textify: ({ skillArgs }) => {
    const [attrBits, maxLocked] = skillArgs;
    const lockedOrbs = idxsFromBits(attrBits).map((c) => AttributeToName.get(c)).join(', ');
    return `Lock up to ${maxLocked} of the following orbs: ${lockedOrbs}. If unable to lock any, Continue.`;
  },
  condition: () => {
    // Not applicable right now, but requires that one of the locked colors exists.
    return true;
  },
  aiEffect: () => { },
  effect: () => { },
  // TODO: Determine if any orbs can be locked.  If no, then return TO_NEXT instead.
  goto: () => TERMINATE,
};

// 95
const onDeathSkillset: EnemySkillEffect = {
  textify: (...args) => skillset.textify(...args).replace('U', 'On death, u'),
  condition: () => false,
  aiEffect: () => { },
  effect: (...args) => skillset.effect(...args),
  goto: () => TO_NEXT,
};

// 96
const lockSkyfall: EnemySkillEffect = {
  textify: ({ skillArgs }) => {
    const [attrBits, minTurns, maxTurns, percent] = skillArgs;
    if (!attrBits || attrBits == -1) {
      return `Lock ${percent}% skyfall for ${rangeTurns(minTurns, maxTurns)}.`;
    }
    const lockedOrbs = idxsFromBits(attrBits).map((c) => AttributeToName.get(c)).join(', ');
    return `Lock ${percent}% of ${lockedOrbs} skyfall for ${minTurns}-${maxTurns}`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TERMINATE,
};

// 97
const randomStickyBlind: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Randomly sticky blind ${skillArgs[1]}-${skillArgs[2]} orbs for ${skillArgs[0]} turns.`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { }, // Implement later?!
  goto: () => TERMINATE,
};

// 98
const patternStickyBlind: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Sticky blind a pattern for ${skillArgs[0]} turns: Pattern: ${skillArgs.slice(1)}.`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { }, // Implement later?!
  goto: () => TERMINATE,
};

// 99
const tapeColumns: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Tape columns ${idxsFromBits(skillArgs[0])} for ${skillArgs[1]} turns`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { }, // Implement later?!
  goto: () => TERMINATE,
};

// 100
const tapeRows: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Tape rows ${idxsFromBits(skillArgs[0])} for ${skillArgs[1]} turns`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { }, // Implement later?!
  goto: () => TERMINATE,
};

// 101
const fixedStartingPoint: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Fixed starting point at ${skillArgs[0] ? 'Random Location' : `${skillArgs[2]}-${skillArgs[1]}`}`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { }, // Implement later?!
  goto: () => TERMINATE,
};

// 102
const randomBombSpawn: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Randomly spawn ${skillArgs[1]}x bomb orbs`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { }, // Implement later?!
  goto: () => TERMINATE,
};

// 103
const patternBombSpawn: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Spawn ${skillArgs[7] ? 'Locked ' : ''}Bomb orbs in a pattern: ${skillArgs.slice(1, 7)}`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { }, // Implement later?!
  goto: () => TERMINATE,
};

// 104
const cloudRandom: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Randomly Cloud ${skillArgs[1]}x${skillArgs[2]} Rectangle for ${skillArgs[0]} turns.`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TERMINATE,
};

// 105
const rcv: EnemySkillEffect = {
  textify: ({ skillArgs }) => {
    const [turns, rcvPercent] = skillArgs;
    return `Set Recovery to ${rcvPercent}% for ${turns} turns`;
  },
  // Determine if already debuffed by opponent?!
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { team, enemy }) => {
    if (team.state.rcvMult != 1) {
      team.damage(enemy.getAtk(), enemy.getAttribute());
      return;
    }
    team.state.rcvMult = skillArgs[1] / 100;
  },
  goto: () => TERMINATE,
};

// 106
const changeTurnTimer: EnemySkillEffect = {
  textify: ({ skillArgs }) => `[Passive] When HP Drops below ${skillArgs[0]}%, change turn timer to ${skillArgs[1]}`,
  condition: () => true,
  aiEffect: () => { },
  // This will occur in the damage step.
  effect: () => { },
  goto: () => TERMINATE,
}

// 107
const unmatchable: EnemySkillEffect = {
  textify: ({ skillArgs }) => `${idxsFromBits(skillArgs[1]).map(c => AttributeToName.get(c))} are unmatchable for ${skillArgs[0]} turn(s)`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TERMINATE,
};

// 108
const attackAndMultiOrbChange: EnemySkillEffect = {
  textify: ({ skillArgs }, { atk }) => {
    const [percent, fromBits, toBits] = skillArgs;
    const damage = addCommas(Math.ceil(percent / 100 * atk));
    const fromString = idxsFromBits(fromBits).map(from => AttributeToName.get(from));
    const toString = idxsFromBits(toBits).map(to => AttributeToName.get(to));
    return `Hit for ${skillArgs[0]}% (${damage}) and convert ${fromString} to ${toString}`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { team, enemy }) => {
    team.damage(Math.ceil(skillArgs[0] * enemy.getAtk() / 100), enemy.getAttribute());
    // Convert orbs?!
  },
  goto: () => TERMINATE,
}

// 109
const spinners: EnemySkillEffect = {
  textify: ({ skillArgs }) => {
    const [turns, period, count] = skillArgs;
    return `Spawn ${count}x Spinners (${period / 100}s period) for ${turns} turns`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TERMINATE,
}

// 110
const spinnerPattern: EnemySkillEffect = {
  textify: ({ skillArgs }) => {
    const [turns, period, r1, r2, r3, r4, r5] = skillArgs;
    return `Spawn Spinners (${period / 100}s period) for ${turns} turns in a pattern: ${[r1, r2, r3, r4, r5]}`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TERMINATE,
};

// 111
const fixedHp: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Player team HP set to ${skillArgs[0] ? `${skillArgs[0]}%` : `${skillArgs[1]}`} for ${skillArgs[2]} turns.`,
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { team }) => {
    let [percent, val] = skillArgs;
    if (percent) {
      val = Math.ceil(team.getHp() * percent / 100);
    }
    team.updateState({ fixedHp: val });
  }, // Implement later?!
  goto: () => TERMINATE,
};

// 112
const fixedTarget: EnemySkillEffect = {
  textify: () => `Fixed target on this monster`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { }, // Implement later?!
  goto: () => TERMINATE,
};

// 113
const gotoIfComboMin: EnemySkillEffect = {
  textify: ({ ai, rnd }) => `If combo count >= ${ai}, go to skill ${rnd}`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: ({ ai, rnd }, { combo }) => {
    return combo >= ai ? rnd - 1 : TO_NEXT;
  },
  type: SkillType.LOGIC,
};

// 118
const resistTypes: EnemySkillEffect = {
  textify: ({ skillArgs }) => `[Passive] Resist ${skillArgs[1]}% of ${idxsFromBits(skillArgs[0]).map((v) => TypeToName.get(v)).join(' and ')} damage.`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TO_NEXT,
};

// 119
const addInvincibility: EnemySkillEffect = {
  textify: () => `Unable to receive damage.`,
  condition: () => true,
  aiEffect: () => { },
  // This will occur in the damage step.
  effect: (_, { enemy }) => {
    enemy.invincible = true;
  },
  goto: () => TERMINATE,
};

// 120
const gotoIfEnemiesRemaining: EnemySkillEffect = {
  textify: ({ ai, rnd }) => `If ${ai} enemies remaining, go to skill ${rnd}`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: ({ ai, rnd }) => {
    console.warn(`Multiple enemies not supported, assuming ${ai} remaining`);
    return rnd;
  },
  type: SkillType.LOGIC,
};

// 121
const removeInvincibility: EnemySkillEffect = {
  textify: () => `Now able to receive damage.`,
  condition: () => true,
  aiEffect: () => { },
  // This will occur in the damage step.
  effect: (_, { enemy }) => {
    enemy.invincible = false;
  },
  goto: () => TERMINATE,
};

// 122
const changeTurnTimerFromRemainingEnemies: EnemySkillEffect = {
  textify: ({ skillArgs }) => `[Pasive] When ${skillArgs[0]} enemies, change turn timer to ${skillArgs[1]}`,
  condition: () => true,
  aiEffect: () => { },
  // This will occur in the damage step.
  effect: () => { },
  goto: () => TERMINATE,
};

// 124
const gachadra: EnemySkillEffect = {
  textify: ({ skillArgs }) => `[Pasive] GACHADRA FEVER - Requires ${skillArgs[1]}x ${AttributeToName.get(skillArgs[0])} orbs to kill`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TERMINATE,
};

// 125
const transformLead: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Transform player lead into ${floof.model.cards[skillArgs[1]].name} for ${skillArgs[0]} turns.`,
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { team }) => {
    team.getActiveTeam()[0].transformedTo = skillArgs[1];
  },
  goto: () => TERMINATE,
};

// 126
const bigBoardOrContinue: EnemySkillEffect = {
  textify: ({ skillArgs }) => `Change board to 7x6 for ${skillArgs[0]} turns. If already 7x6, Continue.`,
  condition: () => true,
  aiEffect: () => { },
  effect: (_, { team }) => {
    team.state.bigBoard = true;
  },
  goto: (_, { bigBoard }) => bigBoard ? TO_NEXT : TERMINATE,
};

// 127
const attackAndNoSkyfall: EnemySkillEffect = {
  textify: ({ skillArgs }, { atk }) => skillArgs[0] ? `Attack of ${skillArgs[0]}% (${addCommas(Math.ceil(skillArgs[0] * atk / 100))}) and n` : 'N' + `o-skyfall for ${skillArgs[1]} turn(s).`,
  condition: () => true,
  aiEffect: () => { },
  // This will occur in the damage step.
  effect: ({ skillArgs }, { team, enemy }) => {
    team.damage(Math.ceil(skillArgs[0] * enemy.getAtk() / 100), enemy.getAttribute());
    // No skyfall?!
  },
  goto: (_, { bigBoard }) => bigBoard ? TO_NEXT : TERMINATE,
};

// 128
const stickyBlindSkyfall: EnemySkillEffect = {
  textify: ({ skillArgs }) => `For ${skillArgs[0]} turns, set ${skillArgs[1]}% skyfall chance of Sticky Blinds`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TERMINATE,
};

// 129
const superResolve: EnemySkillEffect = {
  textify: ({ skillArgs }) => `[Passive] ${skillArgs[0]}% Super Resolve. [Unknown handling of parameter ${skillArgs[1]}]`,
  condition: () => true,
  aiEffect: () => { },
  effect: () => { },
  goto: () => TO_NEXT,
};

// 130
const playerAtkDebuff: EnemySkillEffect = {
  textify: ({ skillArgs }) => {
    const [turns, debuffPercent] = skillArgs;
    return `Player team attack reduced by ${debuffPercent} for ${turns} turns`;
  },
  condition: () => true,
  aiEffect: () => { },
  effect: ({ skillArgs }, { team }) => {
    team.state.burst.attrRestrictions.length = 0;
    team.state.burst.typeRestrictions.length = 0;
    team.state.burst.awakenings.length = 0;
    team.state.burst.awakeningScale = 0;
    team.state.burst.multiplier = 1 - (skillArgs[1] / 100);
  },
  goto: () => TERMINATE,
};


const ENEMY_SKILL_GENERATORS: Record<number, EnemySkillEffect> = {
  1: bindRandom,
  2: bindAttr,
  3: bindType,
  4: orbChange,
  5: blindBoard,
  6: dispelBuffs,
  7: healOrAttack,
  8: enhanceBasicAttack,
  // 9: unused
  // 10: unused
  // 11: unused
  12: singleOrbToJammer,
  13: multiOrbToJammer,
  14: skillBind,
  15: multihit,
  16: skipTurn,
  17: enrage,
  18: enrageFromStatusAilment,
  19: enrageFromMinimumAttacks,
  20: statusShield,
  // 21: unused
  22: setFlagAndContinue,
  23: goto0IndexIfFlag,
  24: unsetFlagAndContinue,
  25: setCounterToAiAndContinue,
  26: incrementCounterAndContinue,
  27: decrementCounterAndContinue,
  28: gotoIfHpBelow,
  29: gotoIfHpAbove,
  30: gotoIfCounterLesser,
  31: gotoIfCounterEqual,
  32: gotoIfCounterGreater,
  33: gotoIfLvLesser,
  34: gotoIfLvEqual,
  35: gotoIfLvGreater,
  36: fallbackAttack,
  37: displayCounterOrContinue,
  38: setCounterAndContinue,
  39: timeDebuff,
  40: suicide,
  // 41: unused
  // 42: unused
  43: gotoIfFlag,
  44: orFlagsAndContinue,
  45: toggleFlagsAndContinue,
  46: changeAttribute,
  47: oldPreemptiveAttack,
  48: attackAndSingleOrbChange,
  49: preemptiveMarker,
  50: gravity,
  // 51: unused
  52: resurrect,
  53: attributeAbsorb,
  54: directedBindAll,
  55: healPlayer,
  56: singleOrbToPoison,
  57: multiOrbToPoison,
  // 58: unused
  // 59: unused
  60: randomPoisonSpawn,
  61: randomPoisonSpawn, // Same as above?!
  62: attackAndBlind,
  63: attackAndBind,
  64: attackAndPoisonSpawn,
  65: bindSubs,
  66: skipTurn,
  67: comboAbsorb,
  68: skyfall,
  69: transformAnimation,
  // 70: unused
  71: voidDamage,
  72: attributeResist,
  73: resolve,
  74: shield,
  75: leadSwap,
  76: columnChange,
  77: attackAndColumnChange,
  78: rowChange,
  79: attackAndRowChange,
  // 80: unused
  81: attackAndChangeBoardOld,
  82: attackWithoutName,
  83: skillset,
  84: boardChange,
  85: attackAndChangeBoard,
  86: healPercent,
  87: damageAbsorb,
  88: awokenBind,
  89: skillDelay,
  90: gotoIfCardOnTeam,
  // 91: unused,
  92: randomOrbSpawn,
  93: finalFantasyAndContinue,
  94: lockOrbs,
  95: onDeathSkillset,
  96: lockSkyfall,
  97: randomStickyBlind,
  98: patternStickyBlind,
  99: tapeColumns,
  100: tapeRows,
  101: fixedStartingPoint,
  102: randomBombSpawn,
  103: patternBombSpawn,
  104: cloudRandom,
  105: rcv,
  106: changeTurnTimer,
  107: unmatchable,
  108: attackAndMultiOrbChange,
  109: spinners,
  110: spinnerPattern,
  111: fixedHp,
  112: fixedTarget,
  113: gotoIfComboMin,
  // 114: unused
  // 115: unused
  // 116: unused
  // 117: unused
  118: resistTypes,
  119: addInvincibility,
  120: gotoIfEnemiesRemaining,
  121: removeInvincibility,
  122: changeTurnTimerFromRemainingEnemies,
  123: addInvincibility, // Hexa only
  124: gachadra,
  125: transformLead,
  126: bigBoardOrContinue,
  127: attackAndNoSkyfall,
  128: stickyBlindSkyfall,
  129: superResolve,
  130: playerAtkDebuff,
};

function toSkillContext(id: number, skillIdx: number): SkillContext {
  const cardEnemySkill = floof.model.cards[id].enemySkills[skillIdx];
  const skill: SkillContext = {
    id: -1,
    ai: -1,
    rnd: -1,
    aiArgs: [0, 0, 0, 0, 0],
    effectId: -1,
    name: '',
    text: '',
    skillArgs: [],
    ratio: 0,
  };

  if (!cardEnemySkill) {
    return skill;
  }
  skill.id = cardEnemySkill.enemySkillId;
  skill.ai = cardEnemySkill.ai;
  skill.rnd = cardEnemySkill.rnd;

  const enemySkill = floof.model.enemySkills[skill.id];
  if (!enemySkill) {
    return skill;
  }
  skill.aiArgs = [...enemySkill.aiArgs];
  skill.effectId = enemySkill.internalEffectId;
  skill.name = enemySkill.name;
  skill.text = enemySkill.usageText;
  skill.skillArgs = [...enemySkill.skillArgs];
  skill.ratio = enemySkill.ratio;
  return skill;
}

enum UnusedReason {
  LOGIC = 0,
  HP_NOT_MET = 1,
  INSUFFICIENT_CHARGES = 2,
  RNG = 3,
}

interface EnemyEffect {
  // Idx of the skill to use.
  idx: number;
  // Chance of this occuring. Usually adds up to 100, but possible to be less.
  chance: number;
  // The final flags that this should be set to.
  flags: number;
  // The final counters that this should be set to.
  counter: number;
  // The path of skills to get to this point. unusedReason is nonzero if this
  // was a terminating skill but was skipped for some reason.
  // e.g. HP too high, charges too low, or Randomness says it's possible to skip.
  path: {
    idx: number;
    unusedReason: UnusedReason;
  }[];
}

const PREEMPTIVE_MARKERS = [47, 49];

/**
 * Get the indexes of the skills to possibly use.
 * The return value is kind of weird, but let's dig down into the meanings.
 * aiEffects: The logic-based effects that occur in the order that they occur.
 *   These can cause counter and flag changes.
 *   If a final effect isn't deterministic, some of these may only occur if
 *   the final effect that is used is >= finalEffectConditional.
 * finalEffects: The final effects that the opponent does to the game state.
 *   This is indexed 0 and is not always deterministic. The total weight usually
 *   adds to 100, but may be any positive number.
 *   If index is -1, that means that this monster has no skills.
 */
function determineSkillset(ctx: AiContext): EnemyEffect[] {
  const possibleEffects: EnemyEffect[] = [];

  const skills: SkillContext[] = Array(floof.model.cards[ctx.cardId].enemySkills.length);
  if (!skills.length) {
    return possibleEffects;
  }
  for (let i = 0; i < skills.length; i++) {
    skills[i] = toSkillContext(ctx.cardId, i);
  }
  // Skip Preemptive checking if neither marker is a preemptive.
  if (ctx.isPreempt && !PREEMPTIVE_MARKERS.includes(skills[0].effectId)) {
    return possibleEffects;
  }
  let idx = 0;
  let remainingChance = 100;
  const path: { idx: number; unusedReason: UnusedReason }[] = [];
  // const finalEffects: { idx: number; weight: number }[] = [];
  // const skippedEffects: number[] = [];
  while (idx < skills.length) {
    const skill = skills[idx];
    // Remaining charge cost insufficient.
    if (skillType(ctx, idx) == SkillType.EFFECT && skill.aiArgs[3] > ctx.charges) {
      path.push({ idx, unusedReason: UnusedReason.INSUFFICIENT_CHARGES });
      idx++;
      continue;
    }
    aiEffect(ctx, idx);
    let next = goto(ctx, idx);
    // HP Conditional skills.
    if (next == TERMINATE && skill.aiArgs[1] < ctx.hpPercent) {
      path.push({ idx, unusedReason: UnusedReason.HP_NOT_MET });
      idx++;
      continue;
    }

    if (next == TERMINATE) {
      // If neither rnd or ai are set on a terminating skill, assume it MUST happen.
      let chance = skills[idx].rnd || skills[idx].ai || 100;
      ctx.charges -= skill.aiArgs[3];
      if (floof.model.cards[ctx.cardId].aiVersion == 1) {
        // Do new
        chance = Math.min(chance, remainingChance);
        remainingChance -= chance;
        possibleEffects.push({ idx, chance: chance, flags: ctx.flags, counter: ctx.counter, path: path.slice() });
      } else {
        const overallChance = remainingChance * chance / 100;
        remainingChance -= overallChance;
        possibleEffects.push({ idx, chance: overallChance, flags: ctx.flags, counter: ctx.counter, path: path.slice() });
      }
      if (!remainingChance) {
        return possibleEffects;
      }
      path.push({ idx, unusedReason: UnusedReason.RNG })
      next = TO_NEXT;
    } else {
      path.push({ idx, unusedReason: UnusedReason.LOGIC })
    }

    if (next == TO_NEXT) {
      idx++;
    } else {
      idx = next;
    }
  }
  // Not all chance was used. Should still return.
  return possibleEffects;
}

export function effect(skillCtx: SkillContext, ctx: GameContext) {
  if (!ENEMY_SKILL_GENERATORS[skillCtx.effectId]) {
    console.warn(`UNIMPLEMENTED EFFECT ID: ${skillCtx.effectId} `);
    return;
  }
  ENEMY_SKILL_GENERATORS[skillCtx.effectId].effect(skillCtx, ctx);
}

export function textify(ctx: AiContext, skillCtx: SkillContext): string {
  if (!ENEMY_SKILL_GENERATORS[skillCtx.effectId]) {
    return `UNIMPLEMENTED EFFECT ID: ${skillCtx.effectId} \n${JSON.stringify(skillCtx)} `;
  }
  let text = ENEMY_SKILL_GENERATORS[skillCtx.effectId].textify(skillCtx, ctx);
  const next = ENEMY_SKILL_GENERATORS[skillCtx.effectId].goto(skillCtx, ctx);
  if (next == TERMINATE && skillCtx.aiArgs[1] != 100) {
    text = `(<= ${skillCtx.aiArgs[1]} % HP) ${text}`;
  }
  if (skillCtx.aiArgs[3]) {
    text = `[Costs ${skillCtx.aiArgs[3]} charges to use] ${text}`;
  }
  if (skillCtx.name && !skillCtx.name.includes('ERROR')) {
    text = `[${skillCtx.name}] ${text}`;
  }
  return text;
}

export function aiEffect(ctx: AiContext, skillIdx: number) {
  const skill = toSkillContext(ctx.cardId, skillIdx);
  const effect = ENEMY_SKILL_GENERATORS[skill.effectId];
  if (!effect) {
    console.error(`UNIMPLEMENTED EFFECT ID: ${skill.effectId} `);
    return TERMINATE;
  }
  return effect.aiEffect(skill, ctx);
}

export function skillType(ctx: AiContext, skillIdx: number): SkillType {
  const skill = toSkillContext(ctx.cardId, skillIdx);
  const effect = ENEMY_SKILL_GENERATORS[skill.effectId];
  if (!effect) {
    console.error(`UNIMPLEMENTED EFFECT ID: ${skill.effectId} `);
    return SkillType.EFFECT;
  }
  return effect.type || SkillType.EFFECT;
}

export function goto(ctx: AiContext, skillIdx: number): number {
  const skill = toSkillContext(ctx.cardId, skillIdx);
  const effect = ENEMY_SKILL_GENERATORS[skill.effectId];
  if (!effect) {
    console.error(`UNIMPLEMENTED EFFECT ID: ${skill.effectId} `);
    return TERMINATE;
  }
  return effect.goto(skill, ctx);
}

export function textifyEnemySkill(enemy: { id: number; atk: number }, idx: number) {
  const text = textify({
    cardId: enemy.id,
    atk: enemy.atk,
    // Values needed to create context, all defaults.
    attribute: -1,
    isPreempt: false,
    lv: 10,
    hpPercent: 100,
    combo: 1,
    otherEnemyHp: 0,
    teamIds: [],
    bigBoard: false,
    charges: 0,
    flags: 0,
    counter: 0,
    teamTypes: new Set(),
    teamAttributes: new Set(),
  }, toSkillContext(enemy.id, idx));
  return text;
}

function textifyEnemySkills(enemy: {
  id: number,
  atk: number,
}): string[] {
  const val = [];
  for (let i = 0; i < floof.model.cards[enemy.id].enemySkills.length; i++) {
    val.push(textifyEnemySkill(enemy, i));
  }
  return val;
}

export {
  textifyEnemySkills,
  determineSkillset,
  toSkillContext,
};
