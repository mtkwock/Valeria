import { TeamBadge } from './common';
import { CardUiAssets, CardAssets, floof } from './ilmina_stripped';
import { Team } from './player_team';
import { getLatentPosition, getAwakeningOffsets, FancyPhotoOptions, PhotoArea } from './templates';

interface RowDraw {
  // Determine the height of this RowDraw relative to the width of the canvas.
  // This is stated as a ratio so that the Drawing Utility knows how much
  // vertical space it will consume.
  getHeightOverWidth: () => number;

  // Obtain a list of all urls that need to be loaded. These will be fetched by
  // the drawing body before calling draw() and will be passed in. If this
  // function does not declare an url, it will be unable to use it easily.
  imagesToLoad: () => string[];

  // The actual draw function. To be called with an Offset. The drawing function
  // asks that the height used does not exceed getHeightOverWidth, the starting
  // Y position is at offsetY, and that the only images used are the ones passed
  // into the function.
  draw: (ctx: CanvasRenderingContext2D, drawnOffsetY: number, images: Record<string, HTMLImageElement>) => void;
}

interface inheritToDraw {
  id: number;
  plussed: boolean;
  lv: number;
}

function borderedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, borderThickness = -1, borderColor = 'black', color = 'yellow') {
  if (borderThickness < 0) {
    borderThickness = ctx.canvas.width / 200;
  }
  ctx.fillStyle = color;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderThickness;
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
}

class TitleRow implements RowDraw {
  private readonly title: string;

  constructor(title: string) {
    this.title = title.trim();
  }

  getHeightOverWidth(): number {
    return this.title ? 0.07 : 0;
  }

  imagesToLoad(): string[] {
    return [];
  }

  draw(ctx: CanvasRenderingContext2D, drawnOffsetY: number): void {
    if (!this.title) {
      return;
    }
    ctx.textAlign = 'left';
    ctx.font = `${ctx.canvas.width * 0.05}px Arial`;
    borderedText(ctx, this.title, ctx.canvas.width / 80, drawnOffsetY + ctx.canvas.width * 0.05, -1, 'black', 'white');
  }
}

class TeamBadgeRow implements RowDraw {
  private readonly badge: TeamBadge;
  constructor(badge: TeamBadge) {
    this.badge = badge;
  }

  getHeightOverWidth(): number {
    return 0.06;
  }

  private getAssetName(): string {
    return `assets/badge/${this.badge}.png`;
  }

  imagesToLoad(): string[] {
    return [this.getAssetName()];
  }

  draw(ctx: CanvasRenderingContext2D, drawnOffsetY: number, images: Record<string, HTMLImageElement>) {
    const width = ctx.canvas.width;
    const badgeWidth = width * 0.06;
    const badgeHeight = badgeWidth * 41 / 53;
    ctx.drawImage(
      images[this.getAssetName()],
      width / 40,
      drawnOffsetY + width * 0.004,
      badgeWidth,
      badgeHeight,
      // -1 * x,
      // -1 * y,
      // 32,
      // 32,
      // offsetX,
      // offsetY,
      // sideLength,
      // sideLength,
    );
  }
}

function drawMonster(ctx: CanvasRenderingContext2D, id: number, sideLength: number, offsetX: number, offsetY: number, images: Record<string, HTMLImageElement>) {
  if (id <= 0) {
    return;
  }

  const d = CardAssets.getIconImageData(floof.model.cards[id]);
  const a = CardUiAssets.getIconFrame(floof.model.cards[id].attribute, false, floof.model);

  ctx.drawImage(
    images[d.url],
    d.offsetX, // x coordinate to being clipping.
    d.offsetY, // y coordinate to begin clipping.
    d.width, // width of the clipped image.
    d.height, // Height of the clipped image
    offsetX, // X Coordinate on canvas.
    offsetY, // y coordinate on canvas.
    sideLength, // width of the drawn image.
    sideLength, // height of the drawn image.
  );

  if (a) {
    ctx.drawImage(
      images[a.url],
      a.offsetX,
      a.offsetY,
      a.width,
      a.height,
      offsetX,
      offsetY,
      sideLength,
      sideLength,
    );
  }

  if (floof.model.cards[id].subattribute >= 0) {
    const s = CardUiAssets.getIconFrame(floof.model.cards[id].subattribute, true, floof.model)
    if (s) {
      ctx.drawImage(
        images[s.url],
        s.offsetX,
        s.offsetY,
        s.width,
        s.height,
        offsetX,
        offsetY,
        sideLength,
        sideLength,
      );
    }
  }
}

