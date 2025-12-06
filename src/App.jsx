// App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import HomePage from "./pages/homepage";
import SecondPage from "./pages/secondpage";
import ThirdPage from "./pages/thirdpage";
import ProductsPage from "./pages/productspage";
import CartPage from "./pages/cartpage";
import AdminPage from "./pages/adminpage";
import AdminLogin from "./pages/adminlogin";
import ProtectedRoute from "./components/protectedroute";
import OrderConfirmation from "./pages/orderconfirmation";
import NotFound from "./pages/notfound";
import products from "./data/products";
import { CartProvider } from "./context/cartcontext";
import TestConnection from "./components/testconnection";
import ProductDetails from "./pages/productdetails";
import ResetPassword from "./pages/resetpassword";
import AboutPage from "./pages/about";
import DeliveryPage from "./pages/delivery";
import ContactPage from "./pages/contact";
import GalleryPage from "./pages/gallery";
import ScrollReveal from "./components/scrollreveal";
import FeedbackPage from "./pages/feedback";

import AnnouncementBar from "./components/AnnouncementBar";
import EmailPopup from "./components/EmailPopup";
import LiveChat from "./components/LiveChat";

// New pages
import CheckoutPage from "./pages/CheckoutPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import ReferralPage from "./pages/ReferralPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import CouponsPage from "./pages/CouponsPage";
import OrdersPage from "./pages/OrdersPage";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";

function AppWrapper() {
  return (
    <CartProvider>
      <Router>
        <App />
      </Router>
    </CartProvider>
  );
}

function App() {
  const location = useLocation();

  return (
    <>
      {/* ⭐ Show Announcement Bar ONLY on Home Page */}
      {location.pathname === "/" && <AnnouncementBar />}
      {/* Global Scroll Reveal */}
      <ScrollReveal />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage products={products} />} />
        <Route path="/second" element={<SecondPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/delivery" element={<DeliveryPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/test-connection" element={<TestConnection />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/track-order" element={<TrackOrderPage />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/coupons" element={<CouponsPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        {/* <Route path="/chat" element={<ReferralPage />} /> */}

        {/* Protected Routes */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-confirmation"
          element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/feedback"
          element={
            <ProtectedRoute>
              <FeedbackPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Route */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requireAdmin>
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* Referral Route - Protected */}
        <Route
          path="/referrals"
          element={
            <ProtectedRoute>
              <ReferralPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* Global Components */}
      <EmailPopup />
      <LiveChat /> {/* ✅ Only loads when user is authenticated */}
    </>
  );
}

export default AppWrapper;
