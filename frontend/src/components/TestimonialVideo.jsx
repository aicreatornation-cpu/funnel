import { useEffect, useRef, useState } from 'react';
import { loadVimeo } from '../vimeo';

// Testimonial card video — a Vimeo video with native controls hidden. It does
// NOT autoplay: it starts paused with a center play button, and plays UNMUTED
// when tapped. Extra controls: mute/unmute and fullscreen.
export default function TestimonialVideo({ videoId }) {
  const containerRef = useRef(null);
  const hostRef = useRef(null);
  const playerRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    let destroyed = false;
    loadVimeo().then((Vimeo) => {
      if (destroyed || !hostRef.current) return;
      const player = new Vimeo.Player(hostRef.current, {
        id: Number(videoId),
        controls: false,   // hide Vimeo's own controls
        autoplay: false,   // wait for the user to press play
        muted: false,
        loop: true,
        autopause: false,
        dnt: true,
        title: false,
        byline: false,
        portrait: false,
        responsive: true,
      });
      playerRef.current = player;
      player.on('play', () => setPlaying(true));
      player.on('pause', () => setPlaying(false));
    });
    return () => {
      destroyed = true;
      try { playerRef.current?.destroy(); } catch { /* ignore */ }
    };
  }, [videoId]);

  // Play always starts UNMUTED (a tap is a user gesture, so sound is allowed).
  const togglePlay = (e) => {
    e.stopPropagation();
    const p = playerRef.current;
    if (!p) return;
    if (playing) {
      p.pause();
    } else {
      p.setMuted(false);
      p.setVolume(1);
      setMuted(false);
      p.play().catch(() => {});
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    const p = playerRef.current;
    if (!p) return;
    const next = !muted;
    p.setMuted(next);
    if (!next) p.setVolume(1);
    setMuted(next);
  };

  const toggleFullscreen = (e) => {
    e.stopPropagation();
    const el = containerRef.current;
    if (document.fullscreenElement) { document.exitFullscreen?.(); return; }
    if (el?.requestFullscreen) el.requestFullscreen().catch(() => playerRef.current?.requestFullscreen?.());
    else if (el?.webkitRequestFullscreen) el.webkitRequestFullscreen();
    else playerRef.current?.requestFullscreen?.();
  };

  return (
    <div className="tc-video" ref={containerRef}>
      <div ref={hostRef} className="tc-video-player" />
      {/* transparent cover so the player can't be tapped directly */}
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

      {/* corner: mute + fullscreen */}
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
    </div>
  );
}
