import { Latent } from './common';
import { Card, CardUiAssets, CardAssets, floof } from './ilmina_stripped';
import { Team } from './player_team';
import { getLatentPosition, getAwakeningOffsets } from './templates';

interface MonsterRowData {
  id: number;
  teamIdx: number,
  positionIdx: number,

  isInherit?: boolean,
  plus?: number;
  awakening?: number;
  superAwakeningIdx?: number,
  latents?: Latent[],
}

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

function drawAwakening(ctx: CanvasRenderingContext2D, awakening: number, sideLength: number, offsetX: number, offsetY: number, image: HTMLImageElement) {
  const [x, y] = getAwakeningOffsets(awakening);

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
      borderedText(ctx, `${inherit.id}`, xStats, drawnOffsetY + inheritLength * 0.25, 3, 'black', 'white');
      borderedText(ctx, `Lv${inherit.lv}`, xStats, drawnOffsetY + inheritLength * 0.583, 3, 'black', 'white');
      borderedText(ctx, `+${inherit.plussed ? 297 : 0}`, xStats, drawnOffsetY + inheritLength * 0.916, 3, 'black', 'white');

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

function borderedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, borderThickness = 2, borderColor = 'black', color = 'yellow') {
  ctx.fillStyle = borderColor;
  ctx.fillText(text, x, y + borderThickness);
  ctx.fillText(text, x, y - borderThickness);
  ctx.fillText(text, x + borderThickness, y);
  ctx.fillText(text, x - borderThickness, y);
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
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
      borderedText(ctx, `Lv${monster.lv}`, xLevel, yLevel, 2, 'black', 'white');

      ctx.textAlign = 'right';
      const xId = drawnOffsetX + length - width * 0.0125;
      borderedText(ctx, `${monster.id}`, xId, yLevel, 2, 'black', 'white');
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

interface FancyPhotoOptions {
  drawInheritSubattributes?: boolean;
  useTransform?: boolean;
  useLeadswap?: boolean;
  showAwakenings?: number[];
  showTeamStats?: boolean;
  showDescription?: boolean;
}

class FancyPhoto {
  private readonly canvas: HTMLCanvasElement;
  private readonly ctx: CanvasRenderingContext2D;
  private urlsToPromises: Record<string, Promise<void>> = {};
  private loadedImages: Record<string, HTMLImageElement> = {};
  private rowDraws: RowDraw[] = [];
  private opts: FancyPhotoOptions;

  constructor(canvas: HTMLCanvasElement, opts: FancyPhotoOptions = {}) {
    this.canvas = canvas;
    this.canvas.width = 1024;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    this.opts = opts;
  }

  setOptions(opts: FancyPhotoOptions) {
    this.opts = opts;
  }

  loadTeam(team: Team): void {
    this.rowDraws.length = 0;

    for (let i = 0; i < team.playerMode; i++) {
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
        awakenings: m.awakenings,
        lv: m.level,
        superAwakeningIdx: m.superAwakeningIdx,
      }));

      this.rowDraws.push(new MonsterRow(monsters));
      this.rowDraws.push(new LatentRow(currentTeam.map((m) => m.latents)));
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

class TeamPhoto {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  queue: Promise<void>;

  attributeBorders = document.createElement('img') as HTMLImageElement;

  monsterWidth: number;
  latentHeight: number;
  latentWidth: number;
  superLatentWidth: number;
  hyperLatentWidth: number;
  titleHeight = 20;
  canvasWidth = 600;
  canvasHeight = 960;
  monsterTotalHeight: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
    this.monsterWidth = this.canvasWidth / 6;
    this.latentHeight = this.monsterWidth / 8;
    this.latentWidth = this.latentHeight;
    this.superLatentWidth = 2 * this.latentWidth;
    this.hyperLatentWidth = 6 * this.latentWidth;

    this.monsterTotalHeight = 1.5 * this.monsterWidth + this.latentHeight;

    const assetInfo = CardUiAssets.getIconFrame(0, false, floof.model);
    if (assetInfo) {
      this.queue = new Promise((resolve) => {
        this.loadImage(assetInfo.url).then((image) => {
          this.attributeBorders = image;
          resolve();
        });
      });
    } else {
      this.queue = Promise.resolve();
    }
  }

  async loadImage(url: string): Promise<HTMLImageElement> {
    const image = document.createElement('img') as HTMLImageElement;
    image.src = url;
    image.style.display = 'none';
    document.body.appendChild(image);
    // const oldQueue = this.queue;
    return new Promise((resolve) => {
      image.onload = (): void => {
        resolve(image);
      };
    });
  }

  private drawAttributes(card: Card, width: number, drawnOffsetX: number, drawnOffsetY: number, drawSubattribute = false): void {
    const attributeDescriptor = CardUiAssets.getIconFrame(card.attribute, false, floof.model);
    if (!attributeDescriptor) {
      return;
    }
    this.context.drawImage(
      this.attributeBorders,
      attributeDescriptor.offsetX,
      attributeDescriptor.offsetY,
      attributeDescriptor.width,
      attributeDescriptor.height,
      drawnOffsetX,
      drawnOffsetY,
      width,
      width,
    );
    if (drawSubattribute && card.subattribute >= 0) {
      const subattributeDescriptor = CardUiAssets.getIconFrame(card.subattribute, true, floof.model);
      if (!subattributeDescriptor) {
        return;
      }
      this.context.drawImage(
        this.attributeBorders,
        subattributeDescriptor.offsetX,
        subattributeDescriptor.offsetY,
        subattributeDescriptor.width,
        subattributeDescriptor.height,
        drawnOffsetX,
        drawnOffsetY,
        width,
        width,
      );
    }
  }

  drawMonster(drawData: MonsterRowData) {
    const card = floof.model.cards[drawData.id];
    if (!card) {
      return;
    }

    const { offsetX, offsetY, width, height, url } = CardAssets.getIconImageData(card);

    const drawnWidth = drawData.isInherit ? this.monsterWidth / 2 : this.monsterWidth;
    let drawnOffsetY = this.titleHeight + (this.monsterTotalHeight) * drawData.teamIdx;
    if (!drawData.isInherit) {
      drawnOffsetY += this.monsterWidth / 2;
    }
    const drawnOffsetX = this.monsterWidth * drawData.positionIdx;

    const oldQueue = this.queue;
    this.queue = new Promise((resolve) => {
      // Await image load before drawing.
      this.loadImage(url).then((image) => {
        // Await other draw processes before drawing.
        oldQueue.then(() => {
          this.context.drawImage(
            image,
            offsetX, // x coordinate to being clipping.
            offsetY, // y coordinate to begin clipping.
            width, // width of the clipped image.
            height, // Height of the clipped image
            drawnOffsetX, // X Coordinate on canvas.
            drawnOffsetY, // y coordinate on canvas.
            drawnWidth, // width of the drawn image.
            drawnWidth, // height of the drawn image.
          );
          this.drawAttributes(card, drawnWidth, drawnOffsetX, drawnOffsetY, !drawData.isInherit);
          document.body.removeChild(image);
          resolve();
        });
      });
    });
  }

  clear(): void {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

export {
  TeamPhoto,
  FancyPhoto,
}
