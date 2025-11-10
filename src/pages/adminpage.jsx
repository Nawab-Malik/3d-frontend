// pages/AdminPage.js (Simplified)
import React, { useState } from "react";
import AdminPanel from "../components/adminpanel";
import AdminGallery from "../components/admingallery";
import AdminFeedback from "../components/adminfeedback";
import AdminOrders from "../components/adminorders";
import AdminOrderItems from "../components/adminorderitems";
import AdminAnnouncements from "../components/AdminAnnouncements";
import AdminCoupons from "../components/AdminCoupons";
import AdminShipping from "../components/AdminShipping";
import AdminSubscriptions from "../components/AdminSubscriptions";
import AdminReferrals from "../components/AdminReferrals";
import AdminSidebar from "../components/adminsidebar";
import { useNavigate } from "react-router-dom";

function AdminPage() {
  const [activeSection, setActiveSection] = useState("product-management");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate('/admin');
  };

  const renderContent = () => {
    switch (activeSection) {
      case "product-management":
        return <AdminPanel />;
      case "gallery":
        return <AdminGallery />;
      case "feedback":
        return <AdminFeedback />;
      case "order-management":
        return <AdminOrders />;
      case "order-items":
        return <AdminOrderItems />;
      case "announcements":
        return <AdminAnnouncements />;
      case "coupons":
        return <AdminCoupons />;
      case "shipping":
        return <AdminShipping />;
      case "subscriptions":
        return <AdminSubscriptions />;
      case "referrals":
        return <AdminReferrals />;
      default:
        return <AdminPanel />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onLogout={handleLogout}
      />
      <div style={{ flex: 1, padding: "20px", marginLeft: "250px" }}>
        {renderContent()}
      </div>
    </div>
  );
}

export default AdminPage;