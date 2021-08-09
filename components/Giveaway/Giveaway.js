import { Component } from "react";

import Header from "../Header";
import Menu from "../Menu";
import { withRouter } from "next/router";

import { ProductsConsumer } from "../../providers/ProductsProvider";
import FemaleIcon from "../../public/static/images/FemaleIcon.svg";
import { EmptyStore } from "../../public/static/vectors";

class Giveaway extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    window.addEventListener("scroll", this.setTabBg);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.setTabBg);
  }

  render() {
    const { router } = this.props;

    return (
      <div className="shop-container" id="shop-container">
        <Header />

        <div className="container">
          <div className="cart-empty-state" style={{ padding: "70px 30px" }}>
            <div className="icon giveaway">
              {/* <figure> */}
              <img src="/static/svgs/female.svg" alt="female" />
              {/* </figure> */}
            </div>
            <div className="icon giveaway">
              {/* <figure> */}
              <img src="/static/svgs/offer.svg" alt="female" />
              {/* </figure> */}
            </div>
            <h5 className="message ga">COUPON CODE: SWEET5</h5>
            <button onClick={() => router.push("/")}>
              CLAIM MY ₦500
            </button>
          </div>

          <Menu />
        </div>
      </div>
    );
  }
}

export default ProductsConsumer(withRouter(Giveaway));
