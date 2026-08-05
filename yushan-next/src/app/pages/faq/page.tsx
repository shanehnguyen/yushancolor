import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers on pigments, single-pigment claims, lightfastness, shipping, duties, returns and the house minerals.",
};

const SECTIONS: { heading: string; items: { q: string; a: string; open?: boolean }[] }[] = [
  {
    heading: "The paint",
    items: [
      {
        q: "Is this rebranded student paint?",
        a: "No. Sixteen of the eighteen colours are single-pigment, and every colour carries a Colour Index code on the label, the product page and the Chart. Payne's Grey is the one deliberate mix in the range and is labelled as a mix.",
        open: true,
      },
      {
        q: "What's actually in it?",
        a: "Gum arabic, glycerin, longan honey and ox gall as the binder, and one pigment per colour except Payne's Grey. Full Colour Index codes are on every pan, every product page, and the Chart.",
      },
      {
        q: "Will this still look like this in twenty years?",
        a: "Every colour is rated on the Blue Wool scale from 1 to 8, published in full, including Hansa Yellow Light's 6, the weakest result in the range. Blue Wool 7 and 8 colours are rated for permanent, unshaded display.",
      },
      {
        q: "I already own a Daniel Smith set. What does this do that mine doesn't?",
        a: "Beitou Sulphur and Yushan Slate. Both are ground from Taiwanese mineral deposits with no Colour Index equivalent sold anywhere else, and both granulate harder than the commercial mineral range.",
      },
      {
        q: 'Half the "genuine mineral" colours in my current set turn out to be mixes. Is this different?',
        a: "Sixteen of eighteen colours here are single-pigment. The two that aren't are the house minerals, which are genuinely single-source ground stone, and Payne's Grey, which is clearly labelled as a two-pigment mix.",
      },
      {
        q: "Is it safe to use?",
        a: "Every pan is ACMI AP certified non-toxic.",
      },
    ],
  },
  {
    heading: "Sets and sizing",
    items: [
      {
        q: "Which set should I start with?",
        a: "If you're new to the range, the $14 Dot Card shows all 18 colours before you commit to a set. If you already know you want a working palette, the Landscape Six covers sky-to-ground plus both house minerals for $58.",
      },
      {
        q: "Can I buy just one colour?",
        a: "Yes. Every colour is available as a single half pan for $11, including both house minerals, so you can restock a well or try one colour without buying a full set.",
      },
      {
        q: "What's the difference between a half pan and a full pan?",
        a: "Every Yushan pan is a half pan, 1.8ml, hand-poured in three fills so it's solid to the bottom rather than just skinned over the surface.",
      },
    ],
  },
  {
    heading: "Shipping and duties",
    items: [
      {
        q: "How much is shipping from Taiwan, and will I get a customs bill?",
        a: "$9 worldwide, free over $80, arriving in 6 to 9 business days to the US, UK or EU. Duties and import tax are prepaid at checkout. Nothing is owed on delivery.",
      },
      {
        q: "How fast do orders ship?",
        a: "Every order ships from the workshop in Datong District, Taipei, within 24 hours of being placed, Monday through Saturday.",
      },
      {
        q: "Do you ship outside the US, UK and EU?",
        a: "Not yet. Those are the only three regions Yushan currently ships to.",
      },
    ],
  },
  {
    heading: "Returns",
    items: [
      {
        q: "What if I don't like it?",
        a: "60-day return, used or unused, no explanation required. If you're not sure yet, the $14 Dot Card puts all eighteen colours in your hands before you commit to a set.",
      },
      {
        q: "How do refunds work?",
        a: "Email hello@yushancolour.com with your order number, we'll send instructions for sending it back, and refunds go to the original payment method.",
      },
      {
        q: "Something arrived damaged. What now?",
        a: "Email a photo to hello@yushancolour.com and we'll sort a replacement without asking you to return anything first.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <main id="main">
      <div className="breadcrumb">
        <Link href="/">Home</Link> / <span>FAQ</span>
      </div>

      <div className="container" style={{ paddingTop: "var(--sp-5)" }}>
        <div className="section__head section__head--center">
          <h1>Frequently asked questions</h1>
          <p>
            Everything painters ask before ordering, grouped by topic. Still stuck? Email{" "}
            <a href="mailto:hello@yushancolour.com" style={{ textDecoration: "underline" }}>
              hello@yushancolour.com
            </a>
            .
          </p>
        </div>
      </div>

      {SECTIONS.map((section, i) => (
        <section className="section" style={i === 0 ? { borderTop: "none", paddingTop: 0 } : undefined} key={section.heading}>
          <div className="section__head section__head--center">
            <h2>{section.heading}</h2>
          </div>
          <div>
            {section.items.map((item) => (
              <details className="faq-item" open={item.open} key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
