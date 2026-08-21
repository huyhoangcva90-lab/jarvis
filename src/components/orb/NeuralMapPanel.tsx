import React, { useCallback, useEffect, useMemo, useState } from "react";
import { gatewayFetch } from "../../utils/gatewayClient.js";
import { buildObsidianGraph } from "../../utils/obsidianParser";
import ObsidianMindmap from "./ObsidianMindmap";

type NeuralMapPanelProps = {
  data: any;
};

type VaultNote = {
  path: string;
  content: string;
  modifiedAt?: string;
};

type VaultPayload = {
  root?: { label?: string; path?: string } | null;
  notes?: VaultNote[];
  totalBytes?: number;
  truncated?: boolean;
  readOnly?: boolean;
};

export default function NeuralMapPanel({ data }: NeuralMapPanelProps) {
  const [payload, setPayload] = useState<VaultPayload | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "empty" | "error">("loading");
  const [error, setError] = useState("");
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setState("loading");
    setError("");
    try {
      const result = await gatewayFetch(data, "/api/obsidian/notes", { method: "GET", timeoutMs: 10000 }) as VaultPayload;
      const notes = Array.isArray(result?.notes) ? result.notes : [];
      setPayload({ ...result, notes });
      setSelectedPath((current) => current && notes.some((note) => note.path === current) ? current : null);
      setState(notes.length ? "ready" : "empty");
    } catch (reason: any) {
      setPayload(null);
      setState("error");
      setError(reason?.message || "Không đọc được Obsidian vault từ workstation.");
    }
  }, [data]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const notes = payload?.notes || [];
  const graph = useMemo(() => buildObsidianGraph(notes), [notes]);
  const selectedNote = useMemo(
    () => notes.find((note) => note.path === selectedPath) || null,
    [notes, selectedPath],
  );

  const sourceLabel = payload?.root?.label || "OBSIDIAN VAULT";

  return (
    <section className="neural-map-shell" aria-label="Đồ thị tri thức JARVIS">
      <header className="neural-map-commandbar">
        <div>
          <small>JARVIS KNOWLEDGE SYSTEM</small>
          <strong>NEURAL MAP</strong>
          <span>{sourceLabel}</span>
        </div>
        <div className="neural-map-source-state" data-state={state}>
          <i />
          <span>{state === "loading" ? "ĐANG QUÉT" : state === "ready" ? "VAULT TRỰC TUYẾN" : state === "empty" ? "VAULT TRỐNG" : "CHƯA KẾT NỐI"}</span>
          <button type="button" onClick={() => void refresh()} disabled={state === "loading"}>QUÉT LẠI</button>
        </div>
      </header>

      {state === "loading" && (
        <div className="neural-map-state-card is-loading">
          <span className="neural-map-loader" />
          <b>Đang dựng mạng tri thức…</b>
          <p>JARVIS đang đọc Markdown và phân tích wikilink trên workstation.</p>
        </div>
      )}

      {state === "error" && (
        <div className="neural-map-state-card is-error">
          <span>!</span>
          <b>Chưa có nguồn tri thức thật</b>
          <p>{error}</p>
          <small>Thiết lập biến server JCORE_OBSIDIAN_ROOT để kết nối một vault Markdown. Không có dữ liệu mẫu được hiển thị thay thế.</small>
        </div>
      )}

      {state === "empty" && (
        <div className="neural-map-state-card">
          <span>0</span>
          <b>Vault đã kết nối nhưng chưa có ghi chú</b>
          <p>Thêm file Markdown vào vault; mỗi file sẽ trở thành một node và mỗi [[wikilink]] sẽ thành một liên kết.</p>
        </div>
      )}

      {state === "ready" && (
        <div className="neural-map-stage">
          <ObsidianMindmap notes={notes} onSelectNote={setSelectedPath} />
          {selectedNote && (
            <article className="neural-note-peek" aria-label={`Nội dung ${selectedNote.path}`}>
              <header>
                <div><small>LIVE NOTE</small><b>{selectedNote.path}</b></div>
                <button type="button" onClick={() => setSelectedPath(null)} aria-label="Đóng nội dung ghi chú">×</button>
              </header>
              <pre>{selectedNote.content}</pre>
              <footer>{selectedNote.modifiedAt ? `Cập nhật ${new Date(selectedNote.modifiedAt).toLocaleString("vi-VN")}` : "Nguồn Markdown trên workstation"}</footer>
            </article>
          )}
        </div>
      )}

      <footer className="neural-map-capability-strip">
        <span><i /> NOTES <b>{notes.length}</b></span>
        <span><i /> LINKS <b>{state === "ready" ? graph.edges.length : "—"}</b></span>
        <span><i /> SOURCE <b>{payload?.truncated ? "PARTIAL" : state === "ready" ? "SYNCED" : "—"}</b></span>
        <span><i /> MODE <b>{payload?.readOnly === false ? "READ / WRITE" : "READ ONLY"}</b></span>
      </footer>
    </section>
  );
}
