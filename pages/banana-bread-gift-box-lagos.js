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
      name: "Does Gourmet Twist do banana bread gift boxes in Lagos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — Gourmet Twist banana bread makes one of the most distinctive gifts in Lagos. Order any flavour for delivery directly to the recipient, fresh-baked the morning it arrives.",
      },
    },
    {
      "@type": "Question",
      name: "Can I order banana bread for a birthday in Lagos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Absolutely. Banana bread from Gourmet Twist is a popular birthday gift across Lagos. Order online with the delivery address, and we bake it fresh the day of delivery.",
      },
    },
    {
      "@type": "Question",
      name: "Can Gourmet Twist handle bulk banana bread orders for offices in Lagos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. For corporate and bulk orders, call " + PHONE_DISPLAY + " to discuss quantities, flavour mixes, and delivery logistics.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best banana bread flavour to give as a gift?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Baileys-Infused is a crowd favourite for adult gifts. For broader appeal, Double Chocolate or a mixed selection covers all bases.",
      },
    },
  ],
};

const faqs = [
  { q: "Does Gourmet Twist do banana bread gift boxes in Lagos?", a: "Yes — Gourmet Twist banana bread makes one of the most distinctive gifts in Lagos. Order any flavour for delivery directly to the recipient, fresh-baked the morning it arrives." },
  { q: "Can I order banana bread for a birthday in Lagos?", a: "Absolutely. Banana bread from Gourmet Twist is a popular birthday gift across Lagos. Order online with the delivery address, and we bake it fresh the day of delivery." },
  { q: "Can Gourmet Twist handle bulk banana bread orders for offices in Lagos?", a: `Yes. For corporate and bulk orders, call ${PHONE_DISPLAY} to discuss quantities, flavour mixes, and delivery logistics.` },
  { q: "What is the best banana bread flavour to give as a gift?", a: "Baileys-Infused is a crowd favourite for adult gifts. For broader appeal, Double Chocolate or a mixed selection covers all bases." },
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

export default function BananaBreadGiftBoxLagos({ featured }) {
  const router = useRouter();
  return (
    <Main>
      <Head>
        <title>Banana Bread Gift Box in Lagos — Birthdays, Offices & More | Gourmet Twist</title>
        <meta name="description" content="The best banana bread gift in Lagos — fresh-baked the morning it arrives. Perfect for birthdays, office treats, thank-you gifts, and corporate orders. Order at Gourmet Twist." />
        <meta property="og:title" content="Banana Bread Gift Box in Lagos | Gourmet Twist" />
        <meta property="og:description" content="Fresh banana bread gifts in Lagos — baked the morning of delivery. Birthdays, offices, and corporate orders." />
        <meta property="og:url" content="https://gourmettwist.ng/banana-bread-gift-box-lagos" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://gourmettwist.ng/banana-bread-gift-box-lagos" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <div className="seo-page">
        <section className="seo-hero">
          <p className="seo-hero__eyebrow">Birthdays · Office Treats · Thank-You Gifts</p>
          <h1 className="seo-hero__title">The Best Banana Bread Gift Box in Lagos</h1>
          <p className="seo-hero__sub">
            A gift that lands differently — fresh-baked the morning it arrives, in 30+ flavours. Delivered across Lagos.
          </p>
          <Link href="/shop"><a className="seo-cta">Order a Gift</a></Link>
        </section>

        <section className="seo-body">
          <p>
            Anyone can send a hamper. Gourmet Twist banana bread is a gift people actually remember — soft, moist, baked that morning, in a flavour chosen specifically for the person receiving it. It says &quot;I thought about this.&quot;
          </p>
          <p>
            <strong>For birthdays:</strong> Baileys-Infused or Triple Choc. Both are celebratory, both are a cut above a standard supermarket cake, and both arrive fresh enough to share that afternoon.
          </p>
          <p>
            <strong>For office treats:</strong> order two or three flavours — Double Chocolate, Nutty Mix, and one wild card — and let people try. You will be the person who brought the thing everyone talked about all week.
          </p>
          <p>
            <strong>For corporate gifting:</strong> call us on{" "}
            <a href={`tel:${PHONE_E164}`} className="seo-phone">{PHONE_DISPLAY}</a> to discuss bulk quantities, flavour mixes, and delivery to multiple addresses across Lagos.
          </p>
        </section>

        <section className="seo-features">
          <h2 className="seo-section-title">Why Gourmet Twist is Lagos&apos;s favourite banana bread gift</h2>
          <ul className="seo-features__list">
            {[
              "Baked fresh the morning of delivery — arrives at its best",
              "30+ flavours to match any recipient's taste",
              "Delivered directly to the recipient's door across Lagos",
              "176K+ community — a gift brand people already trust and love",
              "Corporate and bulk orders available — call for details",
            ].map((item) => (
              <li key={item} className="seo-features__item">
                <span className="seo-features__check">✓</span>{item}
              </li>
            ))}
          </ul>
        </section>

        {featured.length > 0 && (
          <section className="seo-products">
            <h2 className="seo-section-title">Popular gift choices</h2>
            <div className="seo-products__grid">
              {featured.map((p) => (
                <div key={p.id} className="seo-product-card" role="button" tabIndex={0}
                  onClick={() => router.push(`/shop/${slugify(p.name)}`)}
                  onKeyDown={(e) => e.key === "Enter" && router.push(`/shop/${slugify(p.name)}`)}>
                  <div className="seo-product-card__img-wrap">
                    {p.imageUrl ? <img src={p.imageUrl} alt={`${p.name} — banana bread gift Lagos`} className="seo-product-card__img" loading="lazy" />
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
              <Link href="/shop"><a className="seo-cta">Browse all gift options →</a></Link>
            </div>
          </section>
        )}

        <section className="seo-faq">
          <h2 className="seo-section-title">Gift order questions</h2>
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
          <h2 className="seo-bottom-cta__title">Send banana bread as a gift in Lagos today</h2>
          <p className="seo-bottom-cta__sub">
            Call <a href={`tel:${PHONE_E164}`} className="seo-phone">{PHONE_DISPLAY}</a> for bulk orders, or order online now.
          </p>
          <Link href="/shop"><a className="seo-cta">Order a Gift →</a></Link>
        </section>
      </div>
    </Main>
  );
}
