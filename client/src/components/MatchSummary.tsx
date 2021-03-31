import React from "react";
import { Avatar, Box, Typography } from "@material-ui/core";
import { PlayerMatchSummaryDTO } from "../types";

type MatchSummaryProps = {
  data: PlayerMatchSummaryDTO;
};

export default function MatchSummary({ data }: MatchSummaryProps) {
  return (
    <Box>
      <Typography>{data.gameDuration}</Typography>

      <Typography>{data.victory ? "Victory" : "Defeat"}</Typography>
      <Avatar variant="circle" />
      <Typography>{`Champion: ${data.championId}`}</Typography>
      <Typography>{`${data.kills}:${data.deaths}:${data.assists}`}</Typography>

      <Typography>{`Creep Score: ${data.totalMinionsKilled}`}</Typography>
      <Typography>{}</Typography>
    </Box>
  );
}
