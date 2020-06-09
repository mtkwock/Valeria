/**
 * Custom Base 64 encoding for Valeria's teams. This uses the 64 available
 * characaters
 * Encoding is as follows:
 * 6 bits to determine encoding version.
 * 2 bits to determine player mode (1 = 1P, 2 = 2p, 3 = 3p)
 * For each team in mode:
 *   5 bits to encode team badge.
 *   If mode is 1P or 3P: Repeat the following 6 times. Else 5 times
 *     14 bits encode monster sub id.
 *     If monster id is 0, there is no monster here. Go to next monster sub.
 *     Else:
 *       Next 14 bits is monster inherit.
 *       If inherit id is 0, this monster has no inherit, go to monster stats.
 *       Else:
 *         Next 7 bits represents inherit level.
 *         Next 1 bit represents if the inherit monster is +297.
 *       Next 4 bits determine number of Latents
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

import { LatentToPdchu } from './monster_instance'
import { Team } from './player_team';

// Any changes to the encoding schema should be noted here by incrementing this.
const ENCODING_VERSION = 0;

enum Bits {
  VERSION = 6, // We will store up to 64 different decoding versions before doing a complete overhaul.
  PLAYER_MODE = 2, // Must hold up to 3.
  BADGE = 5, // Must hold up to 21 at the moment.
  ID = 14, // Can contain up to id ~16.2k.
  LEVEL = 7, // Must contain up to 110.
  LATENT_COUNT = 4, // Must be able to hit 8.
  LATENT = 6, // Must be able to hold 33.
  AWAKENING = 4, // Must be able to hold up to 9.
  PLUS = 7, // Must be able to hold up to 99.
}

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

function ValeriaEncode(team: Team): string {
  const encoding = new Encoding();
  encoding.queueBits(ENCODING_VERSION, Bits.VERSION);
  const playerMode = team.playerMode;
  encoding.queueBits(playerMode, Bits.PLAYER_MODE);
  const monstersPerTeam = playerMode == 2 ? 5 : 6;
  for (let i = 0; i < playerMode; i++) {
    encoding.queueBits(team.badges[i], Bits.BADGE)
    for (let j = 0; j < monstersPerTeam; j++) {
      const monster = team.monsters[i * 6 + j];
      const id = monster.getId(true);
      if (id <= 0) {
        encoding.queueBits(0, Bits.ID);
        continue;
      }
      encoding.queueBits(id, Bits.ID);
      const inheritId = monster.inheritId;
      if (inheritId <= 0) {
        encoding.queueBits(0, Bits.ID);
      } else {
        encoding.queueBits(inheritId, Bits.ID);
        encoding.queueBits(monster.inheritLevel, Bits.LEVEL);
        encoding.queueBit(monster.inheritPlussed);
      }
      encoding.queueBits(monster.latents.length, Bits.LATENT_COUNT);
      for (const latent of monster.latents) {
        encoding.queueBits(latent, Bits.LATENT);
      }
      encoding.queueBits(monster.level, Bits.LEVEL);
      encoding.queueBits(monster.awakenings, Bits.AWAKENING);
      if (monster.hpPlus + monster.atkPlus + monster.rcvPlus == 297) {
        encoding.queueBit(true);
      } else {
        encoding.queueBit(false);
        encoding.queueBits(monster.hpPlus, Bits.PLUS);
        encoding.queueBits(monster.atkPlus, Bits.PLUS);
        encoding.queueBits(monster.rcvPlus, Bits.PLUS);
      }
      encoding.queueBits(monster.superAwakeningIdx + 1, Bits.AWAKENING);
    }
  }
  return encoding.getString();
}

type DecodeResult = {
  pdchu: string;
  badges: number[];
}

// All decoding methods starting from the first VERSION. When adding new ones,
// add to the TOP of this, so that it's clear which one is the most recent.
const DecodingVersions: Record<number, (e: Encoding) => DecodeResult> = {
  0: (encoding: Encoding): DecodeResult => {
    let pdchu = '';
    let badges = [0, 0, 0];

    const playerMode = encoding.dequeueBits(2);
    const monstersPerTeam = playerMode == 2 ? 5 : 6;
    for (let i = 0; i < playerMode; i++) {
      badges[i] = encoding.dequeueBits(Bits.BADGE);
      let teamString = '';
      for (let j = 0; j < monstersPerTeam; j++) {
        const id = encoding.dequeueBits(Bits.ID);
        if (id == 0) {
          teamString += ' / ';
          continue;
        }
        teamString += `${id} `;
        const inheritId = encoding.dequeueBits(Bits.ID);
        if (inheritId != 0) {
          teamString += `(${inheritId}| lv${encoding.dequeueBits(Bits.LEVEL)}${encoding.dequeueBit() ? ' +297' : ''})`;
        }
        const latentCount = encoding.dequeueBits(Bits.LATENT_COUNT);
        if (latentCount) {
          teamString += '[';
          for (let k = 0; k < latentCount; k++) {
            teamString += `${LatentToPdchu.get(encoding.dequeueBits(Bits.LATENT))},`;
          }
          teamString = teamString.substring(0, teamString.length - 1);
          teamString += '] ';
        }
        teamString += `| lv${encoding.dequeueBits(Bits.LEVEL)} awk${encoding.dequeueBits(Bits.AWAKENING)} `;
        const is297 = encoding.dequeueBit();
        if (!is297) {
          teamString += `+H${encoding.dequeueBits(Bits.PLUS)} +A${encoding.dequeueBits(Bits.PLUS)} +R${encoding.dequeueBits(Bits.PLUS)} `;
        }
        const sa = encoding.dequeueBits(Bits.AWAKENING);
        if (sa) {
          teamString += `sa${sa} `;
        }
        teamString += '/ ';
      }
      pdchu += teamString.substring(0, teamString.length - 2) + '; ';
    }

    return {
      pdchu: pdchu.substring(0, pdchu.length - 2),
      badges,
    };
  },
}

function ValeriaDecodeToPdchu(s: string): DecodeResult {
  const encoding = new Encoding(s);
  const v = encoding.dequeueBits(Bits.VERSION);
  const decoder = DecodingVersions[v];
  if (decoder) {
    return decoder(encoding);
  }

  // Fallback to version 0.
  // This only becomes an issue if we have >= (1 << 4) versions, at which point
  // I will safely assume that we do not need them anymore. (16 encoding
  // updates is pretty big.)
  return DecodingVersions[0](new Encoding(s));
}

export {
  Encoding,
  ValeriaEncode,
  ValeriaDecodeToPdchu,
}
