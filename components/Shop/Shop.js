import { Component } from "react";

import { ShopItem } from "./";
import Header from "../Header";
import Tabs from "../Tabs";
import Menu from "../Menu";

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
    const { selectItem } = this.props;

    const tabs = ["Breads", "Zobo", "Peanut Burger", "Cakes", "Soups"];
    const items = [
      {
        id: 1,
        name: "Double Chocolate Banana Bread",
        image: "/static/images/banana-bread.jpg",
        description:
          "Nunc id arcu sem. Proin augue massa, pretium sit amet elementum vitae, elementum a ligula. ",
        price: 4900
      },
      {
        id: 2,
        name: "Basic Banana Bread",
        image: "/static/images/banana-bread2.jpg",
        description:
          "Nunc id arcu sem. Proin augue massa, pretium sit amet elementum vitae, elementum a ligula. ",
        price: 3000
      },
      {
        id: 3,
        name: "Chocochip Banana Bread",
        image: "/static/images/banana-bread3.jpg",
        description:
          "Nunc id arcu sem. Proin augue massa, pretium sit amet elementum vitae, elementum a ligula. ",
        price: 4000
      }
    ];

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
          <div className="shop-section">
            <div className="section-title favorite">
              <span className="icon">
                <img src="/static/images/diamond.png" alt="" />
              </span>
              <span className="text">Most Recommended</span>
            </div>
            <div className="section-items">
              {items.map((item, index) => {
                const { name, image, price } = item;

                return (
                  <ShopItem
                    key={`item-${index}`}
                    name={name}
                    image={image}
                    price={price}
                    onClick={() => selectItem(item)}
                  />
                );
              })}
            </div>
          </div>
          <div className="shop-section">
            <div className="section-title">All Breads</div>
            <div className="section-items">
              {items.map((item, index) => {
                const { name, image, price } = item;

                return (
                  <ShopItem
                    key={`item-${index}`}
                    name={name}
                    image={image}
                    price={price}
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

export default Shop;
