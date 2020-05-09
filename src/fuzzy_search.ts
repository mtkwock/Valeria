import { Awakening } from './common';
import { floof, Card } from './ilmina_stripped';

const prefixToCardIds: Record<string, number[]> = {};

let prioritizedEnemySearch: Card[] = [];
let prioritizedMonsterSearch: Card[] = [];
let prioritizedInheritSearch: Card[] = [];
const LOW_PRIORITY_SUBSTRING = [
  ' disguise', // Jiraiya disguises mucking up searches for Zela, Rex, and so on.
];
function isLowPriority(s: string): boolean {
  return LOW_PRIORITY_SUBSTRING.some((badSubstring) => {
    return s.toLowerCase().includes(badSubstring);
  });
}
function SearchInit() {
  const ids: number[] = Object.keys(floof.model.cards).map((id) => Number(id));

  prioritizedEnemySearch = ids.map((id: number) => floof.model.cards[id]).reverse();
  prioritizedMonsterSearch = ids.map((id: number) => floof.model.cards[id]).filter((card: Card) => {
    return card.id < 100000;
  }).sort((card1, card2) => {
    if (isLowPriority(card1.name) != isLowPriority(card2.name)) {
      return isLowPriority(card2.name) ? -1 : 1;
    }
    // First throw all equips towards the end.
    if (card1.awakenings[0] != card2.awakenings[0]) {
      if (card2.awakenings[0] == Awakening.AWOKEN_ASSIST) {
        return -1;
      }
      if (card1.awakenings[0] == Awakening.AWOKEN_ASSIST) {
        return 1;
      }
    }
    if (card2.monsterPoints != card1.monsterPoints) {
      return card2.monsterPoints - card1.monsterPoints;
    }
    return card2.id - card1.id;
  });

  prioritizedInheritSearch = prioritizedMonsterSearch.filter((card) => {
    // inheritanceType is defined with the flag &1..
    return Boolean(card);
  }).sort((card1, card2) => {
    if (card1.awakenings[0] != card2.awakenings[0]) {
      if (card1.awakenings[0] == Awakening.AWOKEN_ASSIST) {
        return -1;
      }
      if (card2.awakenings[0] == Awakening.AWOKEN_ASSIST) {
        return 1;
      }
    }
    // if (card2.monsterPoints != card1.monsterPoints) {
    //   return card2.monsterPoints - card1.monsterPoints;
    // }
    return card2.id - card1.id;
  });

  for (const group of floof.model.cardGroups) {
    for (const alias of group.aliases.filter(
      (alias) => alias.indexOf(' ') == -1 && alias == alias.toLowerCase())) {
      prefixToCardIds[alias] = group.cards;
      if (alias == 'halloween') {
        prefixToCardIds['h'] = group.cards;
      }
    }
  }
}

/**
 * Given text, finds the top maxResults monster IDs that match
 * the text in priority order:
 * 1) Exact ID
 * 2) Name Contains Substring
 *    a) Priotize where substrings are at the beginning or follow a space.
 * 4) Fuzzily matches (All letters are present in order in name)
 *    a) Prioritizes consecutive letters.
 * @param text
 * @param maxResults
 * @param searchArray
 * @param filtered
 */
