import { useState } from "react";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";

import { HeaderMenu, SearchInput } from "./";

import { Search } from "../../public/static/vectors";

const Header = () => {
  const [isMenuActive, showMenu] = useState(false);
  const [isSearchInputActive, showSearchInput] = useState(false);

  return (
    <>
      <CSSTransitionGroup
        transitionName="header-menu-animation"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        {isMenuActive && <HeaderMenu showMenu={showMenu} />}
      </CSSTransitionGroup>
      <CSSTransitionGroup
        transitionName="search-input-animation"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        {isSearchInputActive && (
          <SearchInput showSearchInput={showSearchInput} />
        )}
      </CSSTransitionGroup>
      <div className="header">
        <div className="container">
          <div
            className="header-icon-container hamburger-menu"
            onClick={() => showMenu(true)}
          >
            <span></span>
          </div>

          <div className="logo">
            <img src="/static/images/logo.png" alt="" />
          </div>

          <div
            className="header-icon-container search"
            onClick={() => showSearchInput(true)}
          >
            <Search />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
