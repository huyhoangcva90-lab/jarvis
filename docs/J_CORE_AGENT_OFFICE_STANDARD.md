# J-Core Agent Office Standard

Version: 0.1  
Purpose: standardize J-Core into a local-first AI command center inspired by Hermes Dashboard, agent mission-control dashboards, and virtual agent offices.

## 1. Product thesis

J-Core is not an Avengers website. J-Core is a personal AI operating system:

- Chat, voice, and command input.
- Agent fleet / virtual office.
- Missions, tasks, approvals, and workflows.
- Memory and knowledge vault.
- Model router, usage, quota, and cost.
- Logs, traces, replay, and failure analysis.
- Tools, terminal, browser, files, MCP, and connectors.
- Personal modules such as calendar, finance, content, habits, projects, and daily review.

The Avengers / Infinity Stone / Jarvis visual language is the experience layer. The system underneath should stay modular and replaceable.

## 2. External references researched

### Hermes Agent Dashboard

Pattern:

- Local dashboard started by `hermes dashboard`.
- Status page for gateway, version, active sessions, recent sessions.
- Chat tab can embed a real terminal/TUI via PTY/WebSocket.
- Config editor for provider, model, memory, approvals, terminal, delegation.
- API key manager.
- Sessions browser with messages, tool calls, token usage.
- Logs with live tailing and filters.
- Analytics for token/cost usage.
- Cron jobs for scheduled prompts.
- Skills/toolsets browser.
- Localhost-first security model.

Use in J-Core:

- Hermes should be one backend module, not the whole app.
- J-Core should expose Hermes status, sessions, config, skills, cron, logs, analytics, and chat as panels.

Source: https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/web-dashboard.md

### Hermes Workspace

Pattern:

- Workspace UI separate from Hermes brain.
- Hermes gateway handles chat, models, memory, skills, and jobs.
- Workspace gives chat, memory, skills, terminal, dashboard, agent view, operations.
- Real-time tool cards and mission conductor.
- UI talks to local services on ports such as gateway and dashboard.

Use in J-Core:

- Keep `J-Core UI` and `AI runtime/backend` separate.
- J-Core should connect through adapters rather than hardcoding Hermes/OpenClaw/other runtimes.

Source: https://github.com/outsourc-e/hermes-workspace

### My Virtual Office

Pattern:

- Self-hosted 2D office for AI agents.
- Agents get visual presence: desks, rooms, meetings, movement, status.
- Connects to OpenClaw and Hermes.
- Reads safe profile metadata, live activity events, and chat.
- Does not expose raw secrets/logs by default.

Use in J-Core:

- Avengers Office should be a visualization layer for agents.
- Movement should communicate meaningful states, not random wandering.
- Rooms should map to real operational concepts.

Source: https://myvirtualoffice.ai/

### Mission Control / Open Mission Control

Pattern:

- AI agent control plane.
- Agent fleet health, heartbeat, role assignment, task pipeline, recent activity.
- Departments/org hierarchy.
- Kanban workflow.
- Cost tracking, logs, skills, memory, cron, security, alerts.
- SQLite/local-first persistence.
- REST API adapters for multiple agent runtimes.

Use in J-Core:

- J-Core needs a real operations layer: tasks, agents, runs, logs, approvals, costs.
- Agent Office should sit on top of this operations layer.

Sources:

- https://github.com/builderz-labs/mission-control
- https://openclaw-mission-control.dplooy.com/

### CommandRoom

Pattern:

- Observability and control for production AI agents.
- Timeline for LLM calls, tool use, browser steps.
- Human Gates for risky actions.
- Cost intelligence and runaway-loop detection.
- Failure analysis, decision DAGs, replayable traces.

Use in J-Core:

- Every mission/agent run should produce trace events.
- Human approval must be a first-class object.
- Cost, errors, and loops should be visible in the dashboard.

Source: https://www.commandroom.dev/

## 3. J-Core target architecture

```text
J-Core Shell
├─ Command Orb
│  ├─ Chat
│  ├─ Voice
│  ├─ Command palette
│  └─ Context composer
├─ Mission Control
│  ├─ Missions
│  ├─ Tasks
│  ├─ Approvals
│  ├─ Runs
│  └─ Deliverables
├─ Agent Operations
│  ├─ Agent registry
│  ├─ Agent profiles
│  ├─ Heartbeats
│  ├─ Work queues
│  └─ Direct agent chat
├─ Agent Office / Avengers Office
│  ├─ Tower map
│  ├─ Rooms
│  ├─ Shared hall
│  ├─ Chibi agents
│  └─ Activity visualization
├─ Memory & Knowledge
│  ├─ Memories
│  ├─ Notes
│  ├─ Files
│  ├─ Embeddings/search
│  └─ Context packs
├─ Router & Usage
│  ├─ Providers
│  ├─ Models
│  ├─ Quota
│  ├─ Token/cost analytics
│  └─ Routing policy
├─ Automation
│  ├─ Cron jobs
│  ├─ Recurring tasks
│  ├─ Webhooks
│  └─ Night crew
├─ Observability
│  ├─ Logs
│  ├─ Traces
│  ├─ Tool calls
│  ├─ Browser steps
│  └─ Replay/debug
├─ Tools
│  ├─ Terminal
│  ├─ Browser
│  ├─ Files
│  ├─ MCP
│  └─ Custom tools
└─ Personal OS
   ├─ Calendar
   ├─ Finance
   ├─ Content
   ├─ Habits
   ├─ Projects
   └─ Daily review
```

## 4. Shell rule

No module can replace the whole app.

The root shell must always remain:

- Orb / command area.
- Main workspace.
- Module navigation.
- Status surface.
- Global command input.

Avengers Office, Hermes Dashboard, Mission Control, Memory, Router, and Tools are modules inside the shell.

## 5. Standard navigation

Recommended desktop layout:

```text
┌──────────────────────────────────────────────────────────────┐
│ Top status bar: J-Core state, active model, cost, clock       │
├──────────────┬───────────────────────────────┬───────────────┤
│ Module rail  │ Main workspace                │ Context rail   │
│              │                               │               │
│ Chat         │ Chat / mission / office /     │ Agent status   │
│ Missions     │ memory / terminal / logs      │ Memory         │
│ Agents       │                               │ Approvals      │
│ Office       │                               │ Current run    │
│ Memory       │                               │               │
│ Router       │                               │               │
│ Tools        │                               │               │
│ Settings     │                               │               │
├──────────────┴───────────────────────────────┴───────────────┤
│ Command bar: ask, instruct, attach, mic, run, approve         │
└──────────────────────────────────────────────────────────────┘
```

Mobile layout:

- Main workspace first.
- Bottom navigation with max 5 primary items.
- Secondary modules behind drawer.
- Command bar sticky at bottom.
- Office can degrade into room cards instead of full canvas.

## 6. Avengers Office standard

The Avengers Office belongs to the purple realm/module.

### Required office structure

```text
Avengers Tower
├─ Lobby / Shared Hall
│  └─ All active agents stand in assigned zones
├─ Strategy Room
│  └─ Planning, mission breakdown, priorities
├─ Workshop
│  └─ Coding, building, tool execution
├─ Intelligence Room
│  └─ Research, browser, documents, knowledge
├─ Memory Archive
│  └─ Memory, notes, context packs
├─ Monitoring Room
│  └─ Logs, traces, costs, health
├─ Approval Room
│  └─ Human gates and risky actions
└─ Rooftop / Launch Bay
   └─ Deployments, publishing, external actions
```

### Agent-to-character mapping

