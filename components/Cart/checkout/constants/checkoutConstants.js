import { DELIVERY_DISCOUNT } from "../../../../constants";

export const DELIVERY_METHODS = [
  "delivery",
  "s-delivery",
  "c-delivery",
  "sc-delivery",
];

export const PICKUP_METHODS = ["pickup", "s-pickup"];

export const SCHEDULED_METHODS = ["s-delivery", "sc-delivery", "s-pickup"];

export const initialFormData = {
  name: { value: "", valid: false },
  phoneNumber: { value: "", valid: false },
  email: { value: "", valid: false },
  address: { value: "", valid: false },
  deliveryDate: { value: "", valid: true },
  note: { value: "", valid: true },
  shippingMethod: { value: "delivery", valid: true },
};

export const SHIPPING_OPTIONS = [
  { key: "delivery", label: "Delivery" },
  { key: "pickup", label: "Pickup" },
  { key: "s-delivery", label: "Scheduled Delivery" },
  { key: "s-pickup", label: "Scheduled Pickup" },
];

export const PICKUP_LOCATIONS = [
  {
    key: "",
    label: "Choose pickup location",
  },
  {
    key: "1",
    label: "19B Fola Osibo, Lekki Phase 1, Lekki, Nigeria",
    coordinates: {
      address: "19B Fola Osibo, Lekki Phase 1, Lekki, Nigeria",
      latitude: 6.430118879280349,
      longitude: 3.4881381695005618,
      id: "7ea1da57-376a-4b39-a0ff-b93f8f5884bf",
    },
  },
  {
    key: "2",
    label: "13b Methodist Church St, Opebi, Lagos 101233, Lagos, Nigeria",
    coordinates: {
      address: "13b Methodist Church St, Opebi, Lagos 101233, Lagos, Nigeria",
      latitude: 6.5244,
      longitude: 3.3792,
      id: "2d4a8917-3408-4e25-9f6f-aad87a4087bd",
    },
  },
];

export const MINIMUM_ORDER_AMOUNT = 2500;

export const DEFAULT_DELIVERY_DISCOUNT = DELIVERY_DISCOUNT;
