import { useRouter } from "next/router";

import { Check, RightArrow } from "../../public/static/vectors";

const CheckoutSuccess = () => {
  const router = useRouter();

  return (
    <div className="cart-container checkout-success">
      <div className="success-badge">
        <span className="icon">
          <Check />
        </span>
        <span className="text">Success! Thank you for your order!</span>
      </div>
      <div className="success-image">
        <img src="/static/images/success-image.png" alt="" />
      </div>
      <div className="success-message">
        <div className="main-text">
          Your order has been placed successfully.
        </div>
        <div className="description">
          Track your order now by{" "}
          <span onClick={() => router.push("/create-login")}>Creating Login</span>
        </div>
      </div>
      <div className="cart-actions">
        <div className="checkout-button" onClick={() => router.push("/")}>
          <div className="container">
            <span>Continue</span>
            <RightArrow />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
