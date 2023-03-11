const express = require("express");
const routes = express.Router();
const apiController = require("../controllers/apiController");

routes.get("/token", apiController.getToken);

module.exports = routes;
