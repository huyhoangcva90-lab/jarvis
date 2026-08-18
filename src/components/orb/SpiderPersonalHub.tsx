import { useState } from "react";
import type { AiActivity } from "../../App";

type Message = { id: string; role: "user" | "assistant"; text: string; at: number };

type Props = {
  currentTime: string;
  username: string;
  connections: { gateway: boolean; hermes: boolean; openclaw: boolean; nineRouter: boolean };
  messages: Message[];
  isSending: boolean;
  onAskEv: (prompt: string) => void;
  onExit: () => void;
  onResetView: () => void;
};

export default function SpiderPersonalHub({
  currentTime,
  username,
  connections,
  messages,
  isSending,
  onAskEv,
  onExit,
  onResetView,
}: Props) {
  const [mapOpen, setMapOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"missions" | "stats" | "map">("missions");

  return (
    <div className="spider-realm-hud fixed inset-0 z-20 pointer-events-none flex flex-col justify-between p-4 md:p-6 text-white font-mono">
      {/* Top Header Bar */}
      <header className="pointer-events-auto flex items-center justify-between bg-black/60 backdrop-blur-md border border-red-500/40 rounded-xl px-4 py-3 shadow-[0_0_20px_rgba(255,24,59,0.25)]">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/50 text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-[0_0_15px_rgba(255,24,59,0.6)]"
            title="Quay lại Soul Mode (Cam)"
          >
            <span>← QUAY LẠI SOUL MODE</span>
          </button>

          <div className="h-4 w-[1px] bg-red-500/30" />

          <div className="flex items-center gap-2">
            <span className="text-red-500 text-lg font-black tracking-widest">🕷️ SPIDER-MAN LIFE</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-800/60 uppercase">
              Realm Active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="hidden sm:flex items-center gap-2 text-zinc-400">
            <span>OPERATOR:</span>
            <strong className="text-red-400 font-bold">{username}</strong>
          </div>
          <div className="text-red-300 font-bold tracking-wider">{currentTime}</div>
        </div>
      </header>

      {/* Embedded Map Modal if open */}
      {mapOpen && (
        <div className="pointer-events-auto fixed inset-4 md:inset-10 z-50 bg-zinc-950/95 border border-red-500/50 rounded-2xl overflow-hidden flex flex-col shadow-[0_0_50px_rgba(255,24,59,0.35)] backdrop-blur-xl">
          <div className="flex items-center justify-between bg-zinc-900/90 px-4 py-3 border-b border-red-500/30">
            <div className="flex items-center gap-3">
              <span className="text-red-400 font-bold text-sm">🗺️ SPIDEY TRACKER MAP INTEGRATION</span>
              <a
                href="./spideytracker/index.html"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-zinc-400 hover:text-red-300 underline"
              >
                Mở tab độc lập ↗
              </a>
            </div>
            <button
              type="button"
              onClick={() => setMapOpen(false)}
              className="px-3 py-1 bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white rounded border border-red-500/40 text-xs font-bold transition"
            >
              ✕ ĐÓNG MAP
            </button>
          </div>
          <iframe
            src="./spideytracker/index.html"
            title="SpideyTracker Map"
            className="w-full flex-1 border-none"
          />
        </div>
      )}

      {/* Main Content Stage (HUD Panels) */}
      <div className="flex-1 flex items-center justify-between py-4 pointer-events-none">
        {/* Left Panel: RPG Status & Progression */}
        <aside className="pointer-events-auto w-72 md:w-80 bg-black/65 backdrop-blur-md border border-red-500/30 rounded-xl p-4 flex flex-col gap-3 shadow-[0_0_25px_rgba(255,24,59,0.15)]">
          <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
            <span className="text-xs text-red-400 font-bold tracking-wider">HERO STATUS</span>
            <span className="text-[10px] text-zinc-400">LVL 12 // VIGILANTE</span>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <div className="flex justify-between text-[11px] text-zinc-300 mb-1">
                <span>XP PROGRESS</span>
                <span className="text-red-400 font-bold">2,450 / 3,000</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full w-[81%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-zinc-300 mb-1">
                <span>ENERGY / STAMINA</span>
                <span className="text-amber-400 font-bold">92%</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[92%]" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-red-500/20 text-center">
            <div className="bg-red-950/40 border border-red-500/20 rounded p-2">
              <div className="text-[10px] text-zinc-400">DAILY WALK</div>
              <div className="text-sm font-bold text-red-300">4.2 km</div>
            </div>
            <div className="bg-red-950/40 border border-red-500/20 rounded p-2">
              <div className="text-[10px] text-zinc-400">QUEST STREAK</div>
              <div className="text-sm font-bold text-red-300">7 Ngày</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMapOpen(true)}
            className="mt-2 w-full py-2 bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white rounded-lg border border-red-500/50 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-[0_0_15px_rgba(255,24,59,0.5)]"
          >
            <span>🗺️ MỞ BẢN ĐỒ KHÁM PHÁ (MAP)</span>
          </button>
        </aside>

        {/* Right Panel: Daily Real-Life Quests */}
        <aside className="pointer-events-auto w-72 md:w-80 bg-black/65 backdrop-blur-md border border-red-500/30 rounded-xl p-4 flex flex-col gap-3 shadow-[0_0_25px_rgba(255,24,59,0.15)]">
          <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
            <span className="text-xs text-red-400 font-bold tracking-wider">ACTIVE MISSIONS</span>
            <span className="text-[10px] text-emerald-400">2 / 3 HOÀN THÀNH</span>
          </div>

          <ul className="space-y-2 text-xs">
            <li className="p-2 rounded bg-zinc-900/80 border border-emerald-500/40 flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <div>
                <div className="font-semibold text-zinc-200 line-through opacity-80">Đi bộ tuần tra 4km</div>
                <div className="text-[10px] text-emerald-400">+150 XP • +50 Gold</div>
              </div>
            </li>
            <li className="p-2 rounded bg-zinc-900/80 border border-emerald-500/40 flex items-start gap-2">
              <span className="text-emerald-400 font-bold">✓</span>
              <div>
                <div className="font-semibold text-zinc-200 line-through opacity-80">Học tập / Research 2 tiếng</div>
                <div className="text-[10px] text-emerald-400">+200 XP • Skill Focus</div>
              </div>
            </li>
            <li className="p-2 rounded bg-red-950/40 border border-red-500/40 flex items-start gap-2 animate-pulse">
              <span className="text-red-400 font-bold">○</span>
              <div>
                <div className="font-semibold text-red-200">Hoàn thành Sprint Deploy JARVIS</div>
                <div className="text-[10px] text-red-400">+500 XP • Trophy Unlock</div>
              </div>
            </li>
          </ul>

          <div className="pt-2 border-t border-red-500/20 flex gap-2">
            <button
              type="button"
              onClick={() => onAskEv("Tóm tắt tiến độ Spider-Man Life hôm nay và đề xuất nhiệm vụ tiếp theo.")}
              className="flex-1 py-1.5 bg-zinc-900 hover:bg-red-950 text-zinc-300 hover:text-red-200 border border-zinc-700 hover:border-red-500/50 rounded text-[11px] transition"
            >
              Báo cáo tiến độ
            </button>
          </div>
        </aside>
      </div>

      {/* Bottom Action Footer */}
      <footer className="pointer-events-auto flex items-center justify-between bg-black/60 backdrop-blur-md border border-red-500/40 rounded-xl px-4 py-2 text-xs">
        <div className="flex items-center gap-2 text-zinc-400">
          <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          <span>EV SUIT ASSISTANT CONNECTED</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onResetView}
            className="px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-[11px] transition"
          >
            Reset 3D View
          </button>
          <button
            type="button"
            onClick={onExit}
            className="px-3 py-1 rounded bg-red-600/30 hover:bg-red-600 text-red-300 hover:text-white border border-red-500/50 text-[11px] font-bold transition"
          >
            Về SOUL Mode (Cam)
          </button>
        </div>
      </footer>
    </div>
  );
}
