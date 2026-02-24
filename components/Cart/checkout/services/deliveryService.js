import { postRequest } from "../../../../api";
import { API_BASE_URL } from "../../../../constants";
import { PICKUP_LOCATIONS } from "../constants/checkoutConstants";

export const deliveryService = {
  /**
   * Build cities array from delivery types
   */
  buildCitiesArray(deliveryTypes) {
    const cities = deliveryTypes
      .filter(
        (item) =>
          !item.name.toLowerCase().includes("gtfree") &&
          !item.name.toLowerCase().includes("gtlove"),
      )
      .map((item) => ({
        key: item.id,
        label: this.capitalizeWord(item.name.toLowerCase()),
        price: item.price,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    cities.unshift({
      key: 0,
      label: "Choose a city/area",
      price: 0,
    });

    return cities;
  },

  /**
   * Capitalize first letter of word
   */
  capitalizeWord(value) {
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  },

  /**
   * Extract address data from Google suggestion
   */
  extractAddressData(suggest) {
    const fullAddress = suggest.label;
    const latitude = suggest.location.lat;
    const longitude = suggest.location.lng;

    return {
      fullAddress,
      latitude,
      longitude,
    };
  },

  /**
   * Get pickup location coordinates by key
   */
  getPickupLocation(key) {
    const location = PICKUP_LOCATIONS.find((loc) => loc.key === key);
    return (
      location?.coordinates || { address: "", latitude: "", longitude: "" }
    );
  },

  /**
   * Calculate delivery fee based on shipping method
   */
  async calculateDeliveryFee({ shippingMethod, address, city, storeId }) {
    const isChowdeckDelivery =
      shippingMethod === "c-delivery" || shippingMethod === "sc-delivery";

    if (isChowdeckDelivery) {
      const response = await postRequest({
        url: `${API_BASE_URL}customer-requests/stores/${storeId}/chowdeck-delivery-fee`,
        data: { address, city },
      });

      const { total_amount, id } = response.data;

      return {
        price: parseInt(total_amount / 100),
        id,
      };
    }

    // For non-Chowdeck delivery, return 0 (will use city price)
    return {
      price: 0,
      id: null,
    };
  },

  /**
   * Compute distance between two points using Haversine formula
   */
  computeDistance(pointA, pointB) {
    const lat1 = pointA.location.lat;
    const lon1 = pointA.location.lng;
    const lat2 = pointB.lat;
    const lon2 = pointB.lon;

    const R = 6371e3; // Earth radius in meters
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lon2 - lon1) * (Math.PI / 180);

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * (Math.sin(Δλ / 2) * Math.sin(Δλ / 2));

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  },
};
