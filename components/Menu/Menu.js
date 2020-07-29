import { Bread, Avatar, Bag } from "../../public/static/vectors";

const Menu = () => (
  <div className="menu-container">
    <div className="menu-item active">
      <span className="icon">
        <Bread />
      </span>
      <span className="text">Shop Bread</span>
    </div>
    <div className="menu-item">
      <span className="icon">
        <Avatar />
      </span>
      <span className="text">My Account</span>
    </div>
    <div className="menu-item">
      <span className="icon">
        <Bag />
      </span>
      <span className="text">Cart</span>
    </div>
  </div>
);

export default Menu;
