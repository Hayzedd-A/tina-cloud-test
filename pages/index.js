import { Component } from "react";
import { withRouter } from "next/router";

import Main from "../layouts/Main";
import Shop from "../components/Shop";
import SplashScreen from "../components/SplashScreen";

import { ProductsConsumer } from "../providers/ProductsProvider";
import { slugify } from "../utils/functions";

import Modal from "../components/Modal";
import { Logo } from "../public/static/vectors";
import analyticsService from "../services/analyticsService";
// import withAnalytics from '../hocs/withAnalytics';

class Home extends Component {
  state = {
    selectedItem: {},
    showDetails: false,
    showSplash: true,
    showModal: true,
    phoneNumber: "2347018249203",
    message: "Hello, I would like to place an order.",
  };

  selectItem = ({ name, id }) => {
    // Use analytics from props provided by HOC
    analyticsService.trackProductView({
      id,
      name,
    });
    this.props.router.push(`/shop?name=${slugify(name)}&id=${id}`, undefined, {
      shallow: true,
    });
  };

  componentDidMount() {
    this.splashtimeout = setTimeout(() => {
      this.setState({
        showSplash: false,
      });
    }, 4000);
  }

  componentWillUnmount() {
    clearTimeout(this.splashtimeout);
  }

  closeModal = () => {
    this.setState({
      showModal: false,
    });
  };

  render() {
    const { isLoadingProducts } = this.props;

    return (
      <Main>
        {isLoadingProducts ? (
          <SplashScreen />
        ) : (
          <>
            {this.state.showModal && (
              <Modal closeModal={this.closeModal}>
                <div className="add-cart-success">
                  <div className="icon">
                    <Logo />
                  </div>

                  <div className="message">
                    Website Temporarily Unavailable.
                    <span style={{ display: "block", fontSize: 15 }}>
                      We’re currently experiencing some issues with our website.
                      Please continue your order through WhatsApp. We’ll
                      process it right away!
                    </span>
                  </div>

                  <div className="actions">
                    <button className="continue" onClick={this.closeModal}>
                      <a href={`https://wa.me/${this.state.phoneNumber}?text=${this.state.message}`} target="_blank" rel="noopener noreferrer">

                      Open WhatsApp
                      </a>
                    </button>
                  </div>
                </div>
              </Modal>
            )}
            <Shop selectItem={this.selectItem} />
          </>
        )}
      </Main>
    );
  }
}

export default ProductsConsumer(withRouter(Home));
{
  /* <>
  {this.state.showModal && (
    <Modal closeModal={this.closeModal}>
      <div className="add-cart-success">
        <div className="icon">
          <Logo />
        </div>

        <div className="message">
          Enjoy FREE delivery when you order above 25k.
          <span style={{ display: "block", fontSize: 15 }}>
            If delivery exceeds N3,000 you only pay the difference!
          </span>
        </div>

        <div className="actions">
          <button className="continue" onClick={this.closeModal}>
            Ok
          </button>
        </div>
      </div>
    </Modal>
  )}
  <Shop selectItem={this.selectItem} />
</>; */
}
