export interface ObsidianNoteNode {
  id: string;
  title: string;
  path: string;
  folder: string;
  topic: string;
  tags: string[];
  links: string[];
  linkIds: string[];
  backlinks: string[];
  summary: string;
  placeholder?: boolean;
  x?: number;
  y?: number;
}

export interface ObsidianEdge {
  source: string;
  target: string;
}

export interface ObsidianTopic {
  id: string;
  label: string;
  count: number;
}

export interface ObsidianGraphData {
  nodes: ObsidianNoteNode[];
  edges: ObsidianEdge[];
  topics: ObsidianTopic[];
}

function normalizeId(value: string) {
  return value.replace(/\\/g, "/").replace(/\.md$/i, "").replace(/^\/+|\/+$/g, "").toLowerCase();
}

function parseFrontmatter(content: string) {
  if (!content.startsWith("---")) return {} as Record<string, string>;
  const end = content.indexOf("\n---", 3);
  if (end < 0) return {} as Record<string, string>;
  return Object.fromEntries(content.slice(3, end).split(/\r?\n/).flatMap((line) => {
    const separator = line.indexOf(":");
    return separator > 0 ? [[line.slice(0, separator).trim().toLowerCase(), line.slice(separator + 1).trim()]] : [];
  }));
}

function parseTags(content: string, frontmatter: Record<string, string>) {
  const tags = new Set<string>();
  String(frontmatter.tags || "").replace(/^\[|\]$/g, "").split(",").map((tag) => tag.trim().replace(/^#/, "")).filter(Boolean).forEach((tag) => tags.add(tag));
  for (const match of content.matchAll(/(?:^|\s)#([\p{L}\p{N}_\-/]+)/gu)) tags.add(match[1]);
  return [...tags].slice(0, 16);
}

function noteTopic(tags: string[], folder: string) {
  const candidate = tags[0]?.split("/")[0] || folder.split("/")[0] || "inbox";
  return candidate.trim().toLowerCase() || "inbox";
}

export function parseObsidianNote(path: string, content: string): ObsidianNoteNode {
  const normalizedPath = path.replace(/\\/g, "/");
  const fileName = normalizedPath.split("/").pop() || normalizedPath;
  const folder = normalizedPath.includes("/") ? normalizedPath.slice(0, normalizedPath.lastIndexOf("/")) : "Inbox";
  const frontmatter = parseFrontmatter(content);
  const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const title = String(frontmatter.title || heading || fileName.replace(/\.md$/i, ""));
  const links = [...new Set([...content.matchAll(/\[\[([^\]|#]+)(?:#[^\]|]+)?(?:\|[^\]]+)?\]\]/g)].map((match) => match[1].trim()).filter(Boolean))];
  const tags = parseTags(content, frontmatter);
  const bodyLines = content
    .replace(/^---[\s\S]*?^---\s*/m, "")
    .split(/\r?\n/)
    .map((line) => line.replace(/^#+\s*/, "").trim())
    .filter((line) => line && !line.startsWith("#") && !/^[-*]\s*$/.test(line));
  const summaryText = bodyLines.slice(0, 3).join(" ").replace(/\[\[|\]\]/g, "");

  return {
    id: normalizeId(normalizedPath),
    title,
    path: normalizedPath,
    folder,
    topic: noteTopic(tags, folder),
    tags,
    links,
    linkIds: [],
    backlinks: [],
    summary: summaryText ? (summaryText.length > 180 ? `${summaryText.slice(0, 177)}...` : summaryText) : "Obsidian markdown note.",
  };
}

export function buildObsidianGraph(notes: { path: string; content: string }[]): ObsidianGraphData {
  const nodes = notes.map((note) => parseObsidianNote(note.path, note.content));
  const byId = new Map(nodes.map((node) => [node.id, node]));
  const byTitle = new Map<string, ObsidianNoteNode>();
  for (const node of nodes) {
    byTitle.set(normalizeId(node.title), node);
    byTitle.set(normalizeId(node.path.split("/").pop() || node.title), node);
  }

  const edges: ObsidianEdge[] = [];
  for (const node of [...nodes]) {
    for (const rawTarget of node.links) {
      const key = normalizeId(rawTarget);
      let target = byTitle.get(key) || byId.get(key);
      if (!target) {
        target = {
          id: `missing:${key}`,
          title: rawTarget,
          path: `${rawTarget}.md`,
          folder: "Unresolved",
          topic: "unresolved",
          tags: ["unresolved"],
          links: [],
          linkIds: [],
          backlinks: [],
          summary: "Liên kết này chưa có note tương ứng trong vault.",
          placeholder: true,
        };
        nodes.push(target);
        byTitle.set(key, target);
      }
      if (node.linkIds.includes(target.id)) continue;
      node.linkIds.push(target.id);
      target.backlinks.push(node.id);
      edges.push({ source: node.id, target: target.id });
    }
  }

  const grouped = new Map<string, ObsidianNoteNode[]>();
  for (const node of nodes) grouped.set(node.topic, [...(grouped.get(node.topic) || []), node]);
  const topics = [...grouped.entries()]
    .map(([id, topicNodes]) => ({ id, label: id.replace(/[-_]/g, " "), count: topicNodes.length }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));

  const clusterRadius = Math.min(250, Math.max(130, topics.length * 54));
  topics.forEach((topic, topicIndex) => {
    const topicNodes = grouped.get(topic.id) || [];
    const topicAngle = topics.length === 1 ? 0 : (topicIndex / topics.length) * Math.PI * 2 - Math.PI / 2;
    const centerX = topics.length === 1 ? 0 : Math.cos(topicAngle) * clusterRadius;
    const centerY = topics.length === 1 ? 0 : Math.sin(topicAngle) * clusterRadius;
    const nodeRadius = Math.min(82, Math.max(34, topicNodes.length * 9));
    topicNodes.forEach((node, nodeIndex) => {
      const angle = topicNodes.length === 1 ? 0 : (nodeIndex / topicNodes.length) * Math.PI * 2;
      node.x = centerX + Math.cos(angle) * nodeRadius;
      node.y = centerY + Math.sin(angle) * nodeRadius;
    });
  });

  return { nodes, edges, topics };
}
