import React, { useEffect, useState } from "react";
import { soundManager } from "../utils/soundManager.js";

export default function AuthScreen({ data, onUnlock }) {
  const [username, setUsername] = useState(data?.auth?.username || "admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [phase, setPhase] = useState("standby");

  const expectedUsername = data?.auth?.username || "admin";
  const expectedPassword = data?.auth?.password || "123456";
  const locked = attempts >= 5;

  useEffect(() => soundManager.setEnabled(data?.soundEnabled !== false), [data?.soundEnabled]);

  const submit = (event) => {
    event.preventDefault();
    if (locked || phase === "granting") return;
    setPhase("scanning");
    window.setTimeout(() => {
      if (username.trim() === expectedUsername && password === expectedPassword) {
        setPhase("granting");
        setError("");
        soundManager.play("spider");
        window.setTimeout(onUnlock, 900);
        return;
      }
      soundManager.play("warning");
      setAttempts((value) => value + 1);
      setPhase("denied");
      setError("ĐỊNH DANH KHÔNG KHỚP · KIỂM TRA LẠI QUYỀN TRUY CẬP");
      setPassword("");
    }, 520);
  };

  return (
    <main className={`stark-auth ${phase}`}>
      <div className="stark-auth-grid" aria-hidden="true" />
      <div className="stark-auth-scan" aria-hidden="true" />
      <div className="stark-auth-corners" aria-hidden="true"><i /><i /><i /><i /></div>

      <header className="stark-auth-topline">
        <div><span>J</span><b>J-CORE</b><small>PRIVATE INTELLIGENCE SYSTEM</small></div>
        <p><i /> LOCAL ENCRYPTION ACTIVE</p>
        <code>MK VII // {new Date().getFullYear()}</code>
      </header>

      <section className="stark-auth-console">
        <div className="stark-auth-reactor" aria-hidden="true">
          <div className="reactor-orbit orbit-a"><i /><i /><i /></div>
          <div className="reactor-orbit orbit-b"><i /><i /><i /><i /></div>
          <div className="reactor-brackets"><i /><i /><i /><i /></div>
          <div className="reactor-core"><span>J</span><small>{phase === "granting" ? "OPEN" : phase === "scanning" ? "SCAN" : "AI"}</small></div>
          <svg viewBox="0 0 200 200"><circle cx="100" cy="100" r="72" /><circle cx="100" cy="100" r="88" /></svg>
          <p>ARC IDENTITY REACTOR</p>
        </div>

        <form className="stark-auth-form" onSubmit={submit}>
          <div className="stark-auth-heading">
            <span>SECURE ACCESS // LEVEL 07</span>
            <h1>WELCOME BACK,<br /><b>{(username || "OPERATOR").toUpperCase()}</b></h1>
            <p>Xác thực danh tính để kết nối J-Core, Hermes và mạng tác nhân cá nhân.</p>
          </div>

          <label className="stark-field">
            <span>OPERATOR ID</span>
            <div><i>01</i><input autoComplete="username" value={username} disabled={locked || phase === "granting"} onChange={(event) => { setUsername(event.target.value); setError(""); setPhase("standby"); }} /><b>VERIFIED</b></div>
          </label>
          <label className="stark-field">
            <span>ACCESS KEY</span>
            <div><i>02</i><input type="password" autoComplete="current-password" value={password} disabled={locked || phase === "granting"} placeholder="••••••••••••" onChange={(event) => { setPassword(event.target.value); setError(""); setPhase("standby"); }} /><b>{password ? "ENCRYPTED" : "WAITING"}</b></div>
          </label>

          <div className="stark-auth-status" role="status">
            <i />
            <span>{locked ? "ACCESS LOCKED · RELOAD REQUIRED" : error || (phase === "scanning" ? "SCANNING BIOMETRIC SIGNATURE…" : phase === "granting" ? "IDENTITY CONFIRMED · OPENING CORE…" : "SYSTEM READY · AWAITING CREDENTIALS")}</span>
            <small>{String(5 - Math.min(attempts, 5)).padStart(2, "0")} ATTEMPTS</small>
          </div>

          <button className="stark-auth-submit" type="submit" disabled={locked || phase === "scanning" || phase === "granting"}>
            <span>{phase === "granting" ? "ACCESS GRANTED" : phase === "scanning" ? "AUTHENTICATING" : "INITIALIZE J-CORE"}</span><b>→</b>
          </button>
        </form>
      </section>

      <footer className="stark-auth-footer"><span>HERMES GATEWAY</span><i /><span>OPENCLAW LINK</span><i /><span>9ROUTER MATRIX</span><b>ALL SYSTEMS STANDBY</b></footer>
    </main>
  );
}
