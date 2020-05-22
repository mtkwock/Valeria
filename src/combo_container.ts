import { COLORS, Shape, ShapeToLetter, LetterToShape } from './common';
import { ComboEditor } from './templates';

class Combo {
  count: number;
  attribute: number;
  enhanced: number;
  shape: Shape;
  constructor(count: number, attribute: number, enhanced: number = 0, shape: Shape) {
    this.count = count;
    this.attribute = attribute;
    if (enhanced > count) {
      enhanced = count;
    }
    this.enhanced = enhanced;
    if (shape == Shape.L && count != 5 ||
      shape == Shape.COLUMN && (count < 4 || count > 6) ||
      shape == Shape.CROSS && count != 5 ||
      shape == Shape.BOX && count != 9 ||
      shape == Shape.ROW && count < 5) {
      console.warn(`Invalid Shape and count combination. Changing shape to AMORPHOUS`);
      shape = Shape.AMORPHOUS;
    }
    this.shape = shape;
  }

  recount() {
    if (this.shape == Shape.L || this.shape == Shape.CROSS) {
      this.count = 5;
    }
    if (this.shape == Shape.BOX) {
      this.count = 9;
    }
    if (this.shape == Shape.COLUMN) {
      console.warn('TODO: Handle auto changing to column');
    }
    if (this.enhanced > this.count) {
      this.enhanced = this.count;
    }
  }
}

class ComboContainer {
  combos: Record<string, Combo[]>;
  boardWidth: number;
  maxVisibleCombos: number;
  bonusCombosLeader: number;
  bonusCombosActive: number;
  comboEditor: ComboEditor;
  onUpdate: ((c: ComboContainer) => any)[];

  constructor() {
    this.combos = {};
    for (const c of COLORS) {
      this.combos[c] = [];
    }
    this.boardWidth = 6;
    this.maxVisibleCombos = 14;
    this.bonusCombosLeader = 0;
    this.bonusCombosActive = 0;
    this.onUpdate = [];
    this.comboEditor = new ComboEditor();

    this.comboEditor.commandInput.onkeyup = (e) => {
      if (e.keyCode == 13) {
        const remainingCommands = this.doCommands(this.comboEditor.commandInput.value);
        this.comboEditor.commandInput.value = remainingCommands.join(' ');
      }
    };

    const colorToInputs = this.comboEditor.getInputElements();
    for (const c in colorToInputs) {
      for (const i in colorToInputs[c]) {
        const idx = Number(i);
        const { shapeCountEl, enhanceEl } = colorToInputs[c][i];
        // TODO: Add onclick modifiers to these.
        shapeCountEl.onblur = () => {
          const v = shapeCountEl.value.replace(/\s/g, '');
          // Delete this combo.
          let letter = v[0] || 'NaN';
          let count = 0;
          let shape = 'A';

          if (letter == 'R') {
            count = this.boardWidth;
            shape = 'R';
            if (v.length > 1 && Number(v.substring(1)) > count) {
              count = Number(v.substring(1));
            }
            shape = 'R';
          } else if (letter == 'C') {
            count = this.boardWidth - 1;
            shape = 'C';
          } else if ('LXB'.indexOf(letter) >= 0) {
            shape = letter;
            count = letter == 'B' ? 9 : 5;
          } else if (!isNaN(Number(v))) {
            count = Number(v);
          }

          const combos = this.combos[c];

          // Only possibly adding a combo.
          if (idx >= combos.length) {
            if (count == 0) {
              // Nothing to add, return early.
              shapeCountEl.value = '';
              return;
            }
            this.addShape(shape, `${count}${c}`);
            // Modify or delete a combo.
          } else {
            if (count == 0) {
              this.delete(`${c}${idx}`);
            } else {
              combos[idx].shape = LetterToShape[shape];
              combos[idx].count = count;
              combos[idx].recount();
            }
          }
          this.update();
        };
        enhanceEl.onblur = () => {
          const combos = this.combos[c];
          const v = Number(enhanceEl.value);
          if (!isNaN(v) && idx < combos.length) {
            combos[i].enhanced = v;
            combos[i].recount();
            this.update();
          } else {
            enhanceEl.value = '';
          }
        };
      }
    }
  }

  getElement(): HTMLElement {
    return this.comboEditor.getElement();
  }

  doCommands(cmdsString: string) {
    const cmds = cmdsString.split(' ')
      .map((c: string): string => c.trim())
      .filter((c: string): boolean => Boolean(c));

    let executed = 0;
    for (const i in cmds) {
      if (!this.doCommand(cmds[i])) {
        break;
      }
      executed++;
    }
    this.update();
    return cmds.slice(executed);
  }

