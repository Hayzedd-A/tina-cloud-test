import { useEffect } from "react";
import { PageTransition } from "next-page-transitions";
import { useRouter } from "next/router";
import smoothscroll from "smoothscroll-polyfill";

import "../styles/style.sass";

import "../styles/customStyles.css"

import AuthenticationProvider from "../providers/AuthenticationProvider";
import ProductsProvider from "../providers/ProductsProvider";
import CartProvider from "../providers/CartProvider";
import StoreProvider from "../providers/StoreProvider";
import withAnalytics from "../hocs/withAnalytics";

function persistFbc() {
  if (typeof window === "undefined") return;
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  if (!fbclid) return;
  const alreadySet = document.cookie.split(";").some((c) => c.trim().startsWith("_fbc="));
  if (alreadySet) return;
  const expires = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `_fbc=fb.1.${Date.now()}.${fbclid}; expires=${expires}; path=/; SameSite=Lax`;
}

function GourmetTwist({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    smoothscroll.polyfill();
    persistFbc();

    const handleRouteChange = () => {
      persistFbc();
      if (typeof window !== "undefined" && typeof window.fbq === "function") {
        window.fbq("track", "PageView");
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => router.events.off("routeChangeComplete", handleRouteChange);
  }, []);

  return (
    <StoreProvider>
      <CartProvider>
        <ProductsProvider>
          <AuthenticationProvider>
            <Component {...pageProps} />
          </AuthenticationProvider>
        </ProductsProvider>
      </CartProvider>
    </StoreProvider>
  );
}

export default withAnalytics(GourmetTwist);
