import "../styles/style.sass";

import CartProvider from "../providers/CartProvider";

function GourmetTwist({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
    </CartProvider>
  );
}

export default GourmetTwist;
