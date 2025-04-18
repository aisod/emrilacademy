
// Simple analytics tracking functions that could be expanded later

type EventType = 
  | 'page_view'
  | 'login'
  | 'signup'
  | 'class_enroll'
  | 'class_view'
  | 'class_join'
  | 'message_sent'
  | 'resource_download'
  | 'course_view';

interface EventProperties {
  [key: string]: string | number | boolean | null;
}

// This function can be expanded later to connect to actual analytics service
export const trackEvent = (eventType: EventType, properties: EventProperties = {}): void => {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Analytics] Event: ${eventType}`, properties);
  }
  
  // In production, this would send to an analytics service
  // For now, just log to console
  try {
    // Mock analytics service call
    setTimeout(() => {
      console.log(`[Analytics] Sent ${eventType} event`);
    }, 0);
  } catch (error) {
    console.error("[Analytics] Error sending event", error);
  }
};

// Track page views
export const trackPageView = (pageName: string, additionalProps: EventProperties = {}): void => {
  trackEvent('page_view', { 
    page_name: pageName,
    url: window.location.href,
    ...additionalProps
  });
};

// Track user authentication events
export const trackAuth = (eventType: 'login' | 'signup', userId: string): void => {
  trackEvent(eventType, { user_id: userId });
};

// Track class related events
export const trackClassEvent = (
  eventType: 'class_enroll' | 'class_view' | 'class_join',
  classId: string,
  className: string
): void => {
  trackEvent(eventType, {
    class_id: classId,
    class_name: className
  });
};

// Initialize analytics (to be called at app startup)
export const initAnalytics = (): void => {
  console.log("[Analytics] Initialized");
  
  // Could setup global error tracking here
  window.addEventListener('error', (event) => {
    trackEvent('page_view', { 
      error: event.message,
      error_source: event.filename,
      error_line: event.lineno
    });
  });
};