  doCommand(cmd: string): boolean {
    if (cmd == 'D') {
      return this.doCommand('Daa');
    }
    if (cmd.startsWith('Da') || cmd.startsWith('DA')) {
      return this.deleteAll(cmd.substring(2));
    }
    if (cmd.startsWith('D')) {
      return this.delete(cmd.substring(1));
    }
    if ('XCLBR'.indexOf(cmd[0]) >= 0) {
      return this.addShape(cmd[0], cmd.substring(1));
    }
    let maybeMatch = cmd.match(/^\d+/);
    if (maybeMatch) {
      let count = Number(maybeMatch[0]);
      cmd = cmd.substring(maybeMatch[0].length);
      if (!cmd) {
        // Requires at least one color.
        return false;
      }
      return this.add(count, cmd);
    }
    if (cmd[0] in this.combos) {
      return this.add(3, cmd);
    }
    return false;
  }

  addShape(shape: string, cmd: string): boolean {
    let count = 3;
    const maybeCount = cmd.match(/^\d+/);
    if (maybeCount) {
      count = Number(maybeCount[0]);
      cmd = cmd.substring(maybeCount[0].length);
    }
    switch (shape) {
      case 'R':
        count = Math.max(count, this.boardWidth);
        break;
      case 'C':
        count = this.boardWidth - 1;
        break;
      case 'L':
      case 'X':
        count = 5;
        break;
      case 'B':
        count = 9;
        break;
    }
    return this.add(count, cmd, LetterToShape[shape] || Shape.AMORPHOUS);
  }

  add(count: number, cmd: string, shape: Shape = Shape.AMORPHOUS): boolean {
    if (count < 3) {
      count = 3;
    }
    let added = false;
    while (cmd) {
      if (!(cmd[0] in this.combos)) {
        break;
      }
      const c = cmd[0];
      let e = 0;
      cmd = cmd.substring(1);
      const maybeEnhance = cmd.match(/^\d+/);
      if (maybeEnhance) {
        e = Number(maybeEnhance[0]);
        cmd = cmd.substring(maybeEnhance[0].length);
      }
      this.combos[c].push(new Combo(count, COLORS.indexOf(c), e, shape));
      added = true;
    }
    if (cmd) {
      console.warn('Unused values in cmd: ' + cmd);
    }
    return added;
  }

  // TODO
  delete(cmd: string): boolean {
    let colorsToDelete = [];
    while (cmd && cmd[0] in this.combos) {
      colorsToDelete.push(cmd[0]);
      cmd = cmd.substring(1);
    }
    let idxToDelete = 1;
    let fromEnd = true;
    if (cmd) {
      if (cmd[0] == '-') {
        fromEnd = true;
        cmd = cmd.substring(1);
      } else {
        fromEnd = false;
      }
      const maybeIdx = cmd.match(/^\d+/);
      if (maybeIdx) {
        cmd = cmd.substring(maybeIdx[0].length);
        idxToDelete = Number(maybeIdx[0]);
      }
      if (cmd) {
        console.log(`Unused delete args: ${cmd}`);
      }
    }

    let anyDeleted = false;
    for (const c of colorsToDelete) {
      const idx = fromEnd ? this.combos[c].length - idxToDelete : idxToDelete - 0;
      if (idx >= 0 && idx < this.combos[c].length) {
        this.combos[c].splice(idx, 1);
        anyDeleted = true;
        console.log(`Deleting from ${c}, combo #${idx}`);
      } else {
        console.warn(`Index out of bounds: ${idx}`);
      }
    }
    return anyDeleted;
  }

  deleteAll(cmd: string): boolean {
    if (cmd[0].toLowerCase() == 'a') {
      for (const c in this.combos) {
        this.combos[c].length = 0;
      }
      return true;
    }
    // Assume to delete all color values present.
    for (const c of cmd) {
      if (!(c in this.combos)) {
        console.warn('Not valid color: ' + c);
      }
      this.combos[c].length = 0;
    }
    return true;
  }

  update() {
    const data: Record<string, { shapeCount: string, enhance: number }[]> = {};
    for (const c in this.combos) {
      data[c] = this.combos[c].map((combo: Combo): { shapeCount: string, enhance: number } => {
        let countString = ShapeToLetter[combo.shape];
        if (combo.shape == Shape.AMORPHOUS) {
          countString = `${combo.count}`;
        }
        if (combo.shape == Shape.ROW || combo.shape == Shape.COLUMN) {
          countString += `${combo.count}`;
        }
        return {
          shapeCount: countString,
          enhance: combo.enhanced,
        };
      });
    }
    this.comboEditor.update(data);
    for (const fn of this.onUpdate) {
      fn(this);
    }
  }

  setBonusComboLeader(bonus: number) {
    this.bonusCombosLeader = bonus;
    this.comboEditor.totalCombo.innerText = `Total Combos: ${this.comboCount()}`;
  }

  comboCount(): number {
    let total = 0;
    for (const c in this.combos) {
      total += this.combos[c].length;
    }
    return total + this.bonusCombosLeader + this.bonusCombosActive;
  }

  setBoardWidth(width: number): void {
    this.boardWidth = width;
    // TODO: Update combo counts as well.
  }

  getBoardSize(): number {
    return this.boardWidth * (this.boardWidth - 1);
  }
}

export {
  Combo,
  ComboContainer,
}
