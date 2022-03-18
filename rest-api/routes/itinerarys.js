const express = require("express");
let router = express.Router();

const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");

var db = new JsonDB(new Config("database", true, true, "/"));

router.post("/new", (req, res) => {
  const { title, token } = req.body;
  const places = JSON.parse(req.body.places);

  console.log(places);

  //* User auth
  let userIndex = db.getIndex("/users", parseInt(token), "token");
  console.log(token);
  if (userIndex == -1) {
    res.json({ success: false, message: "Error en la autentificacion." });
    return;
  }

  let user = db.getData(`/users[${userIndex}]/username`);

  //* Determinar si el nombre del itinerario ya existe
  let existence = false;
  const length = db.count("/itinerarys");
  for (let i = 0; i < length; i++) {
    let tmpTitle = db.getData(`/itinerarys[${i}]/title`);
    let tmpOwner = db.getData(`/itinerarys[${i}]/owner`);
    if (
      tmpTitle.toLowerCase() === title.toLowerCase() &&
      user.toLowerCase() === tmpOwner.toLowerCase()
    ) {
      existence = true;
    }
  }

  if (existence) {
    res.json({
      success: false,
      message: "Ya tienes un sitio creado por ti con ese nombre.",
    });
    return;
  }

  let id =
    db.count("/itinerarys") == 0 ? 0 : db.getData("/itinerarys[-1]").id + 1;

  db.push("/itinerarys[]", {
    id: id,
    title: title,
    owner: user,
    places: places,
    created: new Date(),
  });
  res.json({ success: true });
});

router.get("/getfromuser", (req, res) => {
  const userName = req.query.user;

  let data = db.getData("/itinerarys");
  let found = [];
  data.forEach((itinerary) => {
    if (itinerary.owner.toLowerCase() === userName.toLowerCase()) {
      found.push(itinerary);
    }
  });

  res.json({ data: found });
});

router.get("/get", (req, res) => {
  const itineraryTitle = req.query.itinerary;
  const userName = req.query.user;

  let data = db.getData("/itinerarys");
  let found = "404";
  data.forEach((itinerary) => {
    if (
      itinerary.title.toLowerCase() === itineraryTitle.toLowerCase() &&
      itinerary.owner.toLowerCase() === userName.toLowerCase()
    ) {
      found = itinerary;
    }
  });

  res.json({ data: found });
});

router.post("/edit", (req, res) => {
  const { token, itineraryId, title, places } = req.body;

  //* Auth
  let userId = db.getIndex("/users", parseInt(token), "token");
  if (userId == -1) {
    res.json({ success: false });
    return;
  }

  //* Validating existence of itinerary
  let itineraryIndex = db.getIndex("/itinerarys", parseInt(itineraryId), "id");
  if (itineraryIndex == -1) {
    res.json({ success: false });
    return;
  }

  //* Implementing changes
  db.push(`/itinerarys[${itineraryIndex}]/title`, title, false);
  db.delete(`/itinerarys[${itineraryIndex}]/places`);
  db.push(`/itinerarys[${itineraryIndex}]/places`, JSON.parse(places), false);

  res.json({ success: true });
});

module.exports = router;