| Character | Agent role | Office behavior |
|---|---|---|
| Iron Man | Architect / Builder | Stands near hologram desk, opens build panels |
| Captain America | Mission Lead | Stands at strategy table, organizes tasks |
| Thor | Automation / Power | Moves to launch bay for scheduled/heavy actions |
| Hulk | Debugger / Breaker | Goes to workshop when tests fail or bugs appear |
| Black Widow | Research / Intel | Goes to intelligence room, browser/search activity |
| Hawkeye | QA / Precision | Goes to review area, checks details and diffs |
| Doctor Strange | Strategy / Time | Handles planning, timelines, simulations |
| Spider-Man | Web / Browser | Handles web interactions and lightweight tasks |
| Vision | Memory / Knowledge | Stays near archive, retrieves context |
| Nick Fury | Operator / User proxy | Control desk, approvals, escalation |

### Movement rules

Avoid random wandering. Movement must represent state:

- `idle`: agent stays at own desk.
- `thinking`: subtle animation near desk.
- `assigned`: walks to relevant room.
- `working`: performs loop/activity animation.
- `blocked`: red/yellow marker and moves to approval/help area.
- `done`: returns to shared hall or deliverable zone.
- `error`: moves to monitoring/debug room.

### Visual style

- Cute chibi proportions.
- Clear silhouette and signature tool/accessory.
- No copyrighted image copying. Use original inspired designs.
- Use SVG/canvas sprites where possible for sharp scaling.
- Purple module palette: violet, magenta, deep navy, glass panels, neon edges.

## 7. Core data model

Minimum entities:

```ts
type AgentStatus =
  | "offline"
  | "idle"
  | "thinking"
  | "assigned"
  | "working"
  | "waiting_approval"
  | "blocked"
  | "done"
  | "error";

type MissionStatus =
  | "inbox"
  | "planning"
  | "queued"
  | "working"
  | "waiting_approval"
  | "review"
  | "completed"
  | "failed"
  | "cancelled";

type AgentProfile = {
  id: string;
  name: string;
  character: string;
  role: string;
  runtime: "local" | "hermes" | "openclaw" | "codex" | "custom";
  model?: string;
  skills: string[];
  status: AgentStatus;
  roomId: string;
  currentMissionId?: string;
  heartbeatAt?: string;
};

type Mission = {
  id: string;
  title: string;
  goal: string;
  status: MissionStatus;
  priority: "low" | "medium" | "high" | "critical";
  assignedAgentIds: string[];
  steps: MissionStep[];
  approvals: Approval[];
  createdAt: string;
  updatedAt: string;
};

type AgentRun = {
  id: string;
  missionId?: string;
  agentId: string;
  input: string;
  status: "running" | "waiting_approval" | "completed" | "failed";
  traceIds: string[];
  tokenUsage?: TokenUsage;
  costUsd?: number;
  startedAt: string;
  endedAt?: string;
};

type TraceEvent = {
  id: string;
  runId: string;
  type: "llm" | "tool" | "browser" | "file" | "shell" | "approval" | "error" | "system";
  title: string;
  summary?: string;
  payload?: unknown;
  createdAt: string;
};

type Approval = {
  id: string;
  runId?: string;
  missionId?: string;
  risk: "low" | "medium" | "high";
  action: string;
  reason: string;
  status: "pending" | "approved" | "rejected" | "expired";
  createdAt: string;
  resolvedAt?: string;
};
```

## 8. Adapter standard

Every runtime should connect through adapters:

```text
HermesAdapter
├─ getStatus()
├─ listSessions()
├─ sendMessage()
├─ listSkills()
├─ listCronJobs()
├─ listLogs()
└─ getAnalytics()

OpenClawAdapter
├─ listAgents()
├─ getAgentStatus()
├─ sendAgentMessage()
├─ subscribeEvents()
└─ listTools()

RouterAdapter
├─ listProviders()
├─ listModels()
├─ getUsage()
├─ estimateCost()
└─ routePrompt()

MissionAdapter
├─ createMission()
├─ assignAgent()
├─ updateStatus()
├─ requestApproval()
└─ recordTrace()
```

