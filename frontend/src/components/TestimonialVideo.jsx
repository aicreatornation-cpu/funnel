import { useEffect, useRef, useState } from 'react';
import { loadVimeo } from '../vimeo';

// Testimonial card video. For fast page loads the heavy Vimeo iframe is NOT
// created up front — each card shows a lightweight thumbnail until the user
// presses play (on the centered card). Only the centered card plays; moving
// away pauses it. Plays UNMUTED. Controls: play/pause, mute, fullscreen.
export default function TestimonialVideo({ videoId, active, wantPlay, onPlayToggle }) {
  const containerRef = useRef(null);
  const hostRef = useRef(null);
  const playerRef = useRef(null);
  const [mounted, setMounted] = useState(false); // has the iframe been created?
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  // Create the player only once this card is active and the user wants playback.
  useEffect(() => { if (active && wantPlay) setMounted(true); }, [active, wantPlay]);

  useEffect(() => {
    if (!mounted) return;
    let destroyed = false;
    loadVimeo().then((Vimeo) => {
      if (destroyed || !hostRef.current) return;
      const player = new Vimeo.Player(hostRef.current, {
        id: Number(videoId),
        controls: false, autoplay: false, muted: false, loop: true,
        autopause: false, dnt: true, title: false, byline: false, portrait: false, responsive: true,
      });
      playerRef.current = player;
      player.on('play', () => setPlaying(true));
      player.on('pause', () => setPlaying(false));
      player.ready().then(() => { if (!destroyed) setReady(true); });
    });
    return () => {
      destroyed = true;
      try { playerRef.current?.destroy(); } catch { /* ignore */ }
    };
  }, [mounted, videoId]);

  // Play only when centered AND wanted; otherwise pause (one video at a time).
  useEffect(() => {
    const p = playerRef.current;
    if (!p || !ready) return;
    if (active && wantPlay) {
      p.setMuted(muted);
      p.play().catch(() => { p.setMuted(true); setMuted(true); p.play().catch(() => {}); });
    } else {
      p.pause().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, wantPlay, ready]);

  const togglePlay = (e) => {
    if (!active) return; // let the click bubble up to center this card
    e.stopPropagation();
    onPlayToggle(!wantPlay);
  };

  const toggleMute = (e) => {
    if (!active) return;
    e.stopPropagation();
    const p = playerRef.current;
    const nextMuted = !muted;
    setMuted(nextMuted);
    if (p) { p.setMuted(nextMuted); if (!nextMuted) p.setVolume(1); }
  };

  const toggleFullscreen = (e) => {
    if (!active) return;
    e.stopPropagation();
    const el = containerRef.current;
    if (document.fullscreenElement) { document.exitFullscreen?.(); return; }
    if (el?.requestFullscreen) el.requestFullscreen().catch(() => playerRef.current?.requestFullscreen?.());
    else if (el?.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else playerRef.current?.requestFullscreen?.();
  };

  return (
    <div className="tc-video" ref={containerRef}>
      {/* lightweight thumbnail until the player is created */}
      {!mounted && (
        <img
          className="tc-poster"
          src={`https://vumbnail.com/${videoId}.jpg`}
          alt=""
          loading="lazy"
          decoding="async"
          onError={(e) => { e.currentTarget.style.display = 'none'; }}
        />
      )}
      {mounted && <div ref={hostRef} className="tc-video-player" />}
      <div className="tc-video-cover" />

      {/* center play/pause — prominent when paused, fades while playing */}
      <button
        className={`tc-play-btn${playing ? ' playing' : ''}`}
        type="button"
        onClick={togglePlay}
        aria-label={playing ? 'Pause' : 'Play'}
      >
        {playing ? (
          <svg viewBox="0 0 20 20" fill="currentColor"><rect x="5" y="4" width="3.5" height="12" rx="1" /><rect x="11.5" y="4" width="3.5" height="12" rx="1" /></svg>
        ) : (
          <svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 4l12 6-12 6V4z" /></svg>
        )}
      </button>

      {/* mute + fullscreen appear once the video is in use */}
      {mounted && (
        <div className="tc-ctrls">
          <button className="tc-ctrl" type="button" onClick={toggleMute} aria-label={muted ? 'Unmute' : 'Mute'}>
            {muted ? (
              <svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4V5z" /><path d="M16 9l5 6M21 9l-5 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            ) : (
              <svg viewBox="0 0 24 24"><path d="M11 5 6 9H3v6h3l5 4V5z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8 8 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            )}
          </button>
          <button className="tc-ctrl" type="button" onClick={toggleFullscreen} aria-label="Fullscreen">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H4v4M16 3h4v4M16 21h4v-4M8 21H4v-4" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
