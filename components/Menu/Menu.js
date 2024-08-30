import Link from "next/link";
import { useRouter } from "next/router";
import { ElfsightWidget } from "react-elfsight-widget";

import { Bread, Avatar, Bag } from "../../public/static/vectors";

import { CartConsumer } from "../../providers/CartProvider";
import { reduceArray } from "../../utils/functions";

const Menu = ({ cart }) => {
  const router = useRouter();
  const cartQuantity = reduceArray(cart, "quantity");

  return (
    <div className="menu-container">
      <div>
        <div className="menu-item">
          <ElfsightWidget
            widgetID="c3a6bd0a-949c-43de-961e-ad614a018677"
          />
        </div>

        <div className="menu-item">
          <Link href="/">
            <a>
              <span className="icon">
                <img
                  src={
                    router.pathname === "/"
                      ? "/static/svgs/shop-active.svg"
                      : "/static/svgs/shop.svg"
                  }
                  alt=""
                />
              </span>
              <span className="text">Shop Bread</span>
            </a>
          </Link>
        </div>

        <div className="menu-item">
          <Link href="/my-orders">
            <a>
              <span className="icon">
                <img
                  src={
                    router.pathname === "/my-orders"
                      ? "/static/svgs/my-orders-active.svg"
                      : "/static/svgs/my-orders.svg"
                  }
                  alt=""
                />
              </span>
              <span className="text">My Orders</span>
            </a>
          </Link>
        </div>

        <div className="menu-item">
          <Link href="/loyalty-points">
            <a>
              <span className="icon">
                <img
                  src={
                    router.pathname === "/loyalty-points"
                      ? "/static/svgs/my-orders-active.svg"
                      : "/static/svgs/my-orders.svg"
                  }
                  alt=""
                />
              </span>
              <span className="text">Loyalty</span>
            </a>
          </Link>
        </div>

        <div className="menu-item">
          <Link href="/cart">
            <a>
              <span className="cart-count">{cartQuantity}</span>
              <span className="icon">
                <img
                  src={
                    router.pathname === "/cart"
                      ? "/static/svgs/cart-active.svg"
                      : "/static/svgs/cart.svg"
                  }
                  alt=""
                />
              </span>
              <span className="text">Cart</span>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartConsumer(Menu);
