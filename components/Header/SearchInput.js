import { Close } from "../../public/static/vectors";

const SearchInput = ({ showSearchInput }) => (
  <div className="search-input-container">
    <div className="search-input">
      <input type="text" placeholder="Search Breads, Cakes and More" />
      <div className="close" onClick={() => showSearchInput(false)}>
        <Close />
      </div>
    </div>
  </div>
);

export default SearchInput;
