import { Component } from "react";
import { withRouter } from "next/router";
import { ElfsightWidget } from "react-elfsight-widget";
import Main from "../layouts/Main";
import classNames from "classnames";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import { RightArrow } from "../public/static/vectors";
import { HeaderMenu } from "./../components/Header";
import { AuthenticationConsumer } from "../providers/AuthenticationProvider";

class Testimonies extends Component {
  constructor(props) {
    super(props);

    const { router } = props;

    this.state = {
      isMenuActive: false,
    };
  }

  showMenu = (isMenuActive) => {
    this.setState({ isMenuActive });
  };

  render() {
    const { router } = this.props;
    const { isMenuActive } = this.state;

    return (
      <Main>
        <div
          className="cart-container login-container"
          style={{ overflow: "visible" }}
        >
          <div className="cart-header login-header">
            <div
              className="container login-header-inner"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                className="back"
                onClick={() =>
                  router.push(`/`, undefined, {
                    shallow: true,
                  })
                }
              >
                <RightArrow />
              </div>
              <div className="title">Testimonies</div>
              <div
                className="header-icon-container hamburger-menu right-menu"
                style={{ top: "-5px" }}
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

          <div className="menu-item" style={{ marginTop: 20 }}>
            <ElfsightWidget widgetID="1e0005eb-b781-49c1-83f6-21812169519f" />
          </div>
        </div>
      </Main>
    );
  }
}

export default AuthenticationConsumer(withRouter(Testimonies));
