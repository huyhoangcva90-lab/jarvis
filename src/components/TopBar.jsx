export default function TopBar({ data, currentTime }) {
  return (
    <header className="sticky top-0 z-30 border-b border-cyan-300/20 bg-void/90 px-4 py-3 backdrop-blur-xl lg:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-mono text-xs uppercase text-greenCore/80">Personal supercomputer interface</p>
          <h1 className="font-mono text-xl uppercase text-cyan-50 sm:text-2xl">J-Core Console</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase">
          <span className="rounded border border-greenCore/30 bg-greenCore/10 px-3 py-2 text-greenCore">AI Core Online</span>
          <span className="rounded border border-cyan-300/20 px-3 py-2 text-cyan-100">{data.username}</span>
          <time className="rounded border border-cyan-300/20 px-3 py-2 text-cyan-100">{currentTime}</time>
        </div>
      </div>
    </header>
  );
}

