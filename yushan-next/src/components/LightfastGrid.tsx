import { Swatch } from "@/components/Swatch";
import type { Pigment } from "@/lib/types";

const LIGHTFAST_IDS = [
  "ultramarine-blue",
  "burnt-sienna",
  "beitou-sulphur",
  "yushan-slate",
  "quinacridone-rose",
  "hansa-yellow-light",
];

export function LightfastGrid({
  pigmentsById,
  className,
}: {
  pigmentsById: Record<string, Pigment>;
  className?: string;
}) {
  return (
    <div className={`lightfast-grid${className ? ` ${className}` : ""}`}>
      {LIGHTFAST_IDS.map((id) => {
        const p = pigmentsById[id];
        if (!p) return null;
        return (
          <div className="lightfast-card" key={id}>
            <div className="lightfast-card__img">
              <Swatch pigment={p} fill />
              <div className="lightfast-card__fade" style={{ opacity: (8 - p.blueWool) * 0.12 }} />
              <div className="lightfast-card__divider" />
            </div>
            <div className="lightfast-card__label">
              <span>{p.name}</span>
              <span className="mono">Blue Wool {p.blueWool} of 8</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
