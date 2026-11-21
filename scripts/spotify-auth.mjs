// One-time Spotify login: gets a refresh token so fetch-spotify.mjs can read your top tracks.
//
// 1. Create an app at https://developer.spotify.com/dashboard and add this redirect URI:
//      http://127.0.0.1:8888/callback
// 2. Put the app's keys in .env.local (git-ignored):
//      SPOTIFY_CLIENT_ID=...
//      SPOTIFY_CLIENT_SECRET=...
// 3. Run:  node --env-file=.env.local scripts/spotify-auth.mjs
//    Log in in the browser. The refresh token is saved to .env.local as SPOTIFY_REFRESH_TOKEN.
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { appendFileSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { exec } from "node:child_process";

const { SPOTIFY_CLIENT_ID: clientId, SPOTIFY_CLIENT_SECRET: clientSecret } = process.env;
if (!clientId || !clientSecret) {
  console.error("Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local first.");
  process.exit(1);
}

const PORT = 8888;
const redirectUri = `http://127.0.0.1:${PORT}/callback`;
const state = randomBytes(16).toString("hex");
const authUrl =
  "https://accounts.spotify.com/authorize?" +
  new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    scope: "user-top-read",
    redirect_uri: redirectUri,
    state,
  });

function saveToken(token) {
  const file = ".env.local";
  const line = `SPOTIFY_REFRESH_TOKEN=${token}`;
  const current = existsSync(file) ? readFileSync(file, "utf8") : "";
  if (/^SPOTIFY_REFRESH_TOKEN=.*$/m.test(current)) {
    writeFileSync(file, current.replace(/^SPOTIFY_REFRESH_TOKEN=.*$/m, line));
  } else {
    appendFileSync(file, `${current && !current.endsWith("\n") ? "\n" : ""}${line}\n`);
  }
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, redirectUri);
  if (url.pathname !== "/callback") {
    res.writeHead(404).end();
    return;
  }
  const code = url.searchParams.get("code");
  if (url.searchParams.get("state") !== state || !code) {
    res.writeHead(400).end(`Login failed: ${url.searchParams.get("error") ?? "bad state"}`);
    server.close();
    process.exitCode = 1;
    return;
  }

  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "authorization_code", code, redirect_uri: redirectUri }),
  });
  const body = await tokenRes.json();
  if (!tokenRes.ok || !body.refresh_token) {
    res.writeHead(500).end("Token exchange failed, see the terminal.");
    console.error("Token exchange failed:", body);
    server.close();
    process.exitCode = 1;
    return;
  }

  saveToken(body.refresh_token);
  res.writeHead(200, { "Content-Type": "text/plain" }).end("Done! You can close this tab.");
  console.log("Saved SPOTIFY_REFRESH_TOKEN to .env.local.");
  console.log("Add it (and the client ID and secret) as GitHub repo secrets for the monthly refresh.");
  server.close();
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Opening Spotify login. If nothing opens, visit:\n${authUrl}\n`);
  const opener = process.platform === "win32" ? `start "" "${authUrl}"` : process.platform === "darwin" ? `open "${authUrl}"` : `xdg-open "${authUrl}"`;
  exec(opener);
});
