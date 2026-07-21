import { soundManager } from "../utils/soundManager.js";

export default function ApprovalDrawer({ isOpen, title, description, onApprove, onDeny, domain }) {
  if (!isOpen) return null;

  const handleApprove = () => {
    soundManager.play("success");
    onApprove();
  };

  const handleDeny = () => {
    soundManager.play("warning");
    onDeny();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-void/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md animate-fadeIn border border-dangerCore/40 bg-slate-950/95 p-6 rounded-xl shadow-[0_0_50px_rgba(239,68,68,0.25)] font-mono">
        
        {/* Header alert */}
        <div className="flex items-center gap-3 border-b border-dangerCore/20 pb-4 mb-4">
          <div className="h-3.5 w-3.5 animate-pulse rounded-full bg-dangerCore" />
          <h2 className="text-md font-bold tracking-widest text-dangerCore uppercase">
            OPERATOR APPROVAL REQUIRED
          </h2>
        </div>

        {/* Content details */}
        <div className="space-y-4 text-sm text-cyan-100">
          <div>
            <span className="text-[10px] text-cyan-100/40 uppercase">Domain Layer:</span>
            <p className="font-bold text-cyanCore">{domain || "SYSTEM CORE"}</p>
          </div>

          <div>
            <span className="text-[10px] text-cyan-100/40 uppercase">Operation Title:</span>
            <p className="font-bold">{title}</p>
          </div>

          <div>
            <span className="text-[10px] text-cyan-100/40 uppercase">Action Description:</span>
            <p className="text-xs text-cyan-100/75 leading-relaxed mt-1">{description}</p>
          </div>
        </div>

        {/* Security Warning */}
        <div className="mt-5 rounded border border-dangerCore/20 bg-dangerCore/5 p-3 text-[10px] text-dangerCore/80 leading-relaxed uppercase">
          ⚠️ CẢNH BÁO: BẰNG VIỆC XÁC NHẬN, BẠN CẤP QUYỀN THỰC THI CHO HỆ THỐNG VÀ HERMES SẼ TIẾP TỤC BƯỚC TIẾP THEO CỦA NHIỆM VỤ.
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={handleDeny}
            className="hud-button danger flex-1 py-2 uppercase text-xs"
          >
            Deny Access
          </button>
          <button
            type="button"
            onClick={handleApprove}
            className="hud-button primary flex-1 py-2 uppercase text-xs border-greenCore hover:bg-greenCore/20 hover:text-white"
          >
            Authorize Action
          </button>
        </div>
      </div>
    </div>
  );
}
