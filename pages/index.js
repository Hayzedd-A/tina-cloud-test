import { Component } from "react";
import { withRouter } from "next/router";

import Main from "../layouts/Main";
import Shop from "../components/Shop";
import SplashScreen from "../components/SplashScreen";

import { slugify } from "../utils/functions";
import { STORE_ID, API_BASE_URL } from "../constants";

class Home extends Component {
  state = {
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
    this.props.router.push(`/shop/${slugify(name)}`);
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
    const { showSplash } = this.state;

    return (
      <Main>
        {showSplash ? (
          <SplashScreen />
        ) : (
          <Shop selectItem={this.selectItem} />
        )}
      </Main>
    );
  }
}

export async function getStaticProps() {
  try {
    const [productsRes, categoriesRes] = await Promise.all([
      fetch(`${API_BASE_URL}customer-requests/stores/${STORE_ID}/products`),
      fetch(
        `${API_BASE_URL}customer-requests/stores/${STORE_ID}/product-categories`
      ),
    ]);

    const productsJson = await productsRes.json();
    const categoriesJson = await categoriesRes.json();

    return {
      props: {
        initialProducts: productsJson.data || [],
        initialCategories: categoriesJson.data || [],
      },
      revalidate: 300,
    };
  } catch {
    return {
      props: { initialProducts: [], initialCategories: [] },
      revalidate: 60,
    };
  }
}

export default withRouter(Home);
