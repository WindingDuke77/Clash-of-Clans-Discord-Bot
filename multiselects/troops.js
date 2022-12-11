let elixirTroops = [
  "Barbarian",
  "Archer",
  "Giant",
  "Goblin",
  "Wall Breaker",
  "Balloon",
  "Wizard",
  "Healer",
  "Dragon",
  "P.E.K.K.A",
  "Baby Dragon",
  "Miner",
  "Electro Dragon",
  "Yeti",
  "Dragon Rider",
];

let darkTroops = [
  "Minion",
  "Hog Rider",
  "Valkyrie",
  "Golem",
  "Witch",
  "Lava Hound",
  "Bowler",
  "Ice Golem",
  "Headhunter",
];

let superTroops = [
  "Super Barbarian",
  "Super Archer",
  "Super Giant",
  "Sneaky Goblin",
  "Super Wall Breaker",
  "Rocket Balloon",
  "Super Wizard",
  "Super Dragon",
  "Inferno Dragon",
  "Super Minion",
  "Super Valkyrie",
  "Super Witch",
  "Ice Hound",
];

let builderTroops = [
  "Raged Barbarian",
  "Sneaky Archer",
  "Boxer Giant",
  "Beta Minion",
  "Bomber",
  "Baby Dragon",
  "Cannon Cart",
  "Night Witch",
  "Drop Ship",
  "Super P.E.K.K.A",
  "Hog Glider",
];

let siegeMachines = [
  "Wall Wrecke",
  "Battle Blimp",
  "Stone Slammer",
  "Siege Barracks",
  "Log Launcher",
  "Flame Flinger",
  "Battle Drill",
];

let pets = [
  "L.A.S.S.I",
  "Electro Owl",
  "Mighty Yak",
  "Unicorn",
  "Frosty",
  "Diggy",
  "Poison Lizard",
  "Phoenix",
];

let Troops = [
  ...elixirTroops,
  ...darkTroops,
  ...superTroops,
  ...builderTroops,
  ...siegeMachines,
  ...pets,
];

Troops = Troops.sort();

let TroopsObj = {
  ["Elixir Troops"]: [...elixirTroops],
  ["Dark Troops"]: [...darkTroops],
  ["Super Troops"]: [...superTroops],
  ["Builder Troops"]: [...builderTroops],
  ["Siege Machines"]: [...siegeMachines],
  ["Pets"]: [...pets],
};

module.exports = {
  elixirTroops,
  darkTroops,
  superTroops,
  builderTroops,
  siegeMachines,
  Troops,
  TroopsObj,
};
