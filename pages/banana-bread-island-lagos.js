import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Main from "../layouts/Main";
import { slugify } from "../utils/functions";

const STORE_ID = "8a7a28dc-b54d-4841-b949-efe60dbae709";
const PHONE_E164 = "+2347018249203";
const PHONE_DISPLAY = "0701 824 9203";

const schema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Does Gourmet Twist deliver banana bread to Victoria Island (VI)?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — Gourmet Twist delivers banana bread to Victoria Island same-day. Order by 9pm for next-morning delivery.",
      },
    },
    {
      "@type": "Question",
      name: "Can I get banana bread delivered to Ikoyi?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Ikoyi is within our same-day delivery area. Order at gourmettwist.ng and select your Ikoyi address at checkout.",
      },
    },
    {
      "@type": "Question",
      name: "Where on Lagos Island is Gourmet Twist based?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our kitchen is at 19B Fola Osibo Street, Lekki Phase 1 — right on the Island. Lekki, VI, Ikoyi, Ajah, and Chevron are all in our same-day delivery radius.",
      },
    },
  ],
};

const faqs = [
  { q: "Does Gourmet Twist deliver banana bread to Victoria Island (VI)?", a: "Yes — Gourmet Twist delivers banana bread to Victoria Island same-day. Order by 9pm for next-morning delivery." },
  { q: "Can I get banana bread delivered to Ikoyi?", a: "Yes. Ikoyi is within our same-day delivery area. Order at gourmettwist.ng and select your Ikoyi address at checkout." },
  { q: "Where on Lagos Island is Gourmet Twist based?", a: "Our kitchen is at 19B Fola Osibo Street, Lekki Phase 1 — right on the Island. Lekki, VI, Ikoyi, Ajah, and Chevron are all in our same-day delivery radius." },
];

export async function getStaticProps() {
  try {
    const res = await fetch(`https://api.zupa.ng/customer-requests/stores/${STORE_ID}/products`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    const categories = Array.isArray(data.data) ? data.data : [];
    const featured = [];
    for (const cat of categories) {
      const source = cat.topProducts?.length ? cat.topProducts : cat.products || [];
      for (const p of source) {
        if (featured.length >= 8) break;
        const sizes = p.sizes || {};
        const key = Object.keys(sizes).find((s) => sizes[s]?.length > 0);
        if (!key) continue;
        const v = sizes[key][0] || {};
        featured.push({ id: p.id, name: p.name, imageUrl: v.imageUrl || null, unitPrice: v.unitPrice || 0 });
      }
      if (featured.length >= 8) break;
    }
    return { props: { featured }, revalidate: 3600 };
  } catch {
    return { props: { featured: [] }, revalidate: 60 };
  }
}

export default function BananaBreadIslandLagos({ featured }) {
  const router = useRouter();
  return (
    <Main>
      <Head>
        <title>Banana Bread on Lagos Island — VI, Ikoyi & Lekki Delivery | Gourmet Twist</title>
        <meta name="description" content="Gourmet Twist delivers the best banana bread on Lagos Island — same-day to Victoria Island, Ikoyi, Lekki, and Ajah. Baked fresh from our Lekki Phase 1 kitchen." />
        <meta property="og:title" content="Banana Bread on Lagos Island — VI, Ikoyi, Lekki | Gourmet Twist" />
        <meta property="og:description" content="Same-day banana bread delivery across Lagos Island. Fresh from Lekki to VI, Ikoyi, Ajah, and beyond." />
        <meta property="og:url" content="https://gourmettwist.ng/banana-bread-island-lagos" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://gourmettwist.ng/banana-bread-island-lagos" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <div className="seo-page">
        <section className="seo-hero">
          <p className="seo-hero__eyebrow">VI · Ikoyi · Lekki · Ajah · Chevron</p>
          <h1 className="seo-hero__title">Banana Bread on Lagos Island — Delivered Same-Day</h1>
          <p className="seo-hero__sub">
            Baked in Lekki Phase 1 every morning and delivered fresh across the Island before lunch.
          </p>
          <Link href="/shop"><a className="seo-cta">Order Now</a></Link>
        </section>

        <section className="seo-body">
          <p>
            Gourmet Twist is an Island business. Our kitchen is in <strong>Lekki Phase 1</strong>, which means Victoria Island, Ikoyi, Lekki, Ajah, and Chevron are all same-day delivery territory — closer than anywhere else in Lagos.
          </p>
          <p>
            Order by 9pm tonight and your banana bread is baked first thing tomorrow morning. We bake to order so nothing sits on a shelf. Your loaf is mixed, baked, cooled, and packed the morning it heads to your address — arriving at the peak of its texture and flavour.
          </p>
          <p>
            <strong>On Victoria Island</strong> especially, we hear from customers who had searched for good banana bread for years before finding us. The range (30+ flavours), the freshness (baked that day), and the consistency (176K+ customers) are the reasons people switch to Gourmet Twist and do not go back.
          </p>
        </section>

        <section className="seo-features">
          <h2 className="seo-section-title">Island delivery coverage</h2>
          <ul className="seo-features__list">
            {[
              "Lekki Phase 1 & 2, Chevron, Ajah — same-day, from ₦0 delivery",
              "Victoria Island (VI) — same-day delivery",
              "Ikoyi — same-day delivery",
              "Yaba, Surulere & mainland — next-day delivery",
              "Kitchen on Fola Osibo Street, Lekki Phase 1",
            ].map((item) => (
              <li key={item} className="seo-features__item">
                <span className="seo-features__check">✓</span>{item}
              </li>
            ))}
          </ul>
        </section>

        {featured.length > 0 && (
          <section className="seo-products">
            <h2 className="seo-section-title">Delivering to the Island today</h2>
            <div className="seo-products__grid">
              {featured.map((p) => (
                <div key={p.id} className="seo-product-card" role="button" tabIndex={0}
                  onClick={() => router.push(`/shop/${slugify(p.name)}`)}
                  onKeyDown={(e) => e.key === "Enter" && router.push(`/shop/${slugify(p.name)}`)}>
                  <div className="seo-product-card__img-wrap">
                    {p.imageUrl ? <img src={p.imageUrl} alt={`${p.name} — banana bread Lagos Island`} className="seo-product-card__img" loading="lazy" />
                      : <div className="seo-product-card__img-placeholder" />}
                  </div>
                  <div className="seo-product-card__info">
                    <span className="seo-product-card__name">{p.name}</span>
                    <span className="seo-product-card__price">from ₦{Number(p.unitPrice).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="seo-cta-row">
              <Link href="/shop"><a className="seo-cta">See all flavours →</a></Link>
            </div>
          </section>
        )}

        <section className="seo-faq">
          <h2 className="seo-section-title">Island delivery questions</h2>
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
          <h2 className="seo-bottom-cta__title">Order banana bread on the Island today</h2>
          <p className="seo-bottom-cta__sub">
            Same-day delivery to VI, Ikoyi and Lekki. Call{" "}
            <a href={`tel:${PHONE_E164}`} className="seo-phone">{PHONE_DISPLAY}</a> or order online.
          </p>
          <Link href="/shop"><a className="seo-cta">Order Now →</a></Link>
        </section>
      </div>
    </Main>
  );
}
