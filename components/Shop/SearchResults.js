import { Component } from "react";
import { withRouter } from "next/router";
import * as shallowequal from "shallowequal";

import { ShopItem } from "./";
import Header from "../Header";
import Menu from "../Menu";

import { ProductsConsumer } from "../../providers/ProductsProvider";
import { EmptySearch } from "../../public/static/vectors";

class SearchResults extends Component {
  constructor(props) {
    super(props);

    const { router } = props;
    const { q } = router.query;

    console.log("here", props.products);

    this.state = {
      q,
      allProducts: [],
      allToppings: [],
      productsResult: []
    };
  }

  formatProducts = () => {
    const { products, router } = this.props;
    const { q } = router.query;

    let allProducts = JSON.parse(JSON.stringify(this.state.allProducts));
    let allToppings = JSON.parse(JSON.stringify(this.state.allToppings));
    let productsResult = [];

    for (let i = 0; i < products.length; i++) {
      const element = products[i];
      
      allProducts = allProducts.concat(element.products);
      allToppings = allToppings.concat(element.toppings);
    }

    if (q) {
      productsResult = JSON.parse(
        JSON.stringify(allProducts)
      ).filter(({ name }) => name.toLowerCase().includes(q.toLowerCase()));
    }

    this.setState({
      allProducts,
      allToppings,
      productsResult
    });
  };

  componentDidMount() {
    this.formatProducts();
  }

  componentDidUpdate(prevProps) {
    const { allProducts } = this.state;
    const { router, products } = this.props;
    const { q } = router.query;

    let productsResult = JSON.parse(JSON.stringify(this.state.productsResult));

    if (!shallowequal(prevProps.router, router) && q) {
      productsResult = JSON.parse(
        JSON.stringify(allProducts)
      ).filter(({ name }) => name.toLowerCase().includes(q.toLowerCase()));

      this.setState({
        productsResult
      });
    }

    if (!shallowequal(prevProps.products, products) && products.length) {
      this.formatProducts();
    }
  }

  render() {
    const { productsResult, allToppings } = this.state;
    const { isLoadingProducts, selectItem, products } = this.props;

    return (
      <div className="shop-container" id="shop-container">
        <Header />
        <div className="container">
          {!isLoadingProducts && (
            <div className="shop-section search-section">
              <div className="section-title">
                {productsResult.length} Search Results found
              </div>
              {productsResult.length ? (
                <div className="section-items">
                  {productsResult.map((item, index) => {
                    const { name, sizes } = item;
                    const firstSize = Object.keys(sizes)[0];
                    const { imageUrl, unitPrice } = sizes[firstSize][0];

                    return (
                      <ShopItem
                        key={`item-${index}`}
                        name={name}
                        image={imageUrl}
                        price={unitPrice}
                        onClick={() =>
                          selectItem({ ...item, toppings: allToppings })
                        }
                      />
                    );
                  })}
                </div>
              ) : (
                <>
                  <div className="empty-search-state">
                    <div className="image">
                      <EmptySearch />
                    </div>
                  </div>

                  <div className="section-title favorite">
                    <span className="icon">
                      <img src="/static/images/diamond.png" alt="" />
                    </span>
                    <span className="text">Checkout our best stuff</span>
                  </div>
                  <div className="section-items">
                    {products[0].products.slice(0, 4).map((item, index) => {
                      const { name, sizes } = item;
                      const firstSize = Object.keys(sizes)[0];
                      const { imageUrl, unitPrice } = sizes[firstSize][0];

                      return (
                        <ShopItem
                          key={`item-${index}`}
                          name={name}
                          image={imageUrl}
                          price={unitPrice}
                          onClick={() =>
                            selectItem({ ...item, toppings: allToppings })
                          }
                        />
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          )}
          <Menu />
        </div>
      </div>
    );
  }
}

export default withRouter(ProductsConsumer(SearchResults));
