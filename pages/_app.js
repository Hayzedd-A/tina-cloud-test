import "../styles/style.sass";

import ProductsProvider from "../providers/ProductsProvider";
import CartProvider from "../providers/CartProvider";

function GourmetTwist({ Component, pageProps }) {
  return (
    <CartProvider>
      <ProductsProvider>
        <Component {...pageProps} />
      </ProductsProvider>
    </CartProvider>
  );
}

export default GourmetTwist;
