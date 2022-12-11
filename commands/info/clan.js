const { SlashCommandBuilder } = require("@discordjs/builders");
const fetch = require("node-fetch");
const Discord = require("discord.js");
const {
  hexFromId,
  capitalize,
  getClanData,
} = require("../../functions/cocfunc.js");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("clan")
    .setDescription("Get info about a clan")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("info")
        .setDescription("Info of the clan")
        .addStringOption((option) =>
          option
            .setName("clanid")
            .setDescription("The Clan Tag")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("warlog")
        .setDescription("Get the warlog of the clan")
        .addStringOption((option) =>
          option
            .setName("clanid")
            .setDescription("The Clan Tag")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("members")
        .setDescription("Get the members of the clan")
        .addStringOption((option) =>
          option
            .setName("clanid")
            .setDescription("The Clan Tag")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("clancapitial")
        .setDescription("Get the Clan Capitial Info of the clan")
        .addStringOption((option) =>
          option
            .setName("clanid")
            .setDescription("The Clan Tag")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("labels")
        .setDescription("Get the labels of the clan")
        .addStringOption((option) =>
          option
            .setName("clanid")
            .setDescription("The Clan Tag")
            .setRequired(true)
        )
    ),

  async execute(interation, Discord, client) {
    let subcommand = interation.options.getSubcommand();
    let clanId = interation.options.getString("clanid") || "2QGLCQGCC";

    if (clanId.startsWith("#")) {
      clanId = clanId.replace("#", "%23");
    } else {
      clanId = "%23" + clanId;
    }

    let json = await getClanData(clanId);

    if (json.reason) {
      return interation.reply({ content: json.reason, ephemeral: true });
    }

    let embed = newEmbed(json);

    switch (subcommand) {
      case "info":
        info(interation, json, embed);
        break;
      case "warlog":
        warlog(interation, json, embed);
        break;
      case "members":
        members(interation, json, embed);
        break;
      case "clancapitial":
        clancapitial(interation, json, embed);
        break;
      case "labels":
        labels(interation, json, embed);
        break;
    }
  },
};

function info(interation, json, embed) {
  embed.setDescription(json.description);
  embed.addFields(
    { name: "Level", value: `${json.clanLevel}`, inline: true },
    { name: "Members", value: `${json.members}`, inline: true },
    { name: "Location", value: `${json.location.name}`, inline: true },
    { name: "War Wins", value: `${json.warWins}`, inline: true },
    { name: "War Win Streak", value: `${json.warWinStreak}`, inline: true }
  );

  interation.reply({ embeds: [embed] });
}

function warlog(interation, json, embed) {
  fetch(`https://api.clashofclans.com/v1/clans/${clanId}/warlog?limit=5`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${process.env.CLASH_TOKEN}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.reason) {
        return interation.reply({ content: json.reason, ephemeral: true });
      }

      embed.setAuthor({ name: json.name + " Warlog" });

      let win = 0;
      let loss = 0;

      for (let i = 0; i < data.items.length; i++) {
        let war = data.items[i];
        embed.addFields({
          name: `${war.opponent.name} Opponent`,
          value: `**Result**: ${war.result} \n **Stars**: ${war.clan.stars} vs ${war.opponent.stars}`,
          inline: false,
        });

        if (war.result === "win") {
          win++;
        }
        if (war.result === "lose") {
          loss++;
        }
      }

      embed.setDescription(
        `Win Percentage: ${Math.round((win / (win + loss)) * 100)}%`
      );

      interation.reply({ embeds: [embed] });
    });
}

function members(interation, json, embed) {
  embed.setAuthor({ name: json.name + " Members" });

  embed.setDescription("Members of the clan \n\n\u200B");

  let members = json.memberList;

  for (let i = 0; i < members.length; i++) {
    let member = members[i];
    let role = member.role;
    role = role.toLowerCase();
    role = role.charAt(0).toUpperCase() + role.slice(1);

    embed.addFields({
      name: `${member.name} ${member.tag}`,
      value: `**Role**: ${role} - **Trophies**: ${member.trophies}`,
      inline: false,
    });
  }

  interation.reply({ embeds: [embed] });
}

function clancapitial(interation, json, embed) {
  if (json.clanCapital.districts.length === 0) {
    return interation.reply({ content: "No Clan Capital" });
  }

  embed.setAuthor({ name: json.name + " Clan Capital" });
  embed.setDescription("Clan Capital \n\n\u200B");

  for (let i = 0; i < json.clanCapital.districts.length; i++) {
    let capital = json.clanCapital.districts[i];
    embed.addFields({
      name: `${capital.name}`,
      value: `**Level**: ${capital.districtHallLevel} `,
      inline: false,
    });
  }

  interation.reply({ embeds: [embed] });
}

function labels(interation, json, embed) {
  let embedsTable = [];

  embed.setTitle(`${json.name}'s Labels`);
  embedsTable.push(embed);

  json.labels.forEach((label) => {
    let embed = new Discord.MessageEmbed();
    embed.setTitle(`${label.name}`);
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

function newEmbed(json) {
  let embed = new Discord.MessageEmbed();

  embed.setTitle(`${json.name} - ${json.tag}`);
  embed.setFooter({ text: `${json.name} - ${json.tag}` });
  embed.setThumbnail(json.badgeUrls.medium);
  embed.setColor(hexFromId(json.tag));

  return embed;
}
