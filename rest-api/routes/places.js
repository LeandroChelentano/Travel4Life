const express = require("express");
let router = express.Router();

const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");

var db = new JsonDB(new Config("database", true, true, "/"));

router.post("/new", (req, res) => {
  const { name, description, location, images, token } = req.body;

  let id = db.count("/places") == 0 ? 0 : db.getData("/places[-1]").id + 1;

  //* Auth
  let userIndex = db.getIndex("/users", parseInt(token), "token");
  console.log(userIndex);
  if (userIndex == -1) {
    res.json({ success: false, message: "Error de autentificacion." });
    return;
  }

  //* Duplied place name?
  let userName = db.getData(`/users[${userIndex}]/username`);
  const allPlaces = db.getData("/places");
  let duplied = false;
  allPlaces.forEach((place) => {
    if (
      place.name.toLowerCase() == name.toLowerCase() &&
      place.author.toLowerCase() == userName.toLowerCase()
    ) {
      duplied = true;
    }
  });

  if (duplied) {
    res.json({
      success: false,
      message: "Ya tienes un lugar con ese nombre en tu cuenta.",
    });
    return;
  }

  //* Creating and pushing place
  db.push(`/users[${userIndex}]/places[]`, id, true);
  db.push(
    "/places[]",
    {
      id: id,
      name: name,
      description: description,
      location: location,
      author: userName,
      time: new Date(),
      photos: images,
      reviews: [],
    },
    true
  );

  db.reload();
  res.json({ success: true });
});

router.post("/getsites", (req, res) => {
  const { username } = req.body;
  let index = db.getIndex("/users", username, "username");

  if (index === -1) return;

  const placesIdentifiers = db.getData(`/users[${index}]/places`);

  let places = new Array();
  placesIdentifiers.forEach((placeId) => {
    places.push(
      db.getData(`/places[${db.getIndex("/places", placeId, "id")}]`)
    );
  });

  res.json({ places: `${JSON.stringify(places)}` });
});

router.post("/deletepost", (req, res) => {
  const { token, post } = req.body;

  //* Validando si el lugar existe
  let placeIndex = db.getIndex("/places", post, "id");
  if (placeIndex == -1) {
    res.json({ success: "no place" });
    return;
  }

  //* Validando si el usuario esta autentificado
  let userIndex = db.getIndex("/users", parseInt(token), "token");
  if (userIndex == -1) {
    res.json({ success: "no auth" });
    return;
  }

  //* Validando si el lugar fue publicado por el usuario
  let isOwner = false;
  let placeId = db.getData(`/places[${placeIndex}]/id`);
  let userPlaces = db.getData(`/users[${userIndex}]/places`);
  userPlaces.forEach((place) => {
    console.log(`${place} ${placeId}`);
    if (place == placeId) {
      isOwner = true;
    }
  });
  if (!isOwner) {
    res.json({ success: "not owner" });
    return;
  }

  //* Eliminar la redundancia contralada
  let users = db.getData("/users");
  users.forEach((user) => {
    user.places.forEach((place, index) => {
      if (place == placeId) {
        let usrInd = db.getIndex(`/users`, user.username, "username");
        db.delete(`/users[${usrInd}]/places[${index}]`);
      }
    });
  });

  db.delete(`/places[${placeIndex}]`);
  res.json({ success: true });
});

router.get("/get", (req, res) => {
  const siteName = req.query.site;
  const userName = req.query.user;

  db.reload();
  const data = db.getData("/places");
  let toSend = "404";
  data.forEach((place) => {
    if (
      place.name.toLowerCase() == siteName.toLowerCase() &&
      place.author.toLowerCase() == userName.toLowerCase()
    ) {
      toSend = place;
    }
  });

  res.json({ data: toSend });
});

router.post("/edit", (req, res) => {
  const { token, siteId, title, desc, location } = req.body;

  //* Auth
  let userIndex = db.getIndex(`/users`, parseInt(token), "token");
  let user = db.getData(`/users[${userIndex}]`);
  if (!user.places.includes(siteId)) {
    res.json({ success: false });
    return;
  }

  //* Editing site object
  let siteIndex = db.getIndex(`/places`, parseInt(siteId), "id");
  db.push(`/places[${siteIndex}]/name`, title, false);
  db.push(`/places[${siteIndex}]/description`, desc, false);
  db.push(`/places[${siteIndex}]/location`, location, false);

  db.save();
  db.reload();

  res.json({ success: true });
});

router.get("/id", (req, res) => {
  const id = parseInt(req.query.id);
  const placeIndex = db.getIndex("/places", id);
  const data = db.getData(`/places[${placeIndex}]`);

  res.json({ data: data.author });
});

module.exports = router;
