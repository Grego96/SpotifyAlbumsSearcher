const express = require("express");
const routes = express.Router();
const apiController = require("../controllers/apiController");

routes.get("/token", apiController.spotifyAccessToken);
routes.get("/album/:id", apiController.getAlbums);

module.exports = routes;
