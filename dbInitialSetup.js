const db = require("./models");

module.exports = async () => {
  await db.sequelize.sync({ force: true });
  console.log("[Database] ¡Tables create!");
};
