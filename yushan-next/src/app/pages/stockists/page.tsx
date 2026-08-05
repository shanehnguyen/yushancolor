import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stockists",
  description: "Yushan Colour Co. ships direct from Taipei and does not currently sell through any physical retailer. Here's why, and how that could change.",
};

export default function StockistsPage() {
  return (
    <main id="main">
      <div className="breadcrumb">
        <Link href="/">Home</Link> / <span>Stockists</span>
      </div>

      <div className="policy-page">
        <h1>Stockists</h1>
        <p>
          There are none yet. Yushan Colour Co. is milled by two people in Datong District, Taipei, in batches of forty pans, and every pan
          currently ships straight from the workshop to your door. No shop, gallery, or art supply store carries the range in person today,
          anywhere.
        </p>
        <h2>Why not</h2>
        <p>
          Batch size is the honest answer. Forty pans a run isn&apos;t enough to hold both direct orders and retail shelf stock without
          running out of colours mid-batch, and a shop with an empty spot on the rack is worse for everyone than no shop at all.
        </p>
        <h2>If you run a shop</h2>
        <p>
          That could change. If you carry artist-grade watercolour and want to talk about being the first physical stockist, the
          conversation starts in the same place as any wholesale order: email <a href="mailto:hello@yushancolour.com">hello@yushancolour.com</a>{" "}
          with your shop name and location, or read more on the <Link href="/pages/wholesale">wholesale page</Link> first.
        </p>
        <h2>In the meantime</h2>
        <p>
          Every colour, spec, and Blue Wool result is on the <Link href="/pages/chart">Chart</Link>, and the{" "}
          <Link href="/products/dot-card">Dot Card</Link> is a $14 way to see all eighteen colours painted out before ordering a set.
        </p>
      </div>
    </main>
  );
}
