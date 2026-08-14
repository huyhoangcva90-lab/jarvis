import { useEffect } from "react";

type Message = { id: string; role: "user" | "assistant"; text: string; at: number };

type Props = {
  currentTime: string;
  username: string;
  connections: { gateway: boolean; hermes: boolean; openclaw: boolean; nineRouter: boolean };
  messages: Message[];
  isSending: boolean;
  onAskEv: (prompt: string) => void;
  onExit: () => void;
  onResetView: () => void;
};

function localSubApp(path: string) {
  return new URL(path, window.location.href).toString();
}

export default function SpiderPersonalHub({ onExit }: Props) {
  const target = localSubApp("./spideytracker/index.html");

  useEffect(() => {
    window.location.assign(target);
  }, [target]);

  return (
    <section className="external-mode-launcher" aria-label="Opening original Spidey Tracker">
      <div>
        <span>ORIGINAL SNAPSHOT MODE</span>
        <h1>Spidey Tracker</h1>
        <p>Đang mở snapshot gốc đã claw/crawl về từ SpideyTracker.</p>
        <a href={target}>Mở ngay</a>
        <button type="button" onClick={onExit}>Quay lại J-Core</button>
      </div>
    </section>
  );
}
