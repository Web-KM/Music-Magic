"use strict";

function showFavorites(req, res) {
  const SQL = "SELECT * FROM songslist";
  client
    .query(SQL)
    .then((results) => {
      res.render("./pages/favorites", { favResults: results.rows });
    })
    .catch((error) => errorHandler(error, req, res));
}

module.exports = showFavorites;
