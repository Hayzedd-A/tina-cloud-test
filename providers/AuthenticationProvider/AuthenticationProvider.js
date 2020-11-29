import React, { Component } from "react";

import { getRequest, postRequest, patchRequest } from "../../api";
import { getRequestError } from "../../utils/functions";

const AuthenticationContext = React.createContext();

class AuthenticationProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      userProfile: null,
      isLoggingIn: false,
      isLoadingProfile: true,
      isUpdatingProfile: false,
      updateProfileStatus: null,
      loginMessage: "",
      loginOutcome: "",
      profileMessage: "",
      profileOutcome: ""
    };
  }

  resetState = () => {
    this.setState({
      isLoggingIn: false,
      isUpdatingProfile: false,
      loginMessage: "",
      loginOutcome: "",
      profileMessage: "",
      profileOutcome: ""
    });
  };

  checkUser = () => {
    const currentUser = localStorage.getItem("gourmet-twist-user");

    this.setState({
      user: currentUser ? JSON.parse(currentUser) : null
    });
  };

  register = async (data, successCallback, errorCallback) => {
    this.resetState();

    this.setState({
      isLoggingIn: true
    });

    try {
      const res = await postRequest({
        url: "/auth/customer/register",
        data
      });

      localStorage.setItem("gourmet-twist-user", JSON.stringify(res.data));

      this.setState({
        isLoggingIn: false,
        loginOutcome: "success",
        user: res.data
      });

      successCallback && successCallback();
    } catch (error) {
      const message = getRequestError(error);

      this.setState({
        isLoggingIn: false,
        loginOutcome: "error",
        loginMessage: message
      });

      errorCallback && errorCallback(message)
    }
  };

  login = async (data, successCallback, errorCallback) => {
    this.resetState();

    this.setState({
      isLoggingIn: true
    });

    try {
      const res = await postRequest({
        url: "/auth/customer/login",
        data
      });

      localStorage.setItem("gourmet-twist-user", JSON.stringify(res.data));

      this.setState({
        isLoggingIn: false,
        loginOutcome: "success",
        user: res.data
      });

      successCallback && successCallback();
    } catch (error) {
      const message = getRequestError(error);

      this.setState({
        isLoggingIn: false,
        loginOutcome: "error",
        loginMessage: message
      });

      errorCallback && errorCallback(message)
    }
  };

  logout = () => {
    localStorage.removeItem("gourmet-twist-user");
    this.setState({
      user: null
    });
  };

  getProfile = async () => {
    this.resetState();
    const user = { ...this.state.user };

    if (user) {
      this.setState({
        isLoadingProfile: true
      });

      try {
        const res = await getRequest({
          url: `users/${user.customer.id}`,
          token: true
        });

        const userProfile = res.data;

        this.setState({
          isLoadingProfile: false,
          userProfile
        });
      } catch (error) {
        const message = getRequestError(error);

        this.setState({
          isLoadingProfile: false
        });
      }
    }
  };

  updateProfile = async (data, callback) => {
    this.resetState();
    let user = { ...this.state.user };

    this.setState({
      isUpdatingProfile: true
    });

    try {
      const res = await patchRequest({
        url: `/auth/customer/profile`,
        token: true,
        data
      });

      user.customer = res.data.customer;

      localStorage.setItem("gourmet-twist-user", JSON.stringify(user));

      this.setState({
        isUpdatingProfile: false,
        updateProfileStatus: true,
        user
      });

      callback && callback("success", "Profile updated successfully!");
    } catch (error) {
      const message = getRequestError(error);

      this.setState({
        isUpdatingProfile: false,
        updateProfileStatus: false,
        profileOutcome: "error",
        profileMessage: message
      });

      callback && callback("error", message);
    }
  };

  componentDidMount() {
    this.checkUser();
  }

  render() {
    return (
      <AuthenticationContext.Provider
        value={{
          ...this.state,
          checkUser: this.checkUser,
          register: this.register,
          login: this.login,
          logout: this.logout,
          getProfile: this.getProfile,
          updateProfile: this.updateProfile
        }}
      >
        {this.props.children}
      </AuthenticationContext.Provider>
    );
  }
}

const AuthenticationConsumer = Component => {
  return class Consumer extends React.Component {
    static getInitialProps(ctx) {
      return Component.getInitialProps ? Component.getInitialProps(ctx) : {};
    }

    render() {
      return (
        <AuthenticationContext.Consumer>
          {data => <Component {...this.props} {...data} />}
        </AuthenticationContext.Consumer>
      );
    }
  };
};

export default AuthenticationProvider;
export { AuthenticationConsumer };
