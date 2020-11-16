import { Component } from "react";

import { withRouter } from "next/router";

import Main from "../layouts/Main";

import Menu from "../components/Menu";
import { MyOrders } from "../components/MyAccount";

import OrdersProvider from "../providers/OrdersProvider";

class MyAccount extends Component {
  state = {
    isMounted: false
  };

  componentDidMount() {
    const currentUser = localStorage.getItem("gourmet-twist-user");

    !currentUser && this.props.router.push("/login");

    this.setState({
      isMounted: true
    });
  }

  render() {
    const { isMounted } = this.state;

    return (
      <Main>
        {isMounted && (
          <OrdersProvider>
            <div className="my-account">
              <div className="my-account-header">My Orders</div>
              <div className="my-account-content">{<MyOrders />}</div>
              <Menu />
            </div>
          </OrdersProvider>
        )}
      </Main>
    );
  }
}

export default withRouter(MyAccount);
