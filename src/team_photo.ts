import { Latent } from './common';
import { Card, CardUiAssets, CardAssets, floof } from './ilmina_stripped';

interface MonsterDrawData {
  id: number;
  teamIdx: number,
  positionIdx: number,

  isInherit?: boolean,
  plus?: number;
  awakening?: number;
  superAwakeningIdx?: number,
  latents?: Latent[],

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

  drawMonster(drawData: MonsterDrawData) {
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
}
