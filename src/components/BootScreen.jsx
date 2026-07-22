export default function BootScreen() {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-void text-cyan-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.16),transparent_34%),linear-gradient(rgba(34,211,238,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.05)_1px,transparent_1px)] bg-[size:auto,42px_42px,42px_42px]" />
      <div className="relative w-[min(560px,90vw)] animate-boot rounded-lg border border-cyan-300/30 bg-slate-950/70 p-8 shadow-hud">
        <div className="mb-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full border border-greenCore/70 shadow-greenHud">
            <div className="m-3 h-6 w-6 animate-pulseCore rounded-full bg-greenCore/70 shadow-[0_0_22px_rgba(74,222,128,0.8)]" />
          </div>
          <div>
            <p className="font-mono text-sm uppercase text-greenCore">Infinity System Boot</p>
            <h1 className="font-mono text-3xl uppercase">JARVIS</h1>
          </div>
        </div>
        <div className="space-y-2 font-mono text-sm text-cyan-100/80">
          <p>&gt; Initializing Hermes Orchestrator...</p>
          <p>&gt; Calibrating Infinity Stones...</p>
          <p>&gt; Establishing secure command surface...</p>
          <p className="text-greenCore">&gt; All systems: ONLINE</p>
        </div>
        <div className="mt-6 h-1 overflow-hidden rounded-full bg-cyan-950">
          <div className="h-full w-full origin-left animate-[boot_1.9s_ease-out_both] bg-gradient-to-r from-cyanCore to-greenCore" />
        </div>
      </div>
    </div>
  );
}
