const apiRoutes = require("./apiRoutes");

module.exports = (app) => {
  app.use(apiRoutes);
};
