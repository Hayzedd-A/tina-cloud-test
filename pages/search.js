import { Component } from "react";
import classNames from "classnames";

import Main from "../layouts/Main";
import { ShopItemDetails, SearchResults } from "../components/Shop";

import { ProductsConsumer } from "../providers/ProductsProvider";

class Home extends Component {
  state = {
    selectedItem: {},
    showDetails: false
  };

  selectItem = selectedItem => {
    this.setState({
      selectedItem,
      showDetails: true
    });
  };

  goBack = () => {
    this.setState(
      {
        showDetails: false
      },
      () =>
        setTimeout(() => {
          this.setState({ selectedItem: {} });
        }, 300)
    );
  };

  render() {
    const { selectedItem, showDetails } = this.state;

    return (
      <Main>
        <div className="swipe-container">
          <div className={classNames("swiper", { showDetails })}>
            <SearchResults selectItem={this.selectItem} />
            <ShopItemDetails goBack={this.goBack} selectedItem={selectedItem} />
          </div>
        </div>
      </Main>
    );
  }
}

export default ProductsConsumer(Home);
