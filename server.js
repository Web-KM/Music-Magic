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

//API routes
app.get("/", handleHomePage);
app.get("/results", handleSearch);
app.get("/details/:id", handleDetails);

function aboutUs(req, res) {
  res.render("./pages/about");
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
