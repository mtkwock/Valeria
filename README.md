Extension Written by Scarlet#1115 on Discord.

**Please do not redistribute yet... This is still in Beta.**

### Building from source
1. Make sure you have npm installed
2. Open a terminal in this repo and run `npm install`
3. Run `npm run build` to create an build in ./dist

### Running local copy
Currently Valeria is a static site, so you just need to host those static files. You can run `npm run serve-dist` to host it locally. Valeria is probably available in https://localhost:4800

### Development
Developers can run `npm run dev` to autocompile on each typescript and sass change and to serve ./bin to https://localhost:4800

## Usage

#### Monster Editing

1. Click on the monster you wish to change on the team.  This should bring you to the Monster editing tab if you weren't already there.
2. On the left pane in the Monster field, change the ID to the monster you want.  You can use fuzzy searching for both the Monster and Inherit.
  * `fujin` will look for monsters with "Fujin" in their name.
  * `megakali` will prioritize Mega Kali because "mega" and "kali" are both in the name.
  * `gx sonia` will find monsters who match Green/None and have Sonia in their name.
  * `equip Durandalf` will find monsters that match Durandalf and prioritize their equip forms if they have any.
  * `ny Yomi`/`vonia` will search New Years and Valentines respectively.
3. The left pane will control all aspects of the monster.
  * I hope these are self-explanatory.  If not, please let me know.

#### Team Editing

You have the option to use a pdchu-like syntax to build your team.  You can also export your team as a pdchu format.

1P Yoh Team
```
yoh (equip trojan) | sa2 / ggzela (equip yoh) [dek * 2, sdr, sdr] | sa5 * 2/ odin dragon / gxfujin [sdr *6 ] / yoh (equip yoh) | sa2
```

2P Kaede Farming team
```
kaede / zeus-dios * 3 / raguel; kaede / zeus-dios * 3 / whaledor
```

If you click the Title area above the team, you can edit your team's name.  This is also used to save your team when going into the `Save/Load` tab.

If you click the `Description` tab underneath your team, you can edit a description.  This Description is saved when saving your team in the `Save/Load` tab.

By clicking `Save Team Screenshot`, you download a screenshot a part of the screen which shows your team and either `Stats` or `Description` depending on what you have selected.

### Dungeon Selection and Usage

#### Finding a Dungeon.

Use the Dungeon Search bar to determine which dungeon is available.  Note that these dungeons are sourced from DadGuide's data and may not always be present or named matching that of NA's.  There are a number of aliases that exist.  See src/fuzzy_search_aliases.ts for existing aliases. If there are aliases that are useful, please add them in a PR or ping Scarlet.

#### Using a Monster

The monsters in a dungeon should be generated automatically with all of their stats and abilities. When selecting a monster, they will automatically apply a preemptive (If there are multiple possible preemptives, a random will be selected.).  Note that monsters are not aware of any player debuffs that other monsters activated (e.g. Time Debuff) and will not act according to the board (They will always assume that the orb that they change exists).

Below the main area, you can see all of the monster's skills parsed along with estimates of damage.  Clicking on a skill will attempt to use the skill on your team, applying hits and debuffs to your team, and buffing/healing itself.

In the monster state editing section, you can change a number of the monster's statuses (status shield, invincibility, combo absorb, damage shield, damage absorb, damage void, and attribute absorbs), as well as see (and edit) the opponent's current state.  Soon, there will be a way to simulate an opponent's next move based on the current game state.

### Damage Calculation

In the middle pane, select the Battle tab.  This tab allows you to control your team's states, such as HP, buffs/debuffs, and see your available actives.  Note, to change teams, select any monster on that team row and it'll automatically update the information.  In the action dropdown, you can choose to determine combo damage with "Apply Combos" or check active damage by selecting on of your team's actives.  Clicking a monster will select its active, then its inherit, then back to combos.  Clicking "Use" will apply the action (Damage and healing for Combos, damage and buffs/debuffs for actives) on the team and the enemy.  Note that not every skill is fully supported.

For the damage calculations, there are three tables.  The first table is the damage before it hits any opponent. This is the damage you'll see on your monsters before they actually hit anything.  The second is the amount that occurs when your opponent is actually hit.  This will be the number you see pop up on the opponents. The last table is the effective damage. This is how much your opponent actually takes due to the fact that your opponent cannot go below 0 HP and cannot go above max. This is important because it allows you to check if the opponent will actually die, or if an absorbed color will save them.

### Team Conformance Tests

If you're constantly changing your team or sharing it with others, you'll often want to check that the team has certain requirements, such as "Team has enough SB for all monsters to be up on turn 1" or "Team has full Blind Resist and Full SBR".  For this, Valeria supports a basic conformance test language which is run every time your team is updated (or every time you update the textarea containing it).  These tests are also saved with your team.

#### Examples

