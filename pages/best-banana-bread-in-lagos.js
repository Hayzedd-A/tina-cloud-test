import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import Main from "../layouts/Main";
import { slugify } from "../utils/functions";

const STORE_ID = "8a7a28dc-b54d-4841-b949-efe60dbae709";
const PHONE_E164 = "+2347018249203";
const PHONE_DISPLAY = "0701 824 9203";
const LAT = 6.601838;
const LNG = 3.3514863;

const bakerySchema = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: "Gourmet Twist",
  description:
    "Home of the World's Best Banana Bread — 30+ fresh varieties baked daily in Lekki and delivered across Lagos.",
  url: "https://gourmettwist.ng",
  telephone: PHONE_E164,
  priceRange: "₦₦",
  address: {
    "@type": "PostalAddress",
    streetAddress: "19B Fola Osibo Street, Lekki Phase 1",
    addressLocality: "Lekki",
    addressRegion: "Lagos",
    addressCountry: "NG",
  },
  geo: { "@type": "GeoCoordinates", latitude: LAT, longitude: LNG },
  servesCuisine: "Bakery, Desserts",
  areaServed: "Lagos",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "500",
  },
  sameAs: [
    "https://www.instagram.com/gourmettwist",
    "https://www.facebook.com/gourmettwist",
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Where can I buy the best banana bread in Lagos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Gourmet Twist bakes the best banana bread in Lagos fresh daily in Lekki Phase 1 and delivers across Lagos. Order at gourmettwist.ng.",
      },
    },
    {
      "@type": "Question",
      name: "Does Gourmet Twist deliver banana bread across Lagos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — same-day delivery on the Island and next-day to the mainland, baked fresh on the day of delivery.",
      },
    },
    {
      "@type": "Question",
      name: "What banana bread flavours does Gourmet Twist have?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Over 30 varieties including Double Chocolate, Triple Choc, Banana x Coconut, Nutty Mix, Nutella and more.",
      },
    },
    {
      "@type": "Question",
      name: "Where is Gourmet Twist located?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our kitchen is at 19B Fola Osibo Street, Lekki Phase 1, Lagos. We deliver across Lagos Island and the mainland.",
      },
    },
  ],
};

const faqs = [
  {
    q: "Where can I buy the best banana bread in Lagos?",
    a: "Gourmet Twist bakes the best banana bread in Lagos fresh daily in Lekki Phase 1 and delivers across Lagos. Order right here at gourmettwist.ng.",
  },
  {
    q: "Does Gourmet Twist deliver banana bread across Lagos?",
    a: "Yes — same-day delivery on the Island and next-day to the mainland, baked fresh on the day of delivery.",
  },
  {
    q: "What banana bread flavours does Gourmet Twist have?",
    a: "Over 30 varieties including Double Chocolate, Triple Choc, Banana × Coconut, Nutty Mix, Nutella, Baileys-infused, and more.",
  },
  {
    q: "Where is Gourmet Twist located?",
    a: "Our kitchen is at 19B Fola Osibo Street, Lekki Phase 1, Lagos. We deliver island-wide and to the mainland.",
  },
];

export async function getStaticProps() {
  try {
    const res = await fetch(
      `https://api.zupa.ng/customer-requests/stores/${STORE_ID}/products`,
    );
    if (!res.ok) throw new Error(`API ${res.status}`);
    const data = await res.json();
    const categories = Array.isArray(data.data) ? data.data : [];

    const featured = [];

    for (const cat of categories) {
      // prefer topProducts, fall back to products
      const source = cat.topProducts?.length
        ? cat.topProducts
        : cat.products || [];
      for (const product of source) {
        if (featured.length >= 8) break;
        const sizes = product.sizes || {};
        const firstSizeKey = Object.keys(sizes).find(
          (s) => sizes[s] && sizes[s].length > 0,
        );
        if (!firstSizeKey) continue;
        const variant = sizes[firstSizeKey][0] || {};
        featured.push({
          id: product.id,
          name: product.name,
          imageUrl: variant.imageUrl || null,
          unitPrice: variant.unitPrice || 0,
        });
      }
      if (featured.length >= 8) break;
    }

    return { props: { featured }, revalidate: 3600 };
  } catch {
    return { props: { featured: [] }, revalidate: 60 };
  }
}

