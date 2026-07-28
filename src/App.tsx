import { TesseractProvider, useTesseract } from "./tesseract/useTesseract";
import ModuleRail from "./components/shell/ModuleRail";
import EmotionSwitcher from "./components/shell/EmotionSwitcher";
import LivingOrbCard from "./components/shell/LivingOrbCard";
import ModuleDeck from "./components/shell/ModuleDeck";
import ContextRail from "./components/shell/ContextRail";
import CommandComposer from "./components/shell/CommandComposer";

// Legacy 3D tower/office components still import this shared shape during typecheck.
// The new shell does not render them directly, but keeping the contract prevents
// old modules from breaking while we migrate them into proper J-Core modules.
export type Agent = {
  id: string;
  codename: string;
  name: string;
  role: string;
  floor: string;
  room: string;
  equipment: string;
  station: string;
  color: string;
  rgb: string;
  status: "ACTIVE" | "STANDBY";
  load: number;
  description: string;
  skills: string[];
  prompt: string;
};

function AppShell() {
  const { activeModule, emotionState, clock } = useTesseract();

  return (
    <main
      className="jcore-shell"
      style={
        {
          "--active": activeModule.color,
          "--active-rgb": activeModule.rgb,
          "--emotion": emotionState.color,
          "--emotion-rgb": emotionState.rgb
        } as React.CSSProperties
      }
    >
      <a className="skip-link" href="#main-workspace">
        Skip to workspace
      </a>
      <ModuleRail />

      <header className="jcore-topbar">
        <div>
          <span>J-Core Console</span>
          <b>TESSERACT AI Command System</b>
        </div>
        <div className="topbar-status">
          <p>
            <i /> Local UI
          </p>
          <p>Hermes bridge: planned</p>
          <p>9Router: planned</p>
          <time>{clock}</time>
        </div>
      </header>

      <EmotionSwitcher />

      <div className="main-workspace" id="main-workspace">
        <LivingOrbCard />
        <ModuleDeck />
      </div>

      <ContextRail />
      <CommandComposer />
    </main>
  );
}

export default function App() {
  return (
    <TesseractProvider>
      <AppShell />
    </TesseractProvider>
  );
}
