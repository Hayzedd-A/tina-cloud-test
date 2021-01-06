import { Component } from "react";
import classNames from "classnames";
import { withRouter } from "next/router";
import shallowequal from "shallowequal";

import Main from "../layouts/Main";

import { TextField, Pin } from "../components/FormElements";
import Toaster from "../components/Toaster";
import Tabs from "../components/Tabs";

import { AuthenticationConsumer } from "../providers/AuthenticationProvider";

import { RightArrow } from "../public/static/vectors";
import { getFormValues } from "../utils/functions";

class FAQ extends Component {
  constructor(props) {
    super(props);

    const { router } = props;
    const { newUser } = router.query;

    this.state = {
      faq: [
        { 
          Q: "What is this platform about?",
          A: "This is a store front for Zupa App his is a store front for Zupa App his is a store front for Zupa App his is a store front for Zupa App"
        },
        { 
          Q: "What is this platform about?",
          A: "This is a store front for Zupa App his is a store front for Zupa App his is a store front for Zupa App his is a store front for Zupa App"
        },
        { 
          Q: "What is this platform about?",
          A: "This is a store front for Zupa App his is a store front for Zupa App his is a store front for Zupa App his is a store front for Zupa App"
        }
      ],
      currentTab: newUser ? 1 : 0,
      isTabActive: false,
      isSignUp: !!newUser
    };
  }

  render() {
    const { router } = this.props;
    const { faq } = this.state;

    return (
      <Main>
        <div className="cart-container login-container">
          <div className="cart-header login-header">
            <div
              className="back"
              onClick={() =>
                router.push(`/`, undefined, {
                  shallow: true
                })
              }
            >
              <RightArrow />
            </div>
            <div className="title">FAQ</div>
          </div>
          <div className="checkout-form login-form">
            <div className="container">
              <div className="faq-content">
                {
                  faq.map(({ Q, A }) => {
                    return (
                      <>
                        <h3>- {Q}</h3>
                        <p>{A}</p>
                      </>
                    )
                  })
                }
              </div>
            </div>
          </div>
        </div>
      </Main>
    );
  }
}

export default AuthenticationConsumer(withRouter(FAQ));
