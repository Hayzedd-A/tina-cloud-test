import React, { Component } from "react";

import { getRequest, postRequest, patchRequest } from "../../api";
import { STORE_ID } from "../../constants";
import { getRequestError } from "../../utils/functions";

const OrdersContext = React.createContext();

class LoyaltyPointsProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loyaltyPoints: [],
      isLoadingLoyaltyPoints: true,
    };
  }

  getLoyaltyPoints = async () => {
    this.setState({
      isLoadingLoyaltyPoints: true
    });

    try {
      const res = await getRequest({
        url: `/customer-requests/stores/${STORE_ID}/loyalty-points-history`,
        token: true
      })

      this.setState({
        loyaltyPoints: res.data,
        isLoadingLoyaltyPoints: false
      })
    } catch (error) {
      const message = getRequestError(error);
      console.log(error, message);

      this.setState({
        isLoadingLoyaltyPoints: false
      })
    }
  };

  componentDidMount() {
    this.getLoyaltyPoints();
  }

  render() {
    return (
      <OrdersContext.Provider
        value={{
          ...this.state,
          getLoyaltyPoints: this.getLoyaltyPoints,
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

export default LoyaltyPointsProvider;
export { OrdersConsumer };
