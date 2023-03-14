const { RequestData } = require("../models");

async function store(req, res, artistName) {
  try {
    const userData = await RequestData.create({
      ip: req.header("x-forwarded-for") || req.connection.remoteAddress,
      date: new Date(Date.now()),
      artistName,
    });
    return userData;
  } catch (error) {
    console.log(error);
    return error.errors[0].message;
  }
}

module.exports = {
  store,
};
