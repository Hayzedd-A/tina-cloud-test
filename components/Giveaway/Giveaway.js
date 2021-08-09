import { Component } from "react";

import Header from "../Header";
import Menu from "../Menu";
import { withRouter } from "next/router";

import { ProductsConsumer } from "../../providers/ProductsProvider";
import FemaleIcon from "../../public/static/images/FemaleIcon.svg";
import { EmptyStore } from "../../public/static/vectors";

class Giveaway extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    window.addEventListener("scroll", this.setTabBg);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.setTabBg);
  }

  render() {
    const { router } = this.props;

    return (
      <div className="shop-container" id="shop-container">
        <Header />

        <div className="container">
          <div className="cart-empty-state" style={{ padding: "70px 30px" }}>
            <div className="icon giveaway">
              {/* <figure> */}
              <img src="/static/svgs/female.svg" alt="female" />
              {/* </figure> */}
            </div>
            <div className="icon giveaway">
              {/* <figure> */}
              <img src="/static/svgs/offer.svg" alt="female" />
              {/* </figure> */}
            </div>
            <h5 className="message ga">COUPON CODE: SWEET 5</h5>
            <button onClick={() => router.push("/")}>CLAIM MY #500</button>
          </div>

          {/* {allProducts && allProducts[currentTab] && allProducts[currentTab].topProducts && allProducts[currentTab].topProducts.length ||
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
                    All products
                  </div>
                  <div className="section-items">
                    <h2>tttttt</h2>
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
          )} */}
          <Menu />
        </div>
      </div>
    );
  }
}

export default ProductsConsumer(withRouter(Giveaway));
