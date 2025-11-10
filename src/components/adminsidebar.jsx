// components/adminsidebar.js
import React, { useState } from "react";
import {
  FaBox,
  FaClipboardList,
  FaListAlt,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaImages,
  FaComments,
  FaBullhorn,
  FaTicketAlt,
  FaShippingFast,
  FaEnvelope,
  FaGift,
} from "react-icons/fa";

import "./adminsidebar.css";

function AdminSidebar({ activeSection, setActiveSection, onLogout }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    {
      name: "Product Management",
      key: "product-management",
      icon: <FaBox className="me-2" />,
    },
    {
      name: "Gallery",
      key: "gallery",
      icon: <FaImages className="me-2" />,
    },
    {
      name: "Order Management",
      key: "order-management",
      icon: <FaClipboardList className="me-2" />,
    },
    {
      name: "Order Items",
      key: "order-items",
      icon: <FaListAlt className="me-2" />,
    },
    {
      name: "Announcements",
      key: "announcements",
      icon: <FaBullhorn className="me-2" />,
    },
    {
      name: "Coupons",
      key: "coupons",
      icon: <FaTicketAlt className="me-2" />,
    },
    {
      name: "Shipping Rules",
      key: "shipping",
      icon: <FaShippingFast className="me-2" />,
    },
    {
      name: "Subscriptions",
      key: "subscriptions",
      icon: <FaEnvelope className="me-2" />,
    },
    {
      name: "Referrals",
      key: "referrals",
      icon: <FaGift className="me-2" />,
    },
    {
      name: "Feedback",
      key: "feedback",
      icon: <FaComments className="me-2" />,
    },
  ];

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      // Mobile behavior: toggle the open/closed state
      setIsMobileOpen(!isMobileOpen);
    } else {
      // Desktop behavior: toggle collapsed/expanded state
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleItemClick = (key) => {
    setActiveSection(key);
    // On mobile, close sidebar after selection
    if (window.innerWidth <= 768) {
      setIsMobileOpen(false);
    }
  };

  const handleLogout = () => {
    onLogout();
    if (window.innerWidth <= 768) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`admin-sidebar ${isCollapsed ? "collapsed" : ""} ${isMobileOpen ? "mobile-open" : ""}`}>
        {/* Toggle Button */}
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {isCollapsed || !isMobileOpen ? <FaBars /> : <FaTimes />}
        </button>

        {/* Logo */}
        <div className="sidebar-logo">
          <h2>{isCollapsed ? "" : "Admin Panel"}</h2>
        </div>

        {/* Menu Items */}
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.key}
              className={`menu-item ${
                activeSection === item.key ? "active" : ""
              }`}
              onClick={() => handleItemClick(item.key)}
            >
              <span className="menu-icon">{item.icon}</span>
              {!isCollapsed && <span className="menu-text">{item.name}</span>}
            </li>
          ))}
        </ul>

        {/* Logout Button */}
        <div className="sidebar-footer">
          <li
            className="menu-item"
            onClick={handleLogout}
            style={{ cursor: 'pointer', color: '#ff4d4f' }}
          >
            <span className="menu-icon"><FaSignOutAlt className="me-2" /></span>
            {!isCollapsed && <span className="menu-text">Logout</span>}
          </li>
        </div>
      </div>
    </>
  );
}

export default AdminSidebar;