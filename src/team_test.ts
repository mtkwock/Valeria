// import { Awakening } from './common';
import { debug } from './debugger';

interface PlayerMonsterContext {
  ID: number;
  HP: number;
  ATTRIBUTE: number;
  SUBATTRIBUTE: number;
  ATK: number;
  RCV: number;
  CD: number;
  CD_MAX: number;
  INHERIT_CD: number;
  INHERIT_CD_MAX: number;

  // TODO: Monster Awakenings
}

interface PlayerTeamContext {
  HP: number;
  RCV: number;
  TIME: number;

  LEADER: PlayerMonsterContext;
  HELPER: PlayerMonsterContext;
  SUB_1: PlayerMonsterContext;
  SUB_2: PlayerMonsterContext;
  SUB_3: PlayerMonsterContext;
  SUB_4: PlayerMonsterContext;

  // TODO: Team specific Awakenings
  SB: number;
  SBR: number;
  FUA: number;
  SFUA: number;
  RESIST_BLIND: number;
  RESIST_POISON: number;
  RESIST_JAMMER: number;
  RESIST_CLOUD: number;
  RESIST_TAPE: number;
  GUARD_BREAK: number;

  RESIST_FIRE: number;
  RESIST_WATER: number;
  RESIST_WOOD: number;
  RESIST_LIGHT: number;
  RESIST_DARK: number;

  // Leader Skill capabilities.
  AUTOFUA: CompareBoolean;
}

interface TestContext {
  MODE: number;
  P1: PlayerTeamContext;
  P2?: PlayerTeamContext;
  P3?: PlayerTeamContext;

  FIRE: number;
  WATER: number;
  WOOD: number;
  LIGHT: number;
  DARK: number;

  ALL_ATTRIBUTES: number;
  TRUE: CompareBoolean,
  FALSE: CompareBoolean,

  // TODO: Currently Selected team awakenings.
}

// enum Comparator {
//   GT = '>',
//   GTE = '>=',
//   E = '=',
//   EE = '==',
//   LTE = '<=',
//   LT = '<',
// }
//
// const COMPARATORS = [
//   Comparator.GTE,
//   Comparator.EE,
//   Comparator.LTE,
//
//   Comparator.GT,
//   Comparator.E,
//   Comparator.LT,
// ];

function replacify(text: string, ctx: TestContext): { text: string; error: string } {
  const replacementFinder = /{[^}]*}/g;
  const matches = text.match(replacementFinder);
  if (matches) {
    for (let match of matches) {
      const pieces = match.replace(/[\s{}]/g, '').split('.');
      let currentVal: any = ctx;
      for (const piece of pieces) {
        try {
          currentVal = currentVal[piece];
          if (currentVal == undefined) {
            return { text, error: `Inaccessible value ${piece} in ${match}` };
          }
        } catch (e) {
          return { text, error: `Inaccessible value ${piece} in ${match}` };
        }
      }
      if (currentVal.constructor != Number) {
        return { text, error: `Final type of ${match} is not a number` };
      }
      text = text.replace(match, `${currentVal}`);
    }
  }
  return { text, error: '' };
}

enum TokenType {
  UNKNOWN = 0,
  NUMBER,
  OPERATOR,
  FUNCTION,
  LEFT_PAREN,
  RIGHT_PAREN,
}

interface Token {
  s: string;
  v: number;
  type: TokenType;
}

enum Operator {
  POWER = '**',
  MULTIPLY = '*',
  DIVIDE = '/',
  ADD = '+',
  SUBTRACT = '-',
  BIT_AND = '&',
  BIT_OR = '|',
  BIT_XOR = '^',

  CMP_GTE = '>=',
  CMP_EE = '==',
  CMP_LTE = '<=',
  CMP_NE = '!=',
  CMP_GT = '>',
  CMP_E = '=',
  CMP_LT = '<',

  AND = '&&',
  OR = '||',
}

const operators = [
  // Must be checked first due to having multiple characters.
  Operator.POWER,
  Operator.AND,
  Operator.OR,
  Operator.CMP_GTE,
  Operator.CMP_EE,
  Operator.CMP_LTE,
  Operator.CMP_NE,

  Operator.MULTIPLY,
  Operator.DIVIDE,
  Operator.ADD,
  Operator.SUBTRACT,
  Operator.BIT_AND,
  Operator.BIT_OR,
  Operator.BIT_XOR,
  Operator.CMP_GT,
  Operator.CMP_E,
  Operator.CMP_LT,

];

const tokenFunctions: Record<string, (args: number[]) => number> = {
  min: (args) => Math.min(...args),
  max: (args) => Math.max(...args),
}

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  text = text.replace(/\s/g, '');
  const numberRe = /^-?\d+(\.\d+)?/;
  while (text) {
    const numberMatch = text.match(numberRe);
    if (numberMatch) {
      if (tokens.length && tokens[tokens.length - 1].type == TokenType.NUMBER && numberMatch[0][0] == '-') {
        tokens.push({
          s: '-',
          v: 0,
          type: TokenType.OPERATOR,
        });
        tokens.push({
          s: '',
          v: Number(numberMatch[0].substring(1)),
          type: TokenType.NUMBER,
        });
      } else {
        tokens.push({
          s: '',
          v: Number(numberMatch[0]),
          type: TokenType.NUMBER,
        });
      }
      text = text.replace(numberRe, '');
      continue;
    }

    let isOperator = false;
    for (const operator of operators) {
      if (text.startsWith(operator)) {
        tokens.push({
          s: operator,
          v: 0,
          type: TokenType.OPERATOR,
        });
        text = text.replace(operator, '');
        isOperator = true;
        break;
      }
    }
    if (isOperator) {
      continue;
    }

    if (text.startsWith('(')) {
      tokens.push({
        s: '(',
        v: 0,
        type: TokenType.LEFT_PAREN,
      });
      text = text.substring(1);
      continue;
    }
    if (text.startsWith(')')) {
      tokens.push({
        s: ')',
        v: 0,
        type: TokenType.RIGHT_PAREN,
      });
      text = text.substring(1);
      continue;
    }
    // Ignore commas.
    if (text.startsWith(',')) {
      text = text.substring(1);
      continue;
    }
    for (const fnName in tokenFunctions) {
      if (text.startsWith(fnName)) {
        tokens.push({
          s: 'fnName',
          v: 0,
          type: TokenType.FUNCTION,
        });
        text.replace(fnName, '');
        continue;
      }
    }

    // UNHANLDED ERROR
    tokens.push({
      s: text,
      v: 0,
      type: TokenType.UNKNOWN,
    });
    text = '';
    debug.print(`Unhandled Token processing: ${text}`);
  }

  return tokens;
}

const OperatorPrecendence: Record<Operator, number> = {
  '**': 5,
  '*': 4,
  '/': 4,
  '+': 3,
  '-': 3,
  '&': 2,
  '|': 2,
  '^': 2,
  '>=': 1,
  '==': 1,
  '<=': 1,
  '!=': 1,
  '>': 1,
  '=': 1,
  '<': 1,

  '&&': 0,
  '||': 0,
};

enum CompareBoolean {
  TRUE = 696969,
  FALSE = 420420,
}

const Operate: Record<Operator, (left: number, right: number) => number> = {
  '**': (left, right) => left ** right,
  '*': (left, right) => left * right,
  '/': (left, right) => left / right,
  '+': (left, right) => left + right,
  '-': (left, right) => left - right,
  '&': (left, right) => left & right,
  '|': (left, right) => left | right,
  '^': (left, right) => left ^ right,
  '>=': (left, right) => left >= right ? CompareBoolean.TRUE : CompareBoolean.FALSE,
  '==': (left, right) => left == right ? CompareBoolean.TRUE : CompareBoolean.FALSE,
  '<=': (left, right) => left <= right ? CompareBoolean.TRUE : CompareBoolean.FALSE,
  '!=': (left, right) => left != right ? CompareBoolean.TRUE : CompareBoolean.FALSE,
  '>': (left, right) => left > right ? CompareBoolean.TRUE : CompareBoolean.FALSE,
  '=': (left, right) => left == right ? CompareBoolean.TRUE : CompareBoolean.FALSE,
  '<': (left, right) => left < right ? CompareBoolean.TRUE : CompareBoolean.FALSE,
  '&&': (left, right) => (left == CompareBoolean.TRUE) && (right == CompareBoolean.TRUE) ? CompareBoolean.TRUE : CompareBoolean.FALSE,
  '||': (left, right) => (left == CompareBoolean.TRUE) || (right == CompareBoolean.TRUE) ? CompareBoolean.TRUE : CompareBoolean.FALSE,
}

