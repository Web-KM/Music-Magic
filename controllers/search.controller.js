"use strict";
const superagent = require("superagent");

function handleSearch(req, res) {
  console.log(req.query.search);
  const url = `https://api.deezer.com/search?q=${req.query.search}`;
  superagent(url)
    .then((result) => {
      const songResults = result.body.data;
      const songs = songResults.map((value) => {
        return new Songs(value);
      });
      res.render("pages/results", { song: songs });
    })
    .catch((err) => errorHandler(err, req, res));
}

function Songs(data) {
  this.id = data.id;
  this.title_short = data.title_short ? data.title_short : "No Title Was Found";
  this.artist_name = data.artist.name
    ? data.artist.name
    : "No Artist Name Was Found";
  this.artist_picture = data.artist.picture_big
    ? data.artist.picture_big
    : "../project-images/no-image.png";
}

module.exports = handleSearch;
