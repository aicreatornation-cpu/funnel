import { useEffect, useRef, useState } from 'react';
import { loadYouTubeApi } from '../youtube';

const VIDEO_ID = 'VFl6F1H8hPs';

// Autoplaying (muted) YouTube Short driven by the IFrame API so there are no
// native controls or playlist skip buttons. Looping is handled in code (no
// `playlist` param), and a transparent cover blocks taps so controls never show.
// The only interaction is the custom mute/unmute button.
export default function HeroVideo() {
  const hostRef = useRef(null);
  const playerRef = useRef(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    let destroyed = false;
    loadYouTubeApi().then((YT) => {
      if (destroyed || !hostRef.current) return;
      playerRef.current = new YT.Player(hostRef.current, {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          playsinline: 1,
          rel: 0,
          modestbranding: 1,
          iv_load_policy: 3,
          fs: 0,
          disablekb: 1,
        },
        events: {
          onReady: (e) => { e.target.mute(); e.target.playVideo(); },
          onStateChange: (e) => {
            // loop without a playlist (which would add skip buttons)
            if (e.data === YT.PlayerState.ENDED) { e.target.seekTo(0); e.target.playVideo(); }
          },
        },
      });
    });
    return () => {
      destroyed = true;
      try { playerRef.current?.destroy(); } catch { /* ignore */ }
    };
  }, []);

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    if (muted) { p.unMute(); p.setVolume(100); p.playVideo(); }
    else { p.mute(); }
    setMuted((m) => !m);
  };

  return (
    <div className="hero-video">
      <div ref={hostRef} className="hero-video-player" />
      {/* transparent cover absorbs taps so the player never shows its controls */}
      <div className="hero-video-cover" />
      <button className="hv-mute" type="button" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
        {muted ? (
          <svg viewBox="0 0 24 24">
            <path d="M11 5 6 9H3v6h3l5 4V5z" />
            <path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24">
            <path d="M11 5 6 9H3v6h3l5 4V5z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8 8 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </div>
  );
}
