export interface ObsidianNoteNode {
  id: string;
  title: string;
  path: string;
  tags: string[];
  links: string[];
  summary: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface ObsidianEdge {
  source: string;
  target: string;
}

export interface ObsidianGraphData {
  nodes: ObsidianNoteNode[];
  edges: ObsidianEdge[];
}

export function parseObsidianNote(path: string, content: string): ObsidianNoteNode {
  const fileName = path.split("/").pop() || path;
  const title = fileName.replace(/\.md$/i, "");
  
  // Extract wikilinks [[Target]] or [[Target|Alias]]
  const linkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
  const links: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = linkRegex.exec(content)) !== null) {
    if (match[1] && !links.includes(match[1].trim())) {
      links.push(match[1].trim());
    }
  }

  // Extract tags #tag_name
  const tagRegex = /(?:^|\s)#([a-zA-Z0-9_\-\/]+)/g;
  const tags: string[] = [];
  while ((match = tagRegex.exec(content)) !== null) {
    if (match[1] && !tags.includes(match[1])) {
      tags.push(match[1]);
    }
  }

  // Extract summary lines
  const lines = content.split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
  const summary = lines.slice(0, 2).join(" ") || "Obsidian markdown note.";

  return {
    id: title,
    title,
    path,
    tags,
    links,
    summary: summary.length > 120 ? `${summary.slice(0, 117)}...` : summary,
  };
}

export function buildObsidianGraph(notes: { path: string; content: string }[]): ObsidianGraphData {
  const parsedNodes = notes.map((n) => parseObsidianNote(n.path, n.content));
  const nodeMap = new Map<string, ObsidianNoteNode>();
  
  parsedNodes.forEach((node) => nodeMap.set(node.id, node));

  const edges: ObsidianEdge[] = [];
  parsedNodes.forEach((node) => {
    node.links.forEach((targetTitle) => {
      // If target node doesn't exist yet, create a placeholder node
      if (!nodeMap.has(targetTitle)) {
        nodeMap.set(targetTitle, {
          id: targetTitle,
          title: targetTitle,
          path: `${targetTitle}.md`,
          tags: ["linked"],
          links: [],
          summary: "Linked note reference.",
        });
      }
      edges.push({ source: node.id, target: targetTitle });
    });
  });

  const nodes = Array.from(nodeMap.values());

  // Layout positioning using simple radial distribution
  const count = nodes.length;
  const radius = Math.min(240, Math.max(120, count * 35));
  nodes.forEach((node, idx) => {
    const angle = (idx / count) * 2 * Math.PI;
    node.x = Math.cos(angle) * radius + (Math.random() * 20 - 10);
    node.y = Math.sin(angle) * radius + (Math.random() * 20 - 10);
  });

  return { nodes, edges };
}
