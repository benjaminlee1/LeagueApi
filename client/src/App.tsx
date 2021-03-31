import React, { useState } from "react";
import { Button, TextField, Box } from "@material-ui/core";
import { PlayerMatchSummaryDTO } from "./types";
import MatchSummary from "./components/MatchSummary";
import axios from "axios";

import "./App.css";

function App() {
  const [username, setUserName] = useState("");
  const [matchData, setMatchData] = useState<Array<PlayerMatchSummaryDTO>>([]);

  function getLastFiveUserMatches() {
    axios
      .get("http://leepinhsun.com/getLastFiveMatches", {
        headers: {
          Username: username,
        },
      })
      .then((resp) => {
        if (resp.status === 200) {
          setMatchData(resp.data);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div>
      <TextField
        onChange={(e) => {
          setUserName(e.target.value);
        }}
      >
        {username}
      </TextField>
      <Button onClick={getLastFiveUserMatches}>Search</Button>
      <p>Stats</p>
      <Box>
        {matchData.length > 0
          ? matchData.map((data, id) => <MatchSummary key={id} data={data} />)
          : null}
      </Box>
    </div>
  );
}

export default App;
