import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../config/theme';
import { useTracker } from '../../context/TrackerContext';
import { GlassPanel } from '../ui/GlassPanel';
import { Signal, Clock } from 'lucide-react';
import { messages } from '../../data/messages';

const panelStyles: React.CSSProperties = {
  position: 'fixed',
  left: 0,
  top: '48px',
  bottom: '52px',
  width: '420px',
  maxWidth: 'calc(100vw - 24px)',
  zIndex: 25,
};

const contentStyles: React.CSSProperties = {
  overflowY: 'auto',
  height: '100%',
  paddingRight: '12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'CRITICAL': return theme.primary;
    case 'HIGH': return theme.secondary;
    default: return theme.muted;
  }
};

export const MessageCenter: React.FC = () => {
  const { dispatch } = useTracker();
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(null);

  return (
    <>
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
        .scan-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: rgba(255, 0, 0, 0.5);
          box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
          animation: scan 3s linear infinite;
          z-index: 10;
          pointer-events: none;
        }
        @keyframes scan {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
      <motion.div
        style={panelStyles}
        initial={{ x: -420, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -420, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <GlassPanel
          title="MESSAGE CENTER"
          subtitle="INCOMING TRANSMISSIONS"
          onClose={() => dispatch({ type: 'SET_PANEL', panel: null })}
        >
          <div style={{ position: 'relative', height: '100%' }}>
            <div className="scan-line" />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px', color: theme.primary }}>
              <Signal size={16} />
            </div>
            <div className="custom-scroll" style={contentStyles}>
              {messages.length === 0 && (
                <div style={{ padding: '18px', color: theme.muted, fontSize: '13px', lineHeight: 1.6 }}>
                  Chưa có tin nhắn nào. Khu này giữ lại để sau nối AI/chat hoặc ghi chú địa điểm.
                </div>
              )}
              {messages.map((msg) => {
                const isExpanded = expandedMessageId === msg.id;
                const priorityColor = getPriorityColor(msg.priority);
                
                return (
                  <div
                    key={msg.id}
                    style={{
                      border: `1px solid ${priorityColor}`,
                      backgroundColor: 'rgba(0,0,0,0.4)',
                      padding: '12px',
                      position: 'relative',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: priorityColor,
                          boxShadow: `0 0 5px ${priorityColor}`,
                        }}
                      />
                      {!msg.read && (
                        <span style={{ fontSize: '10px', color: priorityColor, fontWeight: 'bold' }}>
                          INCOMING TRANSMISSION
                        </span>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: theme.muted, marginBottom: '8px' }}>
                      <span>FROM: {msg.from}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={10} /> {msg.timestamp}</span>
                    </div>

                    <div style={{ fontSize: '13px', color: theme.primary, marginBottom: '12px' }}>
                      {isExpanded ? (
                        <AnimatePresence>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            {msg.content}
                          </motion.div>
                        </AnimatePresence>
                      ) : (
                        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {msg.content}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => setExpandedMessageId(isExpanded ? null : msg.id)}
                      style={{
                        background: 'transparent',
                        border: `1px solid ${theme.border}`,
                        color: theme.primary,
                        padding: '4px 8px',
                        fontSize: '10px',
                        cursor: 'pointer',
                        width: '100%',
                        textTransform: 'uppercase',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {isExpanded ? 'CLOSE MESSAGE' : 'OPEN MESSAGE'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </GlassPanel>
      </motion.div>
    </>
  );
};
