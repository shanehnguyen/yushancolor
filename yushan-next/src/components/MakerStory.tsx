import Image from "next/image";

export function MakerStory() {
  return (
    <section className="section" id="story">
      <div className="maker-story">
        <div className="maker-story__img" style={{ position: "relative" }}>
          <Image src="/images/workshop-mixing.jpg" alt="Close-up of a painter mixing colour on a palette in the workshop" fill sizes="(max-width: 900px) 100vw, 50vw" style={{ objectFit: "cover" }} />
        </div>
        <div className="maker-story__text">
          <h2>Two people, one workshop, Datong District</h2>
          <p>
            Yushan Colour Co. is milled by two people in Datong District, Taipei, in batches of forty pans. The founder spent eleven years as a
            materials chemist before starting the workshop in 2019, which is most of why the site reads like a spec sheet instead of an ad.
          </p>
          <p>
            There is no distributor and no importer. Paint ships from Taipei to painters in the US, UK and EU within twenty-four hours of an
            order, including the two colours ground from Taiwanese mineral deposits that nobody else sells.
          </p>
        </div>
      </div>
    </section>
  );
}
