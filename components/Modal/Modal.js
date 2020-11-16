import { Component } from "react";
import dynamic from "next/dynamic";

const ReactPortal = dynamic(() => import("../ReactPortal"), {
  ssr: false
});

class Modal extends Component {
  render() {
    const { closeModal, children } = this.props;

    return (
      <ReactPortal>
        <div className="modal-overlay" onClick={closeModal}></div>
        <div className="modal-container" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {children}
          </div>
        </div>
      </ReactPortal>
    );
  }
}

export default Modal;
