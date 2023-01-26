const PostItem = ({ name, image, date, onClick }) => {
  return (
    <div className="shop-item" onClick={onClick}>
      <div className="item-image">
        <img
          src={image ? image : "/static/svgs/image-placeholder.svg"}
          alt=""
          rel="preload"
        />
        <div className="item-name">
          <span>{name}</span>
        </div>
      </div>

      <span className="item-price">{date}</span>
    </div>
  );
};

export default PostItem;
