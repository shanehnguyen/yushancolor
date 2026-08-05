import { Swatch } from "@/components/Swatch";
import type { Pigment } from "@/lib/types";

export function TinGrid({
  pigmentIds,
  pigmentsById,
  max,
}: {
  pigmentIds: string[];
  pigmentsById: Record<string, Pigment>;
  max?: number;
}) {
  const ids = max ? pigmentIds.slice(0, max) : pigmentIds;
  const cols = ids.length <= 6 ? 3 : ids.length <= 8 ? 4 : 6;
  return (
    <div className="tin-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {ids.map((id) => {
        const p = pigmentsById[id];
        if (!p) return null;
        return (
          <span className="tin-grid__pan" style={{ position: "relative" }} key={id}>
            <Swatch pigment={p} fill />
          </span>
        );
      })}
    </div>
  );
}
