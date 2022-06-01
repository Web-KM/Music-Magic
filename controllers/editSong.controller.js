"use strict";

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

module.exports = editSong;
