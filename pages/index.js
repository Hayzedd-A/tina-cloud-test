import { Component } from "react";
import { withRouter } from "next/router";

import Main from "../layouts/Main";
import Shop from "../components/Shop";
import SplashScreen from "../components/SplashScreen";

import { ProductsConsumer } from "../providers/ProductsProvider";
import { slugify } from "../utils/functions";

import Modal from "../components/Modal";
import { Logo } from "../public/static/vectors";

class Home extends Component {
  state = {
    selectedItem: {},
    showDetails: false,
    showSplash: true,
    showModal: true,
  };

  selectItem = ({ name, id }) => {
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
                    Dear Twister! Due to our physical launch today, orders
                    placed today will be fulfilled on Monday March 17th
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
          </>
        )}
      </Main>
    );
  }
}

export default ProductsConsumer(withRouter(Home));
