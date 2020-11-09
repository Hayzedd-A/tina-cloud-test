import { Component } from "react";

import { withRouter } from "next/router";

import Main from "../layouts/Main";

import Tabs from "../components/Tabs";
import Menu from "../components/Menu";
import { MyInfo, MyOrders } from "../components/MyAccount";

import OrdersProvider from "../providers/OrdersProvider";

class MyAccount extends Component {
  state = {
    currentTab: 0
  };

  switchTab = currentTab => {
    this.setState({
      currentTab
    });
  };

  componentDidMount() {
    const currentUser = localStorage.getItem("gourmet-twist-user");

    !currentUser && this.props.router.push("/login");
  }

  render() {
    const { currentTab } = this.state;

    const tabs = ["My Info", "My Orders"];
    const tabContent = [<MyInfo />, <MyOrders />];

    return (
      <Main>
        <OrdersProvider>
          <div className="my-account">
            <div className="my-account-header">My Account</div>
            <Tabs
              tabs={tabs}
              currentTab={currentTab}
              switchTab={this.switchTab}
            />
            <div className="my-account-content">{tabContent[currentTab]}</div>
            <Menu />
          </div>
        </OrdersProvider>
      </Main>
    );
  }
}

export default withRouter(MyAccount);
