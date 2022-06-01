"use strict";

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

module.exports = removeFavorites;
