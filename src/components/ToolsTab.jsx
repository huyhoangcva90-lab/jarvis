import Panel from "./Panel.jsx";

export default function ToolsTab({ data, addLog }) {
  const logToolLaunch = (name) => {
    addLog(`${name} tool launch requested.`);
  };

  return (
    <Panel title="Quick Launch" kicker="External tools">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(data.toolUrls).map(([name, url]) => (
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
        ))}
      </div>
    </Panel>
  );
}

