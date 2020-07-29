import { Search } from "../../public/static/vectors";

const Header = () => (
  <div className="header">
    <div className="container">
      <div className="header-icon-container hamburger-menu">
        <span></span>
      </div>

      <div className="logo">
        <img src="/static/images/logo.png" alt="" />
      </div>

      <div className="header-icon-container search">
        <Search />
      </div>
    </div>
  </div>
);

export default Header;
