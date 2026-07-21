import { useState, useEffect } from "react";
import Panel from "./Panel.jsx";
import { soundManager } from "../utils/soundManager.js";

const INITIAL_AGENTS = [
  { id: "friday", name: "FRIDAY", role: "Orchestrator & Router", status: "Idle", load: 0, color: "border-cyanCore/30 text-cyanCore bg-cyanCore/5" },
  { id: "forge", name: "FORGE", role: "Code Architect", status: "Running", load: 74, color: "border-purpleCore/30 text-purpleCore bg-purpleCore/5" },
  { id: "edith", name: "EDITH", role: "Security & Policy Auditor", status: "Idle", load: 0, color: "border-greenCore/30 text-greenCore bg-greenCore/5" },
  { id: "karen", name: "KAREN", role: "RAG & Knowledge Retrieval", status: "Running", load: 45, color: "border-amberCore/30 text-amberCore bg-amberCore/5" },
  { id: "yui", name: "YUI", role: "Finance Auditor", status: "Idle", load: 0, color: "border-redCore/30 text-redCore bg-redCore/5" }
];

const INITIAL_LOGS = [
  "[14:20:01] FRIDAY kernel initialized successfully.",
  "[14:20:05] KAREN connected to Mind database.",
  "[14:22:15] FORGE completed refactoring of stoneState.js.",
  "[14:22:18] EDITH validated all changes. Policy check PASSED."
];

export default function OpenclawDashboard({ data, updateData, addLog } = {}) {
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [logs, setLogs] = useState(INITIAL_LOGS);
  const [isSimulating, setIsSimulating] = useState(false);

  const addLogEntry = (msg) => {
    const stamp = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(new Date());
    setLogs((prev) => [...prev, `[${stamp}] ${msg}`].slice(-16));
  };

  const handleSimulateTask = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    soundManager.play("click");
    addLogEntry("FRIDAY: Dispatching mission: 'Check multi-model gateways response times'...");

    // Step 1: Orchestrator dispatch
    setTimeout(() => {
      setAgents((prev) =>
        prev.map((a) => (a.id === "friday" ? { ...a, status: "Thinking", load: 95 } : a))
      );
      addLogEntry("FRIDAY: Delegating search requests to KAREN.");
      soundManager.play("beep");
    }, 1000);

    // Step 2: Knowledge retrieval running
    setTimeout(() => {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === "friday"
            ? { ...a, status: "Idle", load: 0 }
            : a.id === "karen"
            ? { ...a, status: "Running", load: 88 }
            : a
        )
      );
      addLogEntry("KAREN: Querying 9Router response history for Google Gemini and Claude 3.5 Sonnet...");
      soundManager.play("beep");
    }, 2500);

    // Step 3: Code generation running
    setTimeout(() => {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === "karen"
            ? { ...a, status: "Idle", load: 0 }
            : a.id === "forge"
            ? { ...a, status: "Running", load: 92 }
            : a
        )
      );
      addLogEntry("FORGE: Compiling stats report markdown structure...");
      soundManager.play("beep");
    }, 4500);

    // Step 4: Auditor checks
    setTimeout(() => {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === "forge"
            ? { ...a, status: "Idle", load: 20 }
            : a.id === "edith"
            ? { ...a, status: "Running", load: 60 }
            : a
        )
      );
      addLogEntry("EDITH: Running static code audits on compiled files... 0 vulnerabilities found.");
      soundManager.play("beep");
    }, 6000);

    // Step 5: Finish
    setTimeout(() => {
      setAgents(INITIAL_AGENTS);
      addLogEntry("FRIDAY: Mission completed. Stats report loaded into Memory.");
      soundManager.play("success");
      setIsSimulating(false);
    }, 7500);
  };

  const handlePauseWorkforce = () => {
    soundManager.play("warning");
    addLogEntry("SYSTEM: Powering down OpenClaw Workforce...");
    setAgents((prev) => prev.map((a) => ({ ...a, status: "Paused", load: 0 })));
  };

  const handleResumeWorkforce = () => {
    soundManager.play("success");
    addLogEntry("SYSTEM: OpenClaw Workforce online and standing by.");
    setAgents(INITIAL_AGENTS);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      {/* Cột trái: Agent Cards Grid */}
      <Panel title="Active Agent Fleet" kicker="OpenClaw Workforce">
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            disabled={isSimulating}
            onClick={handleSimulateTask}
            className={`hud-button primary text-xs uppercase ${isSimulating ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSimulating ? "Simulating Task..." : "Simulate Task Dispatch"}
          </button>
          <button
            type="button"
            onClick={handlePauseWorkforce}
            className="hud-button danger text-xs uppercase"
          >
            Power Down
          </button>
          <button
            type="button"
            onClick={handleResumeWorkforce}
            className="hud-button text-xs uppercase"
          >
            Power Up
          </button>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`border rounded p-4 font-mono transition-all duration-200 ${agent.color}`}
            >
              <div className="flex items-center justify-between border-b border-cyan-300/10 pb-2">
                <span className="text-sm font-bold tracking-wider">{agent.name}</span>
                <span
                  className={`text-[10px] uppercase font-bold rounded px-1.5 py-0.5 border ${
                    agent.status === "Running"
                      ? "border-amberCore text-amberCore bg-amberCore/10 animate-pulse"
                      : agent.status === "Thinking"
                      ? "border-cyanCore text-cyanCore bg-cyanCore/10 animate-bounce"
                      : agent.status === "Paused"
                      ? "border-redCore text-redCore bg-redCore/10"
                      : "border-cyan-300/20 text-cyan-100/50"
                  }`}
                >
                  {agent.status}
                </span>
              </div>
              <p className="mt-2 text-xs opacity-75">{agent.role}</p>

              {/* Load indicator */}
              <div className="mt-4">
                <div className="flex justify-between text-[10px] opacity-50 mb-1">
                  <span>LOAD CAPACITY</span>
                  <span>{agent.load}%</span>
                </div>
                <div className="h-1 w-full bg-slate-900 rounded overflow-hidden">
                  <div
                    className="h-full bg-cyanCore transition-all duration-300"
                    style={{ width: `${agent.load}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* Cột phải: Live workforce logs console */}
      <Panel title="Workforce console stream" kicker="Live Agent logs">
        <div className="terminal-window min-h-[300px] max-h-[360px] rounded border border-cyanCore/15 bg-black/70 p-4 font-mono text-[11px] text-cyanCore/90 overflow-auto space-y-1">
          {logs.map((log, idx) => (
            <p key={idx} className="leading-relaxed whitespace-pre-wrap">{log}</p>
          ))}
        </div>
      </Panel>
    </div>
  );
}
