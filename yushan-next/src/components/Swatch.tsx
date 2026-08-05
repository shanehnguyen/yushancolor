import type { Pigment } from "@/lib/types";
import { seedsFor, swatchPaint } from "@/lib/swatch-utils";

export function Swatch({
  pigment,
  mode,
  size,
  fill,
  className,
}: {
  pigment: Pigment;
  mode?: "dilution" | "wet";
  size?: string;
  fill?: boolean;
  className?: string;
}) {
  const { hex, dark, darker, opacity } = swatchPaint(pigment, {
    dilution: mode === "dilution",
    wet: mode === "wet",
  });
  const { ragged, grain } = seedsFor(pigment.id);
  const raggedId = `ragged-${pigment.id}`;
  const grainId = `grain-${pigment.id}`;

  return (
    <>
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <filter id={raggedId} x="-8%" y="-14%" width="116%" height="128%">
            <feTurbulence type="fractalNoise" baseFrequency="0.006 0.03" numOctaves={3} seed={ragged} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={7} xChannelSelector="R" yChannelSelector="G" />
          </filter>
          <filter id={grainId} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.22" numOctaves={3} seed={grain} stitchTiles="stitch" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.1 0 0 0 -0.1" />
          </filter>
        </defs>
      </svg>
      <div
        className={`swatch${className ? ` ${className}` : ""}`}
        role="img"
        aria-label={`${pigment.name}, ${pigment.ci}, Blue Wool ${pigment.blueWool}`}
        style={{
          ["--wash-hex" as string]: hex,
          ["--wash-dark" as string]: dark,
          ["--wash-darker" as string]: darker,
          ["--grain-opacity" as string]: String(opacity),
          filter: `saturate(0.86) url(#${raggedId})`,
          width: size,
          height: size,
          ...(fill ? { position: "absolute" as const, inset: 0 } : {}),
        }}
      >
        <span className="swatch__base" />
        <span className="swatch__pool" />
        <span className="swatch__grain" style={{ filter: `url(#${grainId})` }} />
      </div>
    </>
  );
}

export function SwatchWithLabel({ pigment }: { pigment: Pigment }) {
  return (
    <div className="set-chart__item">
      <Swatch pigment={pigment} />
      <span className="name">{pigment.name}</span>
    </div>
  );
}
