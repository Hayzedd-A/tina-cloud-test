import Link from "next/link";
import { Bread, Avatar, Bag } from "../../public/static/vectors";

import { CartConsumer } from "../../providers/CartProvider";
import { reduceArray } from "../../utils/functions";

const Menu = ({ cart }) => {
  const cartQuantity = reduceArray(cart, "quantity");

  return (
  <div className="menu-container">
    <div>
      <div className="menu-item">
        <Link href="/">
          <a>
            <span className="icon">
              <Bread />
            </span>
            <span className="text">Shop Bread</span>
          </a>
        </Link>
      </div>
      <div className="menu-item">
        <Link href="/my-account">
          <a>
            <span className="icon">
              <Avatar />
            </span>
            <span className="text">My Account</span>
          </a>
        </Link>
      </div>
      <div className="menu-item">
        <Link href="/cart">
          <a>
            <span className="cart-count">{cartQuantity}</span>
            <span className="icon">
              <Bag />
            </span>
            <span className="text">Cart</span>
          </a>
        </Link>
      </div>
    </div>
  </div>
);}

export default CartConsumer(Menu);
