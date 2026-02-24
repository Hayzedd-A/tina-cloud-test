import React, { Fragment } from "react";
import { TextField } from "../../../FormElements";
import SelectField from "../../../FormElements/SelectField";
import DayPickerInput from "react-day-picker/DayPickerInput";
import Geosuggest from "react-geosuggest";
import "react-day-picker/lib/style.css";

import { 
  SHIPPING_OPTIONS, 
  PICKUP_LOCATIONS, 
  DELIVERY_METHODS,
  PICKUP_METHODS,
  SCHEDULED_METHODS 
} from "../constants/checkoutConstants";

const CheckoutForm = ({
  formData,
  cities,
  chosenCity,
  deliveryLocation,
  selectedPickup,
  isLoadingDeliveryPrice,
  onFormChange,
  onShippingMethodChange,
  onCityChange,
  onAddressSelect,
  onAddressChange,
  onDeliveryDateChange,
  onPickupLocationChange,
}) => {
  const { name, phoneNumber, email, shippingMethod, note, deliveryDate } = formData;

  const isDeliveryMethod = DELIVERY_METHODS.includes(shippingMethod.value);
  const isPickupMethod = PICKUP_METHODS.includes(shippingMethod.value);
  const isScheduledMethod = SCHEDULED_METHODS.includes(shippingMethod.value);
  const showScheduledDelivery = shippingMethod.value === "s-delivery" || shippingMethod.value === "sc-delivery";
  const showScheduledPickup = shippingMethod.value === "s-pickup";

  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const disabledModifiers = {
    modifiers: {
      disabled: [{ before: tomorrow }],
    },
  };

  return (
    <div className="checkout-form">
      <div className="container">
        <div className="description">Marked fields are compulsory</div>
        
        <TextField
          label="Receiver's Name"
          placeholder="Enter the receiver's name"
          name="name"
          value={name.value}
          onChange={onFormChange}
          className="mb-40"
          required
        />
        
        <TextField
          label="Email Address (for payment receipt)"
          placeholder="Enter your email address"
          type="email"
          name="email"
          value={email.value}
          onChange={onFormChange}
          className="mb-40"
          required
        />
        
        <TextField
          label="Receiver's Phone Number"
          placeholder="Enter the receiver's phone number"
          name="phoneNumber"
          value={phoneNumber.value}
          onChange={onFormChange}
          className="mb-40"
          hint="11 digits required"
          required
          mobile
        />
      </div>

      <div className="shipping-method">
        <div className="container">
          <SelectField
            label="Select Delivery Type"
            required
            hint="Pickup, Delivery or Scheduled"
            onChange={onShippingMethodChange}
            options={SHIPPING_OPTIONS}
          />

          {/* Regular Delivery */}
          {shippingMethod.value === "delivery" && (
            <DeliveryFields
              cities={cities}
              chosenCity={chosenCity}
              deliveryLocation={deliveryLocation}
              isLoadingDeliveryPrice={isLoadingDeliveryPrice}
              onCityChange={onCityChange}
              onAddressSelect={onAddressSelect}
              onAddressChange={onAddressChange}
            />
          )}

          {/* Regular Pickup */}
          {shippingMethod.value === "pickup" && (
            <PickupFields
              selectedPickup={selectedPickup}
              onPickupLocationChange={onPickupLocationChange}
            />
          )}

          {/* Scheduled Delivery */}
          {showScheduledDelivery && (
            <ScheduledDeliveryFields
              cities={cities}
              chosenCity={chosenCity}
              deliveryLocation={deliveryLocation}
              deliveryDate={deliveryDate}
              isLoadingDeliveryPrice={isLoadingDeliveryPrice}
              disabledModifiers={disabledModifiers}
              onCityChange={onCityChange}
              onAddressSelect={onAddressSelect}
              onAddressChange={onAddressChange}
              onDeliveryDateChange={onDeliveryDateChange}
            />
          )}

          {/* Scheduled Pickup */}
          {showScheduledPickup && (
            <ScheduledPickupFields
              selectedPickup={selectedPickup}
              deliveryDate={deliveryDate}
              disabledModifiers={disabledModifiers}
              onPickupLocationChange={onPickupLocationChange}
              onDeliveryDateChange={onDeliveryDateChange}
            />
          )}

          <TextField
            label="Special Note"
            placeholder="Any special notes for delivery"
            name="note"
            value={note.value}
            onChange={onFormChange}
            className="mb-40"
          />
        </div>
      </div>
    </div>
  );
};

