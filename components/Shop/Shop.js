import { Component } from "react";

import { ShopItem } from "./";
import Header from "../Header";
import Tabs from "../Tabs";
import Menu from "../Menu";

import { ProductsConsumer } from "../../providers/ProductsProvider";

class Shop extends Component {
  state = {
    currentTab: 0,
    isTabActive: false
  };

  switchTab = currentTab => {
    this.setState({
      currentTab
    });
  };

  setTabBg = () => {
    const tab = document
      .getElementById("tab-container-ref")
      .getBoundingClientRect();

    this.setState({
      isTabActive: tab && tab.top <= 0
    });
  };

  componentDidMount() {
    document
      .getElementById("shop-container")
      .addEventListener("scroll", this.setTabBg);
  }

  componentWillUnmount() {
    document
      .getElementById("shop-container")
      .removeEventListener("scroll", this.setTabBg);
  }

  render() {
    const { currentTab, isTabActive } = this.state;
    const { selectItem, products } = this.props;

    const tabs = products.map(({ name }) => name);
    const recommendedProducts = JSON.parse(JSON.stringify(products));

    return (
      <div className="shop-container" id="shop-container">
        <Header />
        <Tabs
          active={isTabActive}
          tabs={tabs}
          currentTab={currentTab}
          switchTab={this.switchTab}
        />
        <div className="container">
          <div className="shop-section carousel">
            <div className="section-title favorite">
              <span className="icon">
                <img src="/static/images/diamond.png" alt="" />
              </span>
              <span className="text">Most Recommended</span>
            </div>
            <div className="section-items">
              {recommendedProducts[currentTab].products.slice(0, 5).map((item, index) => {
                const { name, image, unitPrice } = item;

                return (
                  <ShopItem
                    key={`item-${index}`}
                    name={name}
                    image="/static/images/banana-bread.jpg"
                    price={unitPrice}
                    onClick={() => selectItem(item)}
                  />
                );
              })}
            </div>
          </div>
          <div className="shop-section">
            <div className="section-title">All Breads</div>
            <div className="section-items">
              {products[currentTab].products.map((item, index) => {
                const { name, image, unitPrice } = item;

                return (
                  <ShopItem
                    key={`item-${index}`}
                    name={name}
                    image="/static/images/banana-bread.jpg"
                    price={unitPrice}
                    onClick={() => selectItem(item)}
                  />
                );
              })}
            </div>
          </div>
          <Menu />
        </div>
      </div>
    );
  }
}

export default ProductsConsumer(Shop);
