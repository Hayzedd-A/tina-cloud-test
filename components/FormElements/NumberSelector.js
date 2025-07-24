import { Component } from "react";
import classNames from "classnames";
import { SelectorSubtract, SelectorAdd } from "../../public/static/vectors";

class NumberSelector extends Component {
  constructor(props) {
    super(props);

    const { value } = props;

    this.state = {
      value: value ? value : 0
    };
  }

  handleChange = ({ target }) => {
    let value = target.value;
    value = value || value === 0 ? parseInt(value) : value;

    this.props.onChange({ target: { value } });
  };

  componentDidUpdate(prevProps) {
    const { value } = this.props;

    // console.log((prevProps.value !== value && (value || value === 0)), value)
    if ((prevProps.value !== value && (value || value === 0))) {
      this.setState({
        value
      });
    } else if (prevProps.value !== value && value === "") {
      this.setState({
        value: 0
      });
    }
  }

  render() {
    const { value } = this.state;
    const { className } = this.props;
    // console.log(this.props.index, value)

    return (
      <div className={`number-selector-container ${className || ""}`}>
        <span
          className={classNames("selector left", { disabled: value === 0 })}
          onClick={() => this.handleChange({ target: { value: value - 1 } })}
        >
          <SelectorSubtract />
        </span>
        <input
          type="number"
          name=""
          id=""
          value={value}
          onChange={this.handleChange}
        />
        <span
          className="selector right"
          onClick={() => this.handleChange({ target: { value: value + 1 } })}
        >
          <SelectorAdd />
        </span>
      </div>
    );
  }
}

export default NumberSelector;
