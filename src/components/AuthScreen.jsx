import React, { useEffect, useRef, useState } from "react";
import { soundManager } from "../utils/soundManager.js";

const LockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 10V7.75a4.5 4.5 0 0 1 9 0V10M6 10h12v10H6z" /><path d="M12 14v2.5" /></svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M5.5 20c.6-3.8 2.8-5.8 6.5-5.8s5.9 2 6.5 5.8" /></svg>
);

export default function AuthScreen({ data, onUnlock }) {
  const [username, setUsername] = useState(data?.auth?.username || "admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [phase, setPhase] = useState("standby");
  const timers = useRef([]);

  const expectedUsername = data?.auth?.username || "admin";
  const expectedPassword = data?.auth?.password || "123456";
  const locked = attempts >= 5;

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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) throw new Error("static_preview");
      const result = await response.json();
      if (!response.ok) {
        const authError = new Error(result.error || "invalid_credentials");
        authError.remaining = result.remaining;
        throw authError;
      }
      setPhase("granting");
      soundManager.play("success");
      timers.current.push(window.setTimeout(() => onUnlock(result), 900));
    } catch (loginError) {
      const staticPreview = loginError?.message === "static_preview"
        || window.location.protocol === "file:"
        || window.location.hostname.endsWith("github.io");
      if (staticPreview && username.trim() === expectedUsername && password === expectedPassword) {
        setPhase("granting");
        soundManager.play("success");
        timers.current.push(window.setTimeout(() => onUnlock({ preview: true }), 900));
        return;
      }
      soundManager.play("warning");
      setAttempts((value) => value + 1);
      setPhase("denied");
      setError(loginError?.message === "login_rate_limited"
        ? "Đăng nhập đang tạm khóa 15 phút vì thử sai quá nhiều lần."
        : "Thông tin truy cập chưa đúng. Hãy kiểm tra và thử lại.");
      setPassword("");
    }
  };

  const status = locked
    ? "Đã tạm khóa sau 5 lần thử. Tải lại trang để tiếp tục."
    : phase === "scanning"
      ? "Đang xác minh khóa truy cập…"
      : phase === "granting"
        ? "Danh tính hợp lệ. Đang mở J-Core…"
        : error;

  return (
    <main className={`aegis-auth is-${phase}`}>
      <div className="aegis-ambient" aria-hidden="true">
        <i className="aegis-aurora aegis-aurora-one" />
        <i className="aegis-aurora aegis-aurora-two" />
        <i className="aegis-grain" />
        <i className="aegis-grid" />
        <i className="aegis-scan-beam" />
        <i className="aegis-vignette" />
      </div>

      <nav className="aegis-nav" aria-label="J-Core identity">
        <div className="aegis-brand"><span>J</span><div><b>J—CORE</b><small>PRIVATE INTELLIGENCE</small></div></div>
        <div className="aegis-private"><i /> J-CORE LOCAL <span>SECURE CHANNEL</span></div>
      </nav>

      <section className="aegis-stage">
        <div className="aegis-story">
          <p className="aegis-kicker"><span>01</span> ARC COMMAND ACCESS PROTOCOL</p>
          <h1>Xác thực<br /><em>hệ lõi.</em></h1>
          <p className="aegis-lead">Một danh tính mở toàn bộ không gian hoạch định, tác nhân AI và hệ thống cá nhân của bạn.</p>

          <div className="aegis-core" aria-hidden="true">
            <div className="aegis-core-halo" />
            <div className="aegis-core-shell"><i /><i /><i /><span>J</span></div>
            <div className="aegis-core-ring"><b /><b /><b /></div>
            <div className="aegis-core-orbit orbit-a" />
            <div className="aegis-core-orbit orbit-b" />
            <small className="aegis-core-label label-a">ARC CORE // 100%</small>
            <small className="aegis-core-label label-b">IDENTITY LINK</small>
          </div>

          <div className="aegis-links" aria-label="Hệ thống sẵn sàng">
            <span><i /> HERMES</span><span><i /> OPENCLAW</span><span><i /> 9ROUTER</span>
          </div>
        </div>

        <form className="aegis-card" onSubmit={submit} noValidate>
          <div className="aegis-card-glow" aria-hidden="true" />
          <header>
            <p><LockIcon /> IDENTITY HANDSHAKE / 01</p>
            <h2>Kích hoạt J-Core.</h2>
            <span>Nhập tài khoản và mật khẩu. Những kết nối còn lại được hệ thống tự xử lý.</span>
          </header>

          <div className="aegis-diagnostics" aria-hidden="true">
            <span><i /> CORE ONLINE</span><span><i /> LOCAL VAULT</span><span><i /> AUTO LINK</span>
          </div>

          <div className="aegis-fields">
            <label htmlFor="aegis-operator">Tài khoản</label>
            <div className="aegis-input">
              <UserIcon />
              <input id="aegis-operator" autoComplete="username" value={username} disabled={locked || phase === "granting"} onChange={(event) => { setUsername(event.target.value); resetFeedback(); }} />
              <small>{username.trim() === expectedUsername ? "RECOGNIZED" : "LOCAL"}</small>
            </div>

            <label htmlFor="aegis-key">Mật khẩu</label>
            <div className={`aegis-input ${error ? "has-error" : ""}`}>
              <LockIcon />
              <input id="aegis-key" type={showPassword ? "text" : "password"} autoComplete="current-password" value={password} disabled={locked || phase === "granting"} placeholder="Nhập khóa truy cập" aria-invalid={Boolean(error)} aria-describedby="aegis-feedback" onChange={(event) => { setPassword(event.target.value); resetFeedback(); }} />
              <button type="button" className="aegis-reveal" aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? "HIDE" : "SHOW"}</button>
            </div>
          </div>

          <div id="aegis-feedback" className="aegis-feedback" role="status" aria-live="polite">
            <span>{status}</span>
            {!locked && attempts > 0 && <small>Còn {5 - attempts} lần thử</small>}
          </div>

          <button className="aegis-submit" type="submit" disabled={locked || phase === "scanning" || phase === "granting"}>
            <span>{phase === "granting" ? "TRUY CẬP ĐÃ CẤP" : phase === "scanning" ? "ĐANG QUÉT DANH TÍNH" : locked ? "TẠM KHÓA" : "KÍCH HOẠT HỆ THỐNG"}</span>
            <i aria-hidden="true">{phase === "granting" ? "✓" : "↗"}</i>
          </button>

          <footer><LockIcon /><span>Một lần đăng nhập · tự kết nối toàn bộ dự án local.</span></footer>
        </form>
      </section>

      <footer className="aegis-foot"><span>J—CORE / HERMES GATEWAY</span><span>SAIGON · {new Date().getFullYear()}</span></footer>
      <div className="aegis-aperture" aria-hidden="true" />
    </main>
  );
}
