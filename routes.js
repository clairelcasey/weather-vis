// routes.js

"use strict";

/** Routes for Lunchly */

const express = require("express");

const router = new express.Router();

/** Homepage: show list of customers. */

router.get("/", async function (req, res, next) {
  console.log('we are inside of get!!!"')
  console.log(__dirname)
  return res.sendFile(__dirname+"/static/index.html");
});

module.exports = router;