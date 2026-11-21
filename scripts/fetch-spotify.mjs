// Fetches your top Spotify tracks of the last ~4 weeks and saves them for the Misc section.
// Writes app/data/top-tracks.json and downloads the album covers to public/spotify/,
// so the site never hotlinks Spotify's image CDN.
//
// Run:  node --env-file=.env.local scripts/fetch-spotify.mjs
// Needs SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET and SPOTIFY_REFRESH_TOKEN (see spotify-auth.mjs).
// The monthly GitHub Action (.github/workflows/spotify.yml) runs this and commits the result.
import { mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TRACK_COUNT = 6;
const DATA_FILE = "app/data/top-tracks.json";
const COVER_DIR = "public/spotify";

const { SPOTIFY_CLIENT_ID: clientId, SPOTIFY_CLIENT_SECRET: clientSecret, SPOTIFY_REFRESH_TOKEN: refreshToken } =
  process.env;
if (!clientId || !clientSecret || !refreshToken) {
  console.error("Missing SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET or SPOTIFY_REFRESH_TOKEN.");
  process.exit(1);
}

async function getAccessToken() {
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`Token refresh failed: ${JSON.stringify(body)}`);
  return body.access_token;
}

const token = await getAccessToken();
const res = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=${TRACK_COUNT}`, {
  headers: { Authorization: `Bearer ${token}` },
});
if (!res.ok) throw new Error(`Top tracks request failed: ${res.status} ${await res.text()}`);
const { items } = await res.json();

// Start the cover folder fresh so last month's covers don't pile up.
rmSync(COVER_DIR, { recursive: true, force: true });
mkdirSync(COVER_DIR, { recursive: true });

const tracks = [];
for (const track of items) {
  // Spotify lists covers largest first (640, 300, 64). 300px is plenty for a record sleeve.
  const images = track.album.images;
  const image = images.find((img) => img.width === 300) ?? images[0];
  let cover = null;
  if (image) {
    const imgRes = await fetch(image.url);
    if (imgRes.ok) {
      cover = `/spotify/${track.id}.jpg`;
      writeFileSync(join(COVER_DIR, `${track.id}.jpg`), Buffer.from(await imgRes.arrayBuffer()));
    }
  }
  tracks.push({
    id: track.id,
    name: track.name,
    artists: track.artists.map((artist) => artist.name).join(", "),
    album: track.album.name,
    url: track.external_urls.spotify,
    cover,
  });
}

writeFileSync(DATA_FILE, `${JSON.stringify({ updated: new Date().toISOString().slice(0, 10), tracks }, null, 2)}\n`);
console.log(`Saved ${tracks.length} tracks (${readdirSync(COVER_DIR).length} covers).`);
