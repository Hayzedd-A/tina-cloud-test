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
      name: "Where can I buy banana bread in Lekki?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gourmet Twist bakes the best banana bread in Lekki daily from our kitchen on Fola Osibo Street, Lekki Phase 1. Order at gourmettwist.ng for same-day delivery.",
      },
    },
    {
      "@type": "Question",
      name: "Does Gourmet Twist deliver banana bread in Lekki Phase 1?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — Lekki Phase 1 is our home base. Same-day delivery across Lekki, Chevron, Ajah, and the rest of Lagos Island.",
      },
    },
    {
      "@type": "Question",
      name: "Can I pick up banana bread from Gourmet Twist in Lekki?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Our kitchen is at 19B Fola Osibo Street, Lekki Phase 1. Call " + PHONE_DISPLAY + " to arrange a collection.",
      },
    },
    {
      "@type": "Question",
      name: "What time does banana bread delivery start in Lekki?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Orders placed by 9pm are baked fresh the next morning and out for delivery from around 10am. Same-day orders close when stock sells out.",
      },
    },
  ],
};

const faqs = [
  {
    q: "Where can I buy banana bread in Lekki?",
    a: "Gourmet Twist bakes the best banana bread in Lekki daily from our kitchen on Fola Osibo Street, Lekki Phase 1. Order at gourmettwist.ng for same-day delivery.",
  },
  {
    q: "Does Gourmet Twist deliver banana bread in Lekki Phase 1?",
    a: "Yes — Lekki Phase 1 is our home base. Same-day delivery across Lekki, Chevron, Ajah, and the rest of Lagos Island.",
  },
  {
    q: "Can I pick up banana bread from Gourmet Twist in Lekki?",
    a: `Yes. Our kitchen is at 19B Fola Osibo Street, Lekki Phase 1. Call ${PHONE_DISPLAY} to arrange a collection.`,
  },
  {
    q: "What time does banana bread delivery start in Lekki?",
    a: "Orders placed by 9pm are baked fresh the next morning and out for delivery from around 10am. Same-day orders close when stock sells out.",
  },
];

export async function getStaticProps() {
  try {
    const res = await fetch(
      `https://api.zupa.ng/customer-requests/stores/${STORE_ID}/products`
    );
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

export default function BananaBreadLekki({ featured }) {
  const router = useRouter();
  return (
    <Main>
      <Head>
        <title>Best Banana Bread in Lekki — Fresh Daily | Gourmet Twist</title>
        <meta name="description" content="Gourmet Twist bakes the best banana bread in Lekki fresh every morning from our Lekki Phase 1 kitchen. 30+ varieties, same-day delivery across Lekki and Lagos Island." />
        <meta property="og:title" content="Best Banana Bread in Lekki | Gourmet Twist" />
        <meta property="og:description" content="Fresh banana bread baked daily in Lekki Phase 1. 30+ varieties, same-day delivery." />
        <meta property="og:url" content="https://gourmettwist.ng/banana-bread-lekki" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://gourmettwist.ng/banana-bread-lekki" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <div className="seo-page">
        <section className="seo-hero">
          <p className="seo-hero__eyebrow">Lekki Phase 1 · Baked Fresh Daily</p>
          <h1 className="seo-hero__title">The Best Banana Bread in Lekki</h1>
          <p className="seo-hero__sub">
            Baked every morning on Fola Osibo Street — 30+ varieties, delivered same-day across Lekki and Lagos Island.
          </p>
          <Link href="/shop"><a className="seo-cta">Order Now</a></Link>
        </section>

        <section className="seo-body">
          <p>
            If you&apos;re searching for the best banana bread in Lekki, the answer is less than a kilometre away. Gourmet Twist has been baking the{" "}
            <strong>World&apos;s Best Banana Bread</strong> from our Lekki Phase 1 kitchen for years — fresh every morning, never frozen, never yesterday&apos;s stock.
          </p>
          <p>
            <strong>Lekki is our home.</strong> We&apos;re based on Fola Osibo Street in Lekki Phase 1, which means Lekki gets the freshest loaves — baked that morning and out for delivery by 10am. Whether you&apos;re in Lekki Phase 1, Chevron Drive, Admiralty Way, or Ajah, we deliver to your door.
          </p>
          <p>
            <strong>30+ varieties, all made here.</strong> Double Chocolate, Triple Choc, Baileys-Infused, Banana × Coconut, Nutty Mix, Nutella Swirl, and more — the widest range of banana bread in Lekki, all baked on the same block. Our 176K+ community keeps coming back because the quality never dips.
          </p>
        </section>

        <section className="seo-features">
          <h2 className="seo-section-title">Why Lekki orders from Gourmet Twist</h2>
          <ul className="seo-features__list">
            {[
              "Kitchen based in Lekki Phase 1 — the freshest loaves on the Island",
              "Same-day delivery across Lekki, Chevron, and Ajah",
              "30+ banana bread flavours — the widest range anywhere in Lagos",
              "Baked fresh each morning — never reheated or frozen",
              "Order online in seconds at gourmettwist.ng",
            ].map((item) => (
              <li key={item} className="seo-features__item">
                <span className="seo-features__check">✓</span>{item}
              </li>
            ))}
          </ul>
        </section>

        {featured.length > 0 && (
          <section className="seo-products">
            <h2 className="seo-section-title">Fresh from our Lekki kitchen today</h2>
            <div className="seo-products__grid">
              {featured.map((p) => (
                <div key={p.id} className="seo-product-card" role="button" tabIndex={0}
                  onClick={() => router.push(`/shop/${slugify(p.name)}`)}
                  onKeyDown={(e) => e.key === "Enter" && router.push(`/shop/${slugify(p.name)}`)}>
                  <div className="seo-product-card__img-wrap">
                    {p.imageUrl ? <img src={p.imageUrl} alt={`${p.name} — banana bread Lekki`} className="seo-product-card__img" loading="lazy" />
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
              <Link href="/shop"><a className="seo-cta">Browse all flavours →</a></Link>
            </div>
          </section>
        )}

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
          <h2 className="seo-bottom-cta__title">Order banana bread in Lekki today</h2>
          <p className="seo-bottom-cta__sub">
            Baked this morning, at your door before lunch. Call{" "}
            <a href={`tel:${PHONE_E164}`} className="seo-phone">{PHONE_DISPLAY}</a> or order online.
          </p>
          <Link href="/shop"><a className="seo-cta">Order Now →</a></Link>
        </section>
      </div>
    </Main>
  );
}
