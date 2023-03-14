const express = require("express");
const routes = express.Router();
const apiController = require("../controllers/apiController");
const RequestDataController = require("../controllers/requestDataController");

routes.get("/token", apiController.spotifyAccessToken);
routes.get("/search", apiController.getAlbums);

module.exports = routes;
