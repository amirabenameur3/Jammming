const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

const redirectUri = "http://127.0.0.1:5173/";

const scopes = [
  "playlist-modify-public",
  "playlist-modify-private",
];

function generateRandomString(length) {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const values = crypto.getRandomValues(
    new Uint8Array(length)
  );

  return values.reduce(
    (result, value) =>
      result + possible[value % possible.length],
    ""
  );
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);

  const digest = await crypto.subtle.digest(
    "SHA-256",
    data
  );

  return btoa(
    String.fromCharCode(...new Uint8Array(digest))
  )
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function redirectToSpotifyLogin() {
  const codeVerifier = generateRandomString(64);
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  localStorage.setItem("spotify_code_verifier", codeVerifier);

  const authUrl = new URL("https://accounts.spotify.com/authorize");

  const params = {
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
    code_challenge_method: "S256",
    code_challenge: codeChallenge,
  };

  authUrl.search = new URLSearchParams(params).toString();

  window.location.href = authUrl.toString();
}

async function exchangeCodeForToken() {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (!code) {
    return null;
  }

  window.history.replaceState(
    {},
    document.title,
    window.location.pathname
  );

  const codeVerifier = localStorage.getItem("spotify_code_verifier");

  if (!codeVerifier) {
    throw new Error("Spotify code verifier was not found.");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();

    throw new Error(
      errorData.error_description ||
        "Could not get Spotify access token."
    );
  }

  const tokenData = await response.json();

  localStorage.setItem(
    "spotify_access_token",
    tokenData.access_token
  );

  const expiresAt = Date.now() + tokenData.expires_in * 1000;
  
  localStorage.setItem(
    "spotify_token_expires_at",
    expiresAt.toString()
  );

  if (tokenData.refresh_token) {
    localStorage.setItem(
      "spotify_refresh_token",
      tokenData.refresh_token
    );
  }

  localStorage.removeItem("spotify_code_verifier");

  return tokenData.access_token;
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem(
    "spotify_refresh_token"
  );

  if (!refreshToken) {
    throw new Error("Spotify refresh token not found.");
  }

  const response = await fetch(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        "Content-Type":
          "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();

    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
    localStorage.removeItem("spotify_token_expires_at");

    throw new Error(
      errorData.error_description ||
        "Your Spotify session expired. Please connect again."
    );
  }

  const tokenData = await response.json();

  localStorage.setItem(
    "spotify_access_token",
    tokenData.access_token
  );

  const expiresAt =
    Date.now() + tokenData.expires_in * 1000;

  localStorage.setItem(
    "spotify_token_expires_at",
    expiresAt.toString()
  );

  if (tokenData.refresh_token) {
    localStorage.setItem(
      "spotify_refresh_token",
      tokenData.refresh_token
    );
  }

  return tokenData.access_token;
}

async function getValidAccessToken() {
  const accessToken = localStorage.getItem(
    "spotify_access_token"
  );

  const expiresAt = Number(
    localStorage.getItem("spotify_token_expires_at")
  );

  const refreshBuffer = 60 * 1000;

  const tokenIsValid =
    accessToken &&
    expiresAt &&
    Date.now() < expiresAt - refreshBuffer;

  if (tokenIsValid) {
    return accessToken;
  }

  return refreshAccessToken();
}

async function searchSpotify(searchTerm) {
  const accessToken = await getValidAccessToken();

  const controller = new AbortController();

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 10000);

  try {
    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
            searchTerm
        )}&type=track&limit=10`,
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
        }
    );
    
    if (!response.ok) {
        const errorData = await response.json();
        
        console.error("Spotify search error:", errorData);
        
        throw new Error(
            errorData.error?.message || "Could not search Spotify."
        );
    }
    
    const data = await response.json();
    
    return data.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map((artist) => artist.name).join(", "),
        album: track.album.name,
        uri: track.uri,
        image: track.album.images[1]?.url
            || track.album.images[0]?.url
            || "",
        duration: track.duration_ms,
        spotifyUrl: track.external_urls.spotify,
    }));
  } catch(error) {
    if (error.name === "AbortError") {
        throw new Error(
            "The Spotify search took too long. Please try again."
        );
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

async function getCurrentUser() {
  const accessToken = await getValidAccessToken();

  const response = await fetch("https://api.spotify.com/v1/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorMessage = await response.text();

    throw new Error(
      errorMessage ||
        `Could not get Spotify user. Status: ${response.status}`
    );
  }

  return response.json();
}

async function createPlaylist(playlistName) {
  const accessToken = await getValidAccessToken();

  const response = await fetch(
    "https://api.spotify.com/v1/me/playlists",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: playlistName,
        public: false,
        description: "Created with Jammming",
      }),
    }
  );

  if (!response.ok) {
    const errorMessage = await response.text();

    throw new Error(
      errorMessage ||
        `Could not create Spotify playlist. Status: ${response.status}`
    );
  }

  return response.json();
}

async function addTracksToPlaylist(playlistId, trackUris) {
  const accessToken = await getValidAccessToken();

  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/items`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
        body: JSON.stringify({
        uris: trackUris,
      }),
    }
  );

  if (!response.ok) {
    const errorMessage = await response.text();

    throw new Error(
      errorMessage ||
        `Could not add tracks to playlist. Status: ${response.status}`
    );
  }

  return response.json();
}

export {
  clientId,
  redirectUri,
  scopes,
  generateRandomString,
  generateCodeChallenge,
  redirectToSpotifyLogin,
  exchangeCodeForToken,
  refreshAccessToken,
  getValidAccessToken,
  searchSpotify,
  getCurrentUser,
  createPlaylist,
  addTracksToPlaylist,
};