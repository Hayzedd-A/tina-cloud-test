import { PageTransition } from "next-page-transitions";
import { useRouter } from "next/router";

import "../styles/style.sass";

import AuthenticationProvider from "../providers/AuthenticationProvider";
import ProductsProvider from "../providers/ProductsProvider";
import CartProvider from "../providers/CartProvider";

const TIMEOUT = 400;

function GourmetTwist({ Component, pageProps }) {
  const router = useRouter();

  return (
    <>
      {/* <PageTransition
        timeout={TIMEOUT}
        classNames={
          router.pathname === "/shop/[name]/[id]" ? "page-transition" : ""
        }
        // loadingComponent={<Loader />}
        // loadingDelay={500}
        loadingTimeout={{
          enter: TIMEOUT,
          exit: 0
        }}
        loadingClassNames="loading-indicator"
      > */}
        <CartProvider>
          <ProductsProvider>
            <AuthenticationProvider>
              <Component {...pageProps} />
            </AuthenticationProvider>
          </ProductsProvider>
        </CartProvider>
      {/* </PageTransition> */}
    </>
  );
}

export default GourmetTwist;
