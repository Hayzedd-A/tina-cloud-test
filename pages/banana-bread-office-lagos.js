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
      name: "Can Gourmet Twist supply banana bread for offices in Lagos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Gourmet Twist handles office and corporate banana bread orders across Lagos — multiple loaves, multiple flavours, delivered to your office fresh the morning of your event.",
      },
    },
    {
      "@type": "Question",
      name: "How do I order banana bread for a large office group in Lagos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Call " + PHONE_DISPLAY + " to discuss quantities and flavour mixes. For standard office orders, you can also order multiple items directly at gourmettwist.ng.",
      },
    },
    {
      "@type": "Question",
      name: "What is the best banana bread for office sharing in Lagos?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "For office sharing, a mix of Double Chocolate, Nutty Mix, and Banana x Coconut covers different tastes without anyone being left out. Two or three loaves feed a team of 10-15 comfortably.",
      },
    },
  ],
};

const faqs = [
  { q: "Can Gourmet Twist supply banana bread for offices in Lagos?", a: "Yes. Gourmet Twist handles office and corporate banana bread orders across Lagos — multiple loaves, multiple flavours, delivered to your office fresh the morning of your event." },
  { q: "How do I order banana bread for a large office group in Lagos?", a: `Call ${PHONE_DISPLAY} to discuss quantities and flavour mixes. For standard office orders, you can also order multiple items directly at gourmettwist.ng.` },
  { q: "What is the best banana bread for office sharing in Lagos?", a: "For office sharing, a mix of Double Chocolate, Nutty Mix, and Banana x Coconut covers different tastes without anyone being left out. Two or three loaves feed a team of 10-15 comfortably." },
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

export default function BananaBreadOfficeLagos({ featured }) {
  const router = useRouter();
  return (
    <Main>
      <Head>
        <title>Banana Bread for Office Treats & Corporate Gifting in Lagos | Gourmet Twist</title>
        <meta name="description" content="Gourmet Twist banana bread for Lagos offices — corporate treats, team birthdays, client gifts. Fresh-baked daily in Lekki, delivered to your office across Lagos." />
        <meta property="og:title" content="Banana Bread for Office Treats in Lagos | Gourmet Twist" />
        <meta property="og:description" content="Corporate banana bread orders for Lagos offices. Fresh-baked, multiple flavours, delivered to your door." />
        <meta property="og:url" content="https://gourmettwist.ng/banana-bread-office-lagos" />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://gourmettwist.ng/banana-bread-office-lagos" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>

      <div className="seo-page">
        <section className="seo-hero">
          <p className="seo-hero__eyebrow">Office Treats · Team Birthdays · Corporate Gifting</p>
          <h1 className="seo-hero__title">Banana Bread for Office Treats &amp; Corporate Gifting in Lagos</h1>
          <p className="seo-hero__sub">
            The office treat that gets people talking — fresh-baked, 30+ flavours, delivered to your door in Lagos.
          </p>
          <Link href="/shop"><a className="seo-cta">Order for the Office</a></Link>
        </section>

        <section className="seo-body">
          <p>
            Every Lagos office has had the conversation after someone brought Gourmet Twist: &quot;Where is this from?&quot; It is a different category from supermarket baked goods — you can tell the moment you open the bag that this was baked today.
          </p>
          <p>
            <strong>For team treats:</strong> two or three loaves in different flavours is the move. Double Chocolate for the chocolate crowd, Nutty Mix for those who prefer something lighter, and a wild card like Baileys-Infused or Banana × Coconut. A team of 10-15 is covered, and everyone finds something they like.
          </p>
          <p>
            <strong>For client gifting:</strong> a single loaf of Double Chocolate or Baileys-Infused, delivered fresh to a client&apos;s office on the day of a meeting, is a touchpoint that stands out in a way a hamper does not.
          </p>
          <p>
            <strong>For larger corporate orders</strong> — multiple locations, recurring weekly deliveries, branded packaging — call us on{" "}
            <a href={`tel:${PHONE_E164}`} className="seo-phone">{PHONE_DISPLAY}</a> to discuss.
          </p>
        </section>

        <section className="seo-features">
          <h2 className="seo-section-title">Why Lagos offices choose Gourmet Twist</h2>
          <ul className="seo-features__list">
            {[
              "Baked fresh the morning of delivery — arrives at peak quality",
              "30+ flavours to suit any team's taste",
              "Delivered to your office door across Lagos Island and the mainland",
              "Multiple loaves, multiple flavours — one order, one delivery",
              "Corporate and recurring orders — call for arrangements",
            ].map((item) => (
              <li key={item} className="seo-features__item">
                <span className="seo-features__check">✓</span>{item}
              </li>
            ))}
          </ul>
        </section>

        {featured.length > 0 && (
          <section className="seo-products">
            <h2 className="seo-section-title">Top choices for office orders</h2>
            <div className="seo-products__grid">
              {featured.map((p) => (
                <div key={p.id} className="seo-product-card" role="button" tabIndex={0}
                  onClick={() => router.push(`/shop/${slugify(p.name)}`)}
                  onKeyDown={(e) => e.key === "Enter" && router.push(`/shop/${slugify(p.name)}`)}>
                  <div className="seo-product-card__img-wrap">
                    {p.imageUrl ? <img src={p.imageUrl} alt={`${p.name} — office treat Lagos`} className="seo-product-card__img" loading="lazy" />
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
          <h2 className="seo-section-title">Office order questions</h2>
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
          <h2 className="seo-bottom-cta__title">Order office banana bread in Lagos today</h2>
          <p className="seo-bottom-cta__sub">
            For bulk and corporate orders call{" "}
            <a href={`tel:${PHONE_E164}`} className="seo-phone">{PHONE_DISPLAY}</a>. For standard orders, order online now.
          </p>
          <Link href="/shop"><a className="seo-cta">Order Now →</a></Link>
        </section>
      </div>
    </Main>
  );
}
