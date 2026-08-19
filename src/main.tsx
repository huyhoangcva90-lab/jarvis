import React, { Component, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";

class GlobalErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("JARVIS OS Global Error:", error, errorInfo);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#030812",
            color: "#00e5ff",
            fontFamily: "monospace",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center",
            zIndex: 99999,
          }}
        >
          <h2 style={{ fontSize: "20px", color: "#ff2a4b", marginBottom: "12px" }}>
            ⚠️ JARVIS OS RECOVERY CONSOLE
          </h2>
          <p style={{ color: "rgba(255,255,255,0.8)", marginBottom: "16px", fontSize: "13px" }}>
            Phát hiện lỗi render client. Bạn có thể nhấn nút Đặt lại bộ nhớ đệm bên dưới để khôi phục trạng thái ban đầu.
          </p>
          <pre
            style={{
              background: "rgba(0,0,0,0.85)",
              padding: "16px",
              borderRadius: "6px",
              border: "1px solid rgba(0,229,255,0.3)",
              maxWidth: "800px",
              whiteSpace: "pre-wrap",
              textAlign: "left",
              fontSize: "12px",
              color: "#a7fbff",
              overflow: "auto",
              maxHeight: "260px",
            }}
          >
            {this.state.error.message}
            {"\n"}
            {this.state.error.stack}
          </pre>
          <button
            type="button"
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}
            style={{
              marginTop: "20px",
              padding: "12px 24px",
              background: "#00e5ff",
              color: "#000",
              border: "none",
              borderRadius: "4px",
              fontWeight: 800,
              cursor: "pointer",
              letterSpacing: "0.08em",
            }}
          >
            🔄 KHÔI PHỤC & TẢI LẠI TRANG
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root") as HTMLElement).render(
  <GlobalErrorBoundary>
    <App />
  </GlobalErrorBoundary>
);
