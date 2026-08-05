const FAQS = [
  {
    q: "Is this rebranded student paint?",
    a: "No. Sixteen of the eighteen colours are single-pigment, and every colour carries a Colour Index code on the label, the product page and the Chart. Payne's Grey is the one deliberate mix in the range and is labelled as a mix.",
  },
  {
    q: "What's actually in it?",
    a: "Gum arabic, glycerin, longan honey and ox gall as the binder, and one pigment per colour except Payne's Grey. Full Colour Index codes are on every pan, every product page, the Chart, and a downloadable PDF.",
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
    q: "How much is shipping from Taiwan, and will I get a customs bill?",
    a: "$9 worldwide, free over $80, arriving in 6 to 9 business days. Duties and import tax are prepaid at checkout. Nothing is owed on delivery.",
  },
  {
    q: "What if I don't like it?",
    a: "60-day return, used or unused. If you're not sure yet, the $14 Dot Card puts all eighteen colours in your hands before you commit to a set.",
  },
  {
    q: "Is it safe to use, and will it last?",
    a: "Every pan is ACMI AP certified non-toxic. Lightfastness is Blue Wool 6 to 8 across the range, published per colour with nothing rounded up.",
  },
];

export function ProductFaq() {
  return (
    <section className="section">
      <div className="section__head section__head--center">
        <h2>Questions before you order</h2>
      </div>
      <div>
        {FAQS.map((item) => (
          <details className="faq-item" key={item.q}>
            <summary>{item.q}</summary>
            <p>{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
