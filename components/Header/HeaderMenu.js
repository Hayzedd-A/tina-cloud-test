import Link from "next/link";

import { Close } from "../../public/static/vectors";

import { menu } from "./data";

const HeaderMenu = ({ showMenu }) => (
  <div className="header-menu-container">
    <div className="close" onClick={() => showMenu(false)}>
      <Close />
    </div>
    <div className="header-menu-items">
      {menu.map(({ label, value }, index) => (
        <Link key={`header-menu-${index}`} href={value}>
          <a>{label}</a>
        </Link>
      ))}
    </div>
    <div className="header-menu-items">
      <span className="signout">Sign out</span>
    </div>
  </div>
);

export default HeaderMenu;
