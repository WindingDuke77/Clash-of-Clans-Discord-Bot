const { getAllFiles } = require("../functions/filesfuncs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

module.exports = (discord, client) => {
  let scommandsData = [];

  let scommands = getAllFiles("./commands");
  scommands.forEach((command) => {
    const commandfile = require(`../${command}`);
    const command_name = command
      .split(".")[1]
      .toString()
      .split("/")
      .slice(-1)[0];
    client.scommands.set(command_name, commandfile);

    scommandsData.push(commandfile.data.toJSON());
  });

  client.on("ready", () => {
    const rest = new REST({
      version: "9",
    }).setToken(process.env.DISCORD_TOKEN);
    (async () => {
      try {
        await rest.put(Routes.applicationCommands(client.user.id), {
          body: scommandsData,
        });
        console.log("slash command globly regstired ");
      } catch (err) {
        if (err) console.error(err);
      }
    })();
  });
};
