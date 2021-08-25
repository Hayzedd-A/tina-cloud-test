import { Component } from "react";
import { withRouter } from "next/router";

import Main from "../layouts/Main";
import Giveaway from "../components/Giveaway";
import SplashScreen from "../components/SplashScreen";

import { ProductsConsumer } from "../providers/ProductsProvider";

class GiveawayPage extends Component {
  state = {
    selectedItem: {},
    showDetails: false,
    showSplash: true,
  };

  componentDidMount() {
    this.splashtimeout = setTimeout(() => {
      this.setState({
        showSplash: false,
      });
    }, 4000);
  }

  componentWillUnmount() {
    clearTimeout(this.splashtimeout);
  }

  render() {
    const { isLoadingProducts } = this.props;

    return <Main>{isLoadingProducts ? <SplashScreen /> : <Giveaway />}</Main>;
  }
}

export default ProductsConsumer(withRouter(GiveawayPage));
