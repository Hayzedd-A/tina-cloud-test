import axios from "axios";
import { ANALYTICS_API_BASE_URL } from "../constants";

class AnalyticsService {
  constructor() {
    this.isInitialized = false;
    this.userId = null;
    this.sessionId = null;
    this.userProfile = null;
    this.analyticsId = null;
  }

  // Initialize analytics services
  init(
    userId = null,
    analyticsId = localStorage.getItem("userAnalyticsId") || null,
    sessionId = sessionStorage.getItem("sessionAnalyticsId"),
  ) {
    console.log("analytics started")
    let parsedProfile = {};
    try {
      const rawProfile = localStorage.getItem("gourmet-twist-user");
      parsedProfile = rawProfile ? JSON.parse(rawProfile) : {};
      console.log("user datas", {rawProfile, parsedProfile})
    } catch (e) {
      console.warn("Failed to parse userProfile from localStorage", e);
      parsedProfile = {};
    }

    this.userId = parsedProfile?.customer ? parsedProfile?.customer?.id : null;
    this.isInitialized = true;
    this.analyticsId = analyticsId
    this.sessionId = sessionId;
    this.userProfile = parsedProfile?.customer || null;

    // Initialize Google Analytics if gtag is available
    if (typeof gtag !== "undefined") {
      gtag("config", "GA_MEASUREMENT_ID", {
        user_id: userId,
        custom_map: { custom_parameter: "session_id" },
      });
    }

    console.log("Analysis initiated successfull:", { userId, sessionId });
  }

  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Generic event tracking method
  async trackEvent(eventName, eventData = {}) {
    console.log("checking tracking event:", eventName, eventData);
    // if (!this.isInitialized) return;
    console.log("tracking event:", eventName, eventData);

    const enrichedData = {
      ...eventData,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId,
      userProfile: this.userProfile,
      analyticsId: this.analyticsId,
      userAgent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer,
    };

    // Track to multiple platforms
    await Promise.all([
      this.trackToFacebookPixel(eventName, enrichedData),
      this.trackToGoogleAnalytics(eventName, enrichedData),
      this.trackToBackend(eventName, enrichedData),
    ]);
  }

  // Facebook Pixel tracking
  async trackToFacebookPixel(eventName, data) {
    try {
      if (typeof fbq !== "undefined") {
        const pixelEventName = this.mapToFacebookEvent(eventName);
        fbq("track", pixelEventName, {
          content_name: data.productName,
          content_category: data.category,
          content_ids: data.productId ? [data.productId] : [],
          value: data.value || 0,
          currency: "NGN",
        });
      }

      // Also send to backend for Facebook Conversions API
      if (
        ["purchase", "add_to_cart", "initiate_checkout"].includes(eventName)
      ) {
        await axios.post(`${API_BASE_URL}auth/customer/facebook-pixel-api`, {
          data: [
            {
              event_name: this.mapToFacebookEvent(eventName),
              event_time: Math.floor(Date.now() / 1000),
              action_source: "website",
              user_data: {
                em: data.email ? [this.hashEmail(data.email)] : [],
                ph: data.phone ? [this.hashPhone(data.phone)] : [],
              },
              custom_data: {
                currency: "NGN",
                value: data.value || 0,
                content_name: data.productName,
                content_category: data.category,
              },
            },
          ],
        });
      }
    } catch (error) {
      console.error("Facebook Pixel tracking error:", error);
    }
  }

  // Google Analytics tracking
  trackToGoogleAnalytics(eventName, data) {
    try {
      if (typeof gtag !== "undefined") {
        gtag("event", eventName, {
          event_category: data.category || "user_interaction",
          event_label: data.label,
          value: data.value,
          custom_parameter: this.sessionId,
          user_id: this.userId,
        });
      }
    } catch (error) {
      console.error("Google Analytics tracking error:", error);
    }
  }

  // Backend tracking for custom analytics
  async trackToBackend(eventName, data) {
    try {
      console.log("✅✅Event tracked", {
        eventName,
        data,
        userId: this.userId,
      });
      await axios.post(
        `${ANALYTICS_API_BASE_URL}kitchen-api/customer-events`,
        {
          eventName,
          eventData: data,
          timestamp: new Date().toISOString(),
        },
        {
          headers: {
            authorization: `Bearer ${process.env.NEXT_PUBLIC_API_ANALYTICS}`,
          },
        }
      );
    } catch (error) {
      console.error("Backend tracking error:", error);
    }
  }

  // Map custom events to Facebook Pixel events
  mapToFacebookEvent(eventName) {
    const eventMap = {
      product_view: "ViewContent",
      add_to_cart: "AddToCart",
      initiate_checkout: "InitiateCheckout",
      purchase: "Purchase",
      search: "Search",
      page_view: "PageView",
    };
    return eventMap[eventName] || "CustomEvent";
  }

  // Specific tracking methods for common events
  async trackPageView(pageName, additionalData = {}) {
    await this.trackEvent("page_view", {
      page_name: pageName,
      ...additionalData,
    });
  }

  async trackProductView(product) {
    console.log("product viewed:", product);
    await this.trackEvent("product_view", {
      productId: product.id,
      productName: product.name,
      // category: product.category,
      // price: product.price,
    });
  }

  async trackAddToCart(product, quantity = 1) {
    await this.trackEvent("add_to_cart", {
      ...product,
      // productId: product.id,
      // productName: product.name,
      // category: product.category,
      // quantity,
      // value: product.price * quantity,
    });
  }

  async trackRemoveFromCart(product, quantity = 1) {
    await this.trackEvent("remove_from_cart", {
      productId: product.id,
      productName: product.name,
      category: product.category,
      quantity,
      value: product.price * quantity,
    });
  }

  async trackSearch(searchTerm, resultsCount = 0) {
    await this.trackEvent("search", {
      search_term: searchTerm,
      results_count: resultsCount,
    });
  }

  async trackCheckoutInitiated(cartItems, totalValue) {
    await this.trackEvent("initiate_checkout", {
      ...cartItems,
    });
  }

  async trackPurchase(orderData) {
    await this.trackEvent("purchase", {
      ...orderData,
    });
  }

  async trackUserRegistration(userData) {
    await this.trackEvent("user_registration", {
      method: userData.method || "email",
      user_id: userData.userId,
    });
  }

  async trackUserLogin(userData) {
    await this.trackEvent("user_login", {
      method: userData.method || "email",
      user_id: userData.userId,
    });
  }

  // Utility methods
  hashEmail(email) {
    // Simple hash for demo - use proper crypto in production
    return btoa(email.toLowerCase());
  }

  hashPhone(phone) {
    // Simple hash for demo - use proper crypto in production
    return btoa(phone.replace(/\D/g, ""));
  }
}

// Create singleton instance
const analyticsService = new AnalyticsService();
export default analyticsService;
