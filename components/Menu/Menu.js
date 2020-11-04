import Link from "next/link";
import { Bread, Avatar, Bag } from "../../public/static/vectors";

const Menu = () => (
  <div className="menu-container">
    <div>
      <div className="menu-item active">
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
            <span className="icon">
              <Bag />
            </span>
            <span className="text">Cart</span>
          </a>
        </Link>
      </div>
    </div>
  </div>
);

export default Menu;
