import { useCallback, useEffect, useState } from "react";
import { gatewayFetch } from "../../utils/gatewayClient.js";

type ServiceId = "hermes" | "openclaw" | "9router" | "claude";

export default function AppConfigEditor({ data, service }: { data: any; service: ServiceId }) {
  const [state, setState] = useState<"loading" | "ready" | "saving" | "error">("loading");
  const [content, setContent] = useState("");
  const [original, setOriginal] = useState("");
  const [modifiedAt, setModifiedAt] = useState("");
  const [fileName, setFileName] = useState("");
  const [format, setFormat] = useState("");
  const [writable, setWritable] = useState(false);
  const [message, setMessage] = useState("");
  const [requiredEnv, setRequiredEnv] = useState("");

  const load = useCallback(async () => {
    setState("loading");
    setMessage("");
    try {
      const result: any = await gatewayFetch(data, `/api/apps/config?service=${encodeURIComponent(service)}`);
      setContent(result.content || "");
      setOriginal(result.content || "");
      setModifiedAt(result.modifiedAt || "");
      setFileName(result.fileName || "config");
      setFormat(result.format || "text");
      setWritable(result.writable !== false);
      setRequiredEnv("");
      setState("ready");
    } catch (error: any) {
      setRequiredEnv(error?.details?.requiredEnv || "");
      setMessage(error?.message || "Không thể đọc cấu hình app.");
      setState("error");
    }
  }, [data, service]);

  useEffect(() => { void load(); }, [load]);

  const save = async () => {
    setState("saving");
    setMessage("");
    try {
      const result: any = await gatewayFetch(data, "/api/apps/config", {
        method: "PUT",
        body: JSON.stringify({ service, content, expectedModifiedAt: modifiedAt }),
      });
      setOriginal(content);
      setModifiedAt(result.modifiedAt || modifiedAt);
      setMessage("Đã ghi trực tiếp vào cấu hình Ubuntu.");
      setState("ready");
    } catch (error: any) {
      setMessage(error?.message || "Không thể lưu cấu hình.");
      setState("error");
    }
  };

  const dirty = content !== original;

  return (
    <section className="app-config-editor" aria-label={`Chỉnh cấu hình ${service}`}>
      <header>
        <div><span>LIVE CONFIG WORKSPACE</span><b>{service.toUpperCase()}</b></div>
        <div className={`app-config-state is-${state}`}><i />{state === "saving" ? "SAVING" : state.toUpperCase()}</div>
      </header>

      {state === "error" && !content ? (
        <div className="app-config-empty" role="alert">
          <b>Chưa nối file cấu hình</b>
          <p>{message}</p>
          {requiredEnv && <code>{requiredEnv}=/đường/dẫn/config</code>}
          <button type="button" onClick={() => void load()}>Quét lại</button>
        </div>
      ) : (
        <>
          <div className="app-config-meta">
            <span>{fileName || "config"}</span><small>{format.toUpperCase()} · PRIVATE UBUNTU FILE</small>
          </div>
          <textarea
            value={content}
            disabled={state === "loading" || state === "saving" || !writable}
            spellCheck={false}
            aria-label={`Nội dung cấu hình ${service}`}
            onChange={(event) => setContent(event.target.value)}
          />
          <footer>
            <p className={state === "error" ? "error" : ""}>{message || (dirty ? "Có thay đổi chưa lưu." : "Đang đồng bộ với file thật trên Ubuntu.")}</p>
            <div>
              <button type="button" disabled={state === "loading" || state === "saving"} onClick={() => void load()}>Tải lại</button>
              <button className="primary" type="button" disabled={!dirty || !writable || state === "saving"} onClick={() => void save()}>{state === "saving" ? "Đang lưu" : "Lưu cấu hình"}</button>
            </div>
          </footer>
        </>
      )}
    </section>
  );
}
