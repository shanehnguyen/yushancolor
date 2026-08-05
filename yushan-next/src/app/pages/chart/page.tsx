import type { Metadata } from "next";
import { ChartView } from "@/components/ChartView";

export const metadata: Metadata = {
  title: "The Chart | Every pigment, every code",
  description:
    "All 18 Yushan watercolours with full Colour Index codes, Blue Wool lightfastness, transparency, granulation and staining. PB29, PB15:3, PB60, PG7, PY150, PY3 and more.",
};

export default function ChartPage() {
  return <ChartView />;
}
