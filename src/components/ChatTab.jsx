import Panel from "./Panel.jsx";
import { buildTodayContext, promptCards } from "../utils/prompts.js";

export default function ChatTab({ data, copyText, addLog }) {
  const logLaunch = (label) => {
    addLog(`${label} launch requested.`);
  };

  return (
    <div className="space-y-4">
      <Panel title="AI Link" kicker="External bridge">
        <div className="flex flex-wrap gap-3">
          <a
            className="hud-button primary"
            href="https://chatgpt.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => logLaunch("ChatGPT Web")}
          >
            Open ChatGPT Web
          </a>
          <a
            className="hud-button"
            href="https://chatgpt.com/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => logLaunch("ChatGPT Voice")}
          >
            Open ChatGPT Voice
          </a>
          <button className="hud-button" type="button" onClick={() => copyText(buildTodayContext(data), "Today context copied.")}>
            Copy Today Context
          </button>
        </div>
      </Panel>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {promptCards.map((card) => (
          <Panel key={card.title} title={card.title} kicker="Prompt generator">
            <p className="min-h-28 text-sm leading-6 text-cyan-100/70">{card.prompt}</p>
            <button className="hud-button mt-4 w-full" type="button" onClick={() => copyText(card.prompt, `${card.title} prompt copied.`)}>
              Copy Prompt
            </button>
          </Panel>
        ))}
      </div>
    </div>
  );
}

