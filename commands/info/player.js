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
    .setName("player")
    .setDescription("Info of the Player")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("info")
        .setDescription("Info of the Player")
        .addStringOption((option) =>
          option
            .setName("playid")
            .setDescription("The Player Id")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) => {
      subcommand
        .setName("score")
        .setDescription("Score of the Player")
        .addStringOption((option) =>
          option
            .setName("playid")
            .setDescription("The Player Id")
            .setRequired(true)
        );
      return subcommand;
    })
    .addSubcommand((subcommand) => {
      subcommand
        .setName("troops")
        .setDescription("Troops of the Player")
        .addStringOption((option) =>
          option
            .setName("playid")
            .setDescription("The Player Id")
            .setRequired(true)
        );

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
      subcommand
        .setName("spells")
        .setDescription("Spells of the Player")
        .addStringOption((option) =>
          option
            .setName("playid")
            .setDescription("The Player Id")
            .setRequired(true)
        );

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
      subcommand
        .setName("heros")
        .setDescription("Heros of the Player")
        .addStringOption((option) =>
          option
            .setName("playid")
            .setDescription("The Player Id")
            .setRequired(true)
        );

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
    })
    .addSubcommand((subcommand) => {
      subcommand
        .setName("labels")
        .setDescription("Labels of the Player")
        .addStringOption((option) =>
          option
            .setName("playid")
            .setDescription("The Player Id")
            .setRequired(true)
        );
      return subcommand;
    }),
  async execute(interation, Discord, client) {
    let subcommand = interation.options.getSubcommand();
    let playerId = interation.options.getString("playid") || "8QYR2PVV";

    if (playerId.startsWith("#")) {
      playerId = playerId.replace("#", "%23");
    } else {
      playerId = "%23" + playerId;
    }

    let json = await getPlyData(playerId);

    if (json.reason) {
      return interation.reply({ content: json.reason, ephemeral: true });
    }

    let embed = newEmbed(json);

    switch (subcommand) {
      case "info":
        info(interation, json, embed);
        break;
      case "troops":
        let troop = null;
        troopsSelectorIds.forEach((id) => {
          if (interation.options.getString(id)) {
            troop = interation.options.getString(id);
          }
        });
        troops(interation, troop, json, embed);
        break;
      case "spells":
        let spell = null;
        spellsSelectorIds.forEach((id) => {
          if (interation.options.getString(id)) {
            spell = interation.options.getString(id);
          }
        });
        spells(interation, spell, json, embed);
        break;
      case "heros":
        let hero = null;
        herosSelectorIds.forEach((id) => {
          if (interation.options.getString(id)) {
            hero = interation.options.getString(id);
          }
        });
        heros(interation, hero, json, embed);
        break;
      case "labels":
        Labels(interation, json, embed);
        break;
      case "score":
        score(interation, json, embed);
        break;
    }
  },
};

function info(interation, json, embed) {
  embed.addFields(
    {
      name: "Town Hall",
      value: `Level ${json.townHallLevel}`,
      inline: true,
    },
    {
      name: "Builder Hall",
      value: `Level ${json.builderHallLevel}`,
      inline: true,
    },
    {
      name: "Clan",
      value: `${json.clan.name} - ${json.clan.tag}`,
      inline: true,
    },

    { name: "Current League", value: `${json.league.name}`, inline: true },
    { name: "Trophies", value: `${json.trophies}`, inline: true },
    {
      name: "Versus Trophies",
      value: `${json.versusTrophies}`,
      inline: true,
    },

    {
      name: "Amount of Heroes",
      value: `${json.heroes.length}`,
      inline: true,
    },

    {
      name: "Amount of Spells",
      value: `${json.spells.length}`,
      inline: true,
    },
    {
      name: "Amount of Troops",
      value: `${json.troops.length}`,
      inline: true,
    }
  );
  interation.reply({ embeds: [embed] });
}

function troops(interation, troop, json, embed) {
  troop = capitalize(troop);

  let troopObj = json.troops.find((obj) => obj.name == troop);

  if (!troopObj) {
    return interation.reply({
      content: "Troop not found",
      ephemeral: true,
    });
  }
  embed.setTitle(`${json.name}'s ${troopObj.name} `);
  embed.setThumbnail(null);
  embed.addFields(
    {
      name: "Level",
      value: `${troopObj.level}`,
      inline: true,
    },
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

function spells(interation, spell, json, embed) {
  spell = capitalize(spell);

  let spellObj = json.spells.find((obj) => obj.name == spell);
  if (!spellObj) {
    return interation.reply({
      content: "Spell not found",
      ephemeral: true,
    });
  }

  embed.setTitle(`${json.name}'s ${spellObj.name} `);
  embed.setThumbnail(null);
  embed.addFields(
    {
      name: "Level",
      value: `${spellObj.level}`,
      inline: true,
    },
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

function heros(interation, hero, json, embed) {
  hero = capitalize(hero);

  let heroObj = json.heroes.find((obj) => obj.name == hero);

  if (!heroObj) {
    return interation.reply({ content: "Hero not found", ephemeral: true });
  }

  embed.setTitle(`${json.name}'s ${heroObj.name} `);
  embed.setThumbnail(null);
  embed.addFields(
    {
      name: "Level",
      value: `${heroObj.level}`,
      inline: true,
    },
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

function Labels(interation, json, embed) {
  let embedsTable = [];
  embed.setTitle(`${json.name}'s Labels`);
  embedsTable.push(embed);

  json.labels.forEach((label) => {
    let embed = new Discord.MessageEmbed();
    embed.setTitle(`${label.name}`);
    embed.setFooter({ text: `${json.name} - ${json.tag}` });
    embed.setColor(hexFromId(json.tag));
    embed.setThumbnail(label.iconUrls.medium);
    embedsTable.push(embed);
  });

  if (embedsTable.length == 1) {
    return interation.reply({
      content: "No labels found",
      ephemeral: true,
    });
  }

  interation.reply({ embeds: embedsTable });
}

function score(interation, json, embed) {
  embed.setTitle(`${json.name}'s Score`);

  let score = 0;

  score += json.townHallLevel * 1000 || 0;
  score += json.townHallWeaponLevel * 500 || 0;
  score += json.builderHallLevel * 1000 || 0;

  score += json.trophies * 1 || 0;
  score += json.bestTrophies * 0.5 || 0;
  score += json.warStars * 0.5 || 0;

  score += json.attackWins * 0.5 || 0;
  score += json.defenseWins * 0.5 || 0;
  score += json.versusBattleWins * 0.5 || 0;

  json.achievements.forEach((achievement) => {
    score += achievement.stars * 10 || 0;
  });

  json.heroes.forEach((hero) => {
    score += hero.level * 100 * hero.village == "home" ? 1 : 2 || 0;
  });

  json.troops.forEach((troop) => {
    score += troop.level * 50 * troop.village == "home" ? 1 : 2 || 0;
  });

  json.spells.forEach((spell) => {
    score += spell.level * 150 * spell.village == "home" ? 1 : 2 || 0;
  });

  embed.setDescription(`**Score**: ${score}`);

  interation.reply({ embeds: [embed] });
}

function newEmbed(json) {
  let embed = new Discord.MessageEmbed();

  embed.setTitle(`${json.name} - ${json.tag}`);
  embed.setFooter({ text: `${json.name} - ${json.tag}` });
  embed.setColor(hexFromId(json.tag));
  embed.setThumbnail(json.league.iconUrls.medium);

  return embed;
}
