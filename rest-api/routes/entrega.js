const express = require("express");
let router = express.Router();

const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");

var db = new JsonDB(new Config("database", true, true, "/"));

router.get("/getallusers", (req, res) => {
  let data = [];

  let end = false;
  let i = 0;
  while (!end) {
    try {
      data.push(db.getData(`/users[${i}]/username`));
      i++;
    } catch (err) {
      end = true;
    }
  }

  res.json(data);
});

router.get("/getallsites", (req, res) => {
  res.json(db.getData("/places"));
});

module.exports = router;
