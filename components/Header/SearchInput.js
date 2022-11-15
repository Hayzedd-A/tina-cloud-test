import { useEffect, useRef } from "react";

import classNames from "classnames";
import { Close } from "../../public/static/vectors";

const SearchInput = ({
  q,
  handleSearch,
  showSearchInput,
  isSearchInputActive
}) => {
  const inputRef = useRef();

  useEffect(() => {
    if (isSearchInputActive) {
      inputRef.current.focus();
      inputRef.current.setAttribute('autofocus', 'autofocus');
    } 
  });

  return (
    <div
      className={classNames("search-input-container", {
        active: isSearchInputActive
      })}
    >
      <div className="search-input">
        <input
          ref={inputRef}
          type="text"
          onChange={({ target }) => handleSearch(target.value)}
          placeholder="Search Breads, Cakes and More"
          defaultValue={q}
        />
        <div className="close" onClick={() => showSearchInput(false)}>
          <Close />
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
