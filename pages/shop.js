import Main from "../layouts/Main";

import { ShopItemDetails } from "../components/Shop";
import Loader from "../components/Loader";

import { ProductsConsumer } from "../providers/ProductsProvider";

const ItemDetails = ({ isLoadingProducts }) => (
  <Main>
    {isLoadingProducts && <Loader />}
    <ShopItemDetails />
  </Main>
);

export default ProductsConsumer(ItemDetails);
