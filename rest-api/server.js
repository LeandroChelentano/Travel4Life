const express = require("express");
const app = express();

const cors = require("cors");

const { JsonDB } = require("node-json-db");
const { Config } = require("node-json-db/dist/lib/JsonDBConfig");

var db = new JsonDB(new Config("database", true, true, "/"));

app.use("*", cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);

  next();
});

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: "10MB" }));

app.post("/validatetoken", (req, res) => {
  console.log(`Validando token`);
  let token = req.body.token;
  let index = db.getIndex("/users", parseInt(token), "token");
  index == -1 ? res.json({ active: false }) : res.json({ active: true });
});

app.post("/login", (req, res) => {
  const { user, pass, ip } = req.body;

  if (user == "" || pass == "") {
    res.json({ success: false, message: "Hay elementos en blanco." });
    return;
  }

  let index = db.getIndex("/users", user, "username");
  if (index == -1) {
    res.json({
      success: false,
      message: "No hay una cuenta con ese nombre de usuario..",
    });
    return;
  }

  let userPassword = db.getData(`/users[${index}]/password`);
  if (userPassword != pass) {
    res.json({ success: false, message: "Contraseña incorrecta." });
    return;
  }

  db.push(`/users[${index}]/lastLogIn/ip`, ip);
  db.push(`/users[${index}]/lastLogIn/date`, `${new Date()}`);

  db.reload();
  res.json({ success: true, token: `${GenerateToken(user)}` });
});

const GenerateToken = (user) => {
  let generated = parseInt(Math.random() * (9999 - 1000) + 1000);
  if (db.getIndex("/users", generated, "token") != -1) {
    GenerateToken();
  } else {
    let index = db.getIndex("/users", user, "username");
    db.push(`/users[${index}]/token`, generated, true);
    return generated;
  }
};

app.post("/register", (req, res) => {
  const { user, pass, ip } = req.body;

  if (user == "" || pass == "") {
    res.json({ success: false, message: "Hay elementos en blanco." });
    return;
  }

  let index = db.getIndex("/users", user.toLowerCase(), "username");
  if (index != -1) {
    res.json({ success: false, message: "Nombre de usuario ya existente." });
    return;
  }

  let newUser = {
    username: user.toLowerCase(),
    password: pass,
    name: "",
    description: "",
    created: {
      ip: ip,
      date: new Date(),
    },
    lastLogIn: {
      ip: ip,
      date: new Date(),
    },
    places: [],
  };

  db.push("/users[]", newUser, true);
  let token = GenerateToken(user);

  res.json({ success: true, token: `${token}` });
});

app.post("/getuser", (req, res) => {
  let token = parseInt(req.body.token);
  let index = db.getIndex("/users", token, "token");
  let user = db.getData(`/users[${index}]`);
  return user == null
    ? res.json({ user: null })
    : res.json({ user: user.username });
});

app.post("/publicofuser", (req, res) => {
  let username = req.body.username;

  let index = db.getIndex("/users", username, "username");
  if (index == -1) {
    res.json({ user: "404" });
    return;
  }

  let data = db.getData(`/users[${index}]`);
  let user = {
    username: data.username,
    name: data.name,
    description: data.description,
    places: data.places,
  };

  res.json(user);
});

app.post("/edituser", (req, res) => {
  const { token, name, desc } = req.body;
  console.log(
    "🚀 ~ file: server.js ~ line 146 ~ app.post ~ token, name, desc",
    token,
    name,
    desc
  );

  //* Validando si el usuario esta autentificado
  let userIndex = db.getIndex("/users", parseInt(token), "token");
  if (userIndex == -1) {
    res.json({ success: "no auth" });
    return;
  }

  db.push(`/users[${userIndex}]/name`, name, false);
  db.push(`/users[${userIndex}]/description`, desc, false);

  res.json({ success: true });
  return;
});

var placesRouter = require("./routes/places");
app.use("/places", placesRouter);

var entegaRouter = require("./routes/entrega");
app.use("/entrega", entegaRouter);

var searchRouter = require("./routes/search");
app.use("/search", searchRouter);

var itinerarysRouter = require("./routes/itinerarys");
app.use("/itinerarys", itinerarysRouter);

var reviewsRouter = require("./routes/reviews");
app.use("/reviews", reviewsRouter);

app.listen(2222, () => {
  console.log(`\n\n\tRunning!\n`);
});
