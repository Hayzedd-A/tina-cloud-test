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
      name: "How did Gourmet Twist start?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gourmet Twist started in a home kitchen in Lekki with one banana bread recipe and a refusal to settle for ordinary. What began as a single flavour has grown into 30+ varieties and a community of 176,000+ customers across Lagos.",
      },
    },
    {
      "@type": "Question",
      name: "Where is Gourmet Twist based?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gourmet Twist is based in Lekki Phase 1, Lagos — 19B Fola Osibo Street. We bake fresh every morning and deliver across Lagos Island same-day and to the mainland next-day.",
      },
    },
    {
      "@type": "Question",
      name: "Why does Gourmet Twist call itself the World's Best Banana Bread?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Because we believe it is — and 176,000+ loyal customers agree. Every loaf is baked fresh the morning of delivery using real ingredients, never frozen, never day-old. The range (30+ flavours), the quality, and the consistency over years of trading is the evidence.",
      },
    },
  ],
};

const faqs = [
  { q: "How did Gourmet Twist start?", a: "Gourmet Twist started in a home kitchen in Lekki with one banana bread recipe and a refusal to settle for ordinary. What began as a single flavour has grown into 30+ varieties and a community of 176,000+ customers across Lagos." },
  { q: "Where is Gourmet Twist based?", a: "Gourmet Twist is based in Lekki Phase 1, Lagos — 19B Fola Osibo Street. We bake fresh every morning and deliver across Lagos Island same-day and to the mainland next-day." },
  { q: "Why does Gourmet Twist call itself the World's Best Banana Bread?", a: "Because we believe it is — and 176,000+ loyal customers agree. Every loaf is baked fresh the morning of delivery using real ingredients, never frozen, never day-old. The range (30+ flavours), the quality, and the consistency over years of trading is the evidence." },
];

export async function getStaticProps() {
  return { props: {}, revalidate: 86400 };
}

export default function OurStory() {
  return (
    <Main>
      <Head>
        <title>Our Story — How Gourmet Twist Became the World&apos;s Best Banana Bread | Lagos</title>
        <meta name="description" content="From one recipe in a Lekki kitchen to 176,000+ customers and 30+ flavours — the story of how Gourmet Twist became the home of the World's Best Banana Bread in Lagos." />
        <meta property="og:title" content="Our Story | Gourmet Twist — World's Best Banana Bread Lagos" />
        <meta property="og:description" content="How one banana bread recipe in Lekki grew into Lagos's most loved bakery brand." />
        <meta property="og:url" content="https://gourmettwist.ng/our-story" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://gourmettwist.ng/our-story" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <div className="seo-page">
        <section className="seo-hero">
          <p className="seo-hero__eyebrow">Lekki Phase 1 · Since Day One</p>
          <h1 className="seo-hero__title">How Gourmet Twist Became the World&apos;s Best Banana Bread</h1>
          <p className="seo-hero__sub">
            One recipe. One kitchen. 176,000 customers later — the story of why we never settled for ordinary.
          </p>
          <Link href="/shop"><a className="seo-cta">Try It Yourself</a></Link>
        </section>

        <section className="seo-body">
          <p>
            Gourmet Twist started in a home kitchen in Lekki with a single question: what would banana bread taste like if you actually tried? Not the dry, forgettable loaf from a recipe book — but something dense, moist, made with genuinely ripe bananas, real butter, and real chocolate where chocolate was called for.
          </p>
          <p>
            <strong>The first batch did not leave the kitchen.</strong> Neither did the second. The recipe was refined until it was noticeably better — not just marginally better — than anything else available in Lagos. That standard has not changed.
          </p>
          <p>
            <strong>Over 30 flavours came from listening.</strong> Customers kept asking: what if you added Nutella? What about coconut? Triple chocolate? Baileys? Each idea had to pass the same test: is this genuinely the best version of this thing that exists in Lagos? If the answer was yes, it joined the menu. If not, it stayed in the test kitchen until it was.
          </p>
          <p>
            <strong>176,000+ customers</strong> across Lagos are the real story. People who ordered once and came back the next week. Corporate teams who discovered Gourmet Twist at an office treat and started ordering monthly. Families who now mark birthdays with our Baileys-Infused loaf the way others use a cake.
          </p>
          <p>
            The kitchen is at 19B Fola Osibo Street, Lekki Phase 1. Every loaf is baked there, the morning it leaves. That will not change.
          </p>
        </section>

        <section className="seo-features">
          <h2 className="seo-section-title">What we stand for</h2>
          <ul className="seo-features__list">
            {[
              "Baked fresh every morning — no frozen, no day-old, no shortcuts",
              "Real ingredients throughout — real chocolate, real coconut, real Baileys",
              "30+ flavours, all held to the same quality standard as the original",
              "176K+ community built on consistency, not marketing",
              "Based in Lekki, delivering across all of Lagos",
            ].map((item) => (
              <li key={item} className="seo-features__item">
                <span className="seo-features__check">✓</span>{item}
              </li>
            ))}
          </ul>
        </section>

        <section className="seo-faq">
          <h2 className="seo-section-title">About Gourmet Twist</h2>
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
          <h2 className="seo-bottom-cta__title">Taste the difference yourself</h2>
          <p className="seo-bottom-cta__sub">
            Order the World&apos;s Best Banana Bread in Lagos — baked fresh tomorrow morning. Call{" "}
            <a href={`tel:${PHONE_E164}`} className="seo-phone">{PHONE_DISPLAY}</a> or order online.
          </p>
          <Link href="/shop"><a className="seo-cta">Order Now →</a></Link>
        </section>
      </div>
    </Main>
  );
}
