import { useMemo, useState } from "react";
import Icon from "./Icon";

type LocalHandle = any;

type LocalEntry = {
  name: string;
  kind: "directory" | "file";
  handle: LocalHandle;
  size: number | null;
};

type OpenFile = {
  name: string;
  path: string;
  handle: LocalHandle;
  content: string;
  originalContent: string;
  size: number;
};

function formatBytes(value: number | null) {
  if (value === null) return "DIR";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

function isTextFile(name: string, type: string) {
  if (type.startsWith("text/")) return true;
  return /\.(?:txt|md|mdx|json|jsonc|ya?ml|toml|ini|conf|env|log|csv|tsv|js|jsx|mjs|cjs|ts|tsx|css|scss|html|xml|svg|py|sh|bash|zsh|fish|ps1|go|rs|java|c|h|cpp|hpp|sql|graphql|dockerfile)$/i.test(name);
}

export default function UbuntuWorkspace() {
  const [rootHandle, setRootHandle] = useState<LocalHandle | null>(null);
  const [stack, setStack] = useState<Array<{ name: string; handle: LocalHandle }>>([]);
  const [entries, setEntries] = useState<LocalEntry[]>([]);
  const [selectedFile, setSelectedFile] = useState<OpenFile | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const path = useMemo(() => stack.map((item) => item.name).join(" / "), [stack]);
  const dirty = Boolean(selectedFile && selectedFile.content !== selectedFile.originalContent);
  const pickerSupported = typeof window !== "undefined" && "showDirectoryPicker" in window;

  const loadDirectory = async (handle: LocalHandle, nextStack: Array<{ name: string; handle: LocalHandle }>) => {
    setState("loading");
    setError("");
    try {
      const nextEntries: LocalEntry[] = [];
      for await (const [, entryHandle] of handle.entries()) {
        let size: number | null = null;
        if (entryHandle.kind === "file") {
          try { size = (await entryHandle.getFile()).size; } catch { size = 0; }
        }
        nextEntries.push({ name: entryHandle.name, kind: entryHandle.kind, handle: entryHandle, size });
      }
      nextEntries.sort((a, b) => a.kind === b.kind ? a.name.localeCompare(b.name) : a.kind === "directory" ? -1 : 1);
      setEntries(nextEntries);
      setStack(nextStack);
      setSelectedFile(null);
      setState("ready");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không thể đọc thư mục local.");
      setState("error");
    }
  };

  const mountFolder = async () => {
    if (!pickerSupported) {
      setError("Trình duyệt này chưa hỗ trợ mở thư mục trực tiếp. Hãy dùng Chrome hoặc Edge bản mới.");
      setState("error");
      return;
    }
    try {
      const handle = await (window as any).showDirectoryPicker({ mode: "readwrite" });
      setRootHandle(handle);
      await loadDirectory(handle, [{ name: handle.name, handle }]);
    } catch (requestError: any) {
      if (requestError?.name === "AbortError") return;
      setError(requestError instanceof Error ? requestError.message : "Không thể cấp quyền thư mục.");
      setState("error");
    }
  };

  const openEntry = async (entry: LocalEntry) => {
    if (entry.kind === "directory") {
      await loadDirectory(entry.handle, [...stack, { name: entry.name, handle: entry.handle }]);
      return;
    }
    setState("loading");
    setError("");
    try {
      const file = await entry.handle.getFile();
      if (file.size > 4 * 1024 * 1024) throw new Error("File lớn hơn 4 MB; trình chỉnh sửa local chỉ mở file văn bản nhỏ.");
      if (!isTextFile(file.name, file.type)) throw new Error("Đây không phải file văn bản có thể chỉnh sửa an toàn trong trình duyệt.");
      const content = await file.text();
      setSelectedFile({ name: file.name, path: `${path} / ${file.name}`, handle: entry.handle, content, originalContent: content, size: file.size });
      setState("ready");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không thể đọc file.");
      setState("error");
    }
  };

  const saveSelectedFile = async () => {
    if (!selectedFile || !dirty || saving) return;
    setSaving(true);
    setError("");
    try {
      const writable = await selectedFile.handle.createWritable();
      await writable.write(selectedFile.content);
      await writable.close();
      const file = await selectedFile.handle.getFile();
      setSelectedFile((current) => current ? { ...current, originalContent: current.content, size: file.size } : current);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Không thể lưu file local.");
    } finally {
      setSaving(false);
    }
  };

  const goUp = async () => {
    if (stack.length <= 1) return;
    const nextStack = stack.slice(0, -1);
    await loadDirectory(nextStack[nextStack.length - 1].handle, nextStack);
  };

  const disconnect = () => {
    setRootHandle(null);
    setStack([]);
    setEntries([]);
    setSelectedFile(null);
    setError("");
    setState("idle");
  };

  if (!rootHandle) {
    return (
      <section className="ubuntu-workspace ubuntu-local-onboarding" role="tabpanel" aria-label="Ubuntu local files">
        <div className="ubuntu-local-hero">
          <span className="local-kicker"><i /> LOCAL DIRECT / NO API</span>
          <Icon name="external" />
          <h2>Kết nối Ubuntu local</h2>
          <p>Mở thẳng một thư mục WSL trên máy này. J-Core chỉ đọc hoặc ghi sau khi bạn chủ động cấp quyền; dữ liệu không đi qua Gateway và không được tải lên.</p>
          <button type="button" onClick={() => void mountFolder()}>CHỌN THƯ MỤC UBUNTU</button>
          {!pickerSupported && <small>Yêu cầu Chrome hoặc Edge bản mới.</small>}
        </div>
        <ol className="ubuntu-local-steps">
          <li><b>01</b><span>Đăng nhập J-Core</span></li>
          <li><b>02</b><span>Chọn <code>\\wsl.localhost\Ubuntu\home\...</code></span></li>
          <li><b>03</b><span>Chỉnh sửa tại chỗ, không API</span></li>
        </ol>
      </section>
    );
  }

  return (
    <section className="ubuntu-workspace" role="tabpanel" aria-label="Ubuntu local files">
      <header className="workspace-toolbar">
        <div><Icon name="document" /><span><b>UBUNTU LOCAL</b><small>DIRECT FILE ACCESS · NO API</small></span></div>
        <div className="workspace-local-actions"><span><i /> PHIÊN LOCAL</span><button type="button" onClick={disconnect}>NGẮT THƯ MỤC</button></div>
      </header>

      <div className="workspace-pathbar">
        <button type="button" disabled={stack.length <= 1 || state === "loading"} onClick={() => void goUp()}>← LÊN</button>
        <code>{path}</code>
        <button type="button" disabled={state === "loading"} onClick={() => void loadDirectory(stack[stack.length - 1].handle, stack)}>{state === "loading" ? "ĐANG TẢI" : "LÀM MỚI"}</button>
      </div>

      {error && <div className="workspace-feedback error" role="alert"><b>Không thể hoàn tất</b><span>{error}</span><button type="button" onClick={() => setError("")}>ĐÓNG</button></div>}

      <div className="workspace-browser">
        <nav className="workspace-entry-list" aria-label={`Nội dung ${path}`}>
          {entries.length === 0 && state !== "loading" && <p>Thư mục trống.</p>}
          {entries.map((entry) => (
            <button type="button" key={`${entry.kind}-${entry.name}`} onClick={() => void openEntry(entry)}>
              <span className={`workspace-entry-icon ${entry.kind}`} aria-hidden="true">{entry.kind === "directory" ? "◇" : "·"}</span>
              <span><b>{entry.name}</b><small>{formatBytes(entry.size)}</small></span>
            </button>
          ))}
        </nav>
        <article className="workspace-file-viewer" aria-live="polite">
          {selectedFile ? (
            <><header><span>LOCAL EDITOR</span><b>{selectedFile.path}</b><small>{dirty ? "CHƯA LƯU" : formatBytes(selectedFile.size)}</small><button type="button" disabled={!dirty || saving} onClick={() => void saveSelectedFile()}>{saving ? "ĐANG LƯU" : "LƯU FILE"}</button></header><textarea className="workspace-code-editor" value={selectedFile.content} spellCheck={false} onChange={(event) => setSelectedFile((current) => current ? { ...current, content: event.target.value } : current)} /></>
          ) : (
            <div className="workspace-empty-viewer"><Icon name="document" /><b>Chọn file văn bản để đọc hoặc sửa</b><span>Quyền nằm trong phiên trình duyệt hiện tại. J-Core không giữ đường dẫn hay tải nội dung lên máy chủ.</span></div>
          )}
        </article>
      </div>
    </section>
  );
}
