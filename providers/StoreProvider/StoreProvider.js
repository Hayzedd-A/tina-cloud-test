import { withRouter } from "next/router";
import React, { Component } from "react";
import { API_BASE_URL, STORE_ID } from "../../constants";
import axios from "axios";
import { zupaGetRequest } from "../../api";

const StoreContext = React.createContext();

class StoreProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      store: null,
      invalidURL: false,
      isActive: false,
      isLoadingStore: true,
      themeObject: {},
    };
  }

  fetchStoreInfo = async () => {
    this.setState({
      isLoadingStore: true,
    });

    try {
      /*
      const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwNDgwNjMxOSwiZXhwIjoxNzM2MzYzOTE5fQ.JLjMqDwrn_ZnI313S9HliCnkin7K2sf1QfLaT080g0w";

      const res = await zupaGetRequest({
        url: `/stores/${STORE_ID}?$include=delivery_types,states`,
        token,
      });
     */

      const res = await axios.get(`${API_BASE_URL}auth/stores/${STORE_ID}`);

      localStorage.setItem("STORE_INFO__SAVED", true);
      localStorage.setItem("STORE_INFO", JSON.stringify(res.data));

      this.setState({
        store: res.data,
        isLoadingStore: false,
        invalidURL: false,
        isActive: res?.data?.paystackSubAccountCode ? true : false,
      });
    } catch (error) {
      console.log("store not saved", error);

      this.setState({
        isLoadingStore: false,
        invalidURL: true,
        isActive: false,
      });
    }
  };

  shadeColor = (color, percent) => {
    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt((R * (100 + percent)) / 100);
    G = parseInt((G * (100 + percent)) / 100);
    B = parseInt((B * (100 + percent)) / 100);

    R = R < 255 ? R : 255;
    G = G < 255 ? G : 255;
    B = B < 255 ? B : 255;

    var RR = R.toString(16).length == 1 ? "0" + R.toString(16) : R.toString(16);
    var GG = G.toString(16).length == 1 ? "0" + G.toString(16) : G.toString(16);
    var BB = B.toString(16).length == 1 ? "0" + B.toString(16) : B.toString(16);

    return "#" + RR + GG + BB;
  };

  hexToRgb = (hex) => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
          result[3],
          16
        )}`
      : hex;
  };

  componentDidMount() {
    this.fetchStoreInfo();
  }

  render() {
    return (
      <StoreContext.Provider
        value={{
          ...this.state,
          fetchStoreInfo: this.fetchStoreInfo,
        }}
      >
        {this.props.children}
      </StoreContext.Provider>
    );
  }
}

const StoreConsumer = (Component) => {
  return class Consumer extends React.Component {
    static getInitialProps(ctx) {
      return Component.getInitialProps ? Component.getInitialProps(ctx) : {};
    }

    render() {
      return (
        <StoreContext.Consumer>
          {(data) => <Component {...this.props} {...data} />}
        </StoreContext.Consumer>
      );
    }
  };
};

export default withRouter(StoreProvider);
export { StoreConsumer };
