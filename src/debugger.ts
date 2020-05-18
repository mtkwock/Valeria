import { create } from './templates';

class DebuggerEl {
  private el = create('div') as HTMLDivElement;
  public inputEl = create('input') as HTMLInputElement;
  private buttons: HTMLButtonElement[] = [];
  private textarea = create('textarea') as HTMLTextAreaElement;
  private text = '';

  constructor() {
    this.el.appendChild(this.inputEl);
    this.el.appendChild(this.textarea);
    this.addButton('Clear', () => {
      this.text = '';
      this.textarea.value = '';
    });
    this.textarea.style.width = `100%`;
    this.textarea.style.fontSize = 'small';
    this.textarea.style.height = '250px';
    this.textarea.style.fontFamily = 'monospace';
  }

  addButton(text: string, onclick: () => any) {
    const button = create('button') as HTMLButtonElement;
    button.innerText = text;
    button.onclick = onclick;
    this.el.insertBefore(button, this.textarea);
    this.buttons.push(button);
  }

  getElement(): HTMLDivElement {
    return this.el;
  }

  print(text: string): void {
    this.text += `\n${text}`;
    this.textarea.value = this.text;
  }
}

const debug = new DebuggerEl();

export {
  debug
};
