const { getAllFiles } = require("../functions/filesfuncs");

module.exports = (discord, client) => {
  let events = getAllFiles("./events");
  events.forEach((event) => {
    const eventfile = require(`../${event}`);
    const event_name = event.split(".")[1].toString().split("/").slice(-1)[0];
    client.on(event_name, eventfile.bind(null, discord, client));
  });
};
