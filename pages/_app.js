import { PageTransition } from "next-page-transitions";
import { useRouter } from "next/router";

import "../styles/style.sass";

import AuthenticationProvider from "../providers/AuthenticationProvider";
import ProductsProvider from "../providers/ProductsProvider";
import CartProvider from "../providers/CartProvider";

function GourmetTwist({ Component, pageProps }) {
  const router = useRouter();
  
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