function shuntingYard(text: string): number | string {
  const tokens = tokenize(text);
  if (!tokens.length || tokens[tokens.length - 1].type == TokenType.UNKNOWN) {
    return 'Unhandled tokens at the end';
  }
  const outputQueue: Token[] = [];
  const operatorStack: Token[] = [];
  const top = (): Token => {
    return operatorStack[operatorStack.length - 1];
  }
  for (const token of tokens) {
    if (token.type == TokenType.NUMBER) {
      outputQueue.push(token);
    } else if (token.type == TokenType.FUNCTION) {
      operatorStack.push(token);
    } else if (token.type == TokenType.OPERATOR) {
      while (operatorStack.length && top().type == TokenType.OPERATOR
        // Assume all operators are left-associative.
        && (OperatorPrecendence[top().s as Operator] >= OperatorPrecendence[token.s as Operator])
        && top().type != TokenType.LEFT_PAREN) {
        outputQueue.push(operatorStack.pop() as Token);
      }
      operatorStack.push(token);
    } else if (token.type == TokenType.LEFT_PAREN) {
      operatorStack.push(token);
    } else if (token.type == TokenType.RIGHT_PAREN) {
      while (operatorStack.length && top().type != TokenType.LEFT_PAREN) {
        outputQueue.push(operatorStack.pop() as Token);
      }
      if (operatorStack.length && top().type == TokenType.LEFT_PAREN) {
        operatorStack.pop();
      }
    } else {
      debug.print(`Unhandled token: value: ${token.v} string: ${token.s} type: ${token.type}`);
    }
  }
  while (operatorStack.length) {
    if (top().type == TokenType.LEFT_PAREN) {
      debug.print('Mismatched Parentheses');
    }
    outputQueue.push(operatorStack.pop() as Token);
  }

  let numberStack: number[] = [];
  for (const output of outputQueue) {
    if (output.type == TokenType.NUMBER) {
      numberStack.push(output.v);
    } else if (output.type == TokenType.OPERATOR) {
      const right = numberStack.pop();
      const left = numberStack.pop();
      if (right == undefined || left == undefined) {
        debug.print('Insufficient numbers in to operate on.');
        continue;
      }
      let pushVal = Operate[output.s as Operator](left, right);
      numberStack.push(pushVal);
    } else if (output.type == TokenType.FUNCTION) {
      const right = numberStack.pop();
      const left = numberStack.pop();
      if (right == undefined || left == undefined) {
        debug.print('Insufficient numbers in to function on.');
        continue;
      }
      let pushVal = tokenFunctions[output.s]([left, right]);
      numberStack.push(pushVal);
    }
  }
  if (numberStack.length == 1) {
    return numberStack[0];
  }
  if (numberStack.length > 1) {
    debug.print('Multiple numbers found, returning first');
    return numberStack[0];
  }
  debug.print('No values found?!');
  return 'No values found at the end.';
}

function runTest(statement: string, ctx: TestContext): string {
  const replaced = replacify(statement, ctx);
  if (replaced.error) {
    return replaced.error;
  }

  const value = shuntingYard(replaced.text);
  if (value == CompareBoolean.TRUE) {
    return '';
  }
  if (value == CompareBoolean.FALSE) {
    return `FAILED: ${statement}`;
  }
  return `FAILED: Test result is neither {TRUE} nor {FALSE}: ${statement} resulted in ${value}`;
}

function runTests(testString: string, ctx: TestContext): string[] {
  const lines = testString
    .split('\n') // One test per line.
    .map((l) => l.trim()) // Remove whitespace at ends.
    .filter((l) => !l.startsWith('#')) // Allow commented tests.
    .filter(Boolean); // Remove empty lines.
  const result: string[] = [];

  for (const line of lines) {
    const err = runTest(line, ctx);
    if (err) {
      result.push(err);
    }
  }

  return result;
}

export {
  PlayerMonsterContext,
  PlayerTeamContext,
  TestContext,
  runTest,
  runTests,
  CompareBoolean,
}
