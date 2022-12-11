const { SlashCommandBuilder } = require("@discordjs/builders");
const fetch = require("node-fetch");
const {
  hexFromId,
  capitalize,
  getPlyData,
} = require("../../functions/cocfunc.js");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("accountcheck")
    .setDescription("Info of any Troop, Spell or Hero")
    .addStringOption((option) =>
      option.setName("playerid").setDescription("Player ID").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("apitoken")
        .setDescription(
          "To get this goto Settings>More Settings>API Token. This token can only be use to verfiy your account"
        )
        .setRequired(true)
    ),

  async execute(interation, Discord, client) {
    let playerId = interation.options.getString("playerid");

    let apiToken = interation.options.getString("apitoken");

    if (playerId.startsWith("#")) {
      playerId = playerId.replace("#", "%23");
    } else {
      playerId = "%23" + playerId;
    }

    let json = await getPlyData(playerId);

    if (json.reason) {
      return interation.reply({ content: json.reason, ephemeral: true });
    }

    if (json.reason) {
      return interaction.reply({
        content: `${json.reason}`,
        ephemeral: true,
      });
    }

    // get the player tag data

    fetch(`https://api.clashofclans.com/v1/players/${playerId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.CLASH_TOKEN}`,
      },
    })
      .then((res2) => res2.json())
      .then((json2) => {
        const embed = new Discord.MessageEmbed()
          .setColor(hexFromId(playerId))
          .setTitle(`${json2.name} - (${json2.tag})`)
          .setThumbnail(json2.league.iconUrls.medium);

        if (json.status === "ok") {
          embed.setDescription(
            `${interation.user} is the owner of this account`
          );
        } else {
          embed.setDescription(
            `${interation.user} is not the owner of this account`
          );
        }

        interation.reply({ embeds: [embed] });
      });
  },
};
