import { Component, Suspense, useState } from "react";
import { Img, resource } from 'react-suspense-img';
import ClipLoader from "react-spinners/ClipLoader";

const INITIAL_TIME = +new Date();

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <p className="error">
          An error occurred loading the images. Please check your console for
          more details.
        </p>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary }

const ShopItem = ({ key, name, image, price, onClick }) => {
  const img = image ? image : "/static/svgs/image-placeholder.svg";
  resource.preloadImage(img);
  return (
    <div className="shop-item" onClick={onClick}>
      <div className="item-image">
        <ErrorBoundary>
          <React.Suspense fallback={<div style={{height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%'}}>
            <ClipLoader color={'#000'} loading={true} size={50} />
          </div>}>
            <Img key={`${key}-img`} src={image ? image : "/static/svgs/image-placeholder.svg"} alt="" rel="preload" />
          </React.Suspense>
        </ErrorBoundary>
        <div className="item-name">
          <span>{name}</span>
        </div>
      </div>
      <span className="item-price">₦ {price?.toLocaleString()}</span>
    </div>
  )
};

export default ShopItem;
