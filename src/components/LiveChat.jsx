import { useEffect } from 'react';

/**
 * Live Chat Component
 * Integrates Tawk.to live chat widget
 */
const LiveChat = () => {
  useEffect(() => {
    // Check if Tawk.to credentials are available
    const tawkPropertyId = import.meta.env.VITE_TAWK_PROPERTY_ID;
    const tawkWidgetId = import.meta.env.VITE_TAWK_WIDGET_ID;

    if (!tawkPropertyId || !tawkWidgetId) {
      console.log('Tawk.to credentials not configured');
      return;
    }

    // Load Tawk.to script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${tawkPropertyId}/${tawkWidgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');

    // Add script to document
    document.body.appendChild(script);

    // Cleanup on unmount
    return () => {
      // Remove Tawk.to widget
      if (window.Tawk_API) {
        window.Tawk_API.hideWidget();
      }
      
      // Remove script
      const existingScript = document.querySelector(`script[src*="tawk.to"]`);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  // This component doesn't render anything visible
  // Tawk.to widget appears as a floating button
  return null;
};

export default LiveChat;