function drawAwakening(ctx: CanvasRenderingContext2D, awakening: number, sideLength: number, offsetX: number, offsetY: number, image: HTMLImageElement, opacity = 1.0) {
  const [x, y] = getAwakeningOffsets(awakening);
  if (opacity != 1.0) {
    ctx.save();
    ctx.globalAlpha = opacity;
  }

  ctx.drawImage(
    image,
    -1 * x,
    -1 * y,
    32,
    32,
    offsetX,
    offsetY,
    sideLength,
    sideLength,
  );
  if (opacity! + 1.0) {
    ctx.restore();
  }
}

class InheritRow implements RowDraw {
  private readonly inherits: inheritToDraw[];

  constructor(inherits: inheritToDraw[]) {
    this.inherits = inherits;
  }

  getHeightOverWidth(): number {
    if (this.inherits.some(({ id }) => id > 0)) {
      return 1 / 12;
    }
    return 0;
  }

  draw(ctx: CanvasRenderingContext2D, drawnOffsetY: number, images: Record<string, HTMLImageElement>): void {
    const width = ctx.canvas.width;
    const inheritLength = width / 12;
    for (let i = 0; i < this.inherits.length; i++) {
      const inherit = this.inherits[i];
      if (inherit.id <= 0) {
        continue;
      }
      const drawnOffsetX = i * 2 * inheritLength;
      drawMonster(ctx, inherit.id, inheritLength, drawnOffsetX, drawnOffsetY, images);      // TODO: Draw the text for ID, Levels, and Plusses.
      ctx.textAlign = 'left';
      const xStats = drawnOffsetX + inheritLength + width * 0.005;

      ctx.font = `${width * 0.017}px Arial`;
      borderedText(ctx, `${inherit.id}`, xStats, drawnOffsetY + inheritLength * 0.25, -1, 'black', 'white');
      borderedText(ctx, `Lv${inherit.lv}`, xStats, drawnOffsetY + inheritLength * 0.583, -1, 'black', inherit.lv > 99 ? 'cyan' : 'white');
      borderedText(ctx, `+${inherit.plussed ? 297 : 0}`, xStats, drawnOffsetY + inheritLength * 0.916, -1, 'black', 'white');
    }
  }

  imagesToLoad(): string[] {
    const monsterUrls = this.getIds()
      .filter((id) => id > 0)
      .map((id) => CardAssets.getIconImageData(floof.model.cards[id]).url);
    const attributeBorder = CardUiAssets.getIconFrame(0, false, floof.model);
    if (attributeBorder) {
      return monsterUrls.concat(attributeBorder.url);
    }
    return monsterUrls;
  }

  private getIds(): number[] {
    return this.inherits.map((inherit) => inherit.id);
  }
}

interface monsterToDraw {
  id: number;
  plusses: number;
  awakenings: number;
  superAwakeningIdx: number;
  lv: number;
}

class MonsterRow implements RowDraw {
  private readonly monsters: monsterToDraw[];
  static readonly MAX_AWOKEN_URL = 'assets/max_awoken.png';
  static readonly AWAKENING_URL = 'assets/eggs.png';

  constructor(monsters: monsterToDraw[]) {
    this.monsters = monsters;
  }

  getHeightOverWidth(): number {
    if (this.monsters.some(({ id }) => id > 0)) {
      return 1 / 6;
    }
    return 0;
  }

