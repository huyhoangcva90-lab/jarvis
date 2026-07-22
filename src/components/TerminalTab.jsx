import { useState } from "react";
import Panel from "./Panel.jsx";
import { buildTodayContext } from "../utils/prompts.js";

export default function TerminalTab({ data, updateData, copyText, addLog }) {
  const [input, setInput] = useState("");
  const [terminalLog, setTerminalLog] = useState([
    "J-Core local terminal ready.",
    "Type help to list available commands."
  ]);

  const push = (lines) => setTerminalLog((current) => [...current, ...lines].slice(-80));

  const runCommand = (event) => {
    event.preventDefault();
    const command = input.trim().toLowerCase();
    if (!command) return;
    setInput("");
    if (command === "clear") {
      setTerminalLog([]);
      addLog("Terminal buffer cleared.");
      return;
    }

    const prefix = [`> ${command}`];
    switch (command) {
      case "help":
        push([...prefix, "Commands: help, scan, mission, mood tired, mood calm, energy low, energy high, copy context, open chatgpt, clear"]);
        break;
      case "scan":
        push([...prefix, `Mood=${data.mood}; Energy=${data.energy}; Mission=${data.missionStatus}; Core=ONLINE.`]);
        break;
      case "mission":
        push([...prefix, `Main quest: ${data.mainQuest}`, `Active project: ${data.activeProject}`]);
        break;
      case "mood tired":
        updateData({ mood: "tired" });
        push([...prefix, "Mood channel updated: tired. Reduce task load and choose a recovery action."]);
        break;
      case "mood calm":
        updateData({ mood: "calm" });
        push([...prefix, "Mood channel updated: calm. Maintain steady execution."]);
        break;
      case "energy low":
        updateData({ energy: "low" });
        push([...prefix, "Energy channel updated: low. Recommend one essential mission only."]);
        break;
      case "energy high":
        updateData({ energy: "high" });
        push([...prefix, "Energy channel updated: high. Deep work window available."]);
        break;
      case "copy context":
        copyText(buildTodayContext(data), "Terminal context copied.");
        push([...prefix, "Today context copied to clipboard."]);
        break;
      case "open chatgpt": {
        const popup = window.open("https://chatgpt.com/", "_blank", "noopener,noreferrer");
        push([
          ...prefix,
          popup
            ? "Opening external AI console."
            : "Popup blocked. Use the ChatGPT launch button in CHAT or TOOLS."
        ]);
        break;
      }
      default:
        push([...prefix, "Unknown command. Type help for command list."]);
    }
    addLog(`Terminal command executed: ${command}.`);
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

