"use strict";

const superagent = require("superagent");

function handleDetails(req, res) {
  const url = `https://api.deezer.com/track/${req.params.id}`;
  console.log(url);
  superagent(url)
    .then((result) => {
      let oneSong = result.body;
      const ourSong = new Songs(oneSong);
      console.log(ourSong);
      return ourSong;
    })
    .then((ourSong) => {
      let lyricsApi = `https://api.lyrics.ovh/v1/${ourSong.artist_name}/${ourSong.title_short}`;
      superagent
        .get(lyricsApi)
        .then((lyrResults) => {
          ourSong.lyrics = lyrResults.body.lyrics;
          res.render("pages/details", { song: ourSong });
        })
        .catch((err) => {
          res.render("pages/details", { song: ourSong });
        });
    })
    .catch((err) => console.log("ouch for details!!"));
}

function Songs(data) {
  this.id = data.id;
  this.title_short = data.title_short ? data.title_short : "No Title Was Found";
  this.previewAudio = data.preview
    ? data.preview
    : "No Audio preview Was Found";
  this.artist_name = data.artist.name
    ? data.artist.name
    : "No Artist Name Was Found";
  this.artist_picture = data.artist.picture_big
    ? data.artist.picture_big
    : "../project-images/no-image.png";
  this.lyrics = "No lyrics found";
}

module.exports = handleDetails;
