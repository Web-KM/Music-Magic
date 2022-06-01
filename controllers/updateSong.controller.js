"use strict";

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
module.exports = updateSong;
