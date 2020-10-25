import classNames from "classnames";

import { CircularClose } from "../../public/static/vectors";
import { Checkbox } from "../FormElements";

const ToppingsForm = ({
  toppings,
  closeToppingsForm,
  handleToppingsSelection,
  selectedToppings
}) => {
  const checkIfSelected = toppingId =>
    selectedToppings.some(topping => topping.id === toppingId);

  return (
    <div className="toppings-form-container">
      <div className="toppings-form">
        <div className="toppings-form-header">
          <span>Add Toppings</span>
          <span className="close" onClick={closeToppingsForm}>
            <CircularClose />
          </span>
        </div>

        <div className="toppings-list">
          {toppings.map((topping, index) => {
            const { id, name, unitPrice } = topping;

            return (
            <div
              key={`topping-item-${index}`}
              className={classNames("item", { active: checkIfSelected(id) })}
            >
              <div>
                <div className="image">
                  <img src="/static/images/banana-bread.jpg" alt="" />
                </div>
                <div>
                  <span className="name">{name}</span>
                  <span className="price">
                    ₦ {parseFloat(unitPrice).toLocaleString()}
                  </span>
                </div>
              </div>
              <div>
                <Checkbox
                  checked={checkIfSelected(id)}
                  onChange={e => handleToppingsSelection(topping, e)}
                />
              </div>
            </div>
          )})}
        </div>
        <div className="toppings-action">
          <span className="continue" onClick={closeToppingsForm}>
            Continue
          </span>
        </div>
      </div>
    </div>
  );
};

export default ToppingsForm;
