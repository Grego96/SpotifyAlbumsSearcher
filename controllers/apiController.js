const NodeCache = require("node-cache");
const cache = new NodeCache();
const storeRequestData = require("./requestDataController");

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
  try {
    const token = await spotifyAccessToken();
    const artistResponse = await fetch(
      `https://api.spotify.com/v1/search?query=${req.query.artistName}&type=artist&market=us&limit=50&offset=0`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const artistData = await artistResponse.json();
    storeRequestData.store(req, res, artistData.artists.items[0].name);
    if (artistData.artists.items.length === 0) {
      res.status(404).json({ message: "No artist found" });
    } else {
      const response = await fetch(
        `https://api.spotify.com/v1/artists/${artistData.artists.items[0].id}/albums`,
        {
          method: "get",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            artist: "eminem",
          },
        }
      );
      const data = await response.json();

      res.status(200).json(data);
    }
  } catch (error) {
    res.status(400).json(error);
  }
}

module.exports = {
  authenticate,
  spotifyAccessToken,
  getToken,
  getAlbums,
};