  draw(ctx: CanvasRenderingContext2D, drawnOffsetY: number, images: Record<string, HTMLImageElement>): void {
    const width = ctx.canvas.width;
    const length = width / 6;
    for (let i = 0; i < this.monsters.length; i++) {
      const monster = this.monsters[i];
      if (monster.id <= 0) {
        continue;
      }
      const drawnOffsetX = i * length;

      drawMonster(ctx, monster.id, length, drawnOffsetX, drawnOffsetY, images);
      if (monster.plusses) {
        ctx.textAlign = 'left';
        const x = drawnOffsetX + width * 0.0075;
        const y = drawnOffsetY + width * 0.04;
        ctx.font = `${width * 0.033333}px Arial`;
        borderedText(ctx, `+${monster.plusses} `, x, y);
        ctx.fillStyle = 'black';
      }
      if (monster.awakenings) {
        if (monster.awakenings >= floof.model.cards[monster.id].awakenings.length) {
          ctx.drawImage(
            images[MonsterRow.MAX_AWOKEN_URL],
            0,
            0,
            55,
            55,
            drawnOffsetX + 0.7 * length,
            drawnOffsetY + width * .0125,
            length * 0.23,
            length * 0.23,
          )
        } else {
          ctx.textAlign = 'right';
          const x = drawnOffsetX + length - width * 0.0125;
          const y = drawnOffsetY + width * 0.04;
          ctx.font = `${width * 0.033333}px Arial`;
          borderedText(ctx, `(${monster.awakenings})`, x, y);
        }
      }

      if (monster.superAwakeningIdx >= 0) {
        const sa = floof.model.cards[monster.id].superAwakenings[monster.superAwakeningIdx];
        if (sa != undefined) {
          const xSa = drawnOffsetX + length * 0.7;
          const ySa = drawnOffsetY + length * 0.375;
          drawAwakening(ctx, sa, length * 0.25, xSa, ySa, images[MonsterRow.AWAKENING_URL]);
        }
      }

      ctx.textAlign = 'left';
      const xLevel = drawnOffsetX + width * 0.0125;
      const yLevel = drawnOffsetY + length * 0.92;
      ctx.font = `${width * 0.022}px Arial`;
      borderedText(ctx, `Lv${monster.lv}`, xLevel, yLevel, -1, 'black', monster.lv > 99 ? 'cyan' : 'white');

      ctx.textAlign = 'right';
      const xId = drawnOffsetX + length - width * 0.0125;
      borderedText(ctx, `${monster.id}`, xId, yLevel, -1, 'black', 'white');
    }
  }

  imagesToLoad(): string[] {
    const monsterUrls = this.getIds()
      .filter((id) => id > 0)
      .map((id) => CardAssets.getIconImageData(floof.model.cards[id]).url)
      .concat(MonsterRow.MAX_AWOKEN_URL, MonsterRow.AWAKENING_URL);
    const attributeBorder = CardUiAssets.getIconFrame(0, false, floof.model);
    if (attributeBorder) {
      return monsterUrls.concat(attributeBorder.url);
    }
    return monsterUrls;
  }

  private getIds(): number[] {
    return this.monsters.map((monster) => monster.id);
  }
}

class LatentRow implements RowDraw {
  static readonly LATENT_WIDTH = 32;
  static readonly LATENT_WIDTH_SUPER = 78;
  static readonly LATENT_WIDTH_HYPER = 78 * 3;
  private readonly latents: number[][];
  private mostSlotsUsed: number = 0;
  static readonly LATENT_URL = 'assets/eggs.png';

  constructor(latents: number[][]) {
    this.latents = latents;
    for (const monsterLatents of latents) {
      const slotsUsed = monsterLatents.reduce((total, l) => {
        if (l < 11) {
          return total + 1;
        }
        if (l < 33) {
          return total + 2;
        }
        return total + 6;
      }, 0);
      this.mostSlotsUsed = Math.max(this.mostSlotsUsed, slotsUsed);
    }
  }

  getHeightOverWidth(): number {
    if (this.mostSlotsUsed == 0) {
      return 0;
    }
    if (this.mostSlotsUsed <= 6) {
      return 1 / 48;
    }
    // 7-8 Latents requires 2 rows.
    return 1 / 24;
  }

  imagesToLoad(): string[] {
    return [LatentRow.LATENT_URL];
  }

  draw(ctx: CanvasRenderingContext2D, drawnOffsetY: number, images: Record<string, HTMLImageElement>) {
    const superSize = ctx.canvas.width / 18;
    const hyperSize = 3 * superSize;
    const normalSize = superSize * LatentRow.LATENT_WIDTH / LatentRow.LATENT_WIDTH_SUPER;
    const height = ctx.canvas.width / 48;
    const maxWidth = ctx.canvas.width / 6;

    for (let i = 0; i < this.latents.length; i++) {
      const monsterLatents = this.latents[i].sort((a, b) => b - a);
      let localOffsetX = 0;
      let localOffsetY = 0;
      for (const latent of monsterLatents) {
        let width = hyperSize;
        let imageWidth = LatentRow.LATENT_WIDTH_HYPER;
        if (latent < 11) {
          width = normalSize;
          imageWidth = LatentRow.LATENT_WIDTH;
        } else if (latent < 33) {
          width = superSize;
          imageWidth = LatentRow.LATENT_WIDTH_SUPER;
        }
        if (localOffsetX + width > maxWidth) {
          localOffsetX = 0;
          localOffsetY = height;
        }

        const { x, y } = getLatentPosition(latent);

        ctx.drawImage(
          images[LatentRow.LATENT_URL],
          x,
          y,
          imageWidth,
          32,
          localOffsetX + i * ctx.canvas.width / 6,
          localOffsetY + drawnOffsetY,
          width,
          height,
        );

        localOffsetX += width;
      }
    }
  }
}

