// make list of all spells based on their type

let elixirSpells = [
  "Lightning Spell",
  "Healing Spell",
  "Rage Spell",
  "Jump Spell",
  "Freeze Spell",
  "Clone Spell",
  "Invisibility Spell",
  "Recall Spell",
];

let darkSpells = [
  "Poison Spell",
  "Earthquake Spell",
  "Haste Spell",
  "Skeleton Spell",
  "Bat Spell",
];

let Spells = [...elixirSpells, ...darkSpells];

Spells = Spells.sort();

let SpellsObj = {
  ["Elixir Spells"]: [...elixirSpells],
  ["Dark Spells"]: [...darkSpells],
};

module.exports = {
  elixirSpells,
  darkSpells,
  Spells,
  SpellsObj,
};
