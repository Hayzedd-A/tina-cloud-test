import React, { Component } from "react";

import { getRequest, postRequest, patchRequest } from "../../api";
import { getRequestError } from "../../utils/functions";

const OrdersContext = React.createContext();

class OrdersProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      isLoadingOrders: true,
    };
  }

  getOrders = async () => {
    this.setState({
      isLoadingOrders: true
    });

    try {
      const res = await getRequest({
        url: "/customer-requests/stores/8a7a28dc-b54d-4841-b949-efe60dbae709/orders",
        token: true
      })

      this.setState({
        orders: res.data.data,
        isLoadingOrders: false
      })
    } catch (error) {
      const message = getRequestError(error);
      console.log(error, message);

      this.setState({
        isLoadingOrders: false
      })
    }
  };

  componentDidMount() {
    this.getOrders();
  }

  render() {
    return (
      <OrdersContext.Provider
        value={{
          ...this.state,
          getOrders: this.getOrders,
        }}
      >
        {this.props.children}
      </OrdersContext.Provider>
    );
  }
}

const OrdersConsumer = Component => {
  return class Consumer extends React.Component {
    static getInitialProps(ctx) {
      return Component.getInitialProps ? Component.getInitialProps(ctx) : {};
    }

    render() {
      return (
        <OrdersContext.Consumer>
          {data => <Component {...this.props} {...data} />}
        </OrdersContext.Consumer>
      );
    }
  };
};

export default OrdersProvider;
export { OrdersConsumer };
