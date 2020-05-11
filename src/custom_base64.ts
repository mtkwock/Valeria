import { LatentToPdchu } from './monster_instance'
import { Team } from './player_team';

const CHAR_AT = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const CHAR_TO_NUM: Map<string, number> = new Map(CHAR_AT.split('').map((c, i) => [c, i]));

class Encoding {
  private composedString: string;
  private bitQueue: number = 0;
  private queueLength: number = 0;

  private dequeueLength: number = 0;
  private bitDequeue: number = 0;

  constructor(s: string = '') {
    this.composedString = s;
  }

  private check() {
    while (this.queueLength >= 6) {
      this.queueLength -= 6;
      this.composedString += CHAR_AT[this.bitQueue >> this.queueLength];
      this.bitQueue = this.bitQueue & ((1 << this.queueLength) - 1);
    }
  }

  queueBits(n: number, l: number) {
    if ((1 << l) <= n) {
      throw new Error(`Cannot queue a number ${n} of length ${l}`);
    }
    this.bitQueue = (this.bitQueue << l) | n;
    this.queueLength += l;
    this.check();
  }

  queueBit(on: boolean) {
    this.queueLength++;
    this.bitQueue = this.bitQueue << 1 | Number(on);
    this.check();
  }

  dequeueBit(): number {
    if (!this.dequeueLength) {
      this.dequeueLength = 6;
      this.bitDequeue = CHAR_TO_NUM.get(this.composedString[0]) as number;
      this.composedString = this.composedString.substring(1);
    }
    this.dequeueLength--;
    const val = this.bitDequeue >> this.dequeueLength;
    this.bitDequeue = this.bitDequeue & ((1 << this.dequeueLength) - 1);
    return val;
  }

  dequeueBits(l: number): number {
    let result = 0;
    for (let i = 0; i < l; i++) {
      result = (result << 1) | this.dequeueBit();
    }
    return result;
  }

  getString(): string {
    const padded = this.bitQueue << (6 - this.queueLength);
    return this.composedString + CHAR_AT[padded];
  }
}

/**
 * Encoding is as follows:
 * First two bits = mode (1 = 1P, 2 = 2p, 3 = 3p)
 * For each team in mode:
 *   If mode is 1P or 3P: Repeat the following 6 times. Else 5 times
 *     13 bits encode monster sub id.
 *     If monster id is 0, there is no monster here. Go to next monster sub.
 *     Else:
 *       Next 13 bits is monster inherit.
 *       If inherit id is 0, this monster has no inherit, go to monster stats.
 *       Else:
 *         Next 7 bits represents inherit level.
 *         Next 1 bit represents if the inherit monster is +297.
 *       Next 3 bits determine number of Latents
 *       For each latent:
 *         Next 6 bits represents latent.
 *       Next 7 bits represents monster level.
 *       Next 4 bits represents monster awakening level.
 *       Next 1 bit represents if a monster is 297 or not.
 *       If 297, set to 297
 *       Else:
 *         Next 7 bits represents +HP
 *         Next 7 bits represents +ATK
 *         Next 7 bits represents +RCV
 *       Next 4 bits represents monsters Super Awakening.
 */

function ValeriaEncode(team: Team): string {
  const encoding = new Encoding();
  const playerMode = team.playerMode;
  encoding.queueBits(playerMode, 2);
  const monstersPerTeam = playerMode == 2 ? 5 : 6;
  for (let i = 0; i < playerMode; i++) {
    for (let j = 0; j < monstersPerTeam; j++) {
      const monster = team.monsters[i * 6 + j];
      const id = monster.getId(true);
      if (id <= 0) {
        encoding.queueBits(0, 13);
        continue;
      }
      encoding.queueBits(id, 13);
      const inheritId = monster.inheritId;
      if (inheritId <= 0) {
        encoding.queueBits(0, 13);
      } else {
        encoding.queueBits(inheritId, 13);
        encoding.queueBits(monster.inheritLevel, 7);
        encoding.queueBit(monster.inheritPlussed);
      }
      encoding.queueBits(monster.latents.length, 3);
      for (const latent of monster.latents) {
        encoding.queueBits(latent, 6);
      }
      encoding.queueBits(monster.level, 7);
      encoding.queueBits(monster.awakenings, 4);
      if (monster.hpPlus + monster.atkPlus + monster.rcvPlus == 297) {
        encoding.queueBit(true);
      } else {
        encoding.queueBit(false);
        encoding.queueBits(monster.hpPlus, 7);
        encoding.queueBits(monster.atkPlus, 7);
        encoding.queueBits(monster.rcvPlus, 7);
      }
      encoding.queueBits(monster.superAwakeningIdx + 1, 4);
    }
  }
  return encoding.getString();
}

function ValeriaDecodeToPdchu(s: string): string {
  let pdchu = '';
  const encoding = new Encoding(s);
  const playerMode = encoding.dequeueBits(2);
  const monstersPerTeam = playerMode == 2 ? 5 : 6;
  for (let i = 0; i < playerMode; i++) {
    let teamString = '';
    for (let j = 0; j < monstersPerTeam; j++) {
      const id = encoding.dequeueBits(13);
      if (id == 0) {
        teamString += ' / ';
        continue;
      }
      teamString += `${id} `;
      const inheritId = encoding.dequeueBits(13);
      if (inheritId != 0) {
        teamString += `(${inheritId}| lv${encoding.dequeueBits(7)}${encoding.dequeueBit() ? ' +297' : ''})`;
      }
      const latentCount = encoding.dequeueBits(3);
      if (latentCount) {
        teamString += '[';
        for (let k = 0; k < latentCount; k++) {
          teamString += `${LatentToPdchu.get(encoding.dequeueBits(6))},`;
        }
        teamString = teamString.substring(0, teamString.length - 1);
        teamString += '] ';
      }
      teamString += `| lv${encoding.dequeueBits(7)} awk${encoding.dequeueBits(4)} `;
      const is297 = encoding.dequeueBit();
      if (is297) {
      } else {
        teamString += `+H${encoding.dequeueBits(7)} +A${encoding.dequeueBits(7)} +R${encoding.dequeueBits(7)} `;
      }
      const sa = encoding.dequeueBits(4);
      if (sa) {
        teamString += `sa${sa} `;
      }
      teamString += '/ ';
    }
    pdchu += teamString.substring(0, teamString.length - 2) + '; ';
  }

  return pdchu.substring(0, pdchu.length - 2);
}

export {
  Encoding,
  ValeriaEncode,
  ValeriaDecodeToPdchu,
}
