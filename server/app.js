require("dotenv").config();

var express = require("express");
var cors = require("cors");
var axios = require("axios");

var PORT = process.env.PORT || 5001;
var APIKEY = process.env.APIKEY || "";

var regionURL = "https://na1.api.riotgames.com";

const server = express();

// Middleware uses
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get("/getLastFiveMatches", async function (req, res) {
  // Fail if username is undefined
  if (req.headers.username === undefined) {
    res.status(400).send("Undefined username");
  }

  // Query for summoner account information
  try {
    var accountResp = await axios.get(
      `${regionURL}/lol/summoner/v4/summoners/by-name/${req.headers.username}`,
      {
        headers: { "X-Riot-Token": APIKEY },
      }
    );

    // Fail if status isn't 200
    if (accountResp.status !== 200) {
      res.status(accountResp.status).send({
        error: accountResp.statusText,
        msg: `Error occurred getting summoner account by the name of ${username}.`,
      });
      return;
    }

    var accountId = accountResp.data.accountId;
    // Now need to grab the latest 5 matches via match api

    var matchIdsResp = await axios.get(
      `${regionURL}/lol/match/v4/matchlists/by-account/${accountId}?endIndex=5`,
      {
        headers: { "X-Riot-Token": APIKEY },
      }
    );

    if (matchIdsResp.status !== 200) {
      res.status(matchIds.status).send({
        error: matchIds.statusText,
        msg: `Could not locate match Ids for account ${username}.`,
      });
      return;
    }

    // Use match Ids and form them into requests.
    var matchRequests = await axios.all(
      matchIdsResp.data.matches.map((match) =>
        axios.get(`${regionURL}/lol/match/v4/matches/${match.gameId}`, {
          headers: { "X-Riot-Token": APIKEY },
        })
      )
    );

    // Process data and send.
    var payload = processData(matchRequests, accountId);

    res.setHeader("Content-Type", "application/json");
    res.status(200).end(JSON.stringify({ payload }));
  } catch (err) {
    res.status(500).send(err);
  }
});

server.listen(PORT, cors(), (err) => {
  if (err) {
    console.log("err");
  }

  console.log(`Server listening on ${PORT}`);
});

function processData(data, accountId) {
  return data.map((matchResp) => {
    if (matchResp.status !== 200) {
      return { status: "Error" };
    }

    var playerData = findPlayerData(matchResp.data, accountId);
    if (playerData === undefined) {
      return { status: "Error" };
    }

    return {
      status: "Success",
      gameDuration: matchResp.data.gameDuration,
      spell1Id: playerData.spell1Id,
      spell2Id: playerData.spell2Id,
      victory: playerData.stats.win,
      championId: playerData.championId,
      kills: playerData.stats.kills,
      deaths: playerData.stats.deaths,
      assists: playerData.stats.assists,
      item0: playerData.stats.item0,
      item1: playerData.stats.item1,
      item2: playerData.stats.item2,
      item3: playerData.stats.item3,
      item4: playerData.stats.item4,
      item5: playerData.stats.item5,
      item6: playerData.stats.item6,
      perkSubStyle: playerData.stats.perkSubStyle,
      perkPrimaryStyle: playerData.stats.perkPrimaryStyle,
      totalMinionsKilled: playerData.stats.totalMinionsKilled,
    };
  });
}

function findPlayerData(matchData, accountId) {
  var participantIds = matchData.participantIdentities;
  var participants = matchData.participants;

  var pidDTO = participantIds.find(
    (participant) => participant.player.accountId === accountId
  );

  if (pidDTO === undefined) {
    return undefined;
  }

  return participants.find(
    (participant) => participant.participantId === pidDTO.participantId
  );
}
