import { useEffect } from "react";
import { useRouter } from "next/router";

import { AuthenticationConsumer } from "../../providers/AuthenticationProvider";

import { Check, RightArrow } from "../../public/static/vectors";

const CheckoutSuccess = ({ user }) => {
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
  });

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
          View your order {!user && "by "}
          {user ? (
            <span onClick={() => router.push("/my-account")}>My Account</span>
          ) : (
            <span onClick={() => router.push("/login?newUser=true")}>
              Creating Login
            </span>
          )}
        </div>
      </div>
      <div className="cart-actions no-margin">
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

export default AuthenticationConsumer(CheckoutSuccess);
