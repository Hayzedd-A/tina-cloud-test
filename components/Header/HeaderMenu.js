import Link from "next/link";

import { AuthenticationConsumer } from "../../providers/AuthenticationProvider";

import { Close } from "../../public/static/vectors";

import { menu } from "./data";

const HeaderMenu = ({ showMenu, logout, user }) => (
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
      {user ? (
        <span
          className="signout"
          onClick={() => {
            logout();
            showMenu(false);
          }}
        >
          Sign Out
        </span>
      ) : (
        <Link href="/login">
          <a>Login</a>
        </Link>
      )}
    </div>
  </div>
);

export default AuthenticationConsumer(HeaderMenu);
