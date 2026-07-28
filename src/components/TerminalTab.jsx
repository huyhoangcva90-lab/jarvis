import { useState } from "react";
import Panel from "./Panel.jsx";
import { buildTodayContext } from "../utils/prompts.js";
import { useStoneState } from "../utils/stoneState.js";
import { soundManager } from "../utils/soundManager.js";
import { loadMissions } from "../utils/missionEngine.js";

export default function TerminalTab({ data, updateData, copyText, addLog, onLock = null }) {
  const [input, setInput] = useState("");
  const [terminalLog, setTerminalLog] = useState([
    "J-Core local terminal ready.",
    "Type help to list available commands."
  ]);
  const { setStoneStatus } = useStoneState();

  const push = (lines) => setTerminalLog((current) => [...current, ...lines].slice(-80));

  const runCommand = (event) => {
    event.preventDefault();
    const rawInput = input.trim();
    if (!rawInput) return;
    setInput("");

    soundManager.play("click");

    const tokens = rawInput.split(/\s+/);
    const command = tokens[0].toLowerCase();
    const prefix = [`> ${rawInput}`];

    if (command === "clear") {
      setTerminalLog([]);
      addLog("Terminal buffer cleared.");
      return;
    }

    switch (command) {
      case "help":
        push([
          ...prefix,
          "Available Commands:",
          "  help                          - Show this command list",
          "  sys-info                      - Print system configurations & specs",
          "  realm-set <realm> <status>    - Force-set a Realm Gate status",
          "  mission-list                  - Print ASCII table of all missions",
          "  auth-lock                     - Lock console immediately",
          "  scan                          - Check current J-Core states",
          "  mood <calm|tired>             - Update operator mood channel",
          "  energy <low|high>             - Update operator energy level",
          "  copy context                  - Export context template to clipboard",
          "  clear                         - Clear terminal screen buffer"
        ]);
        break;
      case "sys-info":
        push([
          ...prefix,
          "+--------------------------------------------+",
          "| JARVIS SIX REALMS OPERATING SYSTEM - V2.0  |",
          "+--------------------------------------------+",
          `| OPERATOR: ${data.username.padEnd(32)} |`,
          `| PERSONA:  ${data.aiPersonaName.padEnd(32)} |`,
          `| INTENSITY: ${data.themeIntensity.padEnd(31)} |`,
          `| MOOD:     ${data.mood.padEnd(32)} |`,
          `| ENERGY:   ${data.energy.padEnd(32)} |`,
          "+--------------------------------------------+",
          "| EXTERNAL CORES & GATEWAYS STATUS:          |",
          "|  - HERMES CORE (Polled Localhost:8080)     |",
          "|  - OPENCLAW WORKFORCE (Monitoring)         |",
          "|  - 9ROUTER INFRASTRUCTURE (Online)         |",
          "+--------------------------------------------+"
        ]);
        break;
      case "realm-set":
      case "stone-set": {
        const stoneId = tokens[1]?.toLowerCase();
        const status = tokens[2]?.toLowerCase();
        const validStones = ["power", "space", "mind", "time", "reality", "soul"];
        const validStatuses = ["dormant", "reading", "working", "external_call", "completed", "warning", "error", "approval"];

        if (!stoneId || !status) {
          push([
            ...prefix,
            "Usage: realm-set <realm_id> <status>",
            "Realms: power, space, mind, time, reality, soul",
            "Statuses: dormant, reading, working, external_call, completed, warning, error, approval"
          ]);
        } else if (!validStones.includes(stoneId)) {
          push([...prefix, `Error: Unknown realm ID "${stoneId}"`]);
        } else if (!validStatuses.includes(status)) {
          push([...prefix, `Error: Unknown status "${status}"`]);
        } else {
          setStoneStatus(stoneId, status);
          push([...prefix, `Success: Realm "${stoneId}" state set to "${status}"`]);
          addLog(`Terminal: Override realm '${stoneId}' -> '${status}'`);
        }
        break;
      }
      case "mission-list": {
        const missionsList = loadMissions();
        if (missionsList.length === 0) {
          push([...prefix, "No missions registered in the database."]);
        } else {
          const lines = [
            ...prefix,
            "+--------------------------------+----------+---------+",
            "| MISSION TITLE                  | STATUS   | PROGRESS|",
            "+--------------------------------+----------+---------+"
          ];
          missionsList.forEach((m) => {
            const titleStr = m.title.substring(0, 30).padEnd(30);
            const statusStr = m.status.padEnd(8);
            const progressStr = `${m.progress || 0}%`.padStart(7);
            lines.push(`| ${titleStr} | ${statusStr} | ${progressStr} |`);
          });
          lines.push("+--------------------------------+----------+---------+");
          push(lines);
        }
        break;
      }
      case "auth-lock":
        push([...prefix, "Securing system core...", "Redirecting to authentication gate."]);
        soundManager.play("warning");
        if (onLock) {
          setTimeout(onLock, 1000);
        } else {
          push(["Error: Auth screen lock handler not connected."]);
        }
        break;
      case "scan":
        push([...prefix, `Mood=${data.mood}; Energy=${data.energy}; Mission=${data.missionStatus}; Core=ONLINE.`]);
        break;
      case "mission":
        push([...prefix, `Main quest: ${data.mainQuest}`, `Active project: ${data.activeProject}`]);
        break;
      case "mood": {
        const nextMood = tokens[1]?.toLowerCase();
        if (nextMood === "tired" || nextMood === "calm") {
          updateData({ mood: nextMood });
          push([...prefix, `Mood channel updated to: ${nextMood}`]);
        } else {
          push([...prefix, "Usage: mood <calm|tired>"]);
        }
        break;
      }
      case "energy": {
        const nextEnergy = tokens[1]?.toLowerCase();
        if (nextEnergy === "low" || nextEnergy === "high") {
          updateData({ energy: nextEnergy });
          push([...prefix, `Energy channel updated to: ${nextEnergy}`]);
        } else {
          push([...prefix, "Usage: energy <low|high>"]);
        }
        break;
      }
      case "copy":
        if (tokens[1]?.toLowerCase() === "context") {
          copyText(buildTodayContext(data), "Terminal context copied.");
          push([...prefix, "Today context copied to clipboard."]);
        } else {
          push([...prefix, "Usage: copy context"]);
        }
        break;
      case "open":
        if (tokens[1]?.toLowerCase() === "chatgpt") {
          const popup = window.open("https://chatgpt.com/", "_blank", "noopener,noreferrer");
          push([
            ...prefix,
            popup
              ? "Opening external AI console."
              : "Popup blocked. Use the ChatGPT launch button in CHAT or TOOLS."
          ]);
        } else {
          push([...prefix, "Usage: open chatgpt"]);
        }
        break;
      default:
        push([...prefix, "Unknown command. Type help for command list."]);
    }
    addLog(`Terminal command: ${command}`);
  };

  return (
    <Panel title="Command Terminal" kicker="Local simulation">
      <div className="terminal-window min-h-[470px] rounded border border-greenCore/25 bg-black/60 p-4 font-mono text-sm text-greenCore">
        <div className="max-h-[420px] space-y-2 overflow-auto pr-2">
          {terminalLog.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}
        </div>
      </div>
      <form className="mt-3 flex gap-2" onSubmit={runCommand}>
        <label className="sr-only" htmlFor="terminal-command">Terminal command</label>
        <input
          id="terminal-command"
          className="hud-input font-mono"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type command..."
        />
        <button className="hud-button primary shrink-0" type="submit">Run</button>
      </form>
    </Panel>
  );
}

