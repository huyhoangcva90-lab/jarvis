import { useMemo } from "react";
import javisHtml from "../../../external/javis-os/dashboard/index.html?raw";
import javisStyle from "../../../external/javis-os/dashboard/style.css?raw";
import javisConsoleStyle from "../../../external/javis-os/dashboard/console.css?raw";

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

function extractBody(html: string) {
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] || html;
  return body
    .replaceAll("/brand-logo", new URL("../../../external/javis-os/dashboard/logo.png", import.meta.url).href)
    .replaceAll("/static/", "./javis-static/")
    .replace(/<script[\s\S]*?<\/script>/gi, "");
}

export default function JavisOsHub({ currentTime, username, messages, isSending, onExit }: JavisOsHubProps) {
  const body = useMemo(() => extractBody(javisHtml), []);

  return (
    <section className="javis-original-shell" aria-label="Javis OS original dashboard clone">
      <style>{javisStyle}</style>
      <style>{javisConsoleStyle}</style>
      <div className="javis-original-runtime" dangerouslySetInnerHTML={{ __html: body }} />
      <div className="javis-original-jcore-rail">
        <button type="button" onClick={onExit}>EXIT J-CORE</button>
        <span>NO IFRAME · external/javis-os/dashboard</span>
        <small>{username} · {currentTime} · {messages.length} msgs · {isSending ? "THINKING" : "READY"}</small>
      </div>
    </section>
  );
}
