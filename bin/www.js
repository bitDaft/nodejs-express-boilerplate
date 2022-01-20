#!/usr/bin/env node
"use strict";

// #Application entry point.
import http from "http";
import app from "#app";

import config from "#config";

const port = config.PORT;

if (isNaN(+port)) {
  throw Error("Invalid port provided");
}

app.set("port", port);

const server = http.createServer(app);

server.listen(port, () => {
  console.log("Running -> Listening on port : " + port);
});
