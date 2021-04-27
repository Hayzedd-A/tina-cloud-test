import { Component } from "react";

import { ShopItem } from "./";
import Header from "../Header";
import Tabs from "../Tabs";
import Menu from "../Menu";

import { ProductsConsumer } from "../../providers/ProductsProvider";
import { EmptyStore } from "../../public/static/vectors";
import { slugify } from "../../utils/functions";

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
    window.addEventListener("scroll", this.setTabBg);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.setTabBg);
  }

  render() {
    const { currentTab, isTabActive } = this.state;
    const { selectItem, products, productCategories } = this.props;

    const activeCategories = productCategories ? productCategories.filter((item) => item.active).map((item) => item.name) : [];
    const allProducts = products ? products
      .filter((item) => {
        return activeCategories.includes(item.name);
      })
      .sort((a, b) => {
        console.log(a, b);
        return (a.position && b.position) 
          ? (parseInt(a.position) > parseInt(b.position)) 
            ? 1 : -1
          : (a.name > b.name) 
            ? 1 : -1
      }
        )
      : [];

    const tabs = allProducts.map(({ name }) => name);
    const toppings = products && products[currentTab] && products[currentTab].toppings;

    return (
      <div className="shop-container" id="shop-container">
        <Header />
        <Tabs
          active={isTabActive}
          tabs={activeCategories}
          forCategories={true}
          currentTab={currentTab}
          switchTab={this.switchTab}
        />
        <div className="container">
          {allProducts && allProducts[currentTab] && allProducts[currentTab].topProducts && allProducts[currentTab].topProducts.length ||
          allProducts && allProducts[currentTab] && allProducts[currentTab].products && allProducts[currentTab].products.length ? (
            <>
              {!!(allProducts && allProducts[currentTab].topProducts.length) && (
                <div className="shop-section carousel">
                  <div className="section-title favorite">
                    <span className="icon">
                      <img src="/static/images/diamond.png" alt="" />
                    </span>
                    <span className="text">Current Best Sellers</span>
                  </div>
                  <div className="section-items">
                    {allProducts && allProducts[currentTab].topProducts.map((item, index) => {
                      const { name, sizes } = item;
                      const activeSizes = Object.keys(sizes).filter((item) => sizes[item] && sizes[item].length > 0);
                      const firstSize = activeSizes && activeSizes[0];
                      const { imageUrl, unitPrice } = sizes[firstSize][0] || {};

                      return (
                        <ShopItem
                          key={`${slugify(products[currentTab].name)}-${index}`}
                          name={name}
                          image={imageUrl}
                          price={unitPrice}
                          onClick={() => selectItem({ ...item, toppings })}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
              {!!( allProducts && allProducts[currentTab].products.length) && (
                <div className="shop-section">
                  <div className="section-title">
                    All {allProducts[currentTab].name}s
                  </div>
                  <div className="section-items">
                    {allProducts[currentTab].products.map((item, index) => {
                      const { name, sizes } = item;
                      const activeSizes = Object.keys(sizes).filter((item) => sizes[item] && sizes[item].length > 0);
                      const firstSize = activeSizes && activeSizes[0];
                      const { imageUrl, unitPrice } = sizes[firstSize] ? sizes[firstSize][0] : {};

                      console.log(name, activeSizes[0]);

                      return firstSize && (
                        <ShopItem
                          key={`${slugify(
                            products[currentTab].name
                          )}-${index}-2`}
                          name={name}
                          image={imageUrl}
                          price={unitPrice}
                          onClick={() => selectItem({ ...item, toppings })}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="cart-empty-state" style={{ padding: "70px 30px" }}>
              <div className="icon">
                <EmptyStore />
              </div>
              <div className="message">
                No products at the moment.
                <br /> Please check back later
              </div>
            </div>
          )}
          <Menu />
        </div>
      </div>
    );
  }
}

export default ProductsConsumer(Shop);
