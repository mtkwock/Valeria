import {Attribute, MonsterType, Awakening, Latent} from './common';
import {MonsterInstance, MonsterJson} from './monster_instance';
import {StoredTeamDisplay, TeamPane} from './templates';
import * as leaders from './leaders';

interface Burst {
	attrRestrictions: Attribute[];
	typeRestrictions: MonsterType[];
	awakenings: Awakening[];
	multiplier: number;
	awakeningScale: number;
}

interface TeamState {
	awakenings: boolean;
	currentHp: number;
	skillUsed: boolean;
	shieldPercent: number;
	attributesShielded: Attribute[];
	burst: Burst;
	ignoreDamageAbsorb: boolean;
	ignoreAttributeAbsorb: boolean;
	ignoreDamageVoid: boolean;

	timeBonus: number;
	timeIsMult: boolean;

	rcvMult: number;
	fixedHp: number;
}

const DEFAULT_STATE: TeamState = {
	awakenings: true,
	currentHp: 0,
	skillUsed: true,
	shieldPercent: 0,
	attributesShielded: [
			Attribute.FIRE, Attribute.WATER, Attribute.WOOD,
			Attribute.LIGHT, Attribute.DARK],
	burst: {
		attrRestrictions: [],
		typeRestrictions: [],
		awakenings: [],
		multiplier: 1,
		awakeningScale: 0,
	},
	ignoreDamageAbsorb: false,
	ignoreAttributeAbsorb: false,
	ignoreDamageVoid: false,

	timeBonus: 0,
	timeIsMult: false,

	rcvMult: 0,
	fixedHp: 0,
};

interface TeamJson {
	title: string;
	description: string,
	playerMode: number,
	monsters: MonsterJson[],
}

class StoredTeams {
	teams: Record<string, TeamJson>;
	display: StoredTeamDisplay;

	constructor(team: Team) {
		this.teams = {};
		if (window.localStorage.idcStoredTeams) {
			this.teams = JSON.parse(window.localStorage.idcStoredTeams);
		}
		this.display = new StoredTeamDisplay(
			// On Save Click
			() => {
				this.saveTeam(team.toJson());
				this.update();
			},
			// On Load Click
			(name: string) => {
				team.fromJson(this.getTeam(name));
			},
			// On Delete Click
			(name: string) => {
				this.deleteTeam(name);
				this.update();
			},
		);
		this.update();
	}

	getElement(): HTMLElement {
		return this.display.getElement();
	}

	update(): void {
		this.display.update(Object.keys(this.teams));
	}

	getTeam(name: string): TeamJson {
		if (!(name in this.teams)) {
			throw 'Invalid team name.';
		}
		return this.teams[name];
	}

  // TODO: Add confirmation if overriding.
	saveTeam(teamJson: TeamJson) {
		this.teams[teamJson.title] = teamJson;
		window.localStorage.idcStoredTeams = JSON.stringify(this.teams);
	}

  // TODO: Add confirmation.
	deleteTeam(title: string) {
		delete this.teams[title];
		window.localStorage.idcStoredTeams = JSON.stringify(this.teams);
	}
}

class Team {
	teamName: string = '';
	description: string = '';
	monsters: MonsterInstance[] = [];
	playerMode: number = 1;
	activeTeamIdx: number = 0;
	activeMonster: number = 0;
	lastMaxHp: number = 0;

	storage: StoredTeams;
	state: TeamState;
	teamPane: TeamPane;

	constructor() {
		/**
		 * 1P: 0-5
		 * 2P: 0-4, 6-10
		 * 3P: 0-5, 6-11, 12-17
		 */
		for (let i = 0; i < 18; i++) {
			this.monsters.push(new MonsterInstance());
		}
		this.state = Object.assign({}, DEFAULT_STATE);

		this.storage = new StoredTeams(this);
		this.teamPane = new TeamPane(this.storage.getElement());

		// TODO: Team Form
		// TODO: Monster Editor - Different Class?
		// TODO: Battle Display - Different Class?
	}

	resetState(partial: boolean = false): void {
		const state = this.state;

		if (partial) {
			state.currentHp = state.currentHp / this.lastMaxHp * this.getHp();
			this.lastMaxHp = this.getHp();
			return;
		}
		Object.assign(this.state, DEFAULT_STATE);
		state.currentHp = this.getHp();
	}

	isMultiplayer(): boolean {
		return this.playerMode != 1;
	}

	toPdchu(): string {
		const strings = this.monsters.map((monster) => monster.toPdchu());
		function combine(s: string[]): string {
			return s.join(' / ');
		}
		switch (this.playerMode) {
			case 1:
				return combine(strings.slice(0, 6));
			case 2:
				return combine(strings.slice(0, 5)) + ' ; ' + combine(strings.slice(6, 12));
			case 3:
				return [combine(strings.slice(0, 6)), combine(strings.slice(6, 12)), combine(strings.slice(12, 18))].join(' ; ');
		}
		// Unhandled player mode.
		return '';
	}

