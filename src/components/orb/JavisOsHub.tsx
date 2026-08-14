import { useEffect } from "react";

type Message = { id: string; role: "user" | "assistant"; text: string; at: number };
type NativeDashboards = { hermes: string; openclaw: string; nineRouter: string } | null;

type JavisOsHubProps = {
  currentTime: string;
  username: string;
  messages: Message[];
  isSending: boolean;
  connections: any;
  nativeDashboards: NativeDashboards;
  onAskAi: (prompt: string) => void;
  onExit: () => void;
};

function localSubApp(path: string) {
  return new URL(path, window.location.href).toString();
}

export default function JavisOsHub({ onExit }: JavisOsHubProps) {
  const target = localSubApp("./javis-os/index.html");

  useEffect(() => {
    window.location.assign(target);
  }, [target]);

  return (
    <section className="external-mode-launcher" aria-label="Opening original Javis OS">
      <div>
        <span>ORIGINAL REPO MODE</span>
        <h1>Javis OS</h1>
        <p>Đang mở nguyên dashboard từ external/javis-os/dashboard.</p>
        <a href={target}>Mở ngay</a>
        <button type="button" onClick={onExit}>Quay lại J-Core</button>
      </div>
    </section>
  );
}
