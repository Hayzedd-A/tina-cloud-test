import React, { Component } from "react";

import { getRequest, postRequest, patchRequest } from "../../api";
import { getRequestError } from "../../utils/functions";
import {
  classes,
  students,
  improvementPlans
} from "../../containers/Classes/data";
import { streams, coursePlans } from "../../containers/ClassDetails/data";

const ClassesContext = React.createContext();

class ClassesProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      classes: [],
      classDetails: {},
      streams: [],
      coursePlans: [],
      students: [],
      studentDetails: {},
      improvementPlans: [],
      isLoadingClasses: true,
      isLoadingClass: true,
      isLoadingStreams: true,
      isLoadingCoursePlans: true,
      isLoadingStudents: true,
      isLoadingStudent: true,
      isLoadingImprovementPlans: true,
      isUpdatingClasses: false,
      isUpdatingClass: false,
      isUpdatingStreams: false,
      updateClassesMessage: "",
      updateClassesOutcome: "",
      updateClassMessage: "",
      updateClassOutcome: "",
      updateStreamsMessage: "",
      updateStreamsOutcome: ""
    };
  }

  resetState = () => {
    this.setState({
      isUpdatingClasses: false,
      isUpdatingClass: false,
      isUpdatingStreams: false,
      updateClassesMessage: "",
      updateClassesOutcome: "",
      updateClassMessage: "",
      updateClassOutcome: "",
      updateStreamsMessage: "",
      updateStreamsOutcome: ""
    });
  };

  getClasses = () => {
    this.setState({
      classes
    });
  };

  getClass = id => {
    const classDetails =
      classes.find(classDetail => classDetail.id.toString() === id) || {};

    this.setState({
      classDetails
    });
  };

  addClass = data => {
    let classes = JSON.parse(JSON.stringify(this.state.classes));

    classes.unshift(data);

    this.setState({
      classes
    });
  };

  filterClasses = filter => {
    let newClasses = classes;

    for (const key in filter) {
      if (filter.hasOwnProperty(key)) {
        const value = filter[key];

        if (value.length) {
          newClasses = newClasses.filter(classItem =>
            value.includes(classItem[key])
          );
        }
      }
    }

    this.setState({
      classes: newClasses
    });
  };

  getStreams = classId => {
    const newStreams = streams.filter(
      stream => stream.classId.toString() === classId
    );

    this.setState({
      streams: newStreams
    });
  };

  getCoursePlans = () => {
    this.setState({
      coursePlans
    });
  };

  getStudents = () => {
    this.setState({
      students
    });
  };

  searchStudents = value => {
    const newStudents = students.filter(student =>
      student.name.toLowerCase().includes(value.toLowerCase())
    );

    this.setState({
      students: newStudents
    });
  };

  getStudent = id => {
    const studentDetails =
      students.find(studentDetail => studentDetail.id.toString() === id) || {};

    this.setState({
      studentDetails
    });
  };

  getImprovementPlans = () => {
    this.setState({
      improvementPlans
    });
  };

  removeImprovementPlan = id => {
    const improvementPlans = this.state.improvementPlans.filter(
      plan => plan.id !== id
    );

    this.setState({
      improvementPlans
    });
  };

  componentDidMount() {
    this.getClasses();
  }

  render() {
    return (
      <ClassesContext.Provider
        value={{
          ...this.state,
          getClasses: this.getClasses,
          getClass: this.getClass,
          addClass: this.addClass,
          filterClasses: this.filterClasses,
          getStreams: this.getStreams,
          getCoursePlans: this.getCoursePlans,
          getStudents: this.getStudents,
          getStudent: this.getStudent,
          searchStudents: this.searchStudents,
          getImprovementPlans: this.getImprovementPlans,
          removeImprovementPlan: this.removeImprovementPlan,
        }}
      >
        {this.props.children}
      </ClassesContext.Provider>
    );
  }
}

const ClassesConsumer = Component => {
  return class Consumer extends React.Component {
    static getInitialProps(ctx) {
      return Component.getInitialProps ? Component.getInitialProps(ctx) : {};
    }

    render() {
      return (
        <ClassesContext.Consumer>
          {data => <Component {...this.props} {...data} />}
        </ClassesContext.Consumer>
      );
    }
  };
};

export default ClassesProvider;
export { ClassesConsumer };
