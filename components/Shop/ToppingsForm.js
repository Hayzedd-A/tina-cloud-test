import classNames from "classnames";

import { CircularClose, EmptyStore } from "../../public/static/vectors";
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
  console.log(toppings);
  const activeToppings = toppings ? toppings.filter((topping) => {
    const toppingDetails = getToppingsDetails(topping);
    if(toppingDetails && toppingDetails.unitPrice && parseFloat(toppingDetails.unitPrice) > 0)
      return toppingDetails;
  }) : [];
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
          {
            activeToppings.length > 0
            ? activeToppings.map((topping, index) => {
              const toppingDetails = getToppingsDetails(topping);
              const { id, name, unitPrice, imageUrl } = toppingDetails || {};

              return (
                <div
                  key={`topping-item-${index}`}
                  className={classNames("item", { active: checkIfSelected(id) })}
                >
                  <div>
                    <div className="image">
                      <img src={imageUrl || "/static/svgs/image-placeholder.svg"} alt="" />
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
            })
            : <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', width: '100%'}}>
                <div style={{textAlign: 'center'}}>
                  <EmptyStore width={150} height={150} />
                  <h4 style={{marginTop: '20px'}}>No topping for this size</h4>
                </div>
              </div>
          }
        </div>
        {
          activeToppings.length > 0
          && <div className="toppings-action">
            <button className="continue" onClick={closeToppingsForm}>
              Continue
            </button>
          </div>
        }
      </div>
    </div>
  );
};

export default ToppingsForm;
