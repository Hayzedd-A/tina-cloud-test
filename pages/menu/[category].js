import { useState, useEffect, useCallback } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import { getRequest } from "../../api";
import { STORE_ID } from "../../constants";
import { slugify } from "../../utils/functions";
import { Logo } from "../../public/static/vectors";

const SKIP_CATEGORIES = ["Cake Topper", "Note Card"];

function getSizeDetails(sizes) {
  const result = [];
  Object.entries(sizes).forEach(([sizeName, items]) => {
    if (items.length > 0) {
      result.push({
        name: sizeName.trim(),
        price: items[0].unitPrice,
        image: items[0].imageUrl || null,
      });
    }
  });
  return result;
}

function getPriceInfo(sizes) {
  const details = getSizeDetails(sizes);
  if (!details.length) return { minPrice: 0, hasMultiple: false, image: null };
  const prices = details.map((d) => d.price).filter(Boolean);
  return {
    minPrice: Math.min(...prices),
    hasMultiple: details.length > 1,
    image: details.find((d) => d.image)?.image || null,
  };
}

function formatPrice(n) {
  if (!n) return "";
  return "₦" + Number(n).toLocaleString("en-NG");
}

function ProductModal({ product, onClose }) {
  const name = product.name.trim();
  const desc = product.description?.trim();
  const sizes = getSizeDetails(product.sizes);
  const mainImage = sizes.find((s) => s.image)?.image || null;
  const isStandardOnly =
    sizes.length === 1 && sizes[0].name.toLowerCase().startsWith("standard");

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="mm-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={name}
    >
      <div className="mm-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="mm-img-wrap">
          {mainImage ? (
            <img src={mainImage} alt={name} className="mm-img" />
          ) : (
            <div className="mm-img-placeholder">
              <span>{name[0]}</span>
            </div>
          )}
          <button
            className="mm-close"
            onClick={onClose}
            aria-label="Close details"
          >
            ✕
          </button>
        </div>
        <div className="mm-content">
          <h2 className="mm-name">{name}</h2>
          {desc && <p className="mm-desc">{desc}</p>}
          <div className="mm-pricing">
            <h3 className="mm-pricing-label">
              {isStandardOnly ? "Price" : "Sizes & Prices"}
            </h3>
            <div className="mm-sizes-list">
              {isStandardOnly ? (
                <div className="mm-size-row mm-size-row--solo">
                  <span className="mm-size-price">
                    {formatPrice(sizes[0].price)}
                  </span>
                </div>
              ) : (
                sizes.map((s) => (
                  <div key={s.name} className="mm-size-row">
                    <span className="mm-size-name">{s.name}</span>
                    <span className="mm-size-price">
                      {formatPrice(s.price)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
          <Link href="/" legacyBehavior>
            <a className="mm-order-btn">Order online →</a>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, featured, onOpen }) {
  const { minPrice, hasMultiple, image } = getPriceInfo(product.sizes);
  const name = product.name.trim();

  return (
    <div
      className={`mc${featured ? " mc--featured" : ""}`}
      onClick={() => onOpen(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onOpen(product)}
    >
      <div className="mc-img-wrap">
        {image ? (
          <img src={image} alt={name} className="mc-img" loading="lazy" />
        ) : (
          <div className="mc-img-placeholder">
            <span>{name[0]}</span>
          </div>
        )}
        <span className="mc-price">
          {hasMultiple
            ? `from ${formatPrice(minPrice)}`
            : formatPrice(minPrice)}
        </span>
      </div>
      <div className="mc-body">
        <span className="mc-name">{name}</span>
        <span className="mc-tap-hint">Tap for details</span>
      </div>
    </div>
  );
}

export default function MenuCategoryPage() {
  const router = useRouter();
  const { category: slug } = router.query;

  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (!slug) return;
    getRequest({ url: `/customer-requests/stores/${STORE_ID}/products` })
      .then((res) => {
        const raw = res.data?.data || [];
        const filtered = raw.filter(
          (cat) =>
            !SKIP_CATEGORIES.includes(cat.name.trim()) &&
            cat.products?.length > 0,
        );
        const match = filtered.find((cat) => slugify(cat.name) === slug);
        if (match) {
          setCategory(match);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const openProduct = useCallback((product) => setSelectedProduct(product), []);
  const closeProduct = useCallback(() => setSelectedProduct(null), []);

  const [featured, ...rest] = category?.products || [];

  return (
    <>
      <Head>
        <title>
          {category ? `${category.name} — Gourmet Twist` : "Menu — Gourmet Twist"}
        </title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="menu-page">
        {/* ── Top bar ─────────────────────────────── */}
        <header className="cp-topbar">
          <div className="cp-topbar-inner">
            <Link href="/menu" legacyBehavior>
              <a className="cp-back" aria-label="Back to full menu">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Menu
              </a>
            </Link>
            <div className="cp-topbar-logo">
              <Logo />
            </div>
          </div>
        </header>

        {/* ── Category heading ─────────────────────── */}
        {category && (
          <div className="cp-heading">
            <h1 className="cp-heading-name">{category.name}</h1>
            <div className="menu-ch-rule" />
            <p className="cp-heading-count">
              {category.products.length}{" "}
              {category.products.length === 1 ? "item" : "items"}
            </p>
          </div>
        )}

        {loading && (
          <div className="menu-loading">
            <div className="menu-spinner" />
            <p className="menu-loading-text">Loading…</p>
          </div>
        )}

        {error && !loading && (
          <div className="menu-error">
            <p>Couldn&apos;t load products right now.</p>
            <button onClick={() => window.location.reload()}>Try again</button>
          </div>
        )}

        {notFound && !loading && (
          <div className="cp-not-found">
            <p className="cp-not-found-title">Category not found</p>
            <Link href="/menu" legacyBehavior>
              <a className="cp-not-found-link">← Back to full menu</a>
            </Link>
          </div>
        )}

        {/* ── Products ─────────────────────────────── */}
        {category && !loading && (
          <main className="menu-body">
            {featured && (
              <ProductCard product={featured} featured onOpen={openProduct} />
            )}
            {rest.length > 0 && (
              <div className="menu-grid">
                {rest.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    featured={false}
                    onOpen={openProduct}
                  />
                ))}
              </div>
            )}
          </main>
        )}

        {/* ── Footer ───────────────────────────────── */}
        {!loading && !error && !notFound && category && (
          <footer className="menu-footer">
            <div className="menu-footer-logo">
              <Logo />
            </div>
            <p className="menu-footer-copy">
              Prices in Nigerian Naira (₦) · Menu subject to availability
            </p>
            <Link href="/" legacyBehavior>
              <a className="menu-footer-order">Order for delivery →</a>
            </Link>
          </footer>
        )}
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={closeProduct} />
      )}
    </>
  );
}
