import { Component } from "react";
import classNames from "classnames";

import Shop, { ShopItemDetails } from "../components/Shop";
import Main from "../layouts/Main";
import SplashScreen from "../components/SplashScreen";

class Home extends Component {
  state = {
    selectedItem: {},
    showDetails: false,
    showSplash: true
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

  componentDidMount() {
    this.splashtimeout = setTimeout(() => {
      this.setState({
        showSplash: false
      });
    }, 4000);
  }

  componentWillUnmount() {
    clearTimeout(this.splashtimeout);
  }

  render() {
    const { selectedItem, showDetails, showSplash } = this.state;

    return (
      <Main>
        {showSplash ? (
          <SplashScreen />
        ) : (
          <div className="swipe-container">
            <div className={classNames("swiper", { showDetails })}>
              <Shop selectItem={this.selectItem} />
              <ShopItemDetails
                goBack={this.goBack}
                selectedItem={selectedItem}
              />
            </div>
          </div>
        )}
      </Main>
    );
  }
}

export default Home;
