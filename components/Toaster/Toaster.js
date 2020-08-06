import { Component } from "react";
import dynamic from "next/dynamic";
import { CircularClose, Success } from "../../public/static/vectors";

const ReactPortal = dynamic(() => import("../ReactPortal"), {
  ssr: false
});

class Toaster extends Component {
  componentDidMount() {
    this.timeout = setTimeout(() => {
      this.props.closeToaster();
    }, 5000);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  render() {
    const { message, status, closeToaster } = this.props;

    return (
      <ReactPortal>
        <div className="toaster-container">
          <div>
            <span className={`status ${status}`}>
              {status === "success" && <Success />}
            </span>
            <span className="message">{message}</span>
          </div>
          <div
            className="close"
            onClick={() => {
              clearTimeout(this.timeout);
              closeToaster();
            }}
          >
            <CircularClose />
          </div>
        </div>
      </ReactPortal>
    );
  }
}

export default Toaster;
