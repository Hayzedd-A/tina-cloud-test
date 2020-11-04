import { Component } from "react";
import { withRouter } from "next/router";
import * as shallowequal from "shallowequal";

import { ShopItem } from "./";
import Header from "../Header";
import Menu from "../Menu";

import { ProductsConsumer } from "../../providers/ProductsProvider";

class SearchResults extends Component {
  constructor(props) {
    super(props);

    const { router } = props;
    const { q } = router.query;

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

    let allProducts = [];
    let allToppings = [];
    let productsResult = [];

    products.forEach(element => {
      allProducts = allProducts.concat(element.products);
      allToppings = allToppings.concat(element.toppings);
    });

    if (q) {
      productsResult = allProducts.filter(({ name }) =>
        name.toLowerCase().includes(q.toLowerCase())
      );
    }

    this.setState({
      allProducts,
      allToppings,
      productsResult
    });
  }

  componentDidMount() {
    this.formatProducts();
  }

  componentDidUpdate(prevProps) {
    const { allProducts } = this.state;
    const { router, products } = this.props;
    const { q } = router.query;

    let productsResult = JSON.parse(JSON.stringify(this.state.productsResult));

    if (!shallowequal(prevProps.router, router) && q) {
      productsResult = allProducts.filter(({ name }) =>
        name.toLowerCase().includes(q.toLowerCase())
      );

      this.setState({
        productsResult
      });
    }

    if (!shallowequal(prevProps.products, products) && products.length) {
      this.formatProducts()
    }
  }

  render() {
    const { productsResult, allToppings } = this.state;

    return (
      <div className="shop-container" id="shop-container">
        <Header />
        <div className="container">
          <div className="shop-section search-section">
            <div className="section-title">
              {productsResult.length} Search Results found
            </div>
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
          </div>
          <Menu />
        </div>
      </div>
    );
  }
}

export default withRouter(ProductsConsumer(SearchResults));
