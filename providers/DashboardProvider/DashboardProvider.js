import React, { Component } from "react";

import { getRequest, postRequest, patchRequest } from "../../api";
import { getRequestError } from "../../utils/functions";
import { dueItems, awaitingStudents } from "../../containers/Dashboard/data";

const DashboardContext = React.createContext();

class DashboardProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dueItems: [],
      awaitingStudents: [],
      isLoadingDueItems: true,
      isLoadingAwaitingStudents: true,
      isUpdatingDueItems: false,
      isUpdatingAwaitingStudents: false,
      updateDueItemsMessage: "",
      updateDueItemsOutcome: "",
      awaitingStudentsMessage: "",
      awaitingStudentsOutcome: ""
    };
  }

  resetState = () => {
    this.setState({
      isUpdatingDueItems: false,
      isUpdatingAwaitingStudents: false,
      updateDueItemsMessage: "",
      updateDueItemsOutcome: "",
      awaitingStudentsMessage: "",
      awaitingStudentsOutcome: ""
    });
  };

  getDueItems = () => {
    this.setState({
      dueItems
    });
  };

  getAwaitingStudents = () => {
    this.setState({
      awaitingStudents
    });
  };

  removeItem = id => {
    const dueItems = this.state.dueItems.filter(item => item.id !== id);

    this.setState({
      dueItems
    });
  };

  componentDidMount() {
    this.getDueItems();
    this.getAwaitingStudents();
  }

  render() {
    return (
      <DashboardContext.Provider
        value={{
          ...this.state,
          getDueItems: this.getDueItems,
          getAwaitingStudents: this.getAwaitingStudents,
          removeItem: this.removeItem
        }}
      >
        {this.props.children}
      </DashboardContext.Provider>
    );
  }
}

const DashboardConsumer = Component => {
  return class Consumer extends React.Component {
    static getInitialProps(ctx) {
      return Component.getInitialProps ? Component.getInitialProps(ctx) : {};
    }

    render() {
      return (
        <DashboardContext.Consumer>
          {data => <Component {...this.props} {...data} />}
        </DashboardContext.Consumer>
      );
    }
  };
};

export default DashboardProvider;
export { DashboardConsumer };