UI must not directly call Hermes/OpenClaw/Router internals. UI calls J-Core adapters.

## 9. Persistence standard

Recommended phases:

### Phase A: Local-only MVP

- IndexedDB or localStorage for UI state.
- JSON export/import.
- Mock adapters.

### Phase B: Local backend

- SQLite database.
- REST/WebSocket API.
- Local file vault for memories and artifacts.
- `.env` for provider keys.

### Phase C: Multi-runtime

- Hermes gateway.
- OpenClaw gateway.
- Codex / CLI runtime.
- MCP servers.
- Browser/terminal tools.

## 10. UI module registry

All modules should be registered, not hardcoded:

```ts
type JCoreModule = {
  id: string;
  label: string;
  realm: "core" | "mind" | "time" | "space" | "reality" | "power" | "soul";
  color: "gold" | "green" | "blue" | "red" | "violet" | "orange";
  icon: string;
  panel: "main" | "side" | "drawer" | "modal";
  defaultEnabled: boolean;
  requiresAdapter?: string[];
};
```

Suggested modules:

- `chat`
- `missions`
- `agents`
- `avengers-office`
- `memory`
- `knowledge`
- `router`
- `schedule`
- `finance`
- `tools`
- `terminal`
- `logs`
- `approvals`
- `settings`

## 11. Implementation roadmap

### Milestone 0: repo recovery

- Sync local code to live `origin/main`.
- Remove stale generated assets only after confirming target.
- Fix corrupted Vietnamese encoding.
- Restore docs folder.
- Make sure Avengers Office is a module, not root app.

### Milestone 1: shell standardization

- Create canonical `JCoreShell`.
- Add module registry.
- Add stable layout: rail, main workspace, context rail, command bar.
- Add routing/state so current module persists.

### Milestone 2: data contracts

- Add TypeScript types for Agent, Mission, Run, Trace, Approval, Memory, Tool, Connector.
- Move mock data behind adapters.
- Add local persistence layer.

### Milestone 3: Avengers Office v2

- Build purple module.
- Add tower map on left.
- Add room selection.
- Add shared hall.
- Add chibi agent roster.
- Add state-driven movement rules.
- Add detail panel for selected agent.

### Milestone 4: Hermes integration

- Add Hermes status panel.
- Add sessions panel.
- Add skills panel.
- Add cron/jobs panel.
- Add config/API key surface only if local security is handled.

### Milestone 5: Mission Control

- Add mission board.
- Add assign-to-agent flow.
- Add approvals.
- Add run trace timeline.
- Add cost and token widgets.

### Milestone 6: real operations

- WebSocket event bus.
- Agent heartbeat.
- Tool-call cards.
- Logs/live tail.
- Failure analysis.
- Replay/debug view.

### Milestone 7: personal OS modules

- Calendar/schedule.
- Finance.
- Project dashboard.
- Content pipeline.
- Daily review.
- Habit/routine automation.

## 12. Non-negotiable quality rules

- Do not make any module hijack the whole app.
- Do not use random agent movement.
- Do not expose secrets in office/dashboard views.
- Do not hardcode external runtime details into UI components.
- Do not rely only on localStorage after backend phase starts.
- Use accessible contrast and keyboard navigation.
- Keep touch targets at least 44px.
- Respect reduced motion.
- Prefer semantic color tokens over raw hex values in components.
- Every risky external action needs an approval object.

## 13. First local implementation task

Start with this:

1. Create a clean branch from `origin/main`.
2. Add `JCoreShell`.
3. Add `moduleRegistry`.
4. Convert Avengers Office into `modules/avengers-office`.
5. Add mock `AgentAdapter`.
6. Display agent office from adapter state.
7. Add `TraceEvent` and `Approval` types even if still mocked.

This makes J-Core ready to connect to Hermes/OpenClaw later without rewriting the UI.

