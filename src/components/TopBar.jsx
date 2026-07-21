import { useStoneState } from "../utils/stoneState.js";

export default function TopBar({ data, currentTime }) {
  const { connections } = useStoneState();

  return (
    <header className="sticky top-0 z-30 border-b border-cyan-300/20 bg-void/90 px-4 py-3 backdrop-blur-xl lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase text-greenCore/80">Six Realms System</p>
          <h1 className="font-mono text-xl uppercase text-cyan-50 sm:text-2xl">JARVIS</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase">
          {/* HERMES Status */}
          <span className={`flex items-center gap-1.5 rounded border px-2 py-1 status-dot ${
            connections.hermes 
              ? "border-greenCore/30 bg-greenCore/10 text-greenCore" 
              : "border-redCore/30 bg-redCore/10 text-redCore"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${connections.hermes ? "bg-greenCore animate-pulseCore" : "bg-redCore"}`}></span> HERMES
          </span>

          {/* OPENCLAW Status */}
          <span className={`flex items-center gap-1.5 rounded border px-2 py-1 status-dot ${
            connections.openclaw 
              ? "border-purpleCore/30 bg-purpleCore/10 text-purpleCore" 
              : "border-slate-500/30 bg-slate-500/10 text-slate-400"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${connections.openclaw ? "bg-purpleCore animate-pulse" : "bg-slate-500"}`}></span> OPENCLAW
          </span>

          {/* 9ROUTER Status */}
          <span className={`flex items-center gap-1.5 rounded border px-2 py-1 status-dot ${
            connections.nineRouter 
              ? "border-cyanCore/30 bg-cyanCore/10 text-cyanCore" 
              : "border-slate-500/30 bg-slate-500/10 text-slate-400"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${connections.nineRouter ? "bg-cyanCore animate-pulse" : "bg-slate-500"}`}></span> 9ROUTER
          </span>

          <span className="rounded border border-cyan-300/20 px-3 py-2 text-cyan-100">{data.username}</span>
          <time className="rounded border border-cyan-300/20 px-3 py-2 text-cyan-100">{currentTime}</time>
        </div>
      </div>
    </header>
  );
}

