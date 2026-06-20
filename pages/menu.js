import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import { getRequest } from "../api";
import { STORE_ID } from "../constants";
import { Logo } from "../public/static/vectors";
import Link from "next/link";

const SKIP_CATEGORIES = ["Cake Topper", "Note Card"];

// Returns a flat list of { name, price, image } per size entry
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

// Summary info used on the card
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

// ── Product modal (bottom sheet) ─────────────────────────────────────────────

function ProductModal({ product, onClose }) {
  const name = product.name.trim();
  const desc = product.description?.trim();
  const sizes = getSizeDetails(product.sizes);
  const mainImage = sizes.find((s) => s.image)?.image || null;
  const isSinglePrice =
    sizes.length === 1 ||
    (sizes.length > 0 && sizes.every((s) => s.price === sizes[0].price));
  const isStandardOnly =
    sizes.length === 1 && sizes[0].name.toLowerCase().startsWith("standard");

  // Lock body scroll
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // ESC key to close
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="mm-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={name}>
      <div className="mm-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Image */}
        <div className="mm-img-wrap">
          {mainImage ? (
            <img src={mainImage} alt={name} className="mm-img" />
          ) : (
            <div className="mm-img-placeholder">
              <span>{name[0]}</span>
            </div>
          )}
          <button className="mm-close" onClick={onClose} aria-label="Close details">
            ✕
          </button>
        </div>

        {/* Content */}
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
                  <span className="mm-size-price">{formatPrice(sizes[0].price)}</span>
                </div>
              ) : (
                sizes.map((s) => (
                  <div key={s.name} className="mm-size-row">
                    <span className="mm-size-name">{s.name}</span>
                    <span className="mm-size-price">{formatPrice(s.price)}</span>
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

// ── Product card ──────────────────────────────────────────────────────────────

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
          {hasMultiple ? `from ${formatPrice(minPrice)}` : formatPrice(minPrice)}
        </span>
      </div>
      <div className="mc-body">
        <span className="mc-name">{name}</span>
        <span className="mc-tap-hint">Tap for details</span>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const sectionRefs = useRef([]);
  const tabsRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    getRequest({ url: `/customer-requests/stores/${STORE_ID}/products` })
      .then((res) => {
        const raw = res.data?.data || [];
        const filtered = raw.filter(
          (cat) =>
            !SKIP_CATEGORIES.includes(cat.name.trim()) && cat.products?.length > 0
        );
        setCategories(filtered);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const scrollToSection = (index) => {
    const el = sectionRefs.current[index];
    if (!el) return;
    const tabH = tabsRef.current?.offsetHeight || 56;
    const top = el.getBoundingClientRect().top + window.scrollY - tabH - 8;
    window.scrollTo({ top, behavior: "smooth" });
  };

  useEffect(() => {
    if (!categories.length) return;
    const tabH = tabsRef.current?.offsetHeight || 56;

    const handleScroll = () => {
      const scrollY = window.scrollY + tabH + 24;
      let found = 0;
      sectionRefs.current.forEach((el, i) => {
        if (el && el.offsetTop <= scrollY) found = i;
      });
      if (found !== activeTab) {
        setActiveTab(found);
        const btn = tabsRef.current?.querySelector(`[data-idx="${found}"]`);
        btn?.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories, activeTab]);

  const openProduct = useCallback((product) => setSelectedProduct(product), []);
  const closeProduct = useCallback(() => setSelectedProduct(null), []);

  return (
    <>
      <Head>
        <title>Menu — Gourmet Twist</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
      </Head>

      <div className="menu-page">
        {/* ── Hero ─────────────────────────────── */}
        <header className="menu-hero" ref={heroRef}>
          <div className="menu-hero-logo">
            <Logo />
          </div>
          <div className="menu-hero-wordmark">
            <span className="menu-hero-w1">Gourmet</span>
            <span className="menu-hero-w2">Twist</span>
          </div>
          <p className="menu-hero-sub">
            Artisan bakes · Gift boxes · Breakfast · Cakes
          </p>
          <p className="menu-hero-location">Victoria Island, Lagos</p>
          <a
            href="#menu-start"
            className="menu-hero-cta"
            onClick={(e) => {
              e.preventDefault();
              tabsRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            View menu ↓
          </a>
        </header>

        {/* ── Sticky category tabs ───────────────── */}
        <nav className="menu-tabs-bar" ref={tabsRef} id="menu-start">
          {loading ? (
            <div className="menu-tabs-loading" />
          ) : (
            <div className="menu-tabs-track">
              {categories.map((cat, i) => (
                <button
                  key={cat.id}
                  data-idx={i}
                  className={`menu-tab${activeTab === i ? " menu-tab--on" : ""}`}
                  onClick={() => scrollToSection(i)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* ── Content ──────────────────────────── */}
        <main className="menu-body">
          {loading && (
            <div className="menu-loading">
              <div className="menu-spinner" />
              <p className="menu-loading-text">Loading menu…</p>
            </div>
          )}

          {error && !loading && (
            <div className="menu-error">
              <p>Couldn&apos;t load the menu right now.</p>
              <button onClick={() => window.location.reload()}>Try again</button>
            </div>
          )}

          {categories.map((cat, ci) => {
            const [featured, ...rest] = cat.products;
            return (
              <section
                key={cat.id}
                className="menu-section"
                ref={(el) => (sectionRefs.current[ci] = el)}
              >
                <div className="menu-ch">
                  <div className="menu-ch-inner">
                    <h2 className="menu-ch-name">{cat.name}</h2>
                    <span className="menu-ch-count">{cat.products.length} items</span>
                  </div>
                  <div className="menu-ch-rule" />
                </div>

                {featured && (
                  <ProductCard product={featured} featured onOpen={openProduct} />
                )}

                {rest.length > 0 && (
                  <div className="menu-grid">
                    {rest.map((p) => (
                      <ProductCard key={p.id} product={p} featured={false} onOpen={openProduct} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </main>

        {/* ── Footer ───────────────────────────── */}
        {!loading && !error && (
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

      {/* ── Product modal ────────────────────────── */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={closeProduct} />
      )}
    </>
  );
}
