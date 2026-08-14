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

function localSubApp(path: string) {
  return new URL(path, window.location.href).toString();
}

export default function WorldMonitorHub({ onExit }: WorldMonitorHubProps) {
  const target = localSubApp("./worldmonitor/index.html");

  useEffect(() => {
    window.location.assign(target);
  }, [target]);

  return (
    <section className="external-mode-launcher" aria-label="Opening local World Monitor">
      <div>
        <span>LOCAL ORIGIN MODE</span>
        <h1>World Monitor</h1>
        <p>Opening the local World Monitor surface with login, footer, and pro prompts removed.</p>
        <a href={target}>Open now</a>
        <button type="button" onClick={onExit}>Back to J-Core</button>
      </div>
    </section>
  );
}
