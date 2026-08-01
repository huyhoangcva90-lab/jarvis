# J-Core OS Hub research

Updated: 2026-08-01

## Projects reviewed

| Project | Public signal | Pattern worth keeping | J-Core interpretation |
| --- | ---: | --- | --- |
| [Puter](https://github.com/HeyPuter/puter) | 42.9k GitHub stars | One environment for work, creation, storage and play | Treat files, documents, media and communication as first-class Hub surfaces |
| [daedalOS](https://github.com/DustinBrett/daedalOS) | 13.0k GitHub stars | Persistent windows, app launcher, recent search, file system and many native-feeling apps | Preserve Hub tabs and state; provide a searchable launcher and quick lane |
| [eDEX-UI](https://github.com/GitSquared/edex-ui) | Popular sci-fi terminal project | Cinematic HUD stays useful because terminal, monitor, network and files are live tools | Every decorative zone must communicate state or expose an action |
| [OS.js](https://github.com/os-js/OS.js) | Established web desktop platform | Window manager, application API, GUI toolkit and filesystem abstraction | Keep a stable renderer catalog behind the generative layer |
| [Webamp](https://github.com/captbaritone/webamp) | Widely reused browser media component | A focused media app can feel native, skinnable and reusable inside other desktops | Add Audio Deck and Podcast surfaces instead of generic result cards |
| [AGNT](https://github.com/agnt-gg/agnt) | Active local-first agent OS | Agents, workflows, goals, memory, files, observability and widgets share durable state | Add Automation, Monitor, Inbox and content surfaces alongside chat |
| [Google A2UI](https://github.com/google/A2UI) | Open agent UI specification | Agents send declarative UI; clients map it to trusted components | J-Core accepts Hub payload data, never arbitrary executable UI code |

Star counts are point-in-time public GitHub signals, not quality scores.

## Product conclusions

1. **OS shell first:** the workspace needs a home surface, launcher, tabs, recent state and keyboard access before it needs more visual effects.
2. **Content diversity:** research, maps and dashboards are insufficient. A personal OS also needs files, reading, PDF, notes, inbox, audio, podcasts, feeds and finance.
3. **Operational depth:** automation, monitoring and terminal output must be visible next to content, not hidden behind chat responses.
4. **Trusted composition:** Jarvis chooses from pre-approved renderers and sends data into them. It does not generate arbitrary HTML, CSS or JavaScript.
5. **Progressive density:** Quick Lane handles common actions; search reveals the full catalog; specialized views reveal detail only after launch.

## Implemented catalog

The App Launcher now exposes 32 surfaces across eight groups:

- Intelligence
- World & Space
- Planning
- Work Suite
- Data Systems
- Media Deck
- Creation Lab
- System Core

New specialized surfaces include File Deck, Documents, PDF Reader, Notes, Inbox, Audio Deck, Podcast, Content Feed, Finance, Automation, System Monitor and Terminal.
