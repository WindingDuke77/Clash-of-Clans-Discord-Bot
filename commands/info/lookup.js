const { SlashCommandBuilder } = require("@discordjs/builders");
const fetch = require("node-fetch");
const Discord = require("discord.js");
const { Troops } = require("../../multiselects/troops.js");
const { Spells } = require("../../multiselects/spells.js");
const { Heros } = require("../../multiselects/heros.js");
const { returnImage } = require("../../module/images/main.js");
const {
  hexFromId,
  capitalize,
  getPlyData,
} = require("../../functions/cocfunc.js");

const troopsSelectorIds = [];
const spellsSelectorIds = [];
const herosSelectorIds = [];

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("lookup")
    .setDescription("Info of any Troop, Spell or Hero")
    .addSubcommand((subcommand) => {
      subcommand.setName("troops").setDescription("Troops of the Player");

      let stringOption = null;

      // split troops into 25
      let splitTroops = {};
      let temp = [];
      for (let i = 0; i < Troops.length; i++) {
        temp.push(Troops[i]);
        if (temp.length == 25) {
          // "a-d"
          let groupName = Troops[i - 24].charAt(0) + "-" + Troops[i].charAt(0);
          troopsSelectorIds.push(groupName.toLowerCase());
          splitTroops[groupName] = temp;
          temp = [];
        }
      }
      let groupName =
        Troops[Object.keys(splitTroops).length * 25].charAt(0) +
        "-" +
        Troops[Troops.length - 1].charAt(0);
      troopsSelectorIds.push(groupName.toLowerCase());
      splitTroops[groupName] = temp;
      for (let key in splitTroops) {
        subcommand.addStringOption((option) => {
          let optionName = key.toLowerCase();
          option.setName(optionName);
          option.setDescription(`Troops ${key}`);

          for (let i = 0; i < splitTroops[key].length; i++) {
            option.addChoices({
              name: splitTroops[key][i],
              value: splitTroops[key][i].toLowerCase(),
            });
          }
          return option;
        });
      }
      return subcommand;
    })
    .addSubcommand((subcommand) => {
      subcommand.setName("spells").setDescription("Spells of the Player");

      let stringOption = null;

      // split spells into 25
      let splitSpells = {};
      let temp = [];
      for (let i = 0; i < Spells.length; i++) {
        temp.push(Spells[i]);
        if (temp.length == 25) {
          // "a-d"
          let groupName = Spells[i - 24].charAt(0) + "-" + Spells[i].charAt(0);
          spellsSelectorIds.push(groupName.toLowerCase());
          splitSpells[groupName] = temp;
          temp = [];
        }
      }
      let groupName =
        Spells[Object.keys(splitSpells).length * 25].charAt(0) +
        "-" +
        Spells[Spells.length - 1].charAt(0);
      spellsSelectorIds.push(groupName.toLowerCase());
      splitSpells[groupName] = temp;
      for (let key in splitSpells) {
        subcommand.addStringOption((option) => {
          let optionName = key.toLowerCase();
          option.setName(optionName);
          option.setDescription(`Spells ${key}`);

          for (let i = 0; i < splitSpells[key].length; i++) {
            option.addChoices({
              name: splitSpells[key][i],
              value: splitSpells[key][i].toLowerCase(),
            });
          }
          return option;
        });
      }
      return subcommand;
    })
    .addSubcommand((subcommand) => {
      subcommand.setName("heros").setDescription("Heros of the Player");

      let stringOption = null;

      // split heros into 25
      let splitHeros = {};
      let temp = [];
      for (let i = 0; i < Heros.length; i++) {
        temp.push(Heros[i]);
        if (temp.length == 25) {
          // "a-d"
          let groupName = Heros[i - 24].charAt(0) + "-" + Heros[i].charAt(0);
          herosSelectorIds.push(groupName.toLowerCase());
          splitHeros[groupName] = temp;
          temp = [];
        }
      }
      let groupName =
        Heros[Object.keys(splitHeros).length * 25].charAt(0) +
        "-" +
        Heros[Heros.length - 1].charAt(0);
      herosSelectorIds.push(groupName.toLowerCase());
      splitHeros[groupName] = temp;
      for (let key in splitHeros) {
        subcommand.addStringOption((option) => {
          let optionName = key.toLowerCase();
          option.setName(optionName);
          option.setDescription(`Heros ${key}`);

          for (let i = 0; i < splitHeros[key].length; i++) {
            option.addChoices({
              name: splitHeros[key][i],
              value: splitHeros[key][i].toLowerCase(),
            });
          }

          return option;
        });
      }

      return subcommand;
    }),

  async execute(interation, Discord, client) {
    let subcommand = interation.options.getSubcommand();
    let playerId = "298UPPQ90";

    if (playerId.startsWith("#")) {
      playerId = playerId.replace("#", "%23");
    } else {
      playerId = "%23" + playerId;
    }

    let json = await getPlyData(playerId);

    if (json.reason) {
      return interation.reply({ content: json.reason, ephemeral: true });
    }

    switch (subcommand) {
      case "troops":
        let troop = null;
        troopsSelectorIds.forEach((id) => {
          if (interation.options.getString(id)) {
            troop = interation.options.getString(id);
          }
        });
        troops(interation, troop, json);
        break;
      case "spells":
        let spell = null;
        spellsSelectorIds.forEach((id) => {
          if (interation.options.getString(id)) {
            spell = interation.options.getString(id);
          }
        });
        spells(interation, spell, json);
        break;
      case "heros":
        let hero = null;
        herosSelectorIds.forEach((id) => {
          if (interation.options.getString(id)) {
            hero = interation.options.getString(id);
          }
        });
        heros(interation, hero, json);
        break;
    }
  },
};

