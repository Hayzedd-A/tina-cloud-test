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

function GourmetTwist({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    smoothscroll.polyfill();
  });

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
