const { SlashCommandBuilder } = require("@discordjs/builders");
const fetch = require("node-fetch");
const Discord = require("discord.js");

const parms = {
  // name : presets
  name: { min: 3, desc: "Name of the Clan" },
  warfrequency: {
    examples: ["always", "never", "moreThanOncePerWeek", "lessThanOncePerWeek"],
    name: "warFrequency",
    desc: "how often a war will happen",
  },
  locationid: {
    name: "locationId",
    desc: "Input a country code or a country name",
  },
  minmembers: {
    name: "minMembers",
    desc: "Minimum amount of members in the clan",
    min: 1,
    type: "number",
  },
  maxmembers: {
    name: "maxMembers",
    desc: "Maximum amount of members in the clan",
    max: 50,
    type: "number",
  },
  minclanpoints: {
    name: "minClanPoints",
    desc: "Minimum amount of clan points",
    type: "number",
  },
  minclanlevel: {
    name: "minClanLevel",
    desc: "Minimum clan level",
    type: "number",
  },
};

let location = null;

fetch("https://api.clashofclans.com/v1/locations", {
  headers: {
    Authorization: `Bearer ${process.env.CLASH_TOKEN}`,
  },
})
  .then((res) => res.json())
  .then((json) => {
    location = json.items;
  });

module.exports = {
  cooldown: 5,
  data: (() => {
    let slash = new SlashCommandBuilder();
    slash.setName("clansearch");
    slash.setDescription("Search for a clan");

    for (const [key, value] of Object.entries(parms)) {
      if (value.type === "number") {
        slash.addIntegerOption((option) => {
          option.setName(key);
          option.setDescription(value.desc);
          option.setRequired(false);
          if (value.min) {
            option.setMinValue(value.min);
          }
          if (value.max) {
            option.setMaxValue(value.max);
          }
          return option;
        });
      } else {
        slash.addStringOption((option) => {
          option.setName(key);
          option.setDescription(value.desc);
          option.setRequired(false);
          if (value.examples) {
            value.examples.forEach((example) => {
              option.addChoices({ name: example, value: example });
            });
          }
          return option;
        });
      }
    }

    return slash;
  })(),

  async execute(interation, Discord, client) {
    let options = interation.options;
    let query = {};

    for (const [key, value] of Object.entries(parms)) {
      let option = null;
      if (value.type === "number") {
        option = options.getInteger(key);
      } else {
        option = options.getString(key);
      }
      if (option) {
        query[value.name || key] = option;
      }
    }

    if (query.locationId) {
      let locationId = query.locationId;

      locationId = location.find((loc) => {
        return loc.countryCode === locationId || loc.name === locationId;
      });
      if (locationId) {
        query.locationId = locationId.id;
      } else {
        return interation.reply({
          content: "Invalid location",
          ephemeral: true,
        });
      }
    }
    query.limit = 10;

    let res = await fetch(
      `https://api.clashofclans.com/v1/clans?${new URLSearchParams(query)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CLASH_TOKEN}`,
        },
      }
    );
    let json = await res.json();
    if (json.reason) {
      return interation.reply({
        content: json.reason,
        ephemeral: true,
      });
    }

    if (json.items.length === 0) {
      return interation.reply({
        content: "No clans found",
        ephemeral: true,
      });
    }

    let embed = new Discord.MessageEmbed();
    embed.setTitle("Clan Search");
    embed.setColor("RANDOM");
    // add 2 nextliens
    embed.setDescription("Clan Search Results\n\n");

    embed.setTimestamp();

    json.items.forEach((clan) => {
      embed.addFields({
        name: `${clan.name} - ${clan.tag}`,
        value: `Members: ${clan.members}\nClan Level: ${clan.clanLevel}\nClan Points: ${clan.clanPoints}\nWar Frequency: ${clan.warFrequency} \n\n`,
        inline: false,
      });
    });

    return interation.reply({
      embeds: [embed],
    });
  },
};

