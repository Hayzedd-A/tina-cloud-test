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
      name: "How does banana bread delivery work in Lagos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Order at gourmettwist.ng by 9pm. Your banana bread is baked fresh the next morning and delivered to your door, usually between 10am and 2pm.",
      },
    },
    {
      "@type": "Question",
      name: "Does Gourmet Twist deliver banana bread to the mainland in Lagos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — we deliver across Lagos Island same-day and to the mainland the next day. Delivery fees are calculated at checkout based on your location.",
      },
    },
    {
      "@type": "Question",
      name: "Is there a minimum order for banana bread delivery in Lagos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No minimum order. You can order a single loaf and we will deliver it fresh to your door.",
      },
    },
    {
      "@type": "Question",
      name: "How fresh is the banana bread on delivery?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Every order is baked the morning of delivery. We never deliver frozen or day-old bread — if it was not baked today, it does not go out.",
      },
    },
  ],
};

const faqs = [
  { q: "How does banana bread delivery work in Lagos?", a: "Order at gourmettwist.ng by 9pm. Your banana bread is baked fresh the next morning and delivered to your door, usually between 10am and 2pm." },
  { q: "Does Gourmet Twist deliver banana bread to the mainland in Lagos?", a: "Yes — we deliver across Lagos Island same-day and to the mainland the next day. Delivery fees are calculated at checkout based on your location." },
  { q: "Is there a minimum order for banana bread delivery in Lagos?", a: "No minimum order. You can order a single loaf and we will deliver it fresh to your door." },
  { q: "How fresh is the banana bread on delivery?", a: "Every order is baked the morning of delivery. We never deliver frozen or day-old bread — if it was not baked today, it does not go out." },
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

export default function BananaBreadDeliveryLagos({ featured }) {
  const router = useRouter();
  return (
    <Main>
      <Head>
        <title>Banana Bread Delivery in Lagos — Fresh, Fast | Gourmet Twist</title>
        <meta name="description" content="Order banana bread delivery across Lagos from Gourmet Twist. Baked fresh every morning in Lekki, delivered same-day on the Island and next-day to the mainland." />
        <meta property="og:title" content="Banana Bread Delivery in Lagos | Gourmet Twist" />
        <meta property="og:description" content="Fresh banana bread delivered across Lagos. Baked this morning, at your door today." />
        <meta property="og:url" content="https://gourmettwist.ng/banana-bread-delivery-lagos" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://gourmettwist.ng/banana-bread-delivery-lagos" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <div className="seo-page">
        <section className="seo-hero">
          <p className="seo-hero__eyebrow">Same-Day on the Island · Next-Day Mainland</p>
          <h1 className="seo-hero__title">Banana Bread Delivery Across Lagos</h1>
          <p className="seo-hero__sub">
            Order by 9pm, baked fresh overnight, delivered to your door the next morning. No frozen bread, ever.
          </p>
          <Link href="/shop"><a className="seo-cta">Order Now</a></Link>
        </section>

        <section className="seo-body">
          <p>
            Gourmet Twist delivers banana bread across Lagos — from Lekki and Victoria Island to Ikoyi, Surulere, Yaba, and the mainland. Every loaf is baked fresh the morning it goes out. We do not freeze. We do not reheat. If it was not baked today, it does not leave our kitchen.
          </p>
          <p>
            <strong>How it works:</strong> place your order at gourmettwist.ng by 9pm. Our team bakes your loaves the following morning, and delivery goes out from around 10am. On Lagos Island, most orders arrive by early afternoon. Mainland orders take one additional day.
          </p>
          <p>
            <strong>176,000+ customers</strong> across Lagos trust us for banana bread delivery because the quality is consistent — the same soft, moist, dense crumb every time, 30+ flavours to choose from, and a team that takes freshness seriously enough to bake to order.
          </p>
        </section>

        <section className="seo-features">
          <h2 className="seo-section-title">What makes our delivery different</h2>
          <ul className="seo-features__list">
            {[
              "Baked the morning of your delivery — not days before",
              "Same-day delivery across Lagos Island (Lekki, VI, Ikoyi, Ajah)",
              "Next-day delivery to the mainland (Surulere, Yaba, Ikeja and beyond)",
              "No minimum order — one loaf delivered fresh",
              "30+ flavours, all available for delivery",
            ].map((item) => (
              <li key={item} className="seo-features__item">
                <span className="seo-features__check">✓</span>{item}
              </li>
            ))}
          </ul>
        </section>

        {featured.length > 0 && (
          <section className="seo-products">
            <h2 className="seo-section-title">Available for delivery today</h2>
            <div className="seo-products__grid">
              {featured.map((p) => (
                <div key={p.id} className="seo-product-card" role="button" tabIndex={0}
                  onClick={() => router.push(`/shop/${slugify(p.name)}`)}
                  onKeyDown={(e) => e.key === "Enter" && router.push(`/shop/${slugify(p.name)}`)}>
                  <div className="seo-product-card__img-wrap">
                    {p.imageUrl ? <img src={p.imageUrl} alt={`${p.name} delivery Lagos`} className="seo-product-card__img" loading="lazy" />
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
              <Link href="/shop"><a className="seo-cta">Browse all 30+ flavours →</a></Link>
            </div>
          </section>
        )}

        <section className="seo-faq">
          <h2 className="seo-section-title">Delivery questions answered</h2>
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
          <h2 className="seo-bottom-cta__title">Ready to order banana bread delivery in Lagos?</h2>
          <p className="seo-bottom-cta__sub">
            Place your order by 9pm tonight. Call{" "}
            <a href={`tel:${PHONE_E164}`} className="seo-phone">{PHONE_DISPLAY}</a> or order online.
          </p>
          <Link href="/shop"><a className="seo-cta">Order Now →</a></Link>
        </section>
      </div>
    </Main>
  );
}
