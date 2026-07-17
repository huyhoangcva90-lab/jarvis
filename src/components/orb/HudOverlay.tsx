import { useEffect, useState } from "react";

export default function HudOverlay() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setTime(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="hud-overlay" aria-label="Jarvis command orb interface">
      <header className="hud-top">
        <div className="hud-chip">
          <span>AI REACTOR</span>
          <b>ONLINE</b>
        </div>
        <div className="hud-time">
          <span>{time.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "2-digit" })}</span>
          <b>{time.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</b>
        </div>
        <div className="hud-chip right">
          <span>MODE</span>
          <b>COMMAND</b>
        </div>
      </header>
      <section className="hud-bottom">
        <div className="prompt-shell">
          <button type="button" aria-label="Voice input">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3v10" />
              <path d="M8 7v5a4 4 0 0 0 8 0V7" />
              <path d="M5 12a7 7 0 0 0 14 0" />
              <path d="M12 19v3" />
            </svg>
          </button>
          <input aria-label="Command input" placeholder="Ask Jarvis..." />
          <button type="button" aria-label="Send command">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m13 6 6 6-6 6" />
            </svg>
          </button>
        </div>
        <p>REACTOR FIELD STABLE · ORBITAL PACKETS STREAMING · VOICE LINK READY</p>
      </section>
    </div>
  );
}
