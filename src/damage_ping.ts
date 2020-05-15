import { Attribute, Round } from './common';
import { MonsterInstance } from './monster_instance';

class DamagePing {
  source: MonsterInstance;
  attribute: Attribute;
  isSub: boolean = false;
  ignoreVoid: boolean = false;
  ignoreDefense: boolean = false;
  damage: number = 0;
  rawDamage: number = 0;
  actualDamage: number = 0;
  constructor(source: MonsterInstance, attribute: Attribute, isSub: boolean = false) {
    this.source = source;
    this.attribute = attribute;
    this.isSub = isSub;
  }

  add(amount: number): void {
    this.damage += amount;
  }

  multiply(multiplier: number, round = Round.NEAREST): void {
    this.damage = round(this.damage * multiplier);
  }
}

export {
  DamagePing,
}
