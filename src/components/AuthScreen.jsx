import React, { useEffect, useMemo, useRef, useState } from "react";
import { soundManager } from "../utils/soundManager.js";

const LockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7.5 10V7.75a4.5 4.5 0 0 1 9 0V10M6 10h12v10H6z" />
    <path d="M12 14v2.5" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="8" r="3.5" />
    <path d="M5.5 20c.6-3.8 2.8-5.8 6.5-5.8s5.9 2 6.5 5.8" />
  </svg>
);

const SparkIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4.2 4.2M14.8 14.8 19 19M19 5l-4.2 4.2M9.2 14.8 5 19" />
  </svg>
);

const SYSTEMS = [
  ["HERMES", "PROFILE JARVIS", "SYNC"],
  ["OPENCLAW", "AGENT FABRIC", "READY"],
  ["9ROUTER", "MODEL ROUTE", "AUTO"],
  ["CLAUDE", "CODE BRIDGE", "LINK"],
];

const TELEMETRY = [
  ["VOICE", "VIETNAMESE"],
  ["VAULT", "LOCAL"],
  ["TERMINAL", "UBUNTU"],
  ["MEMORY", "ACTIVE"],
];

export default function AuthScreen({ data, onUnlock }) {
  const [username, setUsername] = useState(data?.auth?.username || "admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [phase, setPhase] = useState("standby");
  const timers = useRef([]);

  const expectedUsername = data?.auth?.username || "admin";
  const locked = attempts >= 5;
  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => soundManager.setEnabled(data?.soundEnabled !== false), [data?.soundEnabled]);
  useEffect(() => () => timers.current.forEach(window.clearTimeout), []);

  const resetFeedback = () => {
    setError("");
    if (phase === "denied") setPhase("standby");
  };

  const submit = async (event) => {
    event.preventDefault();
    if (locked || phase === "scanning" || phase === "granting") return;
    setError("");
    setPhase("scanning");

    await new Promise((resolve) => timers.current.push(window.setTimeout(resolve, 560)));
    try {
      let result = null;
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          credentials: "include",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ username: username.trim(), password }),
        });
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const json = await response.json();
          if (response.ok) {
            result = json;
          } else {
            const authError = new Error(json.error || "invalid_credentials");
            authError.remaining = json.remaining;
            throw authError;
          }
        }
      } catch (networkError) {
        if (networkError?.message === "invalid_credentials" || networkError?.message === "login_rate_limited") {
          throw networkError;
        }
        // Fallback for static hosting / GitHub Pages / Vite dev without gateway
      }

      if (!result) {
        const expectedPass = data?.auth?.password || "123456";
        if (password === expectedPass) {
          result = {
            authenticated: true,
            user: { username: username.trim() || expectedUsername },
            connection: { mode: "local-client", automatic: true },
          };
        } else {
          throw new Error("invalid_credentials");
        }
      }

      setPhase("granting");
      soundManager.play("success");
      timers.current.push(window.setTimeout(() => onUnlock(result), 900));
    } catch (loginError) {
      soundManager.play("warning");
      setAttempts((value) => value + 1);
      setPhase("denied");
      setError(
        loginError?.message === "login_rate_limited"
          ? "Đăng nhập đang tạm khóa 15 phút vì thử sai quá nhiều lần."
          : "Thông tin truy cập chưa đúng. Kiểm tra tài khoản và mật khẩu."
      );
      setPassword("");
    }
  };

  const status = locked
    ? "Đã tạm khóa sau 5 lần thử. Tải lại trang để tiếp tục."
    : phase === "scanning"
      ? "Đang quét danh tính và bắt tay với gateway…"
      : phase === "granting"
        ? "Danh tính hợp lệ. Đang mở J-Core…"
        : error || "Kênh riêng sẵn sàng. Nhập khóa để mở hệ thống.";

  return (
    <main className={`stark-login is-${phase}`}>
      <div className="stark-login-backdrop" aria-hidden="true">
        <i className="stark-grid" />
        <i className="stark-noise" />
        <i className="stark-scan stark-scan-a" />
        <i className="stark-scan stark-scan-b" />
        <i className="stark-glow stark-glow-a" />
        <i className="stark-glow stark-glow-b" />
        <i className="stark-vignette" />
      </div>

      <div className="stark-corners" aria-hidden="true">
        <i /><i /><i /><i />
      </div>

      <nav className="stark-login-nav" aria-label="J-Core identity">
        <div className="stark-brand">
          <span>J</span>
          <div>
            <b>J-CORE</b>
            <small>STARK ACCESS CHAMBER</small>
          </div>
        </div>
        <div className="stark-channel"><i /> LOCAL UBUNTU LINK <span>SECURE</span></div>
      </nav>

      <section className="stark-login-stage">
        <div className="stark-reactor-panel" aria-hidden="true">
          <div className="stark-panel-label">
            <small>ARC ACCESS // MK-85</small>
            <b>BIOMETRIC SIMULATION</b>
          </div>

          <div className="stark-reactor">
            <div className="stark-reactor-beam beam-x" />
            <div className="stark-reactor-beam beam-y" />
            <div className="stark-reactor-ring ring-a"><b /><b /><b /></div>
            <div className="stark-reactor-ring ring-b"><b /><b /></div>
            <div className="stark-reactor-ring ring-c" />
            <div className="stark-reactor-core">
              <span>J</span>
              <small>CORE</small>
            </div>
            <div className="stark-target target-a" />
            <div className="stark-target target-b" />
          </div>

          <div className="stark-service-stack">
            {SYSTEMS.map(([name, detail, state]) => (
              <article key={name}>
                <i />
                <div>
                  <b>{name}</b>
                  <small>{detail}</small>
                </div>
                <span>{state}</span>
              </article>
            ))}
          </div>
        </div>

        <form className="stark-auth-card" onSubmit={submit} noValidate>
          <div className="stark-card-frame" aria-hidden="true" />
          <header>
            <p><SparkIcon /> AUTHORIZATION HANDSHAKE</p>
            <h1>Mở buồng điều khiển.</h1>
            <span>Đăng nhập để kết nối Hermes, OpenClaw, 9Router, Claude và terminal Ubuntu local.</span>
          </header>

          <div className="stark-telemetry" aria-hidden="true">
            {TELEMETRY.map(([label, value]) => (
              <span key={label}><small>{label}</small><b>{value}</b></span>
            ))}
          </div>

          <div className="stark-fields">
            <label htmlFor="stark-operator">Tài khoản</label>
            <div className="stark-input">
              <UserIcon />
              <input
                id="stark-operator"
                autoComplete="username"
                value={username}
                disabled={locked || phase === "granting"}
                onChange={(event) => {
                  setUsername(event.target.value);
                  resetFeedback();
                }}
              />
              <small>{username.trim() === expectedUsername ? "RECOGNIZED" : "LOCAL"}</small>
            </div>

            <label htmlFor="stark-key">Mật khẩu</label>
            <div className={`stark-input ${error ? "has-error" : ""}`}>
              <LockIcon />
              <input
                id="stark-key"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                disabled={locked || phase === "granting"}
                placeholder="Nhập khóa truy cập"
                aria-invalid={Boolean(error)}
                aria-describedby="stark-feedback"
                onChange={(event) => {
                  setPassword(event.target.value);
                  resetFeedback();
                }}
              />
              <button
                type="button"
                className="stark-reveal"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          <div id="stark-feedback" className="stark-feedback" role="status" aria-live="polite">
            <span>{status}</span>
            {!locked && attempts > 0 && <small>Còn {5 - attempts} lần thử</small>}
          </div>

          <button className="stark-submit" type="submit" disabled={locked || phase === "scanning" || phase === "granting"}>
            <span>
              {phase === "granting"
                ? "TRUY CẬP ĐÃ CẤP"
                : phase === "scanning"
                  ? "ĐANG QUÉT DANH TÍNH"
                  : locked
                    ? "TẠM KHÓA"
                    : "KÍCH HOẠT HỆ THỐNG"}
            </span>
            <i aria-hidden="true">{phase === "granting" ? "✓" : "↗"}</i>
          </button>

          <footer>
            <LockIcon />
            <span>Một lần đăng nhập · tự kết nối toàn bộ dự án local.</span>
          </footer>
        </form>
      </section>

      <footer className="stark-login-foot">
        <span>J-CORE / HERMES GATEWAY</span>
        <span>SAIGON · {year}</span>
      </footer>

      <div className="stark-aperture" aria-hidden="true" />
    </main>
  );
}
