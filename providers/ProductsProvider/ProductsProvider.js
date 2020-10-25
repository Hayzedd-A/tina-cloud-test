import React, { Component } from "react";

import { getRequest, postRequest, patchRequest } from "../../api";
import { getRequestError } from "../../utils/functions";

const ProductsContext = React.createContext();

class ProductsProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      isLoadingProducts: true,
    };
  }

  getProducts = async () => {
    this.setState({
      isLoadingProducts: true
    });

    try {
      const res = await getRequest({
        url: "products-listing?storeId=ba629b0f-9749-4097-bfc7-825fdcfe6811"
      })

      this.setState({
        products: res.data.data,
        isLoadingProducts: false
      })
    } catch (error) {
      const message = getRequestError(error);
      console.log(error, message);

      this.setState({
        isLoadingProducts: false
      })
    }
  };

  componentDidMount() {
    this.getProducts();
  }

  render() {
    return (
      <ProductsContext.Provider
        value={{
          ...this.state,
          getProducts: this.getProducts,
        }}
      >
        {this.props.children}
      </ProductsContext.Provider>
    );
  }
}

const ProductsConsumer = Component => {
  return class Consumer extends React.Component {
    static getInitialProps(ctx) {
      return Component.getInitialProps ? Component.getInitialProps(ctx) : {};
    }

    render() {
      return (
        <ProductsContext.Consumer>
          {data => <Component {...this.props} {...data} />}
        </ProductsContext.Consumer>
      );
    }
  };
};

export default ProductsProvider;
export { ProductsConsumer };
