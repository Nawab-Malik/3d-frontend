import { useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";

/**
 * Live Chat Component
 * Integrates Tawk.to live chat widget
 */
const LiveChat = () => {
  const { isAuthenticated, user } = useContext(AuthContext);

  useEffect(() => {
    // Only load Tawk if user is authenticated
    if (!isAuthenticated || !user) {
      console.log("📵 User not logged in - Tawk.to chat disabled");
      return;
    }

    console.log("✅ User logged in - Initializing Tawk.to chat");

    // Initialize Tawk.to
    const initTawk = () => {
      if (window.Tawk_API) {
        console.log("✅ Tawk.to already initialized");
        return;
      }

      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();

      // Set visitor information so admin can see who is chatting
      window.Tawk_API.visitor = {
        name: user?.name || "Guest User",
        email: user?.email || "no-email@user.com",
        externalId: user?._id || user?.id,
        properties: {
          userId: user?._id || user?.id,
          userName: user?.name,
          userEmail: user?.email,
          isAdmin: user?.role === "admin",
          userRole: user?.role || "user",
        },
      };

      const script = document.createElement("script");
      script.async = true;
      script.src = "https://embed.tawk.to/690dfb1230a61419588ee8d9/1j9f9pgft";
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");

      script.onload = () => {
        console.log("✅ Tawk.to chat widget loaded successfully");

        // Verify visitor info is set
        if (window.Tawk_API && window.Tawk_API.visitor) {
          console.log("👤 Visitor info set for admin:", {
            name: user?.name,
            email: user?.email,
            userId: user?._id,
          });
        }
      };

      script.onerror = () => {
        console.warn("⚠️ Failed to load Tawk.to widget");
      };

      document.head.appendChild(script);
    };

    // Load Tawk after a short delay to ensure DOM is ready
    setTimeout(initTawk, 500);

    return () => {
      // Cleanup if needed
    };
  }, [isAuthenticated, user]);

  // Don't render anything - script handles everything
  return null;
};

export default LiveChat;
