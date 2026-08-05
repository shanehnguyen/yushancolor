import type { Metadata } from "next";
import Link from "next/link";
import { WholesaleForm } from "@/components/WholesaleForm";

export const metadata: Metadata = {
  title: "Wholesale and Stockists",
  description: "Yushan Colour Co. does not currently sell through distributors or stockists. Get in touch if you're interested in wholesale.",
};

export default function WholesalePage() {
  return (
    <main id="main">
      <div className="breadcrumb">
        <Link href="/">Home</Link> / <span>Wholesale and stockists</span>
      </div>

      <div className="policy-page">
        <h1>Wholesale and stockists</h1>
        <p>
          Yushan Colour Co. is milled by two people in small batches of forty pans at a time. There is no distributor, no importer, and no
          physical stockist carrying the range today. Everything ships direct from Taipei.
        </p>
        <h2>Interested in carrying Yushan, press, or a collaboration?</h2>
        <p>
          Send the details below: shop or wholesale orders, press samples, collaboration ideas all go to the same place. Given the batch
          size, wholesale capacity is limited, but every inquiry gets a reply. Prefer email? Write to{" "}
          <a href="mailto:hello@yushancolour.com">hello@yushancolour.com</a> directly.
        </p>
        <WholesaleForm />
      </div>
    </main>
  );
}
