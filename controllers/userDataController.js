const UserData = require("../models/UserData");

async function store(req, res) {
  const userData = await UserData.create({
    // ip: req.
    // date:
    artistName: req.body.artistName,
  });
}
