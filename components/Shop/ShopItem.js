import { useState, useRef } from "react";
import ClipLoader from "react-spinners/ClipLoader";


const ShopItem = ({ key, name, image, price, onClick }) => {
  const [loading, setLoading] = useState(true);
  const counter = useRef(0);
  const imageLoaded = () => {
    counter.current += 1;
    if (counter.current >= 1) {
      setLoading(false);
    }
  }
  return (
    <div className="shop-item" onClick={onClick}>
      <div className="item-image">
        {
          loading && (<div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
            <ClipLoader color={'#000'} loading={true} size={50} />
          </div>)
        }
        <img 
          key={`${key}-img`} 
          src={image ? image : "/static/svgs/image-placeholder.svg"} 
          alt="" 
          rel="preload" 
          onLoad={imageLoaded}
        />
        <div className="item-name">
          <span>{name}</span>
        </div>
      </div>
      <span className="item-price">₦ {price?.toLocaleString()}</span>
    </div>
  )
};

export default ShopItem;