export default function BestBananaBreadInLagos({ featured }) {
  const router = useRouter();

  return (
    <Main>
      <Head>
        <title>
          Best Banana Bread in Lagos | Gourmet Twist — World&apos;s Best,
          Delivered Fresh
        </title>
        <meta
          name="description"
          content="Gourmet Twist bakes the best banana bread in Lagos — 30+ fresh varieties, baked daily in Lekki, delivered across Lagos. Order the World's Best Banana Bread online."
        />
        <meta
          property="og:title"
          content="Best Banana Bread in Lagos | Gourmet Twist"
        />
        <meta
          property="og:description"
          content="30+ fresh banana bread varieties baked daily in Lekki Phase 1. Same-day delivery across Lagos Island."
        />
        <meta
          property="og:url"
          content="https://gourmettwist.ng/best-banana-bread-in-lagos"
        />
        <meta property="og:type" content="website" />
        <link
          rel="canonical"
          href="https://gourmettwist.ng/best-banana-bread-in-lagos"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(bakerySchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </Head>

      <div className="seo-page">
        {/* Hero */}
        <section className="seo-hero">
          <p className="seo-hero__eyebrow">
            World&apos;s Best Banana Bread · Lekki, Lagos
          </p>
          <h1 className="seo-hero__title">The Best Banana Bread in Lagos</h1>
          <p className="seo-hero__sub">
            Soft, moist, baked fresh every morning — 30+ varieties, delivered
            across Lagos.
          </p>
          <Link href="/shop">
            <a className="seo-cta">Order Now</a>
          </Link>
        </section>

        {/* Body copy */}
        <section className="seo-body">
          <p>
            If you&apos;ve searched for the best banana bread in Lagos,
            you&apos;ve found it. Gourmet Twist is the home of the{" "}
            <strong>World&apos;s Best Banana Bread</strong> — soft, moist, and
            baked fresh every single morning in our Lekki Phase 1 kitchen, then
            delivered across Lagos.
          </p>
          <p>
            <strong>Over 30 banana bread varieties.</strong> From our legendary{" "}
            <strong>Double Chocolate</strong> and <strong>Triple Choc</strong>{" "}
            loaves to Banana × Coconut, Nutty Mix, Nutella, Baileys-infused, and
            more — Gourmet Twist has built the widest range of premium banana
            bread in Lagos, with a loyal community of 176,000+ who keep coming
            back.
          </p>
          <p>
            <strong>Baked fresh, delivered fast.</strong> Every order is baked
            the day it&apos;s delivered — never frozen, never day-old. We
            deliver across Lagos from our Lekki Phase 1 base, with same-day
            delivery on the Island and next-day to the mainland.
          </p>
        </section>

        {/* Why us */}
        <section className="seo-features">
          <h2 className="seo-section-title">Why Lagos calls us the best</h2>
          <ul className="seo-features__list">
            {[
              "30+ fresh banana bread flavours — the widest range in the city",
              "Baked fresh daily in Lekki Phase 1 — never frozen",
              "176K+ community and a 4.8-star reputation for consistency",
              "Seamless online ordering, delivered warm to your door",
              "Perfect for yourself, gifting, birthdays, and office treats",
            ].map((item) => (
              <li key={item} className="seo-features__item">
                <span className="seo-features__check">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Product grid */}
        {featured.length > 0 && (
          <section className="seo-products">
            <h2 className="seo-section-title">Our most loved flavours</h2>
            <div className="seo-products__grid">
              {featured.map((product) => (
                <div
                  key={product.id}
                  className="seo-product-card"
                  role="button"
                  tabIndex={0}
                  onClick={() => router.push(`/shop/${slugify(product.name)}`)}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    router.push(`/shop/${slugify(product.name)}`)
                  }
                >
                  <div className="seo-product-card__img-wrap">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={`${product.name} — banana bread in Lagos`}
                        className="seo-product-card__img"
                        loading="lazy"
                      />
                    ) : (
                      <div className="seo-product-card__img-placeholder" />
                    )}
                  </div>
                  <div className="seo-product-card__info">
                    <span className="seo-product-card__name">
                      {product.name}
                    </span>
                    <span className="seo-product-card__price">
                      from ₦{Number(product.unitPrice).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="seo-cta-row">
              <Link href="/">
                <a className="seo-cta">Browse all 30+ flavours →</a>
              </Link>
            </div>
          </section>
        )}

        {/* FAQ */}
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

        {/* Bottom CTA */}
        <section className="seo-bottom-cta">
          <h2 className="seo-bottom-cta__title">
            Order the best banana bread in Lagos
          </h2>
          <p className="seo-bottom-cta__sub">
            Fresh-baked today, delivered to your door. Call us on{" "}
            <a href={`tel:${PHONE_E164}`} className="seo-phone">
              {PHONE_DISPLAY}
            </a>{" "}
            or order online.
          </p>
          <Link href="/shop">
            <a className="seo-cta">Order Now →</a>
          </Link>
        </section>
      </div>
    </Main>
  );
}
