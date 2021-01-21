// server.js
"use strict";

const app = require("./app");

const PORT = process.env.PORT || 3000;
app.listen(process.env.PORT, function () {
  console.log("Started starting!");
});