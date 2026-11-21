import type { CSSProperties } from "react";
import RetroWindow from "../../components/retro/RetroWindow";
import { BackToTop, Divider } from "../../components/retro/Badges";
import topTracks from "../../data/top-tracks.json";

interface Track {
  id: string;
  name: string;
  artists: string;
  album: string;
  url: string;
  cover: string | null;
}

// Refreshed monthly by .github/workflows/spotify.yml (scripts/fetch-spotify.mjs).
const { updated, tracks } = topTracks as { updated: string | null; tracks: Track[] };
const [nowSpinning, ...crate] = tracks;

function Cover({ track }: { track: Track }) {
  return track.cover ? <img src={track.cover} alt="" width={300} height={300} loading="lazy" /> : null;
}

// #1 plays on a wooden hi-fi console: turntable on the left, brass nameplate, VU meter and speed buttons on the right.
function Deck({ track }: { track: Track }) {
  return (
    <div className="console">
      <div className="console__deck" aria-hidden="true">
        <span className="turntable__platter">
          <span className="vinyl vinyl--spinning">
            <Cover track={track} />
          </span>
        </span>
        <span className="turntable__arm">
          <span className="turntable__wand" />
        </span>
      </div>

      <div className="console__panel">
        <div className="console__plate">
          <p className="console__kicker">now spinning · #1</p>
          <p className="console__title">{track.name}</p>
          <p className="console__artist">
            {track.artists} · <cite>{track.album}</cite>
          </p>
        </div>

        <div className="console__controls" aria-hidden="true">
          <span className="vu">
            <span className="vu__needle" />
          </span>
          <span className="console__speed">
            <span className="is-on">33</span>
            <span>45</span>
          </span>
          <span className="console__led" />
        </div>

        <a href={track.url} className="btn btn--primary" target="_blank" rel="noopener noreferrer">
          ▶ Play on Spotify
        </a>
      </div>
    </div>
  );
}

export default function MiscPage() {
  return (
    <section id="misc" className="scroll-section section" aria-labelledby="misc-title">
      <h2 id="misc-title" className="section-title">
        <span aria-hidden="true">✦ </span>Miscellaneous<span aria-hidden="true"> ✦</span>
      </h2>
      <Divider kind="stars" />

      <RetroWindow title="on_repeat.m3u" icon="♫">
        <h3 className="crate__heading">~ on repeat this month ~</h3>

        {nowSpinning ? (
          <>
            <Deck track={nowSpinning} />

            {crate.length > 0 && (
              <ol className="crate" start={2}>
                {crate.map((track, index) => (
                  <li key={track.id} className="record" style={{ "--i": index } as CSSProperties}>
                    <a
                      href={track.url}
                      className="record__link"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${track.name} by ${track.artists}, number ${index + 2}, open on Spotify`}
                    >
                      <span className="record__art" aria-hidden="true">
                        <span className="record__slot">
                          <span className="vinyl">
                            <Cover track={track} />
                          </span>
                        </span>
                        <span className="record__sleeve">
                          <Cover track={track} />
                          <span className="record__rank">#{index + 2}</span>
                        </span>
                      </span>
                      <span className="record__title">{track.name}</span>
                      <span className="record__artist">{track.artists}</span>
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </>
        ) : (
          <p className="crate__empty">The needle&apos;s not down yet. Records coming soon!</p>
        )}

        {updated && (
          <p className="crate__meta">
            my Spotify top tracks, last 4 weeks · updated {updated}
          </p>
        )}
      </RetroWindow>
      <BackToTop />
    </section>
  );
}
