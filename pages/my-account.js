import { Component } from "react";

import { withRouter } from "next/router";

import Main from "../layouts/Main";

import Menu from "../components/Menu";
import { MyInfo } from "../components/MyAccount";
import Loader from "../components/Loader";

import OrdersProvider from "../providers/OrdersProvider";

import { RightArrow } from "../public/static/vectors";

class MyAccount extends Component {
  state = {
    isMounted: false
  };

  switchTab = currentTab => {
    this.setState({
      currentTab
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
    const { isMounted } = this.state;
    const { router } = this.props;

    return (
      <Main>
        {!isMounted && <Loader />}
        <OrdersProvider>
          <div className="my-account">
            <div className="my-account-header">
              <div className="container" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                <div className="back" onClick={() => router.push("/")}>
                  <RightArrow />
                </div>
                    My Info
                  </div>
            </div>
            <div className="my-account-content">{<MyInfo />}</div>
            <Menu />
          </div>
        </OrdersProvider>
      </Main>
    );
  }
}

export default withRouter(MyAccount);
