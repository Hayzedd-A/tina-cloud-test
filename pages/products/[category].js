import { Component } from "react";
import { withRouter } from "next/router";
import Link from "next/link";

import Main from "../../layouts/Main";
import Header from "../../components/Header";
import { ShopItem } from "../../components/Shop";
import Loader from "../../components/Loader";
import Menu from "../../components/Menu";

import { ProductsConsumer } from "../../providers/ProductsProvider";
import { slugify } from "../../utils/functions";
import { EmptyStore, RightArrow } from "../../public/static/vectors";
import analyticsService from "../../services/analyticsService";

class ProductCategoryPage extends Component {
  selectItem = ({ name, id, toppings }) => {
    analyticsService.trackProductView({ id, name });
    this.props.router.push(
      `/shop?name=${slugify(name)}&id=${id}`,
      undefined,
      { shallow: true },
    );
  };

  render() {
    const { products, isLoadingProducts, router } = this.props;
    const { category: slug } = router.query;

    const category = products
      ? products.find((cat) => slugify(cat.name) === slug)
      : null;

    const toppings = category?.toppings;

    return (
      <Main>
        <div className="shop-container" id="shop-container">
          <Header />

          <div className="promo-marquee">
            <div className="promo-marquee-track">
              <span>
                ✦&nbsp;&nbsp;FREE delivery on orders above
                ₦25,000&nbsp;&nbsp;·&nbsp;&nbsp;If delivery exceeds ₦3,000 you
                only pay the
                difference!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
              <span>
                ✦&nbsp;&nbsp;FREE delivery on orders above
                ₦25,000&nbsp;&nbsp;·&nbsp;&nbsp;If delivery exceeds ₦3,000 you
                only pay the
                difference!&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </span>
            </div>
          </div>

          <div className="container">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "20px 15px 4px",
              }}
            >
              <Link href="/" legacyBehavior>
                <a
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#1B1617",
                    textDecoration: "none",
                    opacity: 0.55,
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      transform: "rotate(180deg)",
                      width: 16,
                    }}
                  >
                    <RightArrow />
                  </span>
                  All products
                </a>
              </Link>
            </div>

            {isLoadingProducts && <Loader />}

            {!isLoadingProducts && !category && (
              <div
                className="cart-empty-state"
                style={{ padding: "70px 30px" }}
              >
                <div className="icon">
                  <EmptyStore />
                </div>
                <div className="message">
                  Category not found.
                  <br />
                  <Link href="/" legacyBehavior>
                    <a style={{ color: "#F2C131", fontWeight: 700 }}>
                      Browse all products
                    </a>
                  </Link>
                </div>
              </div>
            )}

            {!isLoadingProducts && category && (
              <>
                {!!(category.topProducts && category.topProducts.length) && (
                  <div className="shop-section carousel">
                    <div className="section-title favorite">
                      <span className="icon">
                        <img src="/static/images/diamond.png" alt="" />
                      </span>
                      <span className="text">Current Best Sellers</span>
                    </div>
                    <div className="section-items">
                      {category.topProducts.map((item, index) => {
                        const { name, sizes } = item;
                        const activeSizes = Object.keys(sizes).filter(
                          (s) => sizes[s] && sizes[s].length > 0,
                        );
                        const firstSize = activeSizes[0];
                        const { imageUrl, unitPrice } =
                          (firstSize && sizes[firstSize][0]) || {};
                        return (
                          <ShopItem
                            key={`top-${index}`}
                            name={name}
                            image={imageUrl}
                            price={unitPrice}
                            onClick={() =>
                              this.selectItem({ ...item, toppings })
                            }
                          />
                        );
                      })}
                    </div>
                  </div>
                )}

                {!!(category.products && category.products.length) && (
                  <div className="shop-section">
                    <div className="section-title">
                      All {category.name}s
                    </div>
                    <div className="section-items">
                      {category.products.map((item, index) => {
                        const { name, sizes } = item;
                        const activeSizes = Object.keys(sizes).filter(
                          (s) => sizes[s] && sizes[s].length > 0,
                        );
                        const firstSize = activeSizes[0];
                        const { imageUrl, unitPrice } =
                          firstSize && sizes[firstSize]
                            ? sizes[firstSize][0]
                            : {};
                        return (
                          firstSize && (
                            <ShopItem
                              key={`item-${index}`}
                              name={name}
                              image={imageUrl}
                              price={unitPrice}
                              onClick={() =>
                                this.selectItem({ ...item, toppings })
                              }
                            />
                          )
                        );
                      })}
                    </div>
                  </div>
                )}

                {!(
                  category.topProducts?.length || category.products?.length
                ) && (
                  <div
                    className="cart-empty-state"
                    style={{ padding: "70px 30px" }}
                  >
                    <div className="icon">
                      <EmptyStore />
                    </div>
                    <div className="message">
                      No products at the moment.
                      <br /> Please check back later
                    </div>
                  </div>
                )}
              </>
            )}

            <Menu />
          </div>
        </div>
      </Main>
    );
  }
}

export default ProductsConsumer(withRouter(ProductCategoryPage));
