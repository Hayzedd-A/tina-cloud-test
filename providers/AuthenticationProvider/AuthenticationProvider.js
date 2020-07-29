import React, { Component } from "react";

import { getRequest, postRequest, patchRequest } from "../../api";
import { getRequestError } from "../../utils/functions";

const AuthenticationContext = React.createContext();

class AuthenticationProvider extends Component {
  constructor(props) {
    super(props);

    const currentUser = localStorage.getItem('brightcube-user');

    this.state = {
      user: currentUser ? JSON.parse(currentUser) : null,
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
    const currentUser = localStorage.getItem("brightcube-user");

    this.setState(
      {
        user: currentUser ? JSON.parse(currentUser) : null
      }
      // () => this.getProfile()
    );
  };

  login = async data => {
    this.resetState();

    this.setState({
      isLoggingIn: true
    });

    try {
      const res = await postRequest({
        url: "google/login",
        data
      });

      localStorage.setItem("brightcube-user", JSON.stringify(res.data));

      this.setState({
        isLoggingIn: false,
        loginOutcome: "success",
        user: res.data
      });
    } catch (error) {
      const message = getRequestError(error);

      this.setState({
        isLoggingIn: false,
        loginOutcome: "error",
        loginMessage: message
      });
    }
  };

  logout = () => {
    localStorage.removeItem("brightcube-user");
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
          url: `users/${user.user.id}`,
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

  updateProfile = async data => {
    this.resetState();
    let user = { ...this.state.user };

    this.setState({
      isUpdatingProfile: true
    });

    try {
      const res = await patchRequest({
        url: `users/${user.id}`,
        token: true,
        data
      });

      user.user = res.data;

      localStorage.setItem("nettpharmacy-admin", JSON.stringify(user));

      this.setState({
        isUpdatingProfile: false,
        updateProfileStatus: true,
        user
      });
    } catch (error) {
      const message = getRequestError(error);

      this.setState({
        isUpdatingProfile: false,
        updateProfileStatus: false,
        profileOutcome: "error",
        profileMessage: message
      });
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
