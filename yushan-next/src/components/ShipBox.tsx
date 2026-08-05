import { catalog } from "@/lib/data";

export function ShipBox() {
  const s = catalog.shipping;
  return (
    <div className="ship-box">
      <div className="ship-box__row">
        <span className="k">Origin</span>
        <span>{s.origin}</span>
      </div>
      <div className="ship-box__row">
        <span className="k">Delivery</span>
        <span>{s.transit}</span>
      </div>
      <div className="ship-box__row">
        <span className="k">Cost</span>
        <span>{s.cost}</span>
      </div>
      <div className="ship-box__row">
        <span className="k">Duties</span>
        <span>{s.duty}</span>
      </div>
    </div>
  );
}
