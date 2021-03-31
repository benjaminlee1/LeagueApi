import { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import Request from "request";

import "./App.css";

function App() {
  const [username, setUserName] = useState("");
  async function getLastFiveUserMatches() {
    const resp = await fetch("http://localhost:5001/getLastFiveMatches", {
      method: "GET",
      mode: "no-cors",
    });

    console.log("Hello\n");
    console.log(resp);
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
    </div>
  );
}

export default App;
