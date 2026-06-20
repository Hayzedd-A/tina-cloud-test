import React, { useState } from "react";
import Modal from "./Modal";
import { Logo } from "../public/static/vectors";

function PopupModal({ text, OkText }) {
  const [showModal, setShowModal] = useState(false);

  const dismissModal = () => {
    setShowModal(false)
  }

  if (showModal) {
    return (
      <Modal closeModal={dismissModal}>
        <div className="add-cart-success">
          <div className="icon">
            <Logo />
          </div>

          <div className="message">
            {text.main}
            {text.sub && (
              <span style={{ display: "block", fontSize: 15 }}>{text.sub}</span>
            )}
            {/* <span style={{ display: "block", fontSize: 15, color: "red" }}>
                Please note: There will be no deliveries on new year Day (Jan 1st, 2026); orders will be available for pickup only.
                </span> */}
          </div>

          <div className="actions">
            <button className="continue" style={{ cursor: "pointer" }} onClick={dismissModal}>
              {OkText}
            </button>
          </div>
        </div>
      </Modal>
    );
  } else return null;
}

export default PopupModal;
