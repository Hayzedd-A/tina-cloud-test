import { Component } from "react";
import classNames from "classnames";

import { Back, RightArrow } from "../../public/static/vectors";
import NumberSelector from "../FormElements/NumberSelector";

class ShopItemDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedSize: "Regular",
      quantity: 1
    };
  }

  selectSize = selectedSize => {
    this.setState({
      selectedSize
    });
  };

  handleQuantity = quantity => {
    this.setState({
      quantity
    });
  };

  render() {
    const { selectedSize, quantity } = this.state;
    const { selectedItem, goBack } = this.props;
    const { image, name, price, description } = selectedItem;

    const sizes = ["Regular", "Mini", "Maxi", "Large"];

    return (
      <div className="shop-item-details">
        <div className="item-image">
          <img src={image} alt="" />
          <span className="back" onClick={goBack}>
            <RightArrow />
          </span>
        </div>
        <div className="item-info">
          <div className="container">
            <div className="name-price">
              <span className="name">{name}</span>
              <span className="price">₦ {price && price.toLocaleString()}</span>
            </div>
            <div className="description">{description}</div>
          </div>
        </div>
        <div className="select-section">
          <div className="container">
            <span className="title">SELECT SIZE</span>
            <div className="sizes">
              {sizes.map((size, index) => (
                <span
                  key={`size-${index}`}
                  className={classNames("size-selector", {
                    active: selectedSize === size
                  })}
                  onClick={() => this.selectSize(size)}
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="select-section">
          <div className="container">
            <span className="title">QUANTITY</span>
            <div className="quantity">
              <NumberSelector
                value={quantity}
                onChange={e => this.handleQuantity(e.target.value)}
              />
              <span className="add-toppings">ADD TOPPINGS</span>
            </div>
          </div>
        </div>
        <div className="add-to-cart">
          <div className="container">
            <span>Add {quantity} to Order</span>
            <div>
              <span className="total-price">
                ₦ {(quantity * parseInt(price)).toLocaleString()}
              </span>
              <RightArrow />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ShopItemDetails;
