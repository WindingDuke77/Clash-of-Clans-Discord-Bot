let homeHero = [
  "Barbarian King",
  "Archer Queen",
  "Grand Warden",
  "Royal Champion",
];

let builderBaseHero = ["Battle Machine"];

let Heros = [...homeHero, ...builderBaseHero];

Heros = Heros.sort();

let HerosObj = {
  ["Home Hero"]: [...homeHero],
  ["Builder Base Hero"]: [...builderBaseHero],
};

module.exports = {
  homeHero,
  builderBaseHero,
  Heros,
  HerosObj,
};
