async function getToken(req, res) {
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        btoa(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET),
    },
    body: "grant_type=client_credentials",
  });

  const data = await result.json();
  res.status(200).json({ token: data.access_token });
}

module.exports = {
  getToken,
};
