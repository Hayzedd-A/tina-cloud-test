import Head from "next/head";
import Link from "next/link";
import Main from "../../layouts/Main";
import { ShopItemDetails } from "../../components/Shop";
import { STORE_ID, API_BASE_URL } from "../../constants";
import { slugify } from "../../utils/functions";

const SITE_URL = "https://gourmettwist.ng";

function buildProductSchema(product, slug) {
  const offers = product.sizes.map((s) => ({
    "@type": "Offer",
    url: `${SITE_URL}/shop/${slug}`,
    priceCurrency: "NGN",
    price: s.details.unitPrice || 0,
    name: s.name,
    availability: "https://schema.org/InStock",
    seller: { "@type": "Organization", name: "Gourmet Twist" },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} — fresh banana bread from Gourmet Twist, baked daily in Lekki, Lagos.`,
    image: product.imageUrl || undefined,
    brand: { "@type": "Brand", name: "Gourmet Twist" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "500",
    },
    offers: offers.length === 1 ? offers[0] : offers,
  };
}

export default function ProductPage({ product, slug }) {
  const pageTitle = `${product.name} | Gourmet Twist`;
  const pageDesc =
    product.description ||
    `${product.name} — fresh-baked daily at Gourmet Twist, Lekki. Order online for delivery across Lagos.`;
  const canonical = `${SITE_URL}/shop/${slug}`;
  const productSchema = buildProductSchema(product, slug);

  return (
    <Main>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="product" />
        {product.imageUrl && (
          <meta property="og:image" content={product.imageUrl} />
        )}
        <link rel="canonical" href={canonical} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      </Head>

      <ShopItemDetails productId={product.id} />

      <div style={{ textAlign: "center", padding: "16px 24px 32px", background: "#1a0a00" }}>
        <Link href="/best-banana-bread-in-lagos">
          <a style={{ color: "#c8a96e", fontSize: "13px", textDecoration: "none" }}>
            ← The World&apos;s Best Banana Bread in Lagos
          </a>
        </Link>
      </div>
    </Main>
  );
}

function flattenProducts(categories) {
  const seen = new Set();
  const products = [];
  for (const cat of categories) {
    const items = [
      ...(cat.topProducts || []),
      ...(cat.products || []),
    ];
    for (const p of items) {
      if (!seen.has(p.id)) {
        seen.add(p.id);
        products.push(p);
      }
    }
  }
  return products;
}

function buildProductProps(product, slug) {
  const sizes = product.sizes || {};
  const sizeKeys = Object.keys(sizes).filter(
    (k) => sizes[k] && sizes[k].length > 0
  );
  const firstDetails = sizeKeys.length > 0 ? sizes[sizeKeys[0]][0] : {};

  return {
    id: product.id,
    name: product.name,
    description: product.description || "",
    imageUrl: firstDetails.imageUrl || null,
    unitPrice: firstDetails.unitPrice || 0,
    sizes: sizeKeys.map((key) => ({
      name: key,
      details: sizes[key][0] || {},
    })),
  };
}

export async function getServerSideProps({ params }) {
  const { slug } = params;

  try {
    const res = await fetch(
      `${API_BASE_URL}customer-requests/stores/${STORE_ID}/products`
    );
    if (!res.ok) throw new Error(`API ${res.status}`);
    const json = await res.json();
    const categories = Array.isArray(json.data) ? json.data : [];
    const allProducts = flattenProducts(categories);

    const match = allProducts.find((p) => slugify(p.name) === slug);

    if (!match) {
      return { notFound: true };
    }

    return {
      props: {
        product: buildProductProps(match, slug),
        slug,
      },
    };
  } catch {
    return { notFound: true };
  }
}
