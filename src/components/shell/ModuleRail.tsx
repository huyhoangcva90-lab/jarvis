import { useTesseract } from '../../tesseract/useTesseract';
import { modules } from '../../tesseract/constants';
import type { ModuleId } from '../../tesseract/tesseract';

// Filter out office from main rail if desired, or keep it clearly marked as sub-app
export default function ModuleRail() {
  const { activeModuleId, setModule } = useTesseract();

  return (
    <nav className="module-rail" aria-label="J-Core energy modules">
      <div className="rail-brand" title="Tesseract AI Energy Core">
        <span>T</span>
      </div>
      {modules.map((module) => {
        const isOffice = module.id === 'office';
        return (
          <button
            key={module.id}
            className={`${activeModuleId === module.id ? "is-active" : ""} ${isOffice ? "sub-app-tab" : ""}`}
            style={{ "--module": module.color, "--module-rgb": module.rgb } as React.CSSProperties}
            onClick={() => setModule(module.id)}
            aria-label={`${module.label} (${module.eyebrow})`}
            title={`${module.label} — ${module.eyebrow}`}
          >
            <b aria-hidden="true">{module.icon}</b>
            <span>{module.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
