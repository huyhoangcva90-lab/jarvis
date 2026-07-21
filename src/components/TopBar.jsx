import { useStoneState } from "../utils/stoneState.js";

export default function TopBar({ data, currentTime }) {
  const { connections } = useStoneState();

  return (
    <header className="sticky top-0 z-30 border-b border-cyan-300/20 bg-void/90 px-3 py-2.5 backdrop-blur-xl sm:px-4 lg:px-6">
      <div className="flex min-w-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="hidden font-mono text-xs uppercase text-greenCore/80 sm:block">Six Realms System</p>
          <h1 className="font-mono text-lg uppercase tracking-[0.18em] text-cyan-50 sm:text-2xl">JARVIS</h1>
        </div>
        <div className="flex min-w-0 items-center justify-end gap-1.5 font-mono text-[10px] uppercase sm:gap-2 sm:text-xs">
          {/* HERMES Status */}
          <span className={`flex shrink-0 items-center gap-1.5 rounded border px-2 py-1 status-dot ${
            connections.hermes 
              ? "border-greenCore/30 bg-greenCore/10 text-greenCore" 
              : "border-redCore/30 bg-redCore/10 text-redCore"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${connections.hermes ? "bg-greenCore animate-pulseCore" : "bg-redCore"}`}></span>
            <span className="sm:hidden">H</span><span className="hidden sm:inline">HERMES</span>
          </span>

          {/* OPENCLAW Status */}
          <span className={`flex shrink-0 items-center gap-1.5 rounded border px-2 py-1 status-dot ${
            connections.openclaw 
              ? "border-purpleCore/30 bg-purpleCore/10 text-purpleCore" 
              : "border-slate-500/30 bg-slate-500/10 text-slate-400"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${connections.openclaw ? "bg-purpleCore animate-pulse" : "bg-slate-500"}`}></span>
            <span className="sm:hidden">O</span><span className="hidden sm:inline">OPENCLAW</span>
          </span>

          {/* 9ROUTER Status */}
          <span className={`flex shrink-0 items-center gap-1.5 rounded border px-2 py-1 status-dot ${
            connections.nineRouter 
              ? "border-cyanCore/30 bg-cyanCore/10 text-cyanCore" 
              : "border-slate-500/30 bg-slate-500/10 text-slate-400"
          }`}>
            <span className={`h-1.5 w-1.5 rounded-full ${connections.nineRouter ? "bg-cyanCore animate-pulse" : "bg-slate-500"}`}></span>
            <span className="sm:hidden">9R</span><span className="hidden sm:inline">9ROUTER</span>
          </span>

          <span className="hidden rounded border border-cyan-300/20 px-3 py-2 text-cyan-100 sm:inline-flex">{data.username}</span>
          <time className="max-w-[5.7rem] truncate rounded border border-cyan-300/20 px-2 py-1.5 text-cyan-100 sm:max-w-none sm:px-3 sm:py-2">{currentTime}</time>
        </div>
      </div>
    </header>
  );
}