let info = {
  items: [
    {
      tag: "#2PVYQLCQG",
      name: "UNITED",
      type: "inviteOnly",
      location: {
        id: 32000006,
        name: "International",
        isCountry: false,
      },
      badgeUrls: {
        small:
          "https://api-assets.clashofclans.com/badges/70/Lsn_hrbbHQ-NaBdNXy-rjCzuaNj42XhpnuZllWDy3-I.png",
        large:
          "https://api-assets.clashofclans.com/badges/512/Lsn_hrbbHQ-NaBdNXy-rjCzuaNj42XhpnuZllWDy3-I.png",
        medium:
          "https://api-assets.clashofclans.com/badges/200/Lsn_hrbbHQ-NaBdNXy-rjCzuaNj42XhpnuZllWDy3-I.png",
      },
      clanLevel: 17,
      clanPoints: 35644,
      clanVersusPoints: 34921,
      requiredTrophies: 1500,
      warFrequency: "always",
      warWinStreak: 0,
      warWins: 159,
      warTies: 0,
      warLosses: 118,
      isWarLogPublic: true,
      warLeague: {
        id: 48000011,
        name: "Crystal League II",
      },
      members: 50,
      labels: [
        {
          id: 56000001,
          name: "Clan War League",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
          },
        },
        {
          id: 56000009,
          name: "Donations",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/RauzS-02tv4vWm1edZ-q3gPQGWKGANLZ-85HCw_NVP0.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/RauzS-02tv4vWm1edZ-q3gPQGWKGANLZ-85HCw_NVP0.png",
          },
        },
        {
          id: 56000014,
          name: "Competitive",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/DhBE-1SSnrZQtsfjVHyNW-BTBWMc8Zoo34MNRCNiRsA.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/DhBE-1SSnrZQtsfjVHyNW-BTBWMc8Zoo34MNRCNiRsA.png",
          },
        },
      ],
      requiredVersusTrophies: 2000,
      requiredTownhallLevel: 11,
      chatLanguage: {
        id: 75000000,
        name: "English",
        languageCode: "EN",
      },
    },
    {
      tag: "#P9RJJ9R2",
      name: "UNITED",
      type: "inviteOnly",
      location: {
        id: 32000094,
        name: "Germany",
        isCountry: true,
        countryCode: "DE",
      },
      badgeUrls: {
        small:
          "https://api-assets.clashofclans.com/badges/70/Xdrl4s3vwqrfcEBmV3Qn9TRzDh1Py-TwlZUO9R-k2g4.png",
        large:
          "https://api-assets.clashofclans.com/badges/512/Xdrl4s3vwqrfcEBmV3Qn9TRzDh1Py-TwlZUO9R-k2g4.png",
        medium:
          "https://api-assets.clashofclans.com/badges/200/Xdrl4s3vwqrfcEBmV3Qn9TRzDh1Py-TwlZUO9R-k2g4.png",
      },
      clanLevel: 15,
      clanPoints: 30086,
      clanVersusPoints: 28920,
      requiredTrophies: 2000,
      warFrequency: "unknown",
      warWinStreak: 2,
      warWins: 168,
      isWarLogPublic: false,
      warLeague: {
        id: 48000010,
        name: "Crystal League III",
      },
      members: 41,
      labels: [
        {
          id: 56000001,
          name: "Clan War League",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
          },
        },
        {
          id: 56000004,
          name: "Clan Games",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/7qU7tQGERiVITVG0CPFov1-BnFldu4bMN2gXML5bLIU.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/7qU7tQGERiVITVG0CPFov1-BnFldu4bMN2gXML5bLIU.png",
          },
        },
        {
          id: 56000013,
          name: "Relaxed",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/Kv1MZQfd5A7DLwf1Zw3tOaUiwQHGMwmRpjZqOalu_hI.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/Kv1MZQfd5A7DLwf1Zw3tOaUiwQHGMwmRpjZqOalu_hI.png",
          },
        },
      ],
      requiredVersusTrophies: 1000,
      requiredTownhallLevel: 5,
    },
    {
      tag: "#UYRJ8V82",
      name: "United",
      type: "open",
      location: {
        id: 32000115,
        name: "Iran",
        isCountry: true,
        countryCode: "IR",
      },
      badgeUrls: {
        small:
          "https://api-assets.clashofclans.com/badges/70/uFuGQyWEaz5wiffYOEY9EPjSXZk1VBmyqEN3ClACjO0.png",
        large:
          "https://api-assets.clashofclans.com/badges/512/uFuGQyWEaz5wiffYOEY9EPjSXZk1VBmyqEN3ClACjO0.png",
        medium:
          "https://api-assets.clashofclans.com/badges/200/uFuGQyWEaz5wiffYOEY9EPjSXZk1VBmyqEN3ClACjO0.png",
      },
      clanLevel: 20,
      clanPoints: 40338,
      clanVersusPoints: 41476,
      requiredTrophies: 2000,
      warFrequency: "always",
      warWinStreak: 6,
      warWins: 236,
      warTies: 0,
      warLosses: 299,
      isWarLogPublic: true,
      warLeague: {
        id: 48000014,
        name: "Master League II",
      },
      members: 48,
      labels: [
        {
          id: 56000001,
          name: "Clan War League",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
          },
        },
        {
          id: 56000004,
          name: "Clan Games",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/7qU7tQGERiVITVG0CPFov1-BnFldu4bMN2gXML5bLIU.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/7qU7tQGERiVITVG0CPFov1-BnFldu4bMN2gXML5bLIU.png",
          },
        },
        {
          id: 56000016,
          name: "Clan Capital",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/Odg2DaLfhMgQOci4QvHovdoYq4SDiBrocWS2Bjm8Ah8.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/Odg2DaLfhMgQOci4QvHovdoYq4SDiBrocWS2Bjm8Ah8.png",
          },
        },
      ],
      requiredVersusTrophies: 2000,
      requiredTownhallLevel: 12,
    },
    {
      tag: "#8UCG8L8",
      name: "united",
      type: "open",
      location: {
        id: 32000087,
        name: "France",
        isCountry: true,
        countryCode: "FR",
      },
      badgeUrls: {
        small:
          "https://api-assets.clashofclans.com/badges/70/6cq8r43fJwvMFcyBsB5UOpXIDDJVxeunncQwe77wtwk.png",
        large:
          "https://api-assets.clashofclans.com/badges/512/6cq8r43fJwvMFcyBsB5UOpXIDDJVxeunncQwe77wtwk.png",
        medium:
          "https://api-assets.clashofclans.com/badges/200/6cq8r43fJwvMFcyBsB5UOpXIDDJVxeunncQwe77wtwk.png",
      },
      clanLevel: 19,
      clanPoints: 36372,
      clanVersusPoints: 37564,
      requiredTrophies: 2200,
      warFrequency: "always",
      warWinStreak: 1,
      warWins: 306,
      isWarLogPublic: false,
      warLeague: {
        id: 48000011,
        name: "Crystal League II",
      },
      members: 47,
      labels: [
        {
          id: 56000002,
          name: "Trophy Pushing",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/hNtigjuwJjs6PWhVtVt5HvJgAp4ZOMO8e2nyjHX29sA.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/hNtigjuwJjs6PWhVtVt5HvJgAp4ZOMO8e2nyjHX29sA.png",
          },
        },
        {
          id: 56000011,
          name: "Talkative",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/T1c8AYalTn_RruVkY0mRPwNYF5n802thTBEEnOtNTMw.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/T1c8AYalTn_RruVkY0mRPwNYF5n802thTBEEnOtNTMw.png",
          },
        },
        {
          id: 56000012,
          name: "Underdog",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/ImSgCg88EEl80mwzFZMIiJTqa33bJmJPcl4v2eT6O04.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/ImSgCg88EEl80mwzFZMIiJTqa33bJmJPcl4v2eT6O04.png",
          },
        },
      ],
      requiredVersusTrophies: 1900,
      requiredTownhallLevel: 12,
      chatLanguage: {
        id: 75000001,
        name: "Français",
        languageCode: "FR",
      },
    },
    {
      tag: "#PCVJVJGP",
      name: "United",
      type: "inviteOnly",
      location: {
        id: 32000006,
        name: "International",
        isCountry: false,
      },
      badgeUrls: {
        small:
          "https://api-assets.clashofclans.com/badges/70/ljaGVQ1T3avwmT2GTkwf2hLCywDIsKioVi5_nraLEoQ.png",
        large:
          "https://api-assets.clashofclans.com/badges/512/ljaGVQ1T3avwmT2GTkwf2hLCywDIsKioVi5_nraLEoQ.png",
        medium:
          "https://api-assets.clashofclans.com/badges/200/ljaGVQ1T3avwmT2GTkwf2hLCywDIsKioVi5_nraLEoQ.png",
      },
      clanLevel: 15,
      clanPoints: 11010,
      clanVersusPoints: 11125,
      requiredTrophies: 0,
      warFrequency: "unknown",
      warWinStreak: 3,
      warWins: 323,
      isWarLogPublic: false,
      warLeague: {
        id: 48000008,
        name: "Gold League II",
      },
      members: 17,
      labels: [],
      requiredVersusTrophies: 0,
      requiredTownhallLevel: 6,
    },
    {
      tag: "#2QUCGJJJY",
      name: "United",
      type: "inviteOnly",
      location: {
        id: 32000185,
        name: "Philippines",
        isCountry: true,
        countryCode: "PH",
      },
      badgeUrls: {
        small:
          "https://api-assets.clashofclans.com/badges/70/YuwLuCzNRYplBD2yV0M4dZrC74CX3Tl7cbQJk0TN-P8.png",
        large:
          "https://api-assets.clashofclans.com/badges/512/YuwLuCzNRYplBD2yV0M4dZrC74CX3Tl7cbQJk0TN-P8.png",
        medium:
          "https://api-assets.clashofclans.com/badges/200/YuwLuCzNRYplBD2yV0M4dZrC74CX3Tl7cbQJk0TN-P8.png",
      },
      clanLevel: 5,
      clanPoints: 11653,
      clanVersusPoints: 10283,
      requiredTrophies: 0,
      warFrequency: "always",
      warWinStreak: 1,
      warWins: 40,
      warTies: 0,
      warLosses: 32,
      isWarLogPublic: true,
      warLeague: {
        id: 48000008,
        name: "Gold League II",
      },
      members: 11,
      labels: [
        {
          id: 56000000,
          name: "Clan Wars",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
          },
        },
        {
          id: 56000002,
          name: "Trophy Pushing",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/hNtigjuwJjs6PWhVtVt5HvJgAp4ZOMO8e2nyjHX29sA.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/hNtigjuwJjs6PWhVtVt5HvJgAp4ZOMO8e2nyjHX29sA.png",
          },
        },
        {
          id: 56000010,
          name: "Friendly",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/hM7SHnN0x7syFa-s6fE7LzeO5yWG2sfFpZUHuzgMwQg.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/hM7SHnN0x7syFa-s6fE7LzeO5yWG2sfFpZUHuzgMwQg.png",
          },
        },
      ],
      requiredVersusTrophies: 0,
      requiredTownhallLevel: 5,
      chatLanguage: {
        id: 75000000,
        name: "English",
        languageCode: "EN",
      },
    },
    {
      tag: "#2LVV89G00",
      name: "UNITED",
      type: "open",
      location: {
        id: 32000006,
        name: "International",
        isCountry: false,
      },
      badgeUrls: {
        small:
          "https://api-assets.clashofclans.com/badges/70/y9a6-FLSWDqZlbw50mtJDz-4hUrg4QUMsEj_U0G7sF4.png",
        large:
          "https://api-assets.clashofclans.com/badges/512/y9a6-FLSWDqZlbw50mtJDz-4hUrg4QUMsEj_U0G7sF4.png",
        medium:
          "https://api-assets.clashofclans.com/badges/200/y9a6-FLSWDqZlbw50mtJDz-4hUrg4QUMsEj_U0G7sF4.png",
      },
      clanLevel: 13,
      clanPoints: 29887,
      clanVersusPoints: 29326,
      requiredTrophies: 0,
      warFrequency: "always",
      warWinStreak: 0,
      warWins: 68,
      warTies: 0,
      warLosses: 66,
      isWarLogPublic: true,
      warLeague: {
        id: 48000012,
        name: "Crystal League I",
      },
      members: 27,
      labels: [
        {
          id: 56000000,
          name: "Clan Wars",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
          },
        },
        {
          id: 56000001,
          name: "Clan War League",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
          },
        },
        {
          id: 56000016,
          name: "Clan Capital",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/Odg2DaLfhMgQOci4QvHovdoYq4SDiBrocWS2Bjm8Ah8.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/Odg2DaLfhMgQOci4QvHovdoYq4SDiBrocWS2Bjm8Ah8.png",
          },
        },
      ],
      requiredVersusTrophies: 3200,
      requiredTownhallLevel: 1,
      chatLanguage: {
        id: 75000000,
        name: "English",
        languageCode: "EN",
      },
    },
    {
      tag: "#PC2Y2YUC",
      name: "UNITED",
      type: "open",
      location: {
        id: 32000185,
        name: "Philippines",
        isCountry: true,
        countryCode: "PH",
      },
      badgeUrls: {
        small:
          "https://api-assets.clashofclans.com/badges/70/8rEO8ApcIvwF8sCB_3E-teNtz9gdm1S4OAbpBTIe3qs.png",
        large:
          "https://api-assets.clashofclans.com/badges/512/8rEO8ApcIvwF8sCB_3E-teNtz9gdm1S4OAbpBTIe3qs.png",
        medium:
          "https://api-assets.clashofclans.com/badges/200/8rEO8ApcIvwF8sCB_3E-teNtz9gdm1S4OAbpBTIe3qs.png",
      },
      clanLevel: 14,
      clanPoints: 23941,
      clanVersusPoints: 23489,
      requiredTrophies: 1200,
      warFrequency: "always",
      warWinStreak: 3,
      warWins: 261,
      warTies: 3,
      warLosses: 203,
      isWarLogPublic: true,
      warLeague: {
        id: 48000009,
        name: "Gold League I",
      },
      members: 41,
      labels: [
        {
          id: 56000000,
          name: "Clan Wars",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
          },
        },
        {
          id: 56000001,
          name: "Clan War League",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
          },
        },
        {
          id: 56000016,
          name: "Clan Capital",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/Odg2DaLfhMgQOci4QvHovdoYq4SDiBrocWS2Bjm8Ah8.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/Odg2DaLfhMgQOci4QvHovdoYq4SDiBrocWS2Bjm8Ah8.png",
          },
        },
      ],
      requiredVersusTrophies: 5500,
      requiredTownhallLevel: 8,
      chatLanguage: {
        id: 75000000,
        name: "English",
        languageCode: "EN",
      },
    },
    {
      tag: "#2PCPR29YG",
      name: "UNITED",
      type: "inviteOnly",
      location: {
        id: 32000249,
        name: "United States",
        isCountry: true,
        countryCode: "US",
      },
      badgeUrls: {
        small:
          "https://api-assets.clashofclans.com/badges/70/bJa8Bw7OkNC1re95owuJ_c8ASQLGggavJBEzrnSfYnw.png",
        large:
          "https://api-assets.clashofclans.com/badges/512/bJa8Bw7OkNC1re95owuJ_c8ASQLGggavJBEzrnSfYnw.png",
        medium:
          "https://api-assets.clashofclans.com/badges/200/bJa8Bw7OkNC1re95owuJ_c8ASQLGggavJBEzrnSfYnw.png",
      },
      clanLevel: 10,
      clanPoints: 22161,
      clanVersusPoints: 21921,
      requiredTrophies: 2000,
      warFrequency: "always",
      warWinStreak: 10,
      warWins: 91,
      warTies: 0,
      warLosses: 31,
      isWarLogPublic: true,
      warLeague: {
        id: 48000009,
        name: "Gold League I",
      },
      members: 30,
      labels: [
        {
          id: 56000000,
          name: "Clan Wars",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
          },
        },
        {
          id: 56000001,
          name: "Clan War League",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
          },
        },
        {
          id: 56000014,
          name: "Competitive",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/DhBE-1SSnrZQtsfjVHyNW-BTBWMc8Zoo34MNRCNiRsA.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/DhBE-1SSnrZQtsfjVHyNW-BTBWMc8Zoo34MNRCNiRsA.png",
          },
        },
      ],
      requiredVersusTrophies: 0,
      requiredTownhallLevel: 10,
      chatLanguage: {
        id: 75000000,
        name: "English",
        languageCode: "EN",
      },
    },
    {
      tag: "#2QQ0UCYLY",
      name: "UNITED",
      type: "inviteOnly",
      location: {
        id: 32000115,
        name: "Iran",
        isCountry: true,
        countryCode: "IR",
      },
      badgeUrls: {
        small:
          "https://api-assets.clashofclans.com/badges/70/KhIxog1Gd8HN70JL1lR8DsMyoF4duBEYP-lRnk0ZNP8.png",
        large:
          "https://api-assets.clashofclans.com/badges/512/KhIxog1Gd8HN70JL1lR8DsMyoF4duBEYP-lRnk0ZNP8.png",
        medium:
          "https://api-assets.clashofclans.com/badges/200/KhIxog1Gd8HN70JL1lR8DsMyoF4duBEYP-lRnk0ZNP8.png",
      },
      clanLevel: 3,
      clanPoints: 13778,
      clanVersusPoints: 14586,
      requiredTrophies: 600,
      warFrequency: "always",
      warWinStreak: 1,
      warWins: 9,
      warTies: 0,
      warLosses: 6,
      isWarLogPublic: true,
      warLeague: {
        id: 48000000,
        name: "Unranked",
      },
      members: 16,
      labels: [
        {
          id: 56000000,
          name: "Clan Wars",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
          },
        },
        {
          id: 56000006,
          name: "Base Designing",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/LG966XuC6YoEJsPthcgtyJ8uS46LqYDAeiHJNQKR3YQ.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/LG966XuC6YoEJsPthcgtyJ8uS46LqYDAeiHJNQKR3YQ.png",
          },
        },
        {
          id: 56000014,
          name: "Competitive",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/DhBE-1SSnrZQtsfjVHyNW-BTBWMc8Zoo34MNRCNiRsA.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/DhBE-1SSnrZQtsfjVHyNW-BTBWMc8Zoo34MNRCNiRsA.png",
          },
        },
      ],
      requiredVersusTrophies: 800,
      requiredTownhallLevel: 7,
      chatLanguage: {
        id: 75000015,
        name: "فارسی",
        languageCode: "FA",
      },
    },
    {
      tag: "#G2Q2RU8P",
      name: "UNITED",
      type: "inviteOnly",
      location: {
        id: 32000113,
        name: "India",
        isCountry: true,
        countryCode: "IN",
      },
      badgeUrls: {
        small:
          "https://api-assets.clashofclans.com/badges/70/IgfhOP6GBkWV-Moug3wlZ0kpS23RsUhXbEYdf3YYG4k.png",
        large:
          "https://api-assets.clashofclans.com/badges/512/IgfhOP6GBkWV-Moug3wlZ0kpS23RsUhXbEYdf3YYG4k.png",
        medium:
          "https://api-assets.clashofclans.com/badges/200/IgfhOP6GBkWV-Moug3wlZ0kpS23RsUhXbEYdf3YYG4k.png",
      },
      clanLevel: 14,
      clanPoints: 29780,
      clanVersusPoints: 30935,
      requiredTrophies: 0,
      warFrequency: "always",
      warWinStreak: 8,
      warWins: 194,
      isWarLogPublic: false,
      warLeague: {
        id: 48000010,
        name: "Crystal League III",
      },
      members: 46,
      labels: [
        {
          id: 56000000,
          name: "Clan Wars",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
          },
        },
        {
          id: 56000001,
          name: "Clan War League",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
          },
        },
        {
          id: 56000004,
          name: "Clan Games",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/7qU7tQGERiVITVG0CPFov1-BnFldu4bMN2gXML5bLIU.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/7qU7tQGERiVITVG0CPFov1-BnFldu4bMN2gXML5bLIU.png",
          },
        },
      ],
      requiredVersusTrophies: 2000,
      requiredTownhallLevel: 10,
    },
    {
      tag: "#2QUGCQJYY",
      name: "UNITED",
      type: "closed",
      location: {
        id: 32000185,
        name: "Philippines",
        isCountry: true,
        countryCode: "PH",
      },
      badgeUrls: {
        small:
          "https://api-assets.clashofclans.com/badges/70/KAno9drCLWOlNU_RCftV3LMcHGmawkW4BvcUsmbqFD8.png",
        large:
          "https://api-assets.clashofclans.com/badges/512/KAno9drCLWOlNU_RCftV3LMcHGmawkW4BvcUsmbqFD8.png",
        medium:
          "https://api-assets.clashofclans.com/badges/200/KAno9drCLWOlNU_RCftV3LMcHGmawkW4BvcUsmbqFD8.png",
      },
      clanLevel: 6,
      clanPoints: 28082,
      clanVersusPoints: 26266,
      requiredTrophies: 0,
      warFrequency: "always",
      warWinStreak: 11,
      warWins: 33,
      warTies: 1,
      warLosses: 7,
      isWarLogPublic: true,
      warLeague: {
        id: 48000008,
        name: "Gold League II",
      },
      members: 47,
      labels: [
        {
          id: 56000000,
          name: "Clan Wars",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
          },
        },
        {
          id: 56000004,
          name: "Clan Games",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/7qU7tQGERiVITVG0CPFov1-BnFldu4bMN2gXML5bLIU.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/7qU7tQGERiVITVG0CPFov1-BnFldu4bMN2gXML5bLIU.png",
          },
        },
        {
          id: 56000009,
          name: "Donations",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/RauzS-02tv4vWm1edZ-q3gPQGWKGANLZ-85HCw_NVP0.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/RauzS-02tv4vWm1edZ-q3gPQGWKGANLZ-85HCw_NVP0.png",
          },
        },
      ],
      requiredVersusTrophies: 0,
      requiredTownhallLevel: 8,
      chatLanguage: {
        id: 75000000,
        name: "English",
        languageCode: "EN",
      },
    },
    {
      tag: "#CQ2PVUPC",
      name: "United",
      type: "inviteOnly",
      location: {
        id: 32000178,
        name: "Pakistan",
        isCountry: true,
        countryCode: "PK",
      },
      badgeUrls: {
        small:
          "https://api-assets.clashofclans.com/badges/70/QWTCfnoMkheVe-DUjq8r_D_SdHYmJseySjC4Y3pA0pk.png",
        large:
          "https://api-assets.clashofclans.com/badges/512/QWTCfnoMkheVe-DUjq8r_D_SdHYmJseySjC4Y3pA0pk.png",
        medium:
          "https://api-assets.clashofclans.com/badges/200/QWTCfnoMkheVe-DUjq8r_D_SdHYmJseySjC4Y3pA0pk.png",
      },
      clanLevel: 16,
      clanPoints: 25885,
      clanVersusPoints: 32270,
      requiredTrophies: 2500,
      warFrequency: "always",
      warWinStreak: 0,
      warWins: 150,
      isWarLogPublic: false,
      warLeague: {
        id: 48000008,
        name: "Gold League II",
      },
      members: 26,
      labels: [
        {
          id: 56000006,
          name: "Base Designing",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/LG966XuC6YoEJsPthcgtyJ8uS46LqYDAeiHJNQKR3YQ.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/LG966XuC6YoEJsPthcgtyJ8uS46LqYDAeiHJNQKR3YQ.png",
          },
        },
        {
          id: 56000010,
          name: "Friendly",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/hM7SHnN0x7syFa-s6fE7LzeO5yWG2sfFpZUHuzgMwQg.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/hM7SHnN0x7syFa-s6fE7LzeO5yWG2sfFpZUHuzgMwQg.png",
          },
        },
        {
          id: 56000013,
          name: "Relaxed",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/Kv1MZQfd5A7DLwf1Zw3tOaUiwQHGMwmRpjZqOalu_hI.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/Kv1MZQfd5A7DLwf1Zw3tOaUiwQHGMwmRpjZqOalu_hI.png",
          },
        },
      ],
      requiredVersusTrophies: 0,
      requiredTownhallLevel: 11,
      chatLanguage: {
        id: 75000000,
        name: "English",
        languageCode: "EN",
      },
    },
    {
      tag: "#2YPYG0UCV",
      name: "United",
      type: "inviteOnly",
      location: {
        id: 32000113,
        name: "India",
        isCountry: true,
        countryCode: "IN",
      },
      badgeUrls: {
        small:
          "https://api-assets.clashofclans.com/badges/70/nc_v39d-3T2Y_WhF7uCh7zsEdPOybkPT1wpTUdBUEk0.png",
        large:
          "https://api-assets.clashofclans.com/badges/512/nc_v39d-3T2Y_WhF7uCh7zsEdPOybkPT1wpTUdBUEk0.png",
        medium:
          "https://api-assets.clashofclans.com/badges/200/nc_v39d-3T2Y_WhF7uCh7zsEdPOybkPT1wpTUdBUEk0.png",
      },
      clanLevel: 11,
      clanPoints: 33170,
      clanVersusPoints: 27265,
      requiredTrophies: 2200,
      warFrequency: "always",
      warWinStreak: 2,
      warWins: 70,
      warTies: 0,
      warLosses: 40,
      isWarLogPublic: true,
      warLeague: {
        id: 48000010,
        name: "Crystal League III",
      },
      members: 36,
      labels: [
        {
          id: 56000000,
          name: "Clan Wars",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
          },
        },
        {
          id: 56000001,
          name: "Clan War League",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
          },
        },
        {
          id: 56000016,
          name: "Clan Capital",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/Odg2DaLfhMgQOci4QvHovdoYq4SDiBrocWS2Bjm8Ah8.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/Odg2DaLfhMgQOci4QvHovdoYq4SDiBrocWS2Bjm8Ah8.png",
          },
        },
      ],
      requiredVersusTrophies: 1600,
      requiredTownhallLevel: 12,
      chatLanguage: {
        id: 75000000,
        name: "English",
        languageCode: "EN",
      },
    },
    {
      tag: "#2LUR00RQP",
      name: "UNITED",
      type: "closed",
      location: {
        id: 32000185,
        name: "Philippines",
        isCountry: true,
        countryCode: "PH",
      },
      badgeUrls: {
        small:
          "https://api-assets.clashofclans.com/badges/70/eOvwEdkZLdOiTObQdkliSyEH8_m2qga3awjlhfmn_Zk.png",
        large:
          "https://api-assets.clashofclans.com/badges/512/eOvwEdkZLdOiTObQdkliSyEH8_m2qga3awjlhfmn_Zk.png",
        medium:
          "https://api-assets.clashofclans.com/badges/200/eOvwEdkZLdOiTObQdkliSyEH8_m2qga3awjlhfmn_Zk.png",
      },
      clanLevel: 13,
      clanPoints: 29470,
      clanVersusPoints: 21790,
      requiredTrophies: 200,
      warFrequency: "always",
      warWinStreak: 2,
      warWins: 110,
      warTies: 1,
      warLosses: 59,
      isWarLogPublic: true,
      warLeague: {
        id: 48000012,
        name: "Crystal League I",
      },
      members: 39,
      labels: [
        {
          id: 56000000,
          name: "Clan Wars",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
          },
        },
        {
          id: 56000001,
          name: "Clan War League",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
          },
        },
        {
          id: 56000009,
          name: "Donations",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/RauzS-02tv4vWm1edZ-q3gPQGWKGANLZ-85HCw_NVP0.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/RauzS-02tv4vWm1edZ-q3gPQGWKGANLZ-85HCw_NVP0.png",
          },
        },
      ],
      requiredVersusTrophies: 200,
      requiredTownhallLevel: 9,
    },
    {
      tag: "#2L9Y0GC0Y",
      name: "united",
      type: "inviteOnly",
      location: {
        id: 32000165,
        name: "Nepal",
        isCountry: true,
        countryCode: "NP",
      },
      badgeUrls: {
        small:
          "https://api-assets.clashofclans.com/badges/70/PJDYtSMUYIkxBSskjK6DrFM74BE5GNNbPPzOUjYqFtA.png",
        large:
          "https://api-assets.clashofclans.com/badges/512/PJDYtSMUYIkxBSskjK6DrFM74BE5GNNbPPzOUjYqFtA.png",
        medium:
          "https://api-assets.clashofclans.com/badges/200/PJDYtSMUYIkxBSskjK6DrFM74BE5GNNbPPzOUjYqFtA.png",
      },
      clanLevel: 3,
      clanPoints: 10557,
      clanVersusPoints: 9104,
      requiredTrophies: 0,
      warFrequency: "always",
      warWinStreak: 2,
      warWins: 15,
      warTies: 0,
      warLosses: 4,
      isWarLogPublic: true,
      warLeague: {
        id: 48000000,
        name: "Unranked",
      },
      members: 13,
      labels: [
        {
          id: 56000000,
          name: "Clan Wars",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
          },
        },
        {
          id: 56000001,
          name: "Clan War League",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
          },
        },
        {
          id: 56000009,
          name: "Donations",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/RauzS-02tv4vWm1edZ-q3gPQGWKGANLZ-85HCw_NVP0.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/RauzS-02tv4vWm1edZ-q3gPQGWKGANLZ-85HCw_NVP0.png",
          },
        },
      ],
      requiredVersusTrophies: 0,
      requiredTownhallLevel: 1,
      chatLanguage: {
        id: 75000000,
        name: "English",
        languageCode: "EN",
      },
    },
    {
      tag: "#Y2RULL28",
      name: "UNITED",
      type: "open",
      location: {
        id: 32000113,
        name: "India",
        isCountry: true,
        countryCode: "IN",
      },
      badgeUrls: {
        small:
          "https://api-assets.clashofclans.com/badges/70/KALdzHtcZOoenHmaTJ_hGzMwu6FEFz06jbKtwJ2U1EQ.png",
        large:
          "https://api-assets.clashofclans.com/badges/512/KALdzHtcZOoenHmaTJ_hGzMwu6FEFz06jbKtwJ2U1EQ.png",
        medium:
          "https://api-assets.clashofclans.com/badges/200/KALdzHtcZOoenHmaTJ_hGzMwu6FEFz06jbKtwJ2U1EQ.png",
      },
      clanLevel: 20,
      clanPoints: 37389,
      clanVersusPoints: 39358,
      requiredTrophies: 2900,
      warFrequency: "always",
      warWinStreak: 0,
      warWins: 358,
      isWarLogPublic: false,
      warLeague: {
        id: 48000011,
        name: "Crystal League II",
      },
      members: 38,
      labels: [
        {
          id: 56000000,
          name: "Clan Wars",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
          },
        },
        {
          id: 56000001,
          name: "Clan War League",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
          },
        },
        {
          id: 56000004,
          name: "Clan Games",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/7qU7tQGERiVITVG0CPFov1-BnFldu4bMN2gXML5bLIU.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/7qU7tQGERiVITVG0CPFov1-BnFldu4bMN2gXML5bLIU.png",
          },
        },
      ],
      requiredVersusTrophies: 3100,
      requiredTownhallLevel: 14,
      chatLanguage: {
        id: 75000000,
        name: "English",
        languageCode: "EN",
      },
    },
    {
      tag: "#2QL89QYG9",
      name: "United",
      type: "inviteOnly",
      location: {
        id: 32000115,
        name: "Iran",
        isCountry: true,
        countryCode: "IR",
      },
      badgeUrls: {
        small:
          "https://api-assets.clashofclans.com/badges/70/LuG9cM6cvZq26jFeoba6cN0brejNxJ1x8mSdoaVk8qg.png",
        large:
          "https://api-assets.clashofclans.com/badges/512/LuG9cM6cvZq26jFeoba6cN0brejNxJ1x8mSdoaVk8qg.png",
        medium:
          "https://api-assets.clashofclans.com/badges/200/LuG9cM6cvZq26jFeoba6cN0brejNxJ1x8mSdoaVk8qg.png",
      },
      clanLevel: 3,
      clanPoints: 5992,
      clanVersusPoints: 6051,
      requiredTrophies: 2600,
      warFrequency: "always",
      warWinStreak: 1,
      warWins: 23,
      isWarLogPublic: false,
      warLeague: {
        id: 48000000,
        name: "Unranked",
      },
      members: 5,
      labels: [
        {
          id: 56000000,
          name: "Clan Wars",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
          },
        },
        {
          id: 56000001,
          name: "Clan War League",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/5w60_3bdtYUe9SM6rkxBRyV_8VvWw_jTlDS5ieU3IsI.png",
          },
        },
        {
          id: 56000010,
          name: "Friendly",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/hM7SHnN0x7syFa-s6fE7LzeO5yWG2sfFpZUHuzgMwQg.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/hM7SHnN0x7syFa-s6fE7LzeO5yWG2sfFpZUHuzgMwQg.png",
          },
        },
      ],
      requiredVersusTrophies: 2400,
      requiredTownhallLevel: 11,
    },
    {
      tag: "#PPPP2CYR",
      name: "UNITED",
      type: "open",
      location: {
        id: 32000193,
        name: "Russia",
        isCountry: true,
        countryCode: "RU",
      },
      badgeUrls: {
        small:
          "https://api-assets.clashofclans.com/badges/70/rXlRZacugAYARhVRCa0W-WzN4aWpBuvbDf_4mxwXv7E.png",
        large:
          "https://api-assets.clashofclans.com/badges/512/rXlRZacugAYARhVRCa0W-WzN4aWpBuvbDf_4mxwXv7E.png",
        medium:
          "https://api-assets.clashofclans.com/badges/200/rXlRZacugAYARhVRCa0W-WzN4aWpBuvbDf_4mxwXv7E.png",
      },
      clanLevel: 21,
      clanPoints: 35913,
      clanVersusPoints: 36354,
      requiredTrophies: 2000,
      warFrequency: "always",
      warWinStreak: 6,
      warWins: 453,
      warTies: 2,
      warLosses: 292,
      isWarLogPublic: true,
      warLeague: {
        id: 48000014,
        name: "Master League II",
      },
      members: 30,
      labels: [
        {
          id: 56000000,
          name: "Clan Wars",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
          },
        },
        {
          id: 56000002,
          name: "Trophy Pushing",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/hNtigjuwJjs6PWhVtVt5HvJgAp4ZOMO8e2nyjHX29sA.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/hNtigjuwJjs6PWhVtVt5HvJgAp4ZOMO8e2nyjHX29sA.png",
          },
        },
        {
          id: 56000011,
          name: "Talkative",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/T1c8AYalTn_RruVkY0mRPwNYF5n802thTBEEnOtNTMw.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/T1c8AYalTn_RruVkY0mRPwNYF5n802thTBEEnOtNTMw.png",
          },
        },
      ],
      requiredVersusTrophies: 0,
      requiredTownhallLevel: 13,
      chatLanguage: {
        id: 75000012,
        name: "Pусский",
        languageCode: "RU",
      },
    },
    {
      tag: "#VJVRURCC",
      name: "United",
      type: "inviteOnly",
      location: {
        id: 32000249,
        name: "United States",
        isCountry: true,
        countryCode: "US",
      },
      badgeUrls: {
        small:
          "https://api-assets.clashofclans.com/badges/70/xAzSYiPIgqwgAIoCsJ2UyHWkm29ZTRbDOhSpzbGPfvE.png",
        large:
          "https://api-assets.clashofclans.com/badges/512/xAzSYiPIgqwgAIoCsJ2UyHWkm29ZTRbDOhSpzbGPfvE.png",
        medium:
          "https://api-assets.clashofclans.com/badges/200/xAzSYiPIgqwgAIoCsJ2UyHWkm29ZTRbDOhSpzbGPfvE.png",
      },
      clanLevel: 20,
      clanPoints: 30420,
      clanVersusPoints: 27710,
      requiredTrophies: 0,
      warFrequency: "always",
      warWinStreak: 0,
      warWins: 422,
      isWarLogPublic: false,
      warLeague: {
        id: 48000013,
        name: "Master League III",
      },
      members: 27,
      labels: [
        {
          id: 56000000,
          name: "Clan Wars",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/lXaIuoTlfoNOY5fKcQGeT57apz1KFWkN9-raxqIlMbE.png",
          },
        },
        {
          id: 56000004,
          name: "Clan Games",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/7qU7tQGERiVITVG0CPFov1-BnFldu4bMN2gXML5bLIU.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/7qU7tQGERiVITVG0CPFov1-BnFldu4bMN2gXML5bLIU.png",
          },
        },
        {
          id: 56000014,
          name: "Competitive",
          iconUrls: {
            small:
              "https://api-assets.clashofclans.com/labels/64/DhBE-1SSnrZQtsfjVHyNW-BTBWMc8Zoo34MNRCNiRsA.png",
            medium:
              "https://api-assets.clashofclans.com/labels/128/DhBE-1SSnrZQtsfjVHyNW-BTBWMc8Zoo34MNRCNiRsA.png",
          },
        },
      ],
      requiredVersusTrophies: 0,
      requiredTownhallLevel: 1,
      chatLanguage: {
        id: 75000000,
        name: "English",
        languageCode: "EN",
      },
    },
  ],
  paging: {
    cursors: {
      after: "eyJwb3MiOjIwfQ",
    },
  },
};

let exampleLocation = {
  id: 32000008,
  name: "Åland Islands",
  isCountry: true,
  countryCode: "AX",
};
