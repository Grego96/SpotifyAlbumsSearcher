const NodeCache = require("node-cache");
const cache = new NodeCache();
const axios = require("axios");

async function getToken(req, res) {
  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        btoa(
          process.env.SPOTIFY_CLIENT_ID +
            ":" +
            process.env.SPOTIFY_CLIENT_SECRET
        ),
    },
    body: "grant_type=client_credentials",
  });

  const data = await result.json();
  console.log(data);
  res.status(200).json({ token: data.access_token });
}

async function authenticate() {
  let clientId = process.env.SPOTIFY_CLIENT_ID;
  let clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();

  return {
    accessToken: await data.access_token,
    expiresIn: await data.expires_in,
  };
}

async function spotifyAccessToken() {
  const currentToken = cache.get("currentSpotifyToken");

  let returnValue = null;

  if (!currentToken) {
    const newToken = await authenticate();
    cache.set("currentSpotifyToken", newToken.accessToken);
    cache.ttl("currentSpotifyToken", newToken.expiresIn);

    returnValue = newToken.accessToken;
  } else {
    returnValue = currentToken;
  }

  return returnValue;
}

async function getAlbums(req, res) {
  const result = await axios({
    method: "get",
    baseUrl: `https://api.spotify.com/v1/albums/${req.params.id}`,
    headers: {
      Authorization: `Bearer ${await spotifyAccessToken()}`,
    },
  });
  console.log(result);
  // res.status(200).json(result);
}

module.exports = {
  authenticate,
  spotifyAccessToken,
  getToken,
  getAlbums,
};
