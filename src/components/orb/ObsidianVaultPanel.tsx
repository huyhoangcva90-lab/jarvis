import { useEffect, useState } from "react";
import { gatewayFetch } from "../../utils/gatewayClient.js";
import ObsidianMindmap from "./ObsidianMindmap";
import Icon from "./Icon";

type ObsidianVaultPanelProps = {
  data: any;
};

export default function ObsidianVaultPanel({ data }: ObsidianVaultPanelProps) {
  const [notes, setNotes] = useState<Array<{ path: string; content: string }>>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setState("loading");
    setError("");
    gatewayFetch(data, "/api/obsidian/notes", { method: "GET", timeoutMs: 15000 })
      .then((payload: any) => {
        if (!active) return;
        setNotes(Array.isArray(payload.notes) ? payload.notes : []);
        setState("ready");
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError instanceof Error ? requestError.message : "Không đọc được Obsidian vault.");
        setState("error");
      });
    return () => { active = false; };
  }, [data, reloadKey]);

  if (state === "error") {
    return (
      <section className="obsidian-vault-state" role="tabpanel" aria-label="Obsidian Vault">
        <Icon name="document" />
        <b>OBSIDIAN VAULT CHƯA KẾT NỐI</b>
        <p>{error}</p>
        <small>Đặt JCORE_OBSIDIAN_ROOT trên Ubuntu tới thư mục vault, sau đó khởi động lại Gateway.</small>
        <button type="button" onClick={() => setReloadKey((value) => value + 1)}>Thử lại</button>
      </section>
    );
  }

  if (state === "loading") {
    return <section className="obsidian-vault-state loading" role="status"><Icon name="document" /><b>Đang lập chỉ mục vault…</b></section>;
  }

  if (!notes.length) {
    return <section className="obsidian-vault-state" role="status"><Icon name="document" /><b>Vault chưa có ghi chú Markdown.</b></section>;
  }

  return <ObsidianMindmap notes={notes} />;
}