// Sub-components for different shipping methods

const DeliveryFields = ({
  cities,
  chosenCity,
  deliveryLocation,
  isLoadingDeliveryPrice,
  onCityChange,
  onAddressSelect,
  onAddressChange,
}) => (
  <Fragment>
    <div className="input-container mb-40">
      <SelectField
        label="City"
        required
        hint="Fragile or bulk orders may need special delivery, we'll contact you to review the delivery price."
        onChange={onCityChange}
        options={cities}
      />
      {Object.entries(chosenCity).length < 1 && (
        <span className="hint flashing-red blink_me">Choose a city/area</span>
      )}
    </div>

    <div className="input-container mb-40">
      <label>
        Delivery Address <sup className="marked">*</sup>
        {isLoadingDeliveryPrice && (
          <i style={{ textTransform: "capitalize", color: "#333", fontWeight: "bold" }}>
            {" "}Calculating Price...{" "}
          </i>
        )}
      </label>
      <Geosuggest
        placeholder="Enter your address"
        country="ng"
        onSuggestSelect={onAddressSelect}
        onChange={onAddressChange}
        queryDelay={600}
      />
      {!deliveryLocation.address && (
        <span className="hint flashing-red blink_me">
          Please enter a more specific address for delivery
        </span>
      )}
    </div>
  </Fragment>
);

const PickupFields = ({ selectedPickup, onPickupLocationChange }) => (
  <div className="input-container mb-40">
    <SelectField
      label="Pickup Address"
      required
      hint="Choose pickup location"
      onChange={(e) => onPickupLocationChange(e.target.value)}
      options={PICKUP_LOCATIONS}
    />
  </div>
);

const ScheduledDeliveryFields = ({
  cities,
  chosenCity,
  deliveryLocation,
  deliveryDate,
  isLoadingDeliveryPrice,
  disabledModifiers,
  onCityChange,
  onAddressSelect,
  onAddressChange,
  onDeliveryDateChange,
}) => (
  <Fragment>
    <div className="input-container mb-40">
      <SelectField
        label="City"
        required
        hint="City"
        onChange={onCityChange}
        options={cities}
      />
      {Object.entries(chosenCity).length < 1 && (
        <span className="hint flashing-red blink_me">Choose a city/area</span>
      )}
    </div>

    <div className="input-container mb-40">
      <label>
        Delivery Address <sup className="marked">*</sup>
        {isLoadingDeliveryPrice && (
          <i style={{ textTransform: "capitalize", color: "#333", fontWeight: "bold" }}>
            {" "}Calculating Price...{" "}
          </i>
        )}
      </label>
      <Geosuggest
        placeholder="Enter your address"
        country="ng"
        onSuggestSelect={onAddressSelect}
        onChange={onAddressChange}
        queryDelay={600}
      />
      {!deliveryLocation.address && (
        <span className="hint flashing-red blink_me">
          Please enter a more specific address for delivery
        </span>
      )}
    </div>

    <div className="input-container mb-40">
      <label>
        Delivery Date <sup className="marked">*</sup>
      </label>
      <DayPickerInput
        dayPickerProps={disabledModifiers}
        value={deliveryDate.value}
        onDayChange={onDeliveryDateChange}
        placeholder="DD/MM/YYYY"
        format="DD/MM/YYYY"
      />
    </div>
  </Fragment>
);

const ScheduledPickupFields = ({
  selectedPickup,
  deliveryDate,
  disabledModifiers,
  onPickupLocationChange,
  onDeliveryDateChange,
}) => (
  <Fragment>
    <div className="input-container mb-40">
      <SelectField
        label="Pickup Address"
        required
        hint="Choose pickup location"
        onChange={(e) => onPickupLocationChange(e.target.value)}
        options={PICKUP_LOCATIONS}
      />
    </div>

    <div className="input-container mb-40">
      <label>
        Pickup Date <sup className="marked">*</sup>
      </label>
      <DayPickerInput
        dayPickerProps={disabledModifiers}
        value={deliveryDate.value}
        onDayChange={onDeliveryDateChange}
        placeholder="DD/MM/YYYY"
        format="DD/MM/YYYY"
      />
    </div>
  </Fragment>
);

export default CheckoutForm;