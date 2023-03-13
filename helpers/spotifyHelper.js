const NodeCache = require("node-cache");
const cache = new NodeCache();

class SpotifyHelper {
  constructor() {
    this.cache = new NodeCache();
  }

  async authenticate() {
    let clientId = process.env.SPOTIFY_CLIENT_ID;
    let clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " +
          new Buffer(clientId + ":" + clientSecret).toString("base64"),
      },
      form: {
        grant_type: "client_credentials",
      },
    });

    return {
      accessToken: response.access_token,
      expiresIn: response.expires_in,
    };
  }

  async spotifyAccessToken() {
    const currentToken = this.cache.get("currentSpotifyToken");
    let returnValue = null;

    if (!currentToken) {
      const newToken = await authenticate();
      this.cache.set("currentSpotifyToken", newToken.accessToken);
      this.cache.ttl("currentSpotifyToken", newToken.expiresIn);

      returnValue = newToken.accessToken;
    } else {
      returnValue = currentToken;
    }

    return returnValue;
  }
}
