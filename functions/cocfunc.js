const fetch = require("node-fetch");

function capitalize(s) {
  return s.replace(/(?:^|\s|\.)\S/g, (a) => a.toUpperCase()) || s;
}

function hexFromId(Id) {
  let hash = 0;
  for (let i = 0; i < Id.length; i++) {
    hash = Id.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}

async function getPlyData(playerId) {
  return await new Promise((resolve, reject) => {
    fetch(`https://api.clashofclans.com/v1/players/${playerId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.CLASH_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        resolve(json);
      });
  });
}

async function getClanData(clanId) {
  return await new Promise((resolve, reject) => {
    fetch(`https://api.clashofclans.com/v1/clans/${clanId}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${process.env.CLASH_TOKEN}`,
      },
    })
      .then((res) => res.json())
      .then((json) => {
        resolve(json);
      });
  });
}

module.exports = {
  capitalize,
  hexFromId,
  getPlyData,
  getClanData,
};
