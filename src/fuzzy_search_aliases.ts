/**
 All aliases of monsters and dungeons. Keep these in alphabetical order by
 alias. The value must be the exact ID of the monster or dungeon.

 Also, the alias MUST BE all lower-case.
*/

const MONSTER_ALIASES: Record<string, number> = {

};

const DUNGEON_ALIASES: Record<string, number> = {
  'a1': 1022001,
  'a2': 1022002,
  'a3': 1022003,
  'a4': 1022004,
  'a5': 1022005,
  'a6': 1022006,
  'aa1': 2660001,
  'aa2': 2660002,
  'aa3': 2660003,
  'aa4': 2660004,
};

export {
  MONSTER_ALIASES,
  DUNGEON_ALIASES,
}
