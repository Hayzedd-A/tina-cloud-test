import { useEffect, useCallback } from "react";
import analyticsService from "../services/analyticsService";

export const useAnalytics = (userId = null, sessionId = null) => {
  useEffect(() => {
    console.log("✅✅✅starting analysis from hook", { userId, sessionId });
    analyticsService.init(userId, sessionId);

    const handleRightClick = (event) => {
      analyticsService.trackEvent("right_click", {
        x: event.pageX,
        y: event.pageY,
        element: event.target.tagName,
        id: event.target.id,
        classList: Array.from(event.target.classList),
        timestamp: Date.now(),
        pagePath: window.location.pathname,
        fullURL: window.location.href,
        pageTitle: document.title,
      });
    };

    document.addEventListener("contextmenu", handleRightClick);

    return () => {
      document.removeEventListener("contextmenu", handleRightClick);
    };
  }, [userId, sessionId]);

  const trackEvent = useCallback(async (eventName, eventData) => {
    await analyticsService.trackEvent(eventName, eventData);
  }, []);

  const trackPageView = useCallback(async (pageName, additionalData) => {
    await analyticsService.trackPageView(pageName, additionalData);
  }, []);

  const trackProductView = useCallback(async (product) => {
    await analyticsService.trackProductView(product);
  }, []);

  const trackAddToCart = useCallback(async (product, quantity) => {
    await analyticsService.trackAddToCart(product, quantity);
  }, []);

  const trackRemoveFromCart = useCallback(async (product, quantity) => {
    await analyticsService.trackRemoveFromCart(product, quantity);
  }, []);

  const trackSearch = useCallback(async (searchTerm, resultsCount) => {
    await analyticsService.trackSearch(searchTerm, resultsCount);
  }, []);

  const trackCheckoutInitiated = useCallback(async (cartItems, totalValue) => {
    await analyticsService.trackCheckoutInitiated(cartItems, totalValue);
  }, []);

  const trackPurchase = useCallback(async (orderData) => {
    await analyticsService.trackPurchase(orderData);
  }, []);

  return {
    trackEvent,
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackRemoveFromCart,
    trackSearch,
    trackCheckoutInitiated,
    trackPurchase,
  };
};
