export default function Panel({ title, kicker, children, className = "", action }) {
  return (
    <section className={`hud-panel relative overflow-hidden rounded-lg border border-cyan-300/20 bg-slate-950/60 p-4 shadow-hud ${className}`}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {kicker && <p className="font-mono text-xs uppercase text-greenCore/80">{kicker}</p>}
            {title && <h2 className="font-mono text-lg uppercase text-cyan-100">{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

