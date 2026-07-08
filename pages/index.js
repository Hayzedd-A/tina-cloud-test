import { Component } from "react";
import { withRouter } from "next/router";

import Main from "../layouts/Main";
import Shop from "../components/Shop";
import SplashScreen from "../components/SplashScreen";
import PopupModal from "../components/PopupModal";

import { ProductsConsumer } from "../providers/ProductsProvider";
import { slugify } from "../utils/functions";
import { FIRST_ORDER_DISCOUNT_PERCENT } from "../constants";

class Home extends Component {
  state = {
    selectedItem: {},
    showDetails: false,
    showSplash: true,
  };

  selectItem = ({ name, id, sizes }) => {
    if (typeof window !== "undefined" && typeof window.fbq === "function") {
      const firstSizeKey = Object.keys(sizes || {}).find(
        (s) => sizes[s] && sizes[s].length > 0
      );
      const unitPrice = firstSizeKey ? sizes[firstSizeKey][0]?.unitPrice || 0 : 0;
      window.fbq("track", "ViewContent", {
        content_ids: [id],
        content_type: "product",
        content_name: name,
        value: unitPrice,
        currency: "NGN",
      });
    }
    this.props.router.push(`/shop?name=${slugify(name)}&id=${id}`, undefined, {
      shallow: true,
    });
  };

  componentDidMount() {
    this.splashtimeout = setTimeout(() => {
      this.setState({ showSplash: false });
    }, 4000);
  }

  componentWillUnmount() {
    clearTimeout(this.splashtimeout);
  }

  render() {
    const { isLoadingProducts } = this.props;

    return (
      <Main>
        {isLoadingProducts ? (
          <SplashScreen />
        ) : (
          <>
            {/* <PopupModal
              OkText="Got it!"
              text={{
                main: `🎉 First-time customer? Enjoy ${FIRST_ORDER_DISCOUNT_PERCENT}% off your first order!`,
                sub: `Add items to your cart and enter your phone number to check eligibility and claim your exclusive code.`,
              }}
            /> */}
            <Shop selectItem={this.selectItem} />
          </>
        )}
      </Main>
    );
  }
}

export default ProductsConsumer(withRouter(Home));

{
  /* */
}
