import { Component } from "react";
import classNames from "classnames";
import { withRouter } from "next/router";
import shallowequal from "shallowequal";

import Main from "../layouts/Main";

import { TextField, Pin } from "../components/FormElements";
import Toaster from "../components/Toaster";
import Tabs from "../components/Tabs";

import { AuthenticationConsumer } from "../providers/AuthenticationProvider";
import { Logo } from "../public/static/vectors";

import { RightArrow } from "../public/static/vectors";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import { HeaderMenu } from "./../components/Header";
import { getFormValues } from "../utils/functions";

class FAQ extends Component {
  constructor(props) {
    super(props);

    const { router } = props;
    const { newUser } = router.query;

    this.state = {
      selectedFAQ: 0,
      isMenuActive: false,
      faq: [
        {
          Q: "Can I pick up my order?",
          A: "Pick-ups are available for pre-paid orders. Our pick-up location is 14B Africa Lane, Off Admiralty Road, Lekki Phase 1, Lagos.",
        },
        {
          Q: "Can I cancel my order after placing it?",
          A: "As our breads are baked to order, cancelations are not possible once an order is placed. ",
        },
        {
          Q: "Do you offer refunds?",
          A: "Refunds will be made on a case-by-case basis. There are no refunds for breads that have been baked.",
        },
        {
          Q: "When will I get my order?",
          A: `This depends on where you are located and when the order was placed. In general, Mainland orders placed in the morning or the day before are delivered between 12 noon and 6.30 pm depending on your location. Mainland orders placed after noon are not guaranteed for same day delivery but the next business day.\n\nIsland orders are generally delivered between 9.30 am and 6.00 pm same day if placed before 3.00 pm. Island orders placed after 3.00 pm will be fulfilled the next business day.\n\nNote: We do not guarantee precise delivery times as the orders are batched and delivery times vary depending on the traffic conditions and your order’s position in the delivery batch. For an expedited delivery, please contact us for an estimate.\n\nOrders from the following locations are generally fulfilled the next day unless otherwise communicated: Iyana Ipaja, Ikorodu, Satellite town, Egbeda, Festac, Agege, Ojo, Apapa.\n\nAll orders are baked fresh on the day of delivery.`,
        },
        {
          Q: "How long will my bread last?",
          A: "Although the breads can last days unrefrigerated, we strongly advise that breads are refrigerated immediately and at all times if not consumed on the same day of delivery. Depending on the flavor, our breads can last 1-2 weeks if refrigerated.",
        },
        {
          Q: "I missed my delivery can you bake a fresh batch and redeliver for free?",
          A: "As the breads are baked fresh and to order, once a delivery is missed, we can re-deliver for the original delivery fee paid. Same day re-deliveries are NOT guaranteed. Breads scheduled to be delivered the next day will be refrigerated at our office.",
        },
        {
          Q: "How long can your delivery person wait before leaving my location?",
          A: "As the items in question are edibles, we are only able to wait a maximum of 5 minutes at a location before leaving to serve other customers.",
        },
        {
          Q: "I live in an estate and bikes are not allowed; can the dispatch rider walk to deliver my order to my door?",
          A: "The extent of the delivery is limited to where bikes are allowed. Dispatch riders are unable to walk to deliver.",
        },
        {
          Q: "I live in a high rise; can the dispatch rider bring my order up to my room?",
          A: "We can only deliver to the ground floor where the dispatch rider has a clear view of their bike.",
        },
      ],
      currentTab: newUser ? 1 : 0,
      isTabActive: false,
      isSignUp: !!newUser,
    };
  }

  showMenu = (isMenuActive) => {
    this.setState({ isMenuActive });
  };

  render() {
    const { router } = this.props;
    const { faq, selectedFAQ, isMenuActive } = this.state;

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
              <div className="title">FAQs</div>
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

          <div className="checkout-form login-form">
            <div className="container">
              <div className="faq-content">
                <div className="logo">
                  <Logo />
                </div>
                <p className="about-faq">
                  Gourmet Twist is an online bakery/food store that is
                  redefining your favorite foods with an epicurean twist. Our
                  breads are baked fresh and meals served hot every day.
                </p>
                {faq.map(({ Q, A }, index) => {
                  return (
                    <>
                      <div
                        className={`question ${
                          selectedFAQ === index ? "active" : ""
                        }`}
                        onClick={() => this.setState({ selectedFAQ: index })}
                      >
                        <h3>
                          {index + 1}. {Q}
                        </h3>
                      </div>
                      <div
                        className={`answer ${
                          selectedFAQ === index ? "active" : ""
                        }`}
                      >
                        <p>{A}</p>
                      </div>
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </Main>
    );
  }
}

export default AuthenticationConsumer(withRouter(FAQ));
