import Panel from "./Panel.jsx";
import { buildFullContext } from "../utils/prompts.js";

const fields = [
  ["whoIAm", "Who I am"],
  ["currentProjects", "Current projects"],
  ["longTermGoals", "Long-term goals"],
  ["aiRules", "AI response rules"],
  ["remember", "Things to remember"]
];

export default function MemoryTab({ data, updateData, copyText }) {
  const updateMemory = (key, value) => {
    updateData({ memory: { ...data.memory, [key]: value } });
  };

  return (
    <div className="space-y-4">
      <Panel
        title="Memory Vault"
        kicker="Persistent context"
        action={
          <div className="flex flex-wrap gap-2">
            <button className="hud-button text-xs" type="button" onClick={() => copyText(JSON.stringify(data.memory, null, 2), "Memory JSON copied.")}>
              Export JSON
            </button>
            <button className="hud-button primary text-xs" type="button" onClick={() => copyText(buildFullContext(data), "Full memory context copied.")}>
              Copy Full Context
            </button>
          </div>
        }
      >
        <div className="grid gap-4 lg:grid-cols-2">
          {fields.map(([key, label]) => (
            <label className="field-label" key={key}>
              {label}
              <textarea className="hud-input min-h-36" value={data.memory[key]} onChange={(event) => updateMemory(key, event.target.value)} />
            </label>
          ))}
        </div>
      </Panel>
    </div>
  );
}
