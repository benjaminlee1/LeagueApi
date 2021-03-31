var express = require("express");
var cors = require("cors");

const server = express();

server.get("/getLastFiveMatches", function (req, res) {
  console.log(req);
  res.send({ object: "hello" });
});

server.listen(5001, cors(), (err) => {
  if (err) {
    console.log("err");
  }

  console.log("Server listening on 5001");
});
