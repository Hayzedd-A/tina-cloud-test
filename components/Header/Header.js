import { useState } from "react";
import classNames from "classnames";
import CSSTransitionGroup from "react-transition-group/CSSTransitionGroup";
import { useRouter } from "next/router";

import { HeaderMenu, SearchInput } from "./";

import { Search, Logo } from "../../public/static/vectors";

const Header = () => {
  const router = useRouter();

  const { q } = router.query;

  const [isMenuActive, showMenu] = useState(false);
  const [isSearchInputActive, showSearchInput] = useState(!!q);

  const handleSearch = (value) => {
    router.push(`/search?q=${value}`, undefined, {
      shallow: true,
    });
  };

  return (
    <>
      <CSSTransitionGroup
        transitionName="header-menu-animation"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        {isMenuActive && <HeaderMenu showMenu={showMenu} />}
      </CSSTransitionGroup>

      <div className="header">
        <CSSTransitionGroup
          transitionName="header-container-animation"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {!isSearchInputActive && (
            <div className="container">
              <div
                className="header-icon-container hamburger-menu"
                onClick={() => showMenu(true)}
              >
                <span></span>
              </div>

              <div className="logo" onClick={() => router.push("/")}>
                <Logo />
              </div>

              <div
                className="header-icon-container search"
                onClick={() => showSearchInput(true)}
              >
                <Search />
              </div>
            </div>
          )}
        </CSSTransitionGroup>
      </div>

      <CSSTransitionGroup
        transitionName="search-input-animation"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={300}
      >
        {isSearchInputActive && (
          <SearchInput
            q={q}
            handleSearch={handleSearch}
            showSearchInput={showSearchInput}
            isSearchInputActive={isSearchInputActive}
          />
        )}
      </CSSTransitionGroup>
    </>
  );
};

export default Header;
