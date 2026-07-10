const tabs = ["CORE", "CHAT", "MISSION", "SECTORS", "TERMINAL", "MEMORY", "TOOLS", "SETTINGS"];

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="border-r border-cyan-300/20 bg-slate-950/60 p-3 lg:min-h-[calc(100dvh-73px)] lg:w-64">
      <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1" aria-label="Console navigation">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`group flex min-h-12 items-center justify-between rounded border px-3 py-3 text-left font-mono text-sm uppercase transition duration-200 ${
              activeTab === tab
                ? "border-cyan-300/70 bg-cyan-300/10 text-cyan-50 shadow-hud"
                : "border-cyan-300/10 bg-slate-950/30 text-cyan-100/70 hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-50"
            }`}
            aria-current={activeTab === tab ? "page" : undefined}
          >
            <span>{tab}</span>
            <span className="text-[10px] text-greenCore/70">{String(index + 1).padStart(2, "0")}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}

