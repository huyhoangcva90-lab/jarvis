import React, { useEffect, useState } from "react";
import { soundManager } from "../utils/soundManager.js";

export default function AuthScreen({ data, onUnlock }) {
  const [username, setUsername] = useState(data?.auth?.username || "admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  const expectedUsername = data?.auth?.username || "admin";
  const expectedPassword = data?.auth?.password || "123456";
  const locked = attempts >= 5;

  useEffect(() => {
    soundManager.setEnabled(data?.soundEnabled !== false);
  }, [data?.soundEnabled]);

  const submit = (event) => {
    event.preventDefault();
    if (locked) return;
    if (username.trim() === expectedUsername && password === expectedPassword) {
      soundManager.play("success");
      onUnlock();
      return;
    }
    soundManager.play("warning");
    setAttempts((value) => value + 1);
    setError("Sai tai khoan hoac mat khau.");
    setPassword("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-void px-5">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:42px_42px] opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_82%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-cyan-300/10 to-transparent" />

      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-sm rounded-xl border border-cyanCore/30 bg-slate-950/92 p-7 shadow-[0_0_50px_rgba(34,211,238,0.12)]"
      >
        <div className="mb-7 text-center">
          <div className="mx-auto mb-4 h-3 w-3 rounded-full bg-greenCore shadow-[0_0_14px_#4ade80]" />
          <h1 className="font-mono text-2xl font-bold tracking-[0.28em] text-white">JARVIS</h1>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.24em] text-cyanCore/70">
            Hermes profile gateway
          </p>
        </div>

        <div className="space-y-4 font-mono">
          <label className="field-label">
            Tai khoan
            <input
              className="hud-input text-sm"
              autoComplete="username"
              value={username}
              disabled={locked}
              onChange={(event) => {
                setUsername(event.target.value);
                setError("");
              }}
            />
          </label>
          <label className="field-label">
            Mat khau
            <input
              className="hud-input text-sm"
              type="password"
              autoComplete="current-password"
              value={password}
              disabled={locked}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
            />
          </label>
        </div>

        <div className="mt-5 min-h-5 text-center font-mono text-xs">
          {locked ? (
            <span className="text-dangerCore">Tam khoa dang nhap. Tai lai trang de thu lai.</span>
          ) : error ? (
            <span className="text-dangerCore">{error}</span>
          ) : (
            <span className="text-cyan-100/55">Dang nhap de mo bang dieu khien cuc bo.</span>
          )}
        </div>

        <button
          type="submit"
          className="hud-button primary mt-6 w-full py-3 text-xs uppercase"
          disabled={locked}
        >
          Mo J-Core Dashboard
        </button>
      </form>
    </div>
  );
}
