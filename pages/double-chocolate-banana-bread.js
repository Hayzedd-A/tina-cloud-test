import Head from "next/head";
import Link from "next/link";
import Main from "../layouts/Main";

const PHONE_E164 = "+2347018249203";
const PHONE_DISPLAY = "0701 824 9203";

const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What makes Double Chocolate Banana Bread special?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gourmet Twist Double Chocolate Banana Bread layers real chocolate into a dense, moist banana base — not chocolate extract, not cocoa powder. The result is a loaf that is deeply flavoured, holds moisture for days, and stays soft right to the last slice.",
      },
    },
    {
      "@type": "Question",
      name: "Where can I order Double Chocolate Banana Bread in Lagos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Order at gourmettwist.ng. It is baked fresh the morning of your delivery and delivered across Lagos Island same-day and to the mainland next-day.",
      },
    },
    {
      "@type": "Question",
      name: "How is Double Chocolate different from Triple Choc?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Double Chocolate is chocolate batter with chocolate chips — rich but balanced. Triple Choc adds a ganache swirl, making it the more intense option. First-timers tend to prefer Double Chocolate; returning customers often graduate to Triple Choc.",
      },
    },
  ],
};

const faqs = [
  { q: "What makes Double Chocolate Banana Bread special?", a: "Gourmet Twist Double Chocolate Banana Bread layers real chocolate into a dense, moist banana base — not chocolate extract, not cocoa powder. The result is a loaf that is deeply flavoured, holds moisture for days, and stays soft right to the last slice." },
  { q: "Where can I order Double Chocolate Banana Bread in Lagos?", a: "Order at gourmettwist.ng. It is baked fresh the morning of your delivery and delivered across Lagos Island same-day and to the mainland next-day." },
  { q: "How is Double Chocolate different from Triple Choc?", a: "Double Chocolate is chocolate batter with chocolate chips — rich but balanced. Triple Choc adds a ganache swirl, making it the more intense option. First-timers tend to prefer Double Chocolate; returning customers often graduate to Triple Choc." },
];

export async function getStaticProps() {
  return { props: {}, revalidate: 86400 };
}

export default function DoubleChocolateBananaBread() {
  return (
    <Main>
      <Head>
        <title>Double Chocolate Banana Bread — Lagos&apos; Favourite | Gourmet Twist</title>
        <meta name="description" content="Gourmet Twist Double Chocolate Banana Bread — real chocolate baked into a moist, dense loaf. Lagos's most-ordered banana bread flavour, baked fresh daily in Lekki." />
        <meta property="og:title" content="Double Chocolate Banana Bread Lagos | Gourmet Twist" />
        <meta property="og:description" content="Real chocolate, moist banana base — Lagos's most-ordered flavour. Baked fresh daily in Lekki." />
        <meta property="og:url" content="https://gourmettwist.ng/double-chocolate-banana-bread" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://gourmettwist.ng/double-chocolate-banana-bread" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <div className="seo-page">
        <section className="seo-hero">
          <p className="seo-hero__eyebrow">Lagos&apos;s Most-Ordered Flavour · Fresh from Lekki Daily</p>
          <h1 className="seo-hero__title">Double Chocolate Banana Bread</h1>
          <p className="seo-hero__sub">
            Real chocolate. Moist banana base. Dense crumb that stays soft for days. The one that turns first-time customers into regulars.
          </p>
          <Link href="/shop/double-chocolate-banana-bread"><a className="seo-cta">Order Double Chocolate</a></Link>
        </section>

        <section className="seo-body">
          <p>
            Double Chocolate Banana Bread is the flavour that put Gourmet Twist on the map. It layers <strong>real chocolate</strong> — not cocoa powder, not artificial flavouring — into a dense, moist banana base, then folds in chocolate chips throughout. Every bite has both the comfort of banana bread and the depth of a proper chocolate cake.
          </p>
          <p>
            <strong>What separates ours from anything else in Lagos:</strong> the banana base is made with genuinely ripe bananas (not banana essence), oil-based for moisture retention, and baked at the right temperature so the outside has a slight crust and the inside stays soft and dense. The chocolate is real, and it shows in the flavour.
          </p>
          <p>
            It holds for three days at room temperature. Most orders do not survive day one — but if yours does, it is as good on day three as it was fresh.
          </p>
          <p>
            If Double Chocolate is your gateway, <strong>Triple Choc</strong> is the next step — same base, plus a ganache swirl that makes it the most intense thing we bake. Both are available daily.
          </p>
        </section>

        <section className="seo-features">
          <h2 className="seo-section-title">Why this is the one to order</h2>
          <ul className="seo-features__list">
            {[
              "Real chocolate throughout — batter and chips, not extract",
              "Moist, dense crumb that holds for up to three days",
              "Lagos's most-ordered banana bread flavour, consistently",
              "Baked fresh each morning — order by 9pm for next-day delivery",
              "Part of a 30+ flavour range if you want to explore further",
            ].map((item) => (
              <li key={item} className="seo-features__item">
                <span className="seo-features__check">✓</span>{item}
              </li>
            ))}
          </ul>
        </section>

        <section className="seo-faq">
          <h2 className="seo-section-title">Frequently asked questions</h2>
          <div className="seo-faq__list">
            {faqs.map(({ q, a }) => (
              <div key={q} className="seo-faq__item">
                <h3 className="seo-faq__q">{q}</h3>
                <p className="seo-faq__a">{a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="seo-bottom-cta">
          <h2 className="seo-bottom-cta__title">Order Double Chocolate Banana Bread in Lagos</h2>
          <p className="seo-bottom-cta__sub">
            Baked fresh tomorrow morning, delivered to your door. Call{" "}
            <a href={`tel:${PHONE_E164}`} className="seo-phone">{PHONE_DISPLAY}</a> or order online.
          </p>
          <Link href="/shop/double-chocolate-banana-bread"><a className="seo-cta">Order Now →</a></Link>
        </section>
      </div>
    </Main>
  );
}
