import { Component } from "react";

import { withRouter } from "next/router";

import Main from "../layouts/Main";

import Menu from "../components/Menu";
import { MyOrders, OrderDetails } from "../components/MyAccount";

import OrdersProvider from "../providers/OrdersProvider";
import { RightArrow } from "../public/static/vectors";

class MyAccount extends Component {
  state = {
    isMounted: false,
    orderDetails: null,
    allProducts: []
  };

  showOrderDetails = orderDetails => {
    this.setState({
      orderDetails
    });
  };

  formatProducts = () => {
    const { orderDetails } = this.state;
    const { products } = this.props;

    let allProducts = [];

    for (let i = 0; i < products.length; i++) {
      const element = JSON.parse(JSON.stringify(products[i]));

      element.products = element.products.map(product => ({
        ...product,
        toppings: element.toppings
      }));

      allProducts = allProducts.concat(element.products);
    }

    this.setState({
      allProducts
    });
  };

  componentDidMount() {
    const currentUser = localStorage.getItem("gourmet-twist-user");

    !currentUser && this.props.router.push("/login");

    this.setState({
      isMounted: true
    });
  }

  render() {
    const { isMounted, orderDetails } = this.state;
    const { router } = this.props;

    return (
      <Main>
        {isMounted && (
          <OrdersProvider>
            {orderDetails ? (
              <OrderDetails
                orderDetails={orderDetails}
                goBack={() => this.showOrderDetails()}
              />
            ) : (
              <div className="my-account">
                <div className="my-account-header">
                  <div className="back" onClick={() => router.push("/")}>
                    <RightArrow />
                  </div>
                  My Orders
                </div>
                <div className="my-account-content">
                  {<MyOrders showOrderDetails={this.showOrderDetails} />}
                </div>
                <Menu />
              </div>
            )}
          </OrdersProvider>
        )}
      </Main>
    );
  }
}

export default withRouter(MyAccount);
