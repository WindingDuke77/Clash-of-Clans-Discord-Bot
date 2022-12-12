const { SlashCommandBuilder } = require("@discordjs/builders");
const ms = require("ms");
const startTime = Date.now();

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Stats of the bot"),

  async execute(interation, Discord, client) {
    const Template = new Discord.MessageEmbed()
      .setColor(Math.floor(Math.random() * 16777215).toString(16))
      .setTimestamp()
      .setTitle("Clash of Clans Stats")
      .setDescription("Here some of our Stats")
      .addFields(
        {
          name: "Ping",
          value: `${ms(Math.abs(Date.now() - interation.createdAt))}`,
          inline: true,
        },
        {
          name: "Uptime",
          value: `${ms(Math.abs(Date.now() - startTime))}`,
          inline: true,
        },
        {
          name: "Guilds",
          value: `${client.guilds.cache.size}`,
          inline: true,
        }
      );

    interation.reply({ embeds: [Template] });
  },
};
