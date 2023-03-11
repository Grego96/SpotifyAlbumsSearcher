require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.APP_PORT || 8000;
const dbInitalSetup = require("./dbInitialSetup");

dbInitalSetup();

app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});
