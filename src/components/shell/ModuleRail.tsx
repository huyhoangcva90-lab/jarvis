import { useTesseract } from '../../tesseract/useTesseract';
import { modules } from '../../tesseract/constants';
import type { ModuleId } from '../../tesseract/tesseract';

export default function ModuleRail() {
  const { activeModuleId, setModule } = useTesseract();
  return (
    <nav className="module-rail" aria-label="J-Core modules">
      <div className="rail-brand">
        <span>J</span>
      </div>
      {modules.map((module) => (
        <button
          key={module.id}
          className={activeModuleId === module.id ? "is-active" : ""}
          style={{ "--module": module.color, "--module-rgb": module.rgb } as React.CSSProperties}
          onClick={() => setModule(module.id)}
          aria-label={module.label}
        >
          <b aria-hidden="true">{module.icon}</b>
          <span>{module.label}</span>
        </button>
      ))}
    </nav>
  );
}