	fromPdchu(s: string): void {
		const teamStrings = s.split(';');
    // We don't support >3P.
    if (teamStrings.length > 3) {
      teamStrings.length = 3;
    }
    this.setPlayerMode(teamStrings.length);
    const defaultMonster = '1929 | +0aw0lv1'
    for (let i = 0; i < teamStrings.length; i++) {
      const multiplierRegex = /\*\s*\d$/;
      if (!teamStrings[i]) {
        teamStrings[i] = defaultMonster;
      }
      let monsterStrings = teamStrings[i].split('/')
          .map((s: string): string => s.trim())
          .reduce((allStrings: string[], monsterString: string) => {
            const multiply = monsterString.match(multiplierRegex);
            let count = 1;
            if (multiply) {
              count = Number(multiply[0][multiply[0].length - 1]);
              monsterString = monsterString.substring(0, multiply.index);
            }
            for (let j = 0; j < count; j++) {
              allStrings = allStrings.concat([monsterString])
            }
            return allStrings;
          }, []);
      if (this.playerMode == 2) {
        if (monsterStrings.length > 5) {
          monsterStrings.length = 5;
        }
        while(monsterStrings.length < 5) {
          monsterStrings.push(defaultMonster);
        }
      } else {
        if (monsterStrings.length > 6) {
          monsterStrings.length = 6;
        }
        while(monsterStrings.length < 6) {
          monsterStrings.push(defaultMonster);
        }
      }

      const team = this.getTeamAt(i);
      for (let j = 0; j < monsterStrings.length; j++) {
        team[j].fromPdchu(monsterStrings[j]);
      }
    }
	}

	getTeamAt(teamIdx: number): MonsterInstance[] {
		const monsters = Array(6);
		for (let i = 0; i < 6; i++) {
			monsters[i] = this.monsters[this.getMonsterIdx(teamIdx, i)];
		}
		return monsters;
	}

	getActiveTeam(): MonsterInstance[] {
		return this.getTeamAt(this.activeTeamIdx);
	}

	toJson(): TeamJson {
		return {
			playerMode: this.playerMode,
			title: this.teamName,
			description: this.description,
			monsters: this.monsters.map((monster) => monster.toJson()),
		};
	}

	fromJson(json: TeamJson): void {
		this.playerMode = json.playerMode || 1;
		this.teamName = json.title || 'UNTITLED';
		this.description = json.description || '';
		for (let i = 0; i < this.monsters.length; i++) {
			if (i < json.monsters.length) {
				this.monsters[i].fromJson(json.monsters[i]);
			} else {
				this.monsters[i].setId(-1);
			}
		}
	}

	setPlayerMode(newMode: number): void {
    if (newMode != 1 && newMode != 2 && newMode != 3) {
      throw `Invalid player mode, must be 1, 2, or 3, got ${newMode}`;
    }
    if (this.playerMode == 2) {
      /**
       0 1 2 3  4 6
       6 7 8 9 10 0
       x x x x x x
       ->
       0 1 2 3  4  5
       6 7 8 9 10 11
       x x x x  x  x
       */
      if (newMode == 3) {
        this.monsters[5].copyFrom(this.monsters[6]);
        this.monsters[11].copyFrom(this.monsters[0]);
      }
      if (newMode == 1) {
        this.monsters[5].copyFrom(this.monsters[6]);
      }
    } else if (this.playerMode == 3) {
    } else { // Handle 1P
      if (newMode == 2) {
        this.monsters[6].copyFrom(this.monsters[5]);
      }
    }

    this.playerMode = newMode;
    if (this.activeTeamIdx >= newMode) {
      this.setActiveTeamIdx(newMode - 1);
    }
    // TODO: Update UI to reflect this.
  }

	getHpPercent(): number {
    if (this.getHp() == 0) {
      return 0;
    }
    return Math.round(100 * this.state.currentHp / this.getHp());
  }

  setActiveTeamIdx(idx: number): void {
    if (idx >= this.playerMode || idx < 0) {
      throw `Index should be [0, ${this.playerMode}]`;
    }
    this.activeTeamIdx = idx;
    if (this.playerMode != 2) {
      this.state.currentHp = this.getHp();
    }
    // this.reloadStatDisplay();
    // TODO: Update visuals and calculations when this happens.
  }

	getMonsterIdx(teamIdx: number, localIdx: number): number {
		let idx = 6 * teamIdx + localIdx;
		if (this.playerMode == 2 &&
				((teamIdx == 0 && localIdx == 5) || (teamIdx == 1 && localIdx == 5))) {
			idx = (1 - teamIdx) * 6;
		}
		return idx;
	}

	getHp(): number {
		if (this.state.fixedHp) {
      return this.state.fixedHp;
    }
    const monsters = this.getActiveTeam();
		const partialLead = (monster: MonsterInstance): number => {
			return leaders.hp(monsters[0].getCard().leaderSkillId, {
				monster: monster,
				team: monsters,
				isMultiplayer: this.isMultiplayer(),
			});
		};
		const partialHelper = (monster: MonsterInstance): number => {
			return leaders.hp(monsters[5].getCard().leaderSkillId, {
				monster: monster,
				team: monsters,
				isMultiplayer: this.isMultiplayer(),
			});
		};
    if (this.playerMode == 2) {
      const p2Monsters = this.getTeamAt(this.activeTeamIdx ^ 1);
      for (let i = 1; i < 5; i++) {
        monsters.push(p2Monsters[i]);
      }
    }
    let totalHp = 0;
    const teamHpAwakeningsMult = 1 + (this.state.awakenings ? (monsters.reduce((total, monster) => total + monster.countAwakening(Awakening.TEAM_HP), 0) * 0.05) : 0);
    for (const monster of monsters) {
      if (!monster.id || monster.id <= 0) {
        continue;
      }
      const hpMult = partialLead(monster) * partialHelper(monster);
      const hpBase = monster.getHp(this.isMultiplayer(), this.state.awakenings);
      totalHp += Math.round(hpBase * hpMult * teamHpAwakeningsMult);
    }
    return totalHp;
	}

  // Base recovery before matching.
	getRcv(): number {
		const monsters = this.getActiveTeam();
		const partialLead = (monster: MonsterInstance): number => {
			return leaders.rcv(monsters[0].getCard().leaderSkillId, {
				monster: monster,
				team: monsters,
				isMultiplayer: this.isMultiplayer(),
			});
		};
		const partialHelper = (monster: MonsterInstance): number => {
			return leaders.rcv(monsters[5].getCard().leaderSkillId, {
				monster: monster,
				team: monsters,
				isMultiplayer: this.isMultiplayer(),
			});
		};
		let totalRcv = 0;
		const teamRcvAwakeningsMult = 1 + (this.state.awakenings ? (monsters.reduce((total, monster) => total + monster.countAwakening(Awakening.TEAM_RCV), 0) * 0.1) : 0);
		for (const monster of monsters) {
			if (!monster.id || monster.id <= 0) {
				continue;
			}
			const rcvMult = partialLead(monster) * partialHelper(monster);
			const rcvBase = monster.getRcv(this.isMultiplayer(), this.state.awakenings);
			totalRcv += Math.round(rcvBase * rcvMult * teamRcvAwakeningsMult);
		}
		return totalRcv;
	}

  // TODO
	getTime(): number {
		const monsters = this.getActiveTeam();
		const leadId = monsters[0].getCard().leaderSkillId;
		const helperId = monsters[5].getCard().leaderSkillId;
		const fixedLead = leaders.fixedTime(leadId);
		const fixedHelper = leaders.fixedTime(helperId);
		if (fixedLead || fixedHelper) {
			return Math.min(...[fixedLead, fixedHelper].filter(Boolean));
		}

    let time = 5;

    time += leaders.timeExtend(leadId) + leaders.timeExtend(helperId);

    for (const monster of monsters) {
      time += monster.countAwakening(Awakening.TIME) * 0.5;
      time += monster.countAwakening(Awakening.TIME_PLUS);
      time += monster.latents.filter((l) => l == Latent.TIME).length * 0.05;
      time += monster.latents.filter((l) => l == Latent.TIME_PLUS).length * 0.12;
    }

    if (this.state.timeIsMult) {
      time *= this.state.timeBonus;
    } else {
      time += this.state.timeBonus;
    }

    return time;
	}

	getBoardWidth(): number {
		const monsterGroupsToCheck: MonsterInstance[][] = [[this.monsters[0]]];
		switch(this.playerMode) {
			case 1:
				monsterGroupsToCheck[0].push(this.monsters[5]);
				break;
			case 2:
				monsterGroupsToCheck[0].push(this.monsters[6]);
				break;
			case 3:
			 	monsterGroupsToCheck[0].push(this.monsters[5]);
				monsterGroupsToCheck.push([this.monsters[6], this.monsters[11]]);
				monsterGroupsToCheck.push([this.monsters[12], this.monsters[17]]);
		}

		for (const [m1, m2] of monsterGroupsToCheck) {
			if (leaders.bigBoard(m1.getCard().leaderSkillId)) {
				continue;
			}
			if (leaders.bigBoard(m2.getCard().leaderSkillId)) {
				continue;
			}
			// If neither of the leads have bigBoard, return 6.
			return 6;
		}
		// All teams have bigBoard.
		return 7;
	}
}

export {
	Team
}