function troops(interation, troop, json) {
  troop = capitalize(troop);

  let troopObj = json.troops.find((obj) => obj.name == troop);

  if (!troopObj) {
    return interation.reply({
      content: "Troop not found",
      ephemeral: true,
    });
  }

  let embed = new Discord.MessageEmbed();
  embed.setTitle(`${troopObj.name} `);
  embed.setColor(hexFromId(json.tag));
  //embed.setThumbnail(json.league.iconUrls.medium);

  embed.addFields(
    {
      name: "Max Level",
      value: `${troopObj.maxLevel}`,
      inline: true,
    },
    {
      name: "Village",
      value: `${troopObj.village}`,
      inline: true,
    }
  );

  let troopImage = returnImage("troops", troopObj.name);
  let urlTroopName = troopObj.name.replace(/ /g, "_");
  troopImage = new Discord.MessageAttachment(troopImage, urlTroopName + ".png");

  embed.setImage(`attachment://${urlTroopName}.png`);

  interation.reply({
    embeds: [embed],
    files: [troopImage],
  });
}

function spells(interation, spell, json) {
  spell = capitalize(spell);

  let spellObj = json.spells.find((obj) => obj.name == spell);

  if (!spellObj) {
    return interation.reply({
      content: "Spell not found",
      ephemeral: true,
    });
  }

  let embed = new Discord.MessageEmbed();
  embed.setTitle(`${spellObj.name} `);
  embed.setColor(hexFromId(json.tag));
  //embed.setThumbnail(json.league.iconUrls.medium);

  embed.addFields(
    {
      name: "Max Level",
      value: `${spellObj.maxLevel}`,
      inline: true,
    },
    {
      name: "Village",
      value: `${spellObj.village}`,
      inline: true,
    }
  );

  let spellImage = returnImage("spells", spellObj.name);
  let urlSpellName = spellObj.name.replace(/ /g, "_");
  spellImage = new Discord.MessageAttachment(spellImage, urlSpellName + ".png");

  embed.setThumbnail(`attachment://${urlSpellName}.png`);

  interation.reply({
    embeds: [embed],
    files: [spellImage],
  });
}

function heros(interation, hero, json) {
  hero = capitalize(hero);

  let heroObj = json.heroes.find((obj) => obj.name == hero);

  if (!heroObj) {
    return interation.reply({ content: "Hero not found", ephemeral: true });
  }

  let embed = new Discord.MessageEmbed();
  embed.setTitle(`${heroObj.name} `);
  embed.setColor(hexFromId(json.tag));

  embed.addFields(
    {
      name: "Max Level",
      value: `${heroObj.maxLevel}`,
      inline: true,
    },
    {
      name: "Village",
      value: `${heroObj.village}`,
      inline: true,
    }
  );

  // get the heros image and set it as the thumbnail
  let heroImage = returnImage("heros", heroObj.name);
  let urlHeroName = heroObj.name.replace(/ /g, "_");
  heroImage = new Discord.MessageAttachment(heroImage, urlHeroName + ".png");

  embed.setImage(`attachment://${urlHeroName}.png`);

  interation.reply({
    embeds: [embed],
    files: [heroImage],
  });
}
