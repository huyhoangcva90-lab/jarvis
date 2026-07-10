import { useEffect, useMemo, useState } from "react";
import BootScreen from "./components/BootScreen.jsx";
import ChatTab from "./components/ChatTab.jsx";
import CoreTab from "./components/CoreTab.jsx";
import MemoryTab from "./components/MemoryTab.jsx";
import MissionTab from "./components/MissionTab.jsx";
import SectorsTab from "./components/SectorsTab.jsx";
import SettingsTab from "./components/SettingsTab.jsx";
import Sidebar from "./components/Sidebar.jsx";
import TerminalTab from "./components/TerminalTab.jsx";
import ToolsTab from "./components/ToolsTab.jsx";
import TopBar from "./components/TopBar.jsx";
import { defaultData, loadData, resetData, saveData } from "./utils/storage.js";

export default function App() {
  const [booting, setBooting] = useState(true);
  const [activeTab, setActiveTab] = useState("CORE");
  const [data, setData] = useState(() => loadData());
  const [now, setNow] = useState(() => new Date());
  const [toast, setToast] = useState("");

  useEffect(() => {
    const bootTimer = window.setTimeout(() => setBooting(false), 2000);
    const clockTimer = window.setInterval(() => setNow(new Date()), 1000);
    return () => {
      window.clearTimeout(bootTimer);
      window.clearInterval(clockTimer);
    };
  }, []);

  useEffect(() => {
    saveData(data);
  }, [data]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const currentTime = useMemo(() => {
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "short"
    }).format(now);
  }, [now]);

  const intensityClass = {
    Low: "theme-low",
    Medium: "theme-medium",
    High: "theme-high"
  }[data.themeIntensity] || "theme-medium";

  const addLog = (message) => {
    const stamp = new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit" }).format(new Date());
    setData((current) => ({
      ...current,
      logs: [...current.logs, `[${stamp}] ${message}`].slice(-16)
    }));
  };

  const updateData = (patch) => {
    setData((current) => ({ ...current, ...patch }));
  };

  const copyText = async (text, message) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast(message);
      addLog(message);
    } catch {
      setToast("Clipboard access blocked by browser.");
      addLog("Clipboard access blocked.");
    }
  };

  const hardReset = () => {
    const confirmed = window.confirm("Reset all J-Core local data on this browser?");
    if (!confirmed) return;
    resetData();
    setData(defaultData);
    setToast("Local data reset.");
  };

  const tabs = {
    CORE: <CoreTab data={data} currentTime={currentTime} />,
    CHAT: <ChatTab data={data} copyText={copyText} addLog={addLog} />,
    MISSION: <MissionTab data={data} updateData={updateData} addLog={addLog} />,
    SECTORS: <SectorsTab data={data} updateData={updateData} addLog={addLog} />,
    TERMINAL: <TerminalTab data={data} updateData={updateData} copyText={copyText} addLog={addLog} />,
    MEMORY: <MemoryTab data={data} updateData={updateData} copyText={copyText} />,
    TOOLS: <ToolsTab data={data} addLog={addLog} />,
    SETTINGS: <SettingsTab data={data} updateData={updateData} hardReset={hardReset} addLog={addLog} />
  };

  return (
    <div className={`min-h-dvh overflow-hidden bg-void text-cyan-50 ${intensityClass}`}>
      {booting && <BootScreen />}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,211,238,0.13),transparent_28%),radial-gradient(circle_at_86%_20%,rgba(74,222,128,0.11),transparent_26%),linear-gradient(rgba(34,211,238,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.035)_1px,transparent_1px)] bg-[size:auto,auto,48px_48px,48px_48px]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-cyan-300/10 to-transparent" />
        <div className="absolute h-28 w-full animate-scan bg-gradient-to-b from-transparent via-cyan-300/10 to-transparent" />
      </div>
      <div className="relative z-10">
        <TopBar data={data} currentTime={currentTime} />
        <div className="lg:flex">
          <Sidebar activeTab={activeTab} setActiveTab={(tab) => {
            setActiveTab(tab);
            addLog(`Navigation shifted to ${tab}.`);
          }} />
          <main className="min-w-0 flex-1 p-4 lg:p-6">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3 border-b border-cyan-300/10 pb-4">
              <div>
                <p className="font-mono text-xs uppercase text-greenCore/100">Active interface</p>
                <h2 className="font-mono text-2xl uppercase text-cyan-50">{activeTab}</h2>
              </div>
              <p className="font-mono text-xs uppercase text-cyan-100/60">Persona: {data.aiPersonaName}</p>
            </div>
            {tabs[activeTab]}
          </main>
        </div>
      </div>
      <div className="sr-only" aria-live="polite">{toast}</div>
      {toast && (
        <div className="fixed bottom-4 right-4 z-40 max-w-sm rounded border border-greenCore/40 bg-slate-950/90 px-4 py-3 font-mono text-sm text-greenCore shadow-greenHud">
          {toast}
        </div>
      )}
    </div>
  );
}

