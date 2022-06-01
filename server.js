"use strict";

//setup enviroment variables
require("dotenv").config();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const NODE_ENV = process.env.NODE_ENV;

const options =
  NODE_ENV === "production"
    ? { connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : { connectionString: DATABASE_URL };

//load libraries
const express = require("express");
const cors = require("cors");
const superagent = require("superagent");
const pg = require("pg");
const methodOverride = require("method-override");

//setup app
const app = express();

//middlewares
app.use(cors());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// connect database
const client = new pg.Client(options);
client.on("error", (err) => {
  throw err;
});

// load other modules
const handleHomePage = require("./controllers/home.controller.js");
const handleSearch = require("./controllers/search.controller.js");
const handleDetails = require("./controllers/details.controller.js");
// const handleFavorites = require("./controllers/favorites.controller.js");
// const showFavorites = require("./controllers/showFavorites.controller.js");
// const removeFavorites = require("./controllers/removeFavorites.controller.js");
// const editSong = require("./controllers/editSong.controller.js");
// const updateSong = require("./controllers/updateSong.controller.js");
const aboutUs = require("./controllers/about.controller.js");

//API routes
app.get("/", handleHomePage);
app.get("/results", handleSearch);
app.get("/details/:id", handleDetails);
app.post("/addFavorites", handleFavorites);
app.get("/favorites", showFavorites);
app.delete("/favorites/:id", removeFavorites);
app.get("/editSong/:id", editSong);
app.put("/updateSong/:id", updateSong);
app.get("/about", aboutUs);

function handleFavorites(req, res) {
  let SQL =
    "INSERT INTO songslist (id,title_short,artist_name,artist_picture,lyrics,audio,comment) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *;";
  let values = [
    req.body.id,
    req.body.songName,
    req.body.artistName,
    req.body.artistImg,
    req.body.lyrics,
    req.body.audio,
    req.body.comment,
  ];
  console.log(values);
  client
    .query(SQL, values)
    .then((results) => {
      console.log(results.rows);
      res.redirect("/favorites");
    })
    .catch((err) => {
      console.log("ouch!!");
    });
}

function showFavorites(req, res) {
  const SQL = "SELECT * FROM songslist";
  client
    .query(SQL)
    .then((results) => {
      res.render("./pages/favorites", { favResults: results.rows });
    })
    .catch((error) => errorHandler(error, req, res));
}

function removeFavorites(req, res) {
  const deleteId = [req.params.id];
  const SQL = "DELETE FROM songslist WHERE id=$1";
  client
    .query(SQL, deleteId)
    .then(() => {
      res.redirect("/favorites");
    })
    .catch((error) => {
      console.log("no delete");
    });
}

function editSong(req, res) {
  const SQL = "SELECT * FROM songslist WHERE id=$1;";
  const values = [req.params.id];
  client
    .query(SQL, values)
    .then((results) => {
      res.render("./pages/editSong", { song: results.rows[0] });
    })
    .catch((error) => {
      console.log("no comment");
    });
}

function updateSong(req, res) {
  const SQL =
    "UPDATE songslist SET title_short=$1, artist_name=$2, artist_picture=$3, lyrics=$4, audio=$5 , comment=$6 WHERE id=$7;";
  const values = [
    req.body.songName,
    req.body.artistName,
    req.body.artistImg,
    req.body.lyrics,
    req.body.audio,
    req.body.comment,
    req.params.id,
  ];
  client
    .query(SQL, values)
    .then((results) => res.redirect(`/favorites`))
    .catch((err) => errorHandler(err, req, res));
}

app.get("*", (req, res) => res.status(404).send("Ouch Not Found!"));

function errorHandler(error, req, res) {
  res.status(500).send(error);
}

client.connect().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
  });
});
