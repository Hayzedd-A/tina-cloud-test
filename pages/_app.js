import "../styles/style.sass";

import AuthenticationProvider from "../providers/AuthenticationProvider";
import ProductsProvider from "../providers/ProductsProvider";
import CartProvider from "../providers/CartProvider";

function GourmetTwist({ Component, pageProps }) {
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