class AggregateAwakeningRow implements RowDraw {
  private readonly totals: { awakening: number; total: number }[];
  static readonly PER_ROW = 9;

  constructor(totals: { awakening: number; total: number }[]) {
    this.totals = totals;
  }

  getHeightOverWidth(): number {
    return Math.ceil(Object.keys(this.totals).length / AggregateAwakeningRow.PER_ROW) / 20 + 1 / 20;
  }

  imagesToLoad(): string[] {
    return [MonsterRow.AWAKENING_URL];
  }

  draw(ctx: CanvasRenderingContext2D, drawnOffsetY: number, images: Record<string, HTMLImageElement>): void {
    let verticalOffset = drawnOffsetY + ctx.canvas.width * 1 / 40;
    const sideLength = ctx.canvas.width / 6 * 0.25;
    let xOffset = ctx.canvas.width * 0.05;
    const im = images[MonsterRow.AWAKENING_URL];
    const maxOffset = ctx.canvas.width * 0.9;
    for (const { awakening, total } of this.totals) {
      drawAwakening(ctx, awakening, sideLength, xOffset, verticalOffset, im, total ? 1.0 : 0.5);
      const text = `x${total}`;
      if (text.length < 4) {
        ctx.font = `${ctx.canvas.width * 0.033}px Arial`;
      } else {
        ctx.font = `${ctx.canvas.width * 0.025}px Arial`;
      }
      ctx.textAlign = 'left';
      borderedText(ctx, text, xOffset + sideLength, verticalOffset + sideLength, -1, 'black', 'white');
      xOffset += ctx.canvas.width / (AggregateAwakeningRow.PER_ROW + 1);
      if (xOffset > maxOffset) {
        xOffset = 0.05 * ctx.canvas.width;
        verticalOffset += ctx.canvas.width / 20;
      }
    }
  }
}

class TextRow implements RowDraw {
  private readonly text: string;
  private readonly fontSizeFrac: number;
  private readonly margin: number

  constructor(text: string, fontSizeFrac = 1 / 30, margin = 1 / 40) {
    this.text = text;
    this.fontSizeFrac = fontSizeFrac;
    this.margin = margin;
  }

  imagesToLoad(): string[] {
    return [];
  }

  private getFont(width: number): string {
    return `${width * this.fontSizeFrac}px Arial`;
  }

  private parapperTheWrapper(ctx: CanvasRenderingContext2D): string {
    ctx.font = this.getFont(ctx.canvas.width);
    const maxWidth = ctx.canvas.width * (1 - 2 * this.margin);
    const words = this.text.split(' ');
    let line = '';
    let currentLine = '';
    for (let i = 0; i < words.length; i++) {
      currentLine += words[i] + ' ';
      const width = ctx.measureText(currentLine).width;
      if (width > maxWidth) {
        line += '\n' + words[i] + ' ';
        currentLine = words[i] + ' ';
      } else {
        line += words[i] + ' ';
      }
    }
    return line;
  }

  getHeightOverWidth(): number {
    const testCanvas = document.createElement('canvas') as HTMLCanvasElement;
    testCanvas.width = 1000;
    const ctx = testCanvas.getContext('2d');
    if (!ctx) {
      return 0;
    }
    ctx.font = this.getFont(testCanvas.width);

    const wrappedText = this.parapperTheWrapper(ctx);
    return this.fontSizeFrac * wrappedText.split('\n').length;
  }

  draw(ctx: CanvasRenderingContext2D, drawnOffsetY: number): void {
    ctx.font = this.getFont(ctx.canvas.width);
    for (const line of this.parapperTheWrapper(ctx).split('\n')) {
      drawnOffsetY += this.fontSizeFrac * ctx.canvas.width;
      borderedText(
        ctx,
        line,
        ctx.canvas.width * this.margin,
        drawnOffsetY,
        -1,
        'black',
        'white',
      );
    }
  }
}

class PaddingRow implements RowDraw {
  private readonly frac: number;

  constructor(frac: number) {
    this.frac = frac;
  }

  imagesToLoad(): string[] {
    return [];
  }

  getHeightOverWidth(): number {
    return this.frac;
  }

  draw(): void {
    return;
  }
}

class FancyPhoto {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private urlsToPromises: Record<string, Promise<void>> = {};
  private loadedImages: Record<string, HTMLImageElement> = {};
  private rowDraws: RowDraw[] = [];
  private opts: FancyPhotoOptions = {
    drawTitle: true,
    drawBadge: true,
    useTransform: false,
    useLeadswap: false,
    awakenings: [],
    showDescription: true,
  };
  private photoArea: PhotoArea;
  private lastTeam?: Team;

