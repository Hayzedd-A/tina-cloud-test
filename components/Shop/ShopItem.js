const ShopItem = ({ key, name, image, price, onClick }) => (
  <div className="shop-item" onClick={onClick}>
    <div className="item-image">
      <img key={`${key}-img`} src={image ? image : "/static/svgs/image-placeholder.svg"} alt="" />
      <div className="item-name">
        <span>{name}</span>
      </div>
    </div>
    <span className="item-price">₦ {price?.toLocaleString()}</span>
  </div>
);

export default ShopItem;
