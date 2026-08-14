import { useEffect } from "react";

type Message = { id: string; role: "user" | "assistant"; text: string; at: number };

type WorldMonitorHubProps = {
  currentTime: string;
  username: string;
  messages: Message[];
  isSending: boolean;
  onAskAi: (prompt: string) => void;
  onExit: () => void;
};

const WORLD_MONITOR_ORIGINAL_URL = "https://www.worldmonitor.app/dashboard?utm_source=welcome&utm_content=hero.";

export default function WorldMonitorHub({ onExit }: WorldMonitorHubProps) {
  useEffect(() => {
    window.location.assign(WORLD_MONITOR_ORIGINAL_URL);
  }, []);

  return (
    <section className="external-mode-launcher" aria-label="Opening original World Monitor">
      <div>
        <span>ORIGINAL WEB MODE</span>
        <h1>World Monitor</h1>
        <p>Đang mở trang gốc World Monitor full-page, không iframe.</p>
        <a href={WORLD_MONITOR_ORIGINAL_URL}>Mở ngay</a>
        <button type="button" onClick={onExit}>Quay lại J-Core</button>
      </div>
    </section>
  );
}
