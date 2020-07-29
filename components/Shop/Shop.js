import { useState } from "react";

import { ShopItem } from "./";
import Header from "../Header";
import Tabs from "../Tabs";
import Menu from "../Menu";

const Shop = ({ selectItem }) => {
  const [currentTab, switchTab] = useState(0);
  const tabs = ["Breads", "Zobo", "Peanut Burger", "Cakes", "Soups"];
  const items = [
    {
      name: "Double Chocolate Banana Bread",
      image: "/static/images/banana-bread.jpg",
      description: "Nunc id arcu sem. Proin augue massa, pretium sit amet elementum vitae, elementum a ligula. ",
      price: 4900
    },
    {
      name: "Basic Banana Bread",
      image: "/static/images/banana-bread2.jpg",
      description: "Nunc id arcu sem. Proin augue massa, pretium sit amet elementum vitae, elementum a ligula. ",
      price: 3000
    },
    {
      name: "Chocochip Banana Bread",
      image: "/static/images/banana-bread3.jpg",
      description: "Nunc id arcu sem. Proin augue massa, pretium sit amet elementum vitae, elementum a ligula. ",
      price: 4000
    }
  ];

  return (
    <div className="shop-container">
      <Header />
      <div className="container">
        <Tabs tabs={tabs} currentTab={currentTab} switchTab={switchTab} />
        <div className="shop-section">
          <div className="section-title favorite">
            <span className="icon">
              <img src="/static/images/diamond.png" alt="" />
            </span>
            <span className="text">Most Recommended</span>
          </div>
          <div className="section-items">
            {items.map((item, index) => {
              const { name, image, price } = item;

              return (
                <ShopItem
                  key={`item-${index}`}
                  name={name}
                  image={image}
                  price={price}
                  onClick={() => selectItem(item)}
                />
              );
            })}
          </div>
        </div>
        <div className="shop-section">
          <div className="section-title">All Breads</div>
          <div className="section-items">
            {items.map((item, index) => {
              const { name, image, price } = item;

              return (
                <ShopItem
                  key={`item-${index}`}
                  name={name}
                  image={image}
                  price={price}
                  onClick={() => selectItem(item)}
                />
              );
            })}
          </div>
        </div>
        <Menu />
      </div>
    </div>
  );
};

export default Shop;
