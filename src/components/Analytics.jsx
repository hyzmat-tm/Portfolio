import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Yandex.Metrika - отслеживание переходов по страницам
    if (typeof window.ym !== 'undefined') {
      const ymId = import.meta.env.VITE_YANDEX_METRIKA_ID;
      if (ymId) {
        window.ym(ymId, 'hit', location.pathname + location.hash);
      }
    }

    // Google Analytics - отслеживание переходов по страницам
    if (typeof window.gtag !== 'undefined') {
      const gaId = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;
      if (gaId) {
        window.gtag('config', gaId, {
          page_path: location.pathname + location.hash,
        });
      }
    }
  }, [location]);

  return null;
};

// Функции для отслеживания событий
export const trackEvent = (eventName, eventParams = {}) => {
  // Yandex.Metrika
  if (typeof window.ym !== 'undefined') {
    const ymId = import.meta.env.VITE_YANDEX_METRIKA_ID;
    if (ymId) {
      window.ym(ymId, 'reachGoal', eventName, eventParams);
    }
  }

  // Google Analytics
  if (typeof window.gtag !== 'undefined') {
    window.gtag('event', eventName, eventParams);
  }
};

export default Analytics;
