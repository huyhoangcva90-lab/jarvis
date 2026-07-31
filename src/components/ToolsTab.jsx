import { useState } from "react";
import Panel from "./Panel.jsx";
import { soundManager } from "../utils/soundManager.js";

export default function ToolsTab({ data, addLog }) {
  const [query, setQuery] = useState("");

  const logToolLaunch = (name) => {
    soundManager.play("click");
    addLog(`${name} tool launch requested.`);
  };

  const tools = Object.entries(data.toolUrls).filter(([name, url]) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return name.toLowerCase().includes(q) || url.toLowerCase().includes(q);
  });

  return (
    <Panel
      title="Quick Launch Matrix"
      kicker={`${tools.length} Tools Available`}
      action={
        <input
          type="text"
          className="hud-input font-mono text-xs w-48"
          placeholder="Lọc công cụ..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      }
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {tools.length > 0 ? (
          tools.map(([name, url]) => (
            <a
              key={name}
              className="tool-tile"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => logToolLaunch(name)}
            >
              <span className="font-mono text-lg uppercase text-cyan-50">{name}</span>
              <span className="mt-3 block truncate text-xs text-cyan-100/50">{url}</span>
            </a>
          ))
        ) : (
          <p className="col-span-full py-8 text-center font-mono text-xs text-cyan-100/40">
            Không tìm thấy công cụ nào phù hợp với "{query}".
          </p>
        )}
      </div>
    </Panel>
  );
}

