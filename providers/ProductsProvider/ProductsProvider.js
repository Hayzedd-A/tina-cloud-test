import React, { Component } from "react";

import { getRequest, postRequest, patchRequest } from "../../api";
import { STORE_ID } from "../../constants";
import { getRequestError } from "../../utils/functions";

const ProductsContext = React.createContext();

class ProductsProvider extends Component {
  constructor(props) {
    super(props);

    const { initialProducts, initialCategories } = props;
    this.state = {
      products: initialProducts || [],
      productCategories: initialCategories || [],
      isLoadingProducts: !initialProducts,
      isLoadingProductCategories: !initialCategories,
    };
  }

  getProducts = async () => {
    this.setState({
      isLoadingProducts: true,
    });

    try {
      const res = await getRequest({
        url: `/customer-requests/stores/${STORE_ID}/products`,
      });
      this.setState({
        products: res.data.data,
        isLoadingProducts: false,
      });
      const allowedCategories = ["Valentine Gift Boxes"];
      const allowed = res.data.data.filter((item) =>
        allowedCategories.includes(item.name),
      );
      localStorage.setItem("gourmet-14-allowed", JSON.stringify(allowed));
    } catch (error) {
      const message = getRequestError(error);
      console.log(error, message);

      this.setState({
        isLoadingProducts: false,
      });
    }
  };

  getProductCagetegories = async () => {
    this.setState({
      isLoadingProductCategories: true,
    });

    try {
      const res = await getRequest({
        url: `/customer-requests/stores/${STORE_ID}/product-categories`,
      });

      this.setState({
        productCategories: res.data.data,
        isLoadingProductCategories: false,
      });
    } catch (error) {
      const message = getRequestError(error);
      console.log(error, message);

      this.setState({
        isLoadingProductCategories: false,
      });
    }
  };

  componentDidMount() {
    this.getProductCagetegories();
    this.getProducts();
  }

  render() {
    return (
      <ProductsContext.Provider
        value={{
          ...this.state,
          getProductCagetegories: this.getProductCagetegories,
          getProducts: this.getProducts,
        }}
      >
        {this.props.children}
      </ProductsContext.Provider>
    );
  }
}

const ProductsConsumer = (Component) => {
  return class Consumer extends React.Component {
    static getInitialProps(ctx) {
      return Component.getInitialProps ? Component.getInitialProps(ctx) : {};
    }

    render() {
      return (
        <ProductsContext.Consumer>
          {(data) => <Component {...this.props} {...data} />}
        </ProductsContext.Consumer>
      );
    }
  };
};

export default ProductsProvider;
export { ProductsConsumer };
