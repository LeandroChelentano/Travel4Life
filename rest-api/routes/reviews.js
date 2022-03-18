const express = require("express");
let router = express.Router();

const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");

var db = new JsonDB(new Config("database", true, true, "/"));

router.post("/new", (req, res) => {
  const { token, placeId, title, description, calification } = req.body;

  //* Validating blank objects
  if (title == "" || description == "") {
    res.json({ success: false, message: "Elementos en blanco." });
    return;
  }

  //* User auth
  console.log(token);
  let userIndex = db.getIndex("/users", parseInt(token), "token");
  if (userIndex == -1) {
    res.json({ success: false, message: "Error de autentificación." });
    return;
  }

  //* Check if the user has an active review on the site
  let userName = db.getData(`/users[${userIndex}]/username`);
  let placeIndex = db.getIndex("/places", placeId, "id");
  let usersWithActiveReviews = db.getData(`/places[${placeIndex}]/reviews`);
  let hasAnActiveReview = false;
  usersWithActiveReviews.forEach((review) => {
    if (review.author == userName) hasAnActiveReview = true;
  });

  if (hasAnActiveReview) {
    res.json({
      success: false,
      message: "Ya tienes una review en este sitio.",
    });
    return;
  }

  //* Creating and pushing review
  const newReview = {
    author: userName,
    title: title,
    description: description,
    calification: parseInt(calification),
  };

  db.push(`/places[${placeIndex}]/reviews[]`, newReview);
  db.reload();
  res.json({
    success: true,
    message: "Operación efectuada correctamente.",
  });
});

router.post("/delete", (req, res) => {
  const { token, placeId } = req.body;

  //* User auth
  let userIndex = db.getIndex("/users", parseInt(token), "token");
  if (userIndex == -1) {
    res.json({ success: false, message: "Error de autentificación." });
    return;
  }

  //* Check if the user has an active review on the site
  let userName = db.getData(`/users[${userIndex}]/username`);
  let placeIndex = db.getIndex("/places", parseInt(placeId), "id");
  let usersWithActiveReviews = db.getData(`/places[${placeIndex}]/reviews`);
  let hasAnActiveReview = false;
  let reviewIndex;
  usersWithActiveReviews.forEach((review, index) => {
    if (review.author == userName) {
      hasAnActiveReview = true;
      reviewIndex = index;
    }
  });

  if (!hasAnActiveReview) {
    res.json({
      success: false,
      message: "No tienes una review en este sitio.",
    });
    return;
  }

  //* Deleting review
  db.delete(`/places[${placeIndex}]/reviews[${reviewIndex}]`);
  res.json({
    success: true,
    message: "Operación efectuada correctamente.",
  });

  console.log(`Site deleted => Site: ${placeId} AND By: ${userName}`);
});

module.exports = router;
