import { useEffect } from "react";
import { PageTransition } from "next-page-transitions";
import { useRouter } from "next/router";
import smoothscroll from 'smoothscroll-polyfill';

import "../styles/style.sass";

import AuthenticationProvider from "../providers/AuthenticationProvider";
import ProductsProvider from "../providers/ProductsProvider";
import CartProvider from "../providers/CartProvider";

function GourmetTwist({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    smoothscroll.polyfill()
  })
  
  return (
      <CartProvider>
        <ProductsProvider>
          <AuthenticationProvider>
            <Component {...pageProps} />
          </AuthenticationProvider>
        </ProductsProvider>
      </CartProvider>
  );
}

export default GourmetTwist;
