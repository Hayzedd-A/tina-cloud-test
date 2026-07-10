import { Component } from "react";
import { withRouter } from "next/router";

import Main from "../layouts/Main";
import { SearchResults } from "../components/Shop";

import { ProductsConsumer } from "../providers/ProductsProvider";
import { slugify } from "../utils/functions";

class Home extends Component {
  state = {
    selectedItem: {},
    showDetails: false,
  };

  selectItem = ({ name, id }) => {
    this.props.router.push(`/shop/${slugify(name)}`);
  };

  render() {
    return (
      <Main>
        <SearchResults selectItem={this.selectItem} />
      </Main>
    );
  }
}

export default ProductsConsumer(withRouter(Home));
