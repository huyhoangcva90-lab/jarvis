import { useState } from "react";
import { TesseractProvider, useTesseract } from "./tesseract/useTesseract";
import ModuleRail from "./components/shell/ModuleRail";
import EmotionSwitcher from "./components/shell/EmotionSwitcher";
import LivingOrbCard from "./components/shell/LivingOrbCard";
import ModuleDeck from "./components/shell/ModuleDeck";
import ContextRail from "./components/shell/ContextRail";
import CommandComposer from "./components/shell/CommandComposer";

// Legacy 3D tower/office components still import this shared shape during typecheck.
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
  const [isHudHidden, setIsHudHidden] = useState(false);
  const [isHoverRevealed, setIsHoverRevealed] = useState(false);

  return (
    <main
      className={`jcore-shell ${isHudHidden ? "hud-collapsed" : ""} ${isHoverRevealed ? "hover-revealed" : ""}`}
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
          <button
            onClick={() => setIsHudHidden(!isHudHidden)}
            style={{
              background: isHudHidden ? 'rgba(105, 232, 255, 0.25)' : 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(175, 220, 240, 0.25)',
              color: '#eef7fb',
              padding: '3px 10px',
              borderRadius: '4px',
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '11px',
              cursor: 'pointer',
              marginRight: '8px'
            }}
            title="Ẩn/Hiện HUD thanh điều khiển"
          >
            {isHudHidden ? '👁️ SHOW HUD' : '👁️ HIDE HUD'}
          </button>
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

      {/* Right Hover Trigger Zone when HUD is hidden */}
      {isHudHidden && (
        <div
          className="right-hover-trigger-zone"
          onMouseEnter={() => setIsHoverRevealed(true)}
          onMouseLeave={() => setIsHoverRevealed(false)}
          title="Hover sang phải để hiện HUD"
        />
      )}

      <div
        className="hud-context-wrapper"
        onMouseEnter={() => isHudHidden && setIsHoverRevealed(true)}
        onMouseLeave={() => isHudHidden && setIsHoverRevealed(false)}
      >
        <ContextRail />
      </div>

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
