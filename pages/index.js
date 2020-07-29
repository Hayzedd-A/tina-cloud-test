import { Component } from "react";
import classNames from "classnames";

import Shop, { ShopItemDetails } from "../components/Shop";

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
      <div className="app">
        <div className="swipe-container">
          <div className={classNames("swiper", { showDetails })}>
            <Shop selectItem={this.selectItem} />
            <ShopItemDetails goBack={this.goBack} selectedItem={selectedItem} />
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
