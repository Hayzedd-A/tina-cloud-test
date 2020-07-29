const ShopItem = ({ name, image, price, onClick }) => (
  <div className="shop-item" onClick={onClick}>
    <div className="item-image">
      <img src={image} alt="" />
      <div className="item-name">
        <span>{name}</span>
      </div>
    </div>
    <span className="item-price">₦ {price}</span>
  </div>
);

export default ShopItem;
