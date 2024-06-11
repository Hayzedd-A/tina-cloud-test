import { Component } from "react";

import { withRouter } from "next/router";

import Main from "../layouts/Main";

import Menu from "../components/Menu";
import { LoyaltyPoints, OrderDetails } from "../components/MyAccount";
import Loader from "../components/Loader";

import LoyaltyPointsProvider from "../providers/LoyaltyPointsProvider";

import { RightArrow } from "../public/static/vectors";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import { HeaderMenu } from "./../components/Header";

class MyAccount extends Component {
    state = {
        isMounted: false,
        isMenuActive: false,
        orderDetails: null,
        allProducts: [],
        loyaltyPoints: []
    };

    showOrderDetails = (orderDetails) => {
        this.setState({
            orderDetails,
        });
    };

    showMenu = (isMenuActive) => {
        this.setState({ isMenuActive });
    };

    componentDidMount() {
        const currentUser = localStorage.getItem("gourmet-twist-user");

        !currentUser && this.props.router.push("/login");

        this.setState({
            isMounted: true,
        });
    }

    render() {
        const { isMounted, orderDetails, isMenuActive } = this.state;
        const { router } = this.props;

        return (
            <Main>
                {!isMounted && <Loader />}
                <LoyaltyPointsProvider>
                    {orderDetails ? (
                        <OrderDetails
                            orderDetails={orderDetails}
                            goBack={() => this.showOrderDetails()}
                        />
                    ) : (
                        <div className="my-account">
                            <div className="my-account-header">
                                <div
                                    className="container"
                                    style={{
                                        position: "relative",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        width: "100%",
                                        height: "100%",
                                    }}
                                >
                                    <div className="back" onClick={() => router.push("/")}>
                                        <RightArrow />
                                    </div>
                                    Loyalty Points History
                                    <div
                                        className="header-icon-container hamburger-menu right-menu"
                                        style={{ top: "30px" }}
                                        onClick={() => this.showMenu(true)}
                                    >
                                        <span></span>
                                    </div>
                                    <CSSTransitionGroup
                                        transitionName="header-menu-animation"
                                        transitionEnterTimeout={500}
                                        transitionLeaveTimeout={300}
                                    >
                                        {isMenuActive && <HeaderMenu showMenu={this.showMenu} />}
                                    </CSSTransitionGroup>
                                </div>
                            </div>
                            <div className="my-account-content">
                                {<LoyaltyPoints showOrderDetails={this.showOrderDetails} />}
                            </div>
                            <Menu />
                        </div>
                    )}
                </LoyaltyPointsProvider>
            </Main>
        );
    }
}

export default withRouter(MyAccount);