  constructor() {
    this.photoArea = new PhotoArea(this.opts, () => {
      this.reloadTeam();
      this.redraw();
    });
    this.canvas = this.photoArea.getCanvas();
    this.canvas.width = 1024;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }

  getElement(): HTMLElement {
    return this.photoArea.getElement();
  }

  setOptions(opts: FancyPhotoOptions) {
    this.opts = opts;
  }

  reloadTeam(): void {
    if (this.lastTeam) {
      this.loadTeam(this.lastTeam);
    }
  }

  loadTeam(team: Team): void {
    this.lastTeam = team;
    this.rowDraws.length = 0;
    if (this.opts.drawTitle) {
      this.rowDraws.push(new TitleRow(team.teamName));
    }

    for (let i = 0; i < team.playerMode; i++) {
      if (this.opts.drawBadge && team.playerMode != 2) {
        this.rowDraws.push(new TeamBadgeRow(team.badges[i]));
      }
      team.activeTeamIdx = i;
      const currentTeam = team.getTeamAt(i);
      const inherits: inheritToDraw[] = currentTeam.map((m) => ({
        id: m.inheritId,
        plussed: m.inheritPlussed,
        lv: m.inheritLevel,
      }));
      this.rowDraws.push(new InheritRow(inherits));

      const monsters: monsterToDraw[] = currentTeam.map((m) => ({
        id: m.getId(!this.opts.useTransform),
        plusses: m.hpPlus + m.atkPlus + m.rcvPlus,
        awakenings: this.opts.useTransform && m.transformedTo > 0 ? 9 : m.awakenings,
        lv: m.level,
        superAwakeningIdx: m.superAwakeningIdx,
      }));

      this.rowDraws.push(new MonsterRow(monsters));
      this.rowDraws.push(new LatentRow(currentTeam.map((m) => m.latents)));
      if (this.opts.awakenings.length) {
        const awakeningTotals = this.opts.awakenings.map((awakening) => {
          let total = team.countAwakening(awakening, { ignoreTransform: !this.opts.useTransform, includeTeamBadge: true });
          return { awakening, total };
        });
        this.rowDraws.push(new AggregateAwakeningRow(awakeningTotals));
      }
    }

    if (this.opts.showDescription) {
      for (const line of team.description.split('\n')) {
        this.rowDraws.push(new TextRow(line));
      }
      this.rowDraws.push(new PaddingRow(1 / 40));
    }
  }

  redraw(idx = 0): void {
    const heightOverWidth = this.rowDraws.reduce((total, rowDraw) => total + rowDraw.getHeightOverWidth(), 0);
    this.canvas.height = this.canvas.width * heightOverWidth;
    let aggregateOffset = 0;
    for (let i = 0; i < idx; i++) {
      aggregateOffset += this.rowDraws[i].getHeightOverWidth() * this.canvas.width;
    }
    this.ctx.clearRect(0, aggregateOffset, this.canvas.width, this.canvas.height - aggregateOffset);

    for (const rowDraw of this.rowDraws.slice(idx)) {
      const imageUrls = rowDraw.imagesToLoad();
      for (const imageUrl of imageUrls) {
        if (!this.urlsToPromises[imageUrl]) {
          const image = document.createElement('img') as HTMLImageElement;
          image.src = imageUrl;
          image.style.display = 'none';
          document.body.appendChild(image);
          this.urlsToPromises[imageUrl] = new Promise((resolve) => {
            image.onload = () => {
              this.loadedImages[imageUrl] = image;
              resolve();
            };
          });
        }
      }

      const currentOffset = aggregateOffset;

      Promise.all(imageUrls.map((url) => this.urlsToPromises[url])).then(() => {
        rowDraw.draw(this.ctx, currentOffset, this.loadedImages);
      });
      aggregateOffset += rowDraw.getHeightOverWidth() * this.canvas.width;
    }
  }
}

/*
[Title]

|+297  *|+297  *|+297  *|+297  *|+297  *|+297  *|
|     SA|     SA|     SA|     SA|     SA|     SA|
|Lv   ID|Lv   ID|Lv   ID|Lv   ID|Lv   ID|Lv   ID|
LATENTS LATENTS LATENTS LATENTS LATENTS LATENTS

SB, Resists, SBR, FUA, SFUa (Have a toggle above which changes this.)
Max 6 per row?

x1-3 times depending on playerMode.

[Team Description occurs on second column]
What type of special text should be here? Bold?  Title things?
 */

export {
  FancyPhoto,
}
