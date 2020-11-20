import classNames from "classnames";

import { CircularClose } from "../../public/static/vectors";
import { Checkbox } from "../FormElements";

const ToppingsForm = ({
  toppings,
  closeToppingsForm,
  handleToppingsSelection,
  selectedToppings,
  getToppingsDetails
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
            const toppingDetails = getToppingsDetails(topping);
            const { id, name, unitPrice, imageUrl } = toppingDetails;

            return (
              <div
                key={`topping-item-${index}`}
                className={classNames("item", { active: checkIfSelected(id) })}
              >
                <div>
                  <div className="image">
                    <img src={imageUrl} alt="" />
                  </div>
                  <div>
                    <span className="name">{name}</span>
                    <span className="price">
                      ₦ {unitPrice && parseFloat(unitPrice).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div>
                  <Checkbox
                    checked={checkIfSelected(id)}
                    onChange={e => handleToppingsSelection(toppingDetails, e)}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="toppings-action">
          <button className="continue" onClick={closeToppingsForm}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToppingsForm;
