# J-Core UI Rebuild Plan

## Goal

Rebuild J-Core from a visually noisy demo into a clear AI command center.

User feedback:

- The golden orb is about 60% acceptable.
- Other areas feel chaotic, visually noisy, and do not communicate system meaning.
- The system should feel like an emotional intelligence, not a random sci-fi dashboard.
- Keep iterating until the owner approves the interface.

## Design direction

J-Core should feel like:

- A living AI cockpit.
- Calm by default, powerful when activated.
- Modular, not scattered.
- Emotional, but not childish.
- Cinematic, but still readable and useful.

## Non-negotiable structure

```text
Top bar
├─ System identity
├─ Live state
├─ Time / runtime
└─ Connection health

Left rail
├─ Chat
├─ Missions
├─ Agents
├─ Purple Office
├─ Memory
├─ Router
├─ Logs
└─ Settings

Center
├─ Living orb
├─ Current AI emotional state
├─ Active module summary
└─ Command composer

Right rail
├─ Agent status
├─ Approvals
├─ Memory pulse
└─ Hermes / 9Router health

Bottom
└─ Mission timeline / system pulse
```

## Emotional orb states

| State | Meaning | Motion | Color |
|---|---|---|---|
| Calm | Idle, stable, ready | slow breathing | gold |
| Listening | User input / mic / waiting | ring opens outward | cyan |
| Thinking | Planning / reasoning | denser inner lattice | violet |
| Speaking | Replying / streaming | wave pulses | green |
| Alert | Approval / error / risky action | sharper pulse | red |
| Creative | Image/design/ideation | aurora swirl | magenta |
| Web | Browser ops / link graph / web monitoring | web-net pulse | red + cyan |

The orb must not just glow randomly. Its motion should communicate system state.

## Module color semantics

| Module | Realm | Color | Meaning |
|---|---|---|---|
| Chat | Core | Gold | Conversation / command |
| Missions | Mind | Blue | Planning / execution |
| Agents | Power | Orange | Worker fleet |
| Purple Office | Soul | Violet | Visual agent office |
| Memory | Time | Green | Recall / knowledge |
| Router | Space | Cyan | Model/provider routing |
| Logs | Reality | Red | Debug / observability |
| Settings | Core | Slate | Configuration |

## Iteration rule

Do not keep adding visual elements until the composition works.

Each iteration should improve one of:

1. Layout clarity.
2. Color meaning.
3. Orb emotional behavior.
4. Agent office readability.
5. Command/chat usability.
6. Backend readiness.

## Current v1 implementation scope

- Replace full-page Avengers Tower root with J-Core command shell.
- Preserve Avengers/Purple Office only as one module.
- Add emotional orb state controls.
- Add module registry.
- Add meaningful dashboard panels.
- Use mock Hermes/9Router/agent data for now.

## Next iterations

### v2

- Replace CSS orb with enhanced R3F orb while preserving state tokens. **Done in local v2.**
- Move module/agent/room data into a canonical model file. **Done in local v2.**
- Make Purple Office rooms selectable with state-driven agent placement. **Done in local v2.**
- Add real module routing and persisted state.
- Improve command composer into real chat shell.

### v3

- Add Hermes dashboard-like module: API server, dashboard, sessions, skills, cron, logs. **Done in local v3 mock UI.**
- Add 9Router quota/provider/fallback module. **Done in local v3 mock UI.**
- Add OpenClaw fleet/gateway module. **Done in local v3 mock UI.**
- Add Spider-inspired Web Ops form: browser agent, link graph, monitor and human-gated web actions. **Done in local v4 mock UI.**
- Add HermesAdapter mock/real switch.
- Add OpenClawAdapter mock/real switch.
- Add RouterAdapter mock/real switch.
- Add mission timeline from real data contract.

### v4

- Upgrade Purple Office into interactive tower rooms.
- Add chibi agent sprites with state-driven movement.

### v5

- User review pass: tune colors, density, rhythm, and emotional state feel until approved.
