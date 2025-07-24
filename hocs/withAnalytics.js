import React, { useEffect, useState } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

// Generate a unique ID using timestamp and random number
const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const withAnalytics = (WrappedComponent) => {
  const WithAnalyticsComponent = (props) => {
    const [userId, setUserId] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
      // This runs only on the client side

      // Get or generate userId for persistent user tracking
      let storedUserId = localStorage.getItem('userAnalyticsId');
      if (!storedUserId) {
        storedUserId = generateUniqueId();
        localStorage.setItem('userAnalyticsId', storedUserId);
      }
      setUserId(storedUserId);

      // Get or generate sessionId for current session tracking
      let storedSessionId = sessionStorage.getItem('sessionAnalyticsId');
      if (!storedSessionId) {
        storedSessionId = generateUniqueId();
        sessionStorage.setItem('sessionAnalyticsId', storedSessionId);
      }
      setSessionId(storedSessionId);

      setIsInitialized(true);
    }, []);

    // Initialize analytics with userId and sessionId (only when both are available)
    const analytics = useAnalytics(userId, sessionId);

    // Don't render the component until IDs are initialized
    if (!isInitialized) {
      return null; // or a loading spinner
    }

    return <WrappedComponent {...props} analytics={analytics} />;
  };

  WithAnalyticsComponent.displayName = `withAnalytics(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return WithAnalyticsComponent;
};

export default withAnalytics;
