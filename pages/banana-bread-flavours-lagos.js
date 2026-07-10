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
      name: "What banana bread flavours does Gourmet Twist have in Lagos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Over 30 varieties including Double Chocolate, Triple Choc, Baileys-Infused, Banana x Coconut, Nutty Mix, Nutella Swirl, Banana Fruit Cake, and many more — the widest range of banana bread flavours in Lagos.",
      },
    },
    {
      "@type": "Question",
      name: "What is the most popular banana bread flavour at Gourmet Twist?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Double Chocolate and Triple Choc consistently top the order charts, followed closely by Baileys-Infused. For first-timers, we recommend Double Chocolate.",
      },
    },
    {
      "@type": "Question",
      name: "Does Gourmet Twist have non-chocolate banana bread flavours?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — Nutty Mix, Banana x Coconut, and the classic Banana Bread are popular choices for those who prefer something lighter than chocolate.",
      },
    },
  ],
};

const faqs = [
  { q: "What banana bread flavours does Gourmet Twist have in Lagos?", a: "Over 30 varieties including Double Chocolate, Triple Choc, Baileys-Infused, Banana x Coconut, Nutty Mix, Nutella Swirl, Banana Fruit Cake, and many more — the widest range of banana bread flavours in Lagos." },
  { q: "What is the most popular banana bread flavour at Gourmet Twist?", a: "Double Chocolate and Triple Choc consistently top the order charts, followed closely by Baileys-Infused. For first-timers, we recommend Double Chocolate." },
  { q: "Does Gourmet Twist have non-chocolate banana bread flavours?", a: "Yes — Nutty Mix, Banana x Coconut, and the classic Banana Bread are popular choices for those who prefer something lighter than chocolate." },
];

export async function getStaticProps() {
  try {
    const res = await fetch(`https://api.zupa.ng/customer-requests/stores/${STORE_ID}/products`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    const categories = Array.isArray(data.data) ? data.data : [];

    // For the flavours page, show all products (not just top 8)
    const seen = new Set();
    const allProducts = [];
    for (const cat of categories) {
      const items = [...(cat.topProducts || []), ...(cat.products || [])];
      for (const p of items) {
        if (seen.has(p.id)) continue;
        seen.add(p.id);
        const sizes = p.sizes || {};
        const key = Object.keys(sizes).find((s) => sizes[s]?.length > 0);
        if (!key) continue;
        const v = sizes[key][0] || {};
        allProducts.push({ id: p.id, name: p.name, imageUrl: v.imageUrl || null, unitPrice: v.unitPrice || 0 });
      }
    }
    return { props: { allProducts }, revalidate: 3600 };
  } catch {
    return { props: { allProducts: [] }, revalidate: 60 };
  }
}

export default function BananaBreadFlavoursLagos({ allProducts }) {
  const router = useRouter();
  return (
    <Main>
      <Head>
        <title>30+ Banana Bread Flavours in Lagos | Gourmet Twist</title>
        <meta name="description" content="Gourmet Twist has the widest range of banana bread flavours in Lagos — Double Chocolate, Triple Choc, Baileys-Infused, Nutella, Banana x Coconut and 25+ more. Order fresh." />
        <meta property="og:title" content="30+ Banana Bread Flavours in Lagos | Gourmet Twist" />
        <meta property="og:description" content="The widest range of banana bread flavours in Lagos. All 30+ varieties, baked fresh daily in Lekki." />
        <meta property="og:url" content="https://gourmettwist.ng/banana-bread-flavours-lagos" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://gourmettwist.ng/banana-bread-flavours-lagos" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <div className="seo-page">
        <section className="seo-hero">
          <p className="seo-hero__eyebrow">30+ Varieties · Baked Fresh Daily in Lekki</p>
          <h1 className="seo-hero__title">Every Banana Bread Flavour We Make</h1>
          <p className="seo-hero__sub">
            The widest range of banana bread in Lagos — from classic to triple-chocolate to Baileys-infused. All baked fresh, delivered across Lagos.
          </p>
          <Link href="/shop"><a className="seo-cta">Browse the Full Menu</a></Link>
        </section>

        <section className="seo-body">
          <p>
            No one in Lagos makes more banana bread varieties than Gourmet Twist. What started as one classic recipe has grown into a menu of{" "}
            <strong>30+ distinct flavours</strong> — each developed, tested, and refined until it was noticeably better than anything else on the market.
          </p>
          <p>
            <strong>For the chocolate lover:</strong> Double Chocolate, Triple Choc, and Choc Chunks are the trio you want. Triple Choc layers chocolate batter, chips, and a ganache swirl — it is the one people order again before the first loaf is finished.
          </p>
          <p>
            <strong>For something different:</strong> Baileys-Infused (adult favourite), Banana × Coconut (tropical), and Nutty Mix (textured, less sweet) are the pick for people who want something memorable without being obvious.
          </p>
          <p>
            <strong>Every single flavour</strong> is baked the morning of your delivery — never frozen, never day-old. That&apos;s how 176,000+ customers know they can trust us.
          </p>
        </section>

        {allProducts.length > 0 && (
          <section className="seo-products">
            <h2 className="seo-section-title">All our flavours</h2>
            <div className="seo-products__grid">
              {allProducts.map((p) => (
                <div key={p.id} className="seo-product-card" role="button" tabIndex={0}
                  onClick={() => router.push(`/shop/${slugify(p.name)}`)}
                  onKeyDown={(e) => e.key === "Enter" && router.push(`/shop/${slugify(p.name)}`)}>
                  <div className="seo-product-card__img-wrap">
                    {p.imageUrl ? <img src={p.imageUrl} alt={`${p.name} — banana bread Lagos`} className="seo-product-card__img" loading="lazy" />
                      : <div className="seo-product-card__img-placeholder" />}
                  </div>
                  <div className="seo-product-card__info">
                    <span className="seo-product-card__name">{p.name}</span>
                    <span className="seo-product-card__price">from ₦{Number(p.unitPrice).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="seo-faq">
          <h2 className="seo-section-title">Flavour questions</h2>
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
          <h2 className="seo-bottom-cta__title">30+ flavours, all baked fresh today</h2>
          <p className="seo-bottom-cta__sub">
            Call <a href={`tel:${PHONE_E164}`} className="seo-phone">{PHONE_DISPLAY}</a> or order online and choose your favourite.
          </p>
          <Link href="/shop"><a className="seo-cta">Order Now →</a></Link>
        </section>
      </div>
    </Main>
  );
}
