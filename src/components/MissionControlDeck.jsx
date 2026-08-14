import { useState } from 'react';
import Panel from './Panel.jsx';
import { useAllStoneStatuses } from '../utils/stoneState.jsx';
import { STONE_META, STONE_COLORS } from '../types/stones.js';

// Import existing tabs
import MissionTab from './MissionTab.jsx';
import MemoryTab from './MemoryTab.jsx';
import TerminalTab from './TerminalTab.jsx';
import ToolsTab from './ToolsTab.jsx';
import SettingsTab from './SettingsTab.jsx';

import NineRouterDashboard from './nineRouterDashboard.jsx';
import OpenclawDashboard from './openclawDashboard.jsx';

const TABS = [
  { id: 'OVERVIEW', label: 'TỔNG QUAN' },
  { id: 'MISSIONS', label: 'NHIỆM VỤ' },
  { id: 'AGENTS', label: 'TÁC NHÂN' },
  { id: 'ROUTER', label: '9ROUTER' },
  { id: 'SCHEDULE', label: 'LỊCH TRÌNH' },
  { id: 'FINANCE', label: 'TÀI CHÍNH' },
  { id: 'KNOWLEDGE', label: 'TRI THỨC' },
  { id: 'MEMORY', label: 'BỘ NHỚ' },
  { id: 'TERMINAL', label: 'TERMINAL' },
  { id: 'TOOLS', label: 'CÔNG CỤ' },
  { id: 'SETTINGS', label: 'CẤU HÌNH' },
];

export default function MissionControlDeck({ data, updateData, addLog, copyText, hardReset, currentTime, onLock }) {
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const stoneStatuses = useAllStoneStatuses();

  const renderContent = () => {
    switch (activeTab) {
      case 'OVERVIEW':
        return (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {stoneStatuses.map((s) => (
              <Panel key={s.id} title={STONE_META[s.id].label} kicker={STONE_META[s.id].domain}>
                <div className="flex items-center gap-4 py-2">
                  <div className="text-4xl">{STONE_META[s.id].icon}</div>
                  <div>
                    <p className="font-mono text-xs uppercase text-cyan-100/50">Trạng thái</p>
                    <span
                      className="mt-1 inline-block rounded border px-2 py-0.5 font-mono text-xs uppercase"
                      style={{
                        borderColor: STONE_COLORS[s.id].border,
                        color: STONE_COLORS[s.id].primary,
                        background: STONE_COLORS[s.id].bg,
                      }}
                    >
                      {s.status}
                    </span>
                  </div>
                </div>
              </Panel>
            ))}
          </div>
        );
      case 'MISSIONS':
        return <MissionTab data={data} updateData={updateData} addLog={addLog} />;
      case 'AGENTS':
        return <OpenclawDashboard data={data} addLog={addLog} />;
      case 'ROUTER':
        return <NineRouterDashboard data={data} addLog={addLog} />;
      case 'SCHEDULE':
        return (
          <Panel title="Lịch trình Time Stone" kicker="Personal OS · Phase 6">
            <div className="flex min-h-[200px] items-center justify-center font-mono text-sm text-cyan-100/40">
              <p>⏳ Lịch trình, Thói quen & Tự động hóa — Đang phát triển ở Phase 6</p>
            </div>
          </Panel>
        );
      case 'FINANCE':
        return (
          <Panel title="Tài chính Reality Stone" kicker="Finance System · Phase 7">
            <div className="flex min-h-[200px] items-center justify-center font-mono text-sm text-cyan-100/40">
              <p>💎 Quản lý Thu nhập, Chi tiêu & Ngân sách — Đang phát triển ở Phase 7</p>
            </div>
          </Panel>
        );
      case 'KNOWLEDGE':
        return (
          <Panel title="Tri thức Mind Stone" kicker="Knowledge Core · Phase 9">
            <div className="flex min-h-[200px] items-center justify-center font-mono text-sm text-cyan-100/40">
              <p>🧠 Tích hợp Notion, Claude Code & Tìm kiếm RAG — Đang phát triển ở Phase 9</p>
            </div>
          </Panel>
        );
      case 'MEMORY':
        return <MemoryTab data={data} updateData={updateData} copyText={copyText} />;
      case 'TERMINAL':
        return <TerminalTab data={data} updateData={updateData} copyText={copyText} addLog={addLog} onLock={onLock} />;
      case 'TOOLS':
        return <ToolsTab data={data} addLog={addLog} />;
      case 'SETTINGS':
        return <SettingsTab data={data} updateData={updateData} hardReset={hardReset} addLog={addLog} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Tab Bar */}
      <div className="-mx-4 mb-4 flex overflow-x-auto border-b border-cyan-300/10 px-1 lg:-mx-6">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`deck-tab shrink-0 whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? 'active border-cyanCore'
                : 'border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="animate-fadeIn">
        {renderContent()}
      </div>
    </div>
  );
}
