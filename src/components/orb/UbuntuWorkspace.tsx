import { useCallback, useEffect, useMemo, useState } from "react";
import { gatewayFetch } from "../../utils/gatewayClient.js";
import Icon from "./Icon";

type WorkspaceRoot = {
  id: string;
  label: string;
  available: boolean;
  writable: boolean;
};

type WorkspaceEntry = {
  name: string;
  path: string;
  type: "directory" | "file";
  size: number | null;
  modifiedAt: string;
};

type UbuntuWorkspaceProps = {
  data: any;
};

function parentPath(path: string) {
  const parts = path.split("/").filter(Boolean);
  parts.pop();
  return parts.join("/");
}

function formatBytes(value: number | null) {
  if (value === null) return "DIR";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

export default function UbuntuWorkspace({ data }: UbuntuWorkspaceProps) {
  const [roots, setRoots] = useState<WorkspaceRoot[]>([]);
  const [rootId, setRootId] = useState("workspace");
  const [path, setPath] = useState("");
  const [entries, setEntries] = useState<WorkspaceEntry[]>([]);
  const [selectedFile, setSelectedFile] = useState<{ path: string; content: string; size: number } | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");

  const loadDirectory = useCallback(async (nextRootId: string, nextPath: string) => {
    setState("loading");
    setError("");
    try {
      const payload: any = await gatewayFetch(
        data,
        `/api/workspace/tree?root=${encodeURIComponent(nextRootId)}&path=${encodeURIComponent(nextPath)}`,
        { method: "GET", timeoutMs: 10000 },
      );
      setRootId(nextRootId);
      setPath(String(payload.path || ""));
      setEntries(Array.isArray(payload.entries) ? payload.entries : []);
      setSelectedFile(null);
      setState("ready");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không đọc được thư mục từ Ubuntu.");
      setState("error");
    }
  }, [data]);

  useEffect(() => {
    let active = true;
    gatewayFetch(data, "/api/workspace/roots", { method: "GET", timeoutMs: 10000 })
      .then((payload: any) => {
        if (!active) return;
        const nextRoots = Array.isArray(payload.roots) ? payload.roots : [];
        setRoots(nextRoots);
        const initialRoot = nextRoots.find((root: WorkspaceRoot) => root.id === "workspace" && root.available)?.id
          || nextRoots.find((root: WorkspaceRoot) => root.available)?.id;
        if (!initialRoot) throw new Error("Chưa có workspace root khả dụng trên Gateway.");
        return loadDirectory(initialRoot, "");
      })
      .catch((requestError) => {
        if (!active) return;
        setError(requestError instanceof Error ? requestError.message : "Không tải được danh sách workspace.");
        setState("error");
      });
    return () => { active = false; };
  }, [data, loadDirectory]);

  const openEntry = async (entry: WorkspaceEntry) => {
    if (entry.type === "directory") {
      await loadDirectory(rootId, entry.path);
      return;
    }
    setState("loading");
    setError("");
    try {
      const payload: any = await gatewayFetch(
        data,
        `/api/workspace/file?root=${encodeURIComponent(rootId)}&path=${encodeURIComponent(entry.path)}`,
        { method: "GET", timeoutMs: 10000 },
      );
      setSelectedFile({ path: payload.path, content: payload.content, size: payload.size });
      setState("ready");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không đọc được file.");
      setState("error");
    }
  };

  const availableRoots = useMemo(() => roots.filter((root) => root.available), [roots]);

  return (
    <section className="ubuntu-workspace" role="tabpanel" aria-label="Ubuntu Files">
      <header className="workspace-toolbar">
        <div>
          <Icon name="document" />
          <span><b>UBUNTU FILES</b><small>READ-ONLY BROKER</small></span>
        </div>
        <label>
          <span>Root</span>
          <select
            value={rootId}
            onChange={(event) => void loadDirectory(event.target.value, "")}
            disabled={state === "loading"}
          >
            {availableRoots.map((root) => <option key={root.id} value={root.id}>{root.label}</option>)}
          </select>
        </label>
      </header>

      <div className="workspace-pathbar">
        <button
          type="button"
          aria-label="Lên thư mục cha"
          disabled={!path || state === "loading"}
          onClick={() => void loadDirectory(rootId, parentPath(path))}
        >
          ← LÊN
        </button>
        <code>{rootId}:/{path}</code>
        <button type="button" disabled={state === "loading"} onClick={() => void loadDirectory(rootId, path)}>
          {state === "loading" ? "ĐANG TẢI" : "LÀM MỚI"}
        </button>
      </div>

      {error && (
        <div className="workspace-feedback error" role="alert">
          <b>Không truy cập được dữ liệu</b>
          <span>{error}</span>
          <button type="button" onClick={() => void loadDirectory(rootId, path)}>Thử lại</button>
        </div>
      )}

      {!error && (
        <div className="workspace-browser">
          <nav className="workspace-entry-list" aria-label={`Nội dung ${rootId}:/${path}`}>
            {entries.length === 0 && state !== "loading" && <p>Thư mục trống.</p>}
            {entries.map((entry) => (
              <button type="button" key={entry.path} onClick={() => void openEntry(entry)}>
                <span className={`workspace-entry-icon ${entry.type}`} aria-hidden="true">{entry.type === "directory" ? "▱" : "·"}</span>
                <span><b>{entry.name}</b><small>{formatBytes(entry.size)}</small></span>
              </button>
            ))}
          </nav>
          <article className="workspace-file-viewer" aria-live="polite">
            {selectedFile ? (
              <>
                <header><span>FILE VIEWER</span><b>{selectedFile.path}</b><small>{formatBytes(selectedFile.size)}</small></header>
                <pre><code>{selectedFile.content}</code></pre>
              </>
            ) : (
              <div className="workspace-empty-viewer">
                <Icon name="document" />
                <b>{state === "loading" ? "Đang đồng bộ Ubuntu…" : "Chọn một file văn bản để đọc"}</b>
                <span>Gateway không cấp quyền ghi, xóa hoặc chạy file từ màn này.</span>
              </div>
            )}
          </article>
        </div>
      )}
    </section>
  );
}
