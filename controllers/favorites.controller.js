"use strict";

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

module.exports = handleFavorites;
