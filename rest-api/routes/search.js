const express = require("express");
let router = express.Router();

const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");

var db = new JsonDB(new Config("database", true, true, "/"));

router.get("/", (req, res) => {
  db.reload();
  const name = req.query.name.toLowerCase();

  //?
  if (name === "") {
    const found = get10FirstSites();
    res.json({ result: found });
    return;
  }

  let searchResults = [];

  for (let i = 0; i < db.count("/places"); i++) {
    let data = db.getData(`/places[${i}]`);

    if (data.name.toLowerCase().includes(name)) {
      searchResults.push({
        type: "Sitio",
        title: data.name,
        description: data.description,
        location: data.location,
        author: data.author,
        time: data.time,
      });
    }
  }

  for (let i = 0; i < db.count("/itinerarys"); i++) {
    let data = db.getData(`/itinerarys[${i}]`);
    console.log(data);

    if (data.title.toLowerCase().includes(name)) {
      searchResults.push({
        type: "Itinerario",
        title: data.title,
        author: data.owner,
        places: data.places,
        created: data.created,
      });
    }
  }

  res.json({ result: searchResults });
});

router.get("/getall", (req, res) => {
  let searchResults = [];
  for (let i = 0; i < db.count("/places"); i++) {
    let site = db.getData(`/places[${i}]`);

    searchResults.push({ key: site.id, value: site.name });
  }

  res.json({ result: searchResults });
});

router.get("/getallplacesnophotos", (req, res) => {
  const found = get10FirstSites();
  res.json({ result: found });
});

const get10FirstSites = () => {
  let found = [];
  let all = db.getData("/places");
  all.forEach((place, index) => {
    found.push({
      type: "Sitio",
      title: place.name,
      description: place.description,
      location: place.location,
      author: place.author,
      time: place.time,
    });
    if (index > 10) return;
  });
  return found;
};

module.exports = router;