```
# Lines beginning with "#" are ignored, as are empty lines.

# Each line runs a different test.
# Ensure P1's lead and helper are up on turn 1.
{P1.LEADER.CD} <= {P1.SB}
{P1.HELPER.CD} <= {P1.SB}
# This can also be written as
{P1.LEADER.CD} <= {P1.SB} and {P1.HELPER.CD} <= {P1.SB}

# Ensure that P1 has all hazard resists:
{P1.SBR} >= 5
{P1.RESIST_BLIND} >= 5
{P1.RESIST_POISON} >= 5
{P1.RESIST_JAMMER} >= 5
{P1.RESIST_CLOUD} > 0
{P1.RESIST_TAPE} > 0
{P1.GUARD_BREAK} > 0

# Ensure that P2 has FUA or SFUA
{P2.FUA} + {P2.SFUA} > 0
# Alternatively
{P2.FUA} > 0 or {P2.SFUA} > 0

# Ensure that P1's 1st sub has enough attack to button a monster with 2m HP and 10k def with 300x nuke.
{P1.SUB_1.ATK} * 300 * 2 >= 2000000 + 10000

# Ensure that the 2nd sub's inherit is not up after the third turn.
{P1.SUB_2.INHERIT_CD} > {P1.SB} + 3

# Ensure that the team can tank a 180k preemptive with a 75% shield
{P1.HP} >= 180000 * (1 - 0.75)

# Check that your sub-hp team has 0 recovery
{P1.RCV} <= 0

# Ensure your cheese team has 100% fire resist
{P1.RESIST_FIRE} >= 100
```

Below is a (possibly-out-of-date) list of values that you can access.  When accessing, the final value must be either a number or a CompareBoolean (Which is just another number).

```
MODE: number;
P1: {
    HP: number;
    RCV: number;
    TIME: number;

    LEADER: {
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
    }
    HELPER: See LEADER
    SUB_1: See LEADER
    SUB_2: See LEADER
    SUB_3: See LEADER
    SUB_4: See LEADER

    // TODO: Team specific Awakenings
    SB: number
    SBR: number
    FUA: number
    SFUA: number
    RESIST_BLIND: number
    RESIST_POISON: number
    RESIST_JAMMER: number
    RESIST_CLOUD: number
    RESIST_TAPE: number
    GUARD_BREAK: number

    // These resists are sums of this team's awakenings and latents.
    RESIST_FIRE: number;
    RESIST_WATER: number;
    RESIST_WOOD: number;
    RESIST_LIGHT: number;
    RESIST_DARK: number;

    // Leader Skill capabilities.
    // Not supported yet
    AUTOFUA: CompareBoolean;
}
P2 (May not exist): See P1;
P3 (May not exist): See P1;

FIRE: 1;
WATER: 2;
WOOD: 4;
LIGHT: 8;
DARK: 16;

ALL_ATTRIBUTES: 31;
TRUE: CompareBoolean.TRUE,
FALSE: CompareBoolean.FALSE,
```

You can see what values are allowed by looking at the first 100 lines of [team_test.ts](https://github.com/mtkwock/Valeria/blob/master/src/team_test.ts).


### View Monster Stats

## Command Editor syntax

### Start with:

1. `X`,`L`,`B`,`C` - A shape to choose the colors in.
2. `R`    - A row.  Can add any valid number of orbs after such as
   `R10`, `R11`, `R15`. Defaults to 6 on a 6x5 board.
4. \##   - Size of this Orb match. Must be between 3 and board size inclusive.
5. _ - Going straight to the attributes will assume a 3-match.

### Choose attributes

  * Must be at least one from "rgbldhpmjou", doing multiple will cause multiple of these to occur. e.g. 4rr will make 2x 4-matches of Red.
    * fire **R**ed
    * water **B**lue
    * wood **G**reen
    * **L**ight
    * **D**ark
    * **H**eart
    * **P**oison
    * **M**ortal poison
    * **J**ammer
    * b**O**mb
    * **U**ncolored / **U**nknown
  * Add Enhance
    * #      - This will cause # orbs to be enhanced.

#### Examples:

|Input|Output|
|-----|---|
|`r`| Make a 3-match of reds. |
|`rrrr`| Make 4x 3-match of reds. |
|`4hl1`|Make a TPA of each heal and light. The light combo has 1 enhanced orb.|
|`Rd`| Make a Row of 6 (on 6x5) dark orbs. |
|`R9rb`|Make a Row with 9 orbs of each red and blue.|
|`Bhg ggh`|Make a Box of hearts and greens, then two green 3-matches and one heart 3-match.|
|`Ch2`|Make a Column of hearts with 2 enhanced orbs.|
|`R30d`|Make a Roard with 30 darks.|


### Deleting combos
Start with:

 * `DA`  - Delete ALL combos of the given attribute(s).
 * `Da`  - Same as above.
 * `D`   - Delete combos of a given attribute and a give position. If alone, this will delete all combos.

Follow up with attributes to delete.

 * Must be at least one from "rgbldhpmjou", doing multiple will cause multiple deletions to occur.
 * If using DA/Da, you can use DAa/Daa to delete ALL combos that you've made.
 * Add an optional index to delete.
   * \##  - Will delete the #th combo, 0 or 1 indexed depending on settings.
   * -# - Will delete the #th combo from the end.
   * _  - No input will default to deleting the last combo.

#### Examples

|Input|Output|
|-----|---|
|`Dr`| Delete the last Red combo |
|`Dab`| Delete All Blue combos. |
|`Dald`| Delete All Light and Dark combos.|
|`Du0`| Delete the first Uncolored Combo. (Invalid if Indexed 1) |
|`Dj1`|Delete the second Jammer combo. (First if Indexed 1)|
|`Dg-2`| Delete the 2nd from last Green combo.|
|`Drb2`| Delete, from reds and blues, the 3rd combo.|
|`Drr`| Delete the last TWO Red combos.|