function fuzzyMonsterSearch(text: string, maxResults: number = 15, searchArray: Card[] | undefined = undefined, filtered = false): number[] {
  if (!text || text == '-1') {
    return [-1];
  }
  searchArray = searchArray || prioritizedMonsterSearch;
  text = text.toLowerCase();
  let toEquip = false;
  let toBase = false;
  if (text.startsWith('equip')) {
    text = text.substring('equip'.length).trim();
    toEquip = true;
  } else if (text.startsWith('base')) {
    text = text.substring('base'.length).trim();
    toBase = true;
  } else if (text.startsWith('revo')) {
    text = text.replace('revo', 'reincarnated');
  } else if (text.startsWith('srevo')) {
    text = text.replace('srevo', 'super reincarnated');
  }
  const result: number[] = [];
  // Test for exact match.
  if (text in floof.model.cards) {
    result.push(Number(text));
  }
  let lowerPriority: number[] = [];
  let lowestPriority: number[] = [];
  // Search for monsters whose substrings work.
  for (const card of searchArray) {
    if (result.length >= maxResults) {
      break;
    }
    const idx = card.name.toLowerCase().indexOf(text);
    if (idx < 0) {
      continue;
    }
    if (idx == 0 || card.name[idx - 1] == ' ') {
      if (idx + text.length == card.name.length || card.name[idx + text.length] == ' ') {
        result.push(card.id);
      } else {
        lowerPriority.push(card.id);
      }
    } else {
      lowestPriority.push(card.id);
    }
  }
  for (const id of lowerPriority) {
    if (result.length < maxResults) {
      result.push(id);
    }
  }
  for (const id of lowestPriority) {
    if (result.length < maxResults) {
      result.push(id);
    }
  }
  if (!filtered && result.length < maxResults) {
    let collabMatches: number[] = [];
    for (const prefix in prefixToCardIds) {
      if (text.startsWith(prefix)) {
        for (const match of fuzzyMonsterSearch(text.substring(prefix.length).trim(), maxResults, searchArray.filter((card) => prefixToCardIds[prefix].some((id) => id == card.id)))) {
          if (!collabMatches.some((m) => m == match)) {
            collabMatches.push(match);
          }
        }
      }
    }
    for (const match of collabMatches) {
      if (result.length < maxResults && !result.some((id) => id == match)) {
        result.push(match);
      }
    }
    const attributes: Record<string, number> = {
      'r': 0, 'b': 1, 'g': 2, 'l': 3, 'd': 4, 'x': -1,
    };
    let attribute = -1;
    let subattribute = -2;
    let attributeText = '';
    let subattributeText = '';
    if (text.length > 2 && text[0] in attributes) {
      attribute = attributes[text[0]];
      attributeText = text.substring(1).trim();
      if (attributeText.length > 2 && attributeText[0] in attributes) {
        subattribute = attributes[attributeText[0]];
        subattributeText = attributeText.substring(1).trim();
      }
    }
    if (subattributeText) {
      const filteredSub = searchArray.filter((card) => card.attribute == attribute && card.subattribute == subattribute);
      const matches = fuzzyMonsterSearch(subattributeText, maxResults, filteredSub, true);
      for (const match of matches) {
        if (result.length < maxResults && !result.some((id) => id == match)) {
          result.push(match);
        }
      }
    }
    if (attributeText) {
      const filteredAttr = searchArray.filter((card) => card.attribute == attribute);
      const matches = fuzzyMonsterSearch(attributeText, maxResults, filteredAttr, true);
      for (const match of matches) {
        if (result.length < maxResults && !result.some((id) => id == match)) {
          result.push(match);
        }
      }
    }
  }

  lowerPriority.length = 0;
  let scoredPriority: number[][] = [];
  // Fuzzy match with the name.
  // This prioritizes values with consecutive letters.
  for (const card of searchArray) {
    if (result.length >= maxResults) {
      break;
    }
    if (result.some((id) => id == card.id)) {
      continue;
    }
    const name = card.name.toLowerCase();
    let currentStringIdx = -1;
    let score = 0;
    let scoreDelta = 1;
    for (const c of text) {
      const nextIdx = name.indexOf(c, currentStringIdx + 1);
      if (nextIdx == currentStringIdx + 1) {
        scoreDelta *= 2;
      } else {
        scoreDelta = 1;
      }
      score += scoreDelta;
      currentStringIdx = nextIdx;
      if (currentStringIdx < 0) {
        break;
      }
    }
    if (currentStringIdx >= 0) {
      scoredPriority.push([card.id, score]);
      continue;
    }
  }
  scoredPriority.sort((a, b) => b[1] - a[1]);
  for (const match of scoredPriority) {
    if (result.length > maxResults) {
      break;
    }
    result.push(match[0]);
  }
  if (toEquip) {
    let equips: number[] = [];
    for (const id of result) {
      const treeId = floof.model.cards[id].evoTreeBaseId;
      if (treeId in floof.model.evoTrees) {
        for (const card of floof.model.evoTrees[treeId].cards) {
          if (!equips.some((id) => id == card.id) && card.awakenings[0] == Awakening.AWOKEN_ASSIST) {
            equips.push(card.id);
          }
        }
      }
    }
    for (const id of result) {
      if (!equips.some((i) => i == id)) {
        equips.push(id);
      }
    }
    if (equips.length > maxResults) {
      equips.length = maxResults;
    }
    result.length = 0;
    for (const id of equips) {
      result.push(id);
    }
  }
  if (toBase) {
    let bases = result.map((id) => floof.model.cards[id].evoTreeBaseId);

    const seen = new Set<number>();
    result.length = 0;
    for (const id of bases) {
      if (seen.has(id)) {
        continue;
      }
      seen.add(id);
      result.push(id);
    }
  }
  if (!result.length) {
    return [-1];
  }
  return result;
}

function fuzzySearch<T>(text: string, maxResults: number = 15, searchArray: { s: string, value: T }[]): T[] {
  if (!text) {
    return [];
  }
  text = text.toLowerCase();
  const result: T[] = [];

  for (const { s, value } of searchArray) {
    if (s == text) {
      result.push(value);
    }
  }

  for (const { s, value } of searchArray) {
    if (text.includes(s) && !result.includes(value)) {
      result.push(value);
    }
  }

  let scoredPriority: { score: number, value: T }[] = [];
  // Fuzzy match with the name.
  // This prioritizes values with consecutive letters.
  for (const { s, value } of searchArray) {
    if (result.length >= maxResults) {
      break;
    }
    if (result.includes(value)) {
      continue;
    }
    const name = s.toLowerCase();
    let currentStringIdx = -1;
    let score = 0;
    let scoreDelta = 1;
    for (const c of text) {
      const nextIdx = name.indexOf(c, currentStringIdx + 1);
      if (nextIdx == currentStringIdx + 1) {
        scoreDelta *= 2;
      } else {
        scoreDelta = 1;
      }
      score += scoreDelta;
      currentStringIdx = nextIdx;
      if (currentStringIdx < 0) {
        break;
      }
    }
    if (currentStringIdx >= 0) {
      scoredPriority.push({ value, score });
      continue;
    }
  }
  scoredPriority.sort((a, b) => b.score - a.score);
  for (const match of scoredPriority) {
    if (result.length > maxResults) {
      break;
    }
    if (!result.includes(match.value)) {
      result.push(match.value);
    }
  }
  return result;
}

export {
  SearchInit, // Must be called to have any reasonable values.

  fuzzyMonsterSearch,
  fuzzySearch,
  prioritizedMonsterSearch,
  prioritizedInheritSearch,
  prioritizedEnemySearch,
}
