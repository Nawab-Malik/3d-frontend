// components/Navbar.js
import React, { useState, useEffect, useContext } from "react";
import {
  FaHome,
  FaQuoteRight,
  FaInfoCircle,
  FaStore,
  FaTruck,
  FaUser,
  FaSignInAlt,
  FaUserPlus,
  FaShoppingCart,
  FaImages,
} from "react-icons/fa";
import logo from "../assets/logo.svg";
import LoginModal from "./loginmodel";
import SignupModal from "./signupmodel";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout, token } = useContext(AuthContext);
  const [active, setActive] = useState("Home");
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

  // Update active state based on current location
  useEffect(() => {
    const pathToActive = {
      "/": "Home",
      "/second": "Quote",
      "/about": "About Us",
      "/products": "Store",
      "/delivery": "Delivery",
      "/contact": "Contact",
      "/gallery": "Gallery",
    };

    const currentActive = pathToActive[location.pathname] || "Home";
    setActive(currentActive);
  }, [location.pathname]);

  useEffect(() => {
    setShowCartDropdown(false);
  }, [location.pathname]);

  const isAdminRoute = location.pathname.startsWith("/admin");
  const isUserLoggedIn = isAuthenticated && user?.role !== "admin";

  const menuItems = [
    { name: "Home", icon: <FaHome className="me-2" />, path: "/" },
    // { name: "Quote", icon: <FaQuoteRight className="me-2" />, path: "/second" },
    {
      name: "About Us",
      icon: <FaInfoCircle className="me-2" />,
      path: "/about",
    },
    { name: "Store", icon: <FaStore className="me-2" />, path: "/products" },
    { name: "Delivery", icon: <FaTruck className="me-2" />, path: "/delivery" },
    { name: "Gallery", icon: <FaImages className="me-2" />, path: "/gallery" },
  ];

  const handleLoginSuccess = (userData) => {
    // Assuming AuthContext handles the login state
    setShowLogin(false);

    // Navigate to home after login
    navigate("/");
  };

  const handleLogout = () => {
    logout();
    // Redirect to home or login
    window.location.href = "/";
  };

  const fetchOrders = async () => {
    if (!isAuthenticated || !token) return;

    try {
      setOrdersLoading(true);
      setOrdersError("");

      const res = await fetch(
        "https://3-d-backend-3pgu.vercel.app/api/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to load orders");
      }

      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders", err);
      setOrdersError("Unable to load recent orders.");
    } finally {
      setOrdersLoading(false);
    }
  };

  const toggleCartDropdown = () => {
    const next = !showCartDropdown;
    setShowCartDropdown(next);
    if (next) {
      fetchOrders();
    }
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-bg-image py-2"
        data-bs-theme="dark"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 1030,
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          height: "120px",
        }}
      >
        <div className="container-xl d-flex align-items-center justify-content-between">
          {/* Logo */}
          <a
            className="navbar-brand d-flex align-items-center"
            href="/"
            style={{ paddingLeft: "20px" }}
            onClick={(e) => {
              e.preventDefault();
              setActive("Home");
              navigate("/");
            }}
          >
            <img
              src={logo}
              alt="Logo"
              width="150"
              height="150"
              className="me-2"
              style={{ userSelect: "none" }}
            />
          </a>

          {/* Hamburger for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu + Buttons */}
          <div
            className="collapse navbar-collapse justify-content-center"
            id="navbarNav"
          >
            {/* Menu items */}
            <ul className="navbar-nav mx-auto">
              {menuItems.map((item) => (
                <li
                  key={item.name}
                  className="nav-item mx-2"
                  onClick={() => {
                    setActive(item.name);
                    navigate(item.path);
                  }}
                >
                  <a
                    href={item.path}
                    className={`nav-link d-flex align-items-center px-3 py-2 ${
                      active === item.name ? "active-link" : ""
                    }`}
                    style={{
                      cursor: "pointer",
                      borderRadius: "8px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(255,255,255,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      if (active !== item.name) {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    {active === item.name && item.icon}
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>

            {/* Auth Buttons */}
            <div
              className="d-flex align-items-center ms-auto"
              style={{ paddingRight: "20px", gap: "10px" }}
            >
              {!isAdminRoute &&
                (isUserLoggedIn ? (
                  <div className="d-flex align-items-center gap-3">
                    <span
                      className="text-white me-2"
                      style={{
                        fontSize: "0.95rem",
                        fontWeight: "500",
                      }}
                    >
                      Welcome, {user?.name}
                    </span>
                    <div style={{ position: "relative" }}>
                      <button
                        className="btn btn-outline-light d-flex align-items-center"
                        onClick={toggleCartDropdown}
                        style={{
                          borderRadius: "8px",
                          transition: "all 0.3s ease",
                          padding: "6px 12px",
                        }}
                        title="View Cart and Orders"
                      >
                        <FaShoppingCart className="me-1" />
                        Cart
                        <span
                          style={{
                            marginLeft: "6px",
                            fontSize: "0.75rem",
                          }}
                        >
                          {showCartDropdown ? "▲" : "▼"}
                        </span>
                      </button>
                      {showCartDropdown && (
                        <div
                          style={{
                            position: "absolute",
                            right: 0,
                            marginTop: "8px",
                            minWidth: "260px",
                            backgroundColor: "white",
                            color: "#212529",
                            borderRadius: "8px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            zIndex: 2000,
                            padding: "12px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "8px",
                              marginBottom: "10px",
                              borderBottom: "1px solid #eee",
                              paddingBottom: "10px",
                            }}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setShowCartDropdown(false);
                                navigate("/cart");
                              }}
                              style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                textAlign: "left",
                                color: "#514F6E",
                                fontWeight: 600,
                                cursor: "pointer",
                              }}
                            >
                              View Cart
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowCartDropdown(false);
                                navigate("/track-order");
                              }}
                              style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                textAlign: "left",
                                color: "#514F6E",
                                cursor: "pointer",
                              }}
                            >
                              Track Orders
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowCartDropdown(false);
                                navigate("/delivery");
                              }}
                              style={{
                                background: "transparent",
                                border: "none",
                                padding: 0,
                                textAlign: "left",
                                color: "#514F6E",
                                cursor: "pointer",
                              }}
                            >
                              Shipping Information
                            </button>
                            <Link
                              to="/coupons"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                padding: "10px 15px",
                                color: "#333",
                                textDecoration: "none",
                                borderRadius: "6px",
                                transition: "background 0.3s ease",
                              }}
                              onMouseOver={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "#f0f0f0")
                              }
                              onMouseOut={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                  "transparent")
                              }
                            >
                              🎁 Coupons
                            </Link>
                          </div>
                          <div
                            style={{
                              marginBottom: "6px",
                              fontWeight: 600,
                            }}
                          >
                            Recent Orders
                          </div>
                          {ordersLoading && (
                            <div
                              style={{
                                fontSize: "0.9rem",
                                color: "#666",
                              }}
                            >
                              Loading orders...
                            </div>
                          )}
                          {ordersError && !ordersLoading && (
                            <div
                              style={{
                                fontSize: "0.9rem",
                                color: "#dc3545",
                              }}
                            >
                              {ordersError}
                            </div>
                          )}
                          {!ordersLoading &&
                            !ordersError &&
                            orders.length === 0 && (
                              <div
                                style={{
                                  fontSize: "0.9rem",
                                  color: "#666",
                                }}
                              >
                                No recent orders found.
                              </div>
                            )}
                          {!ordersLoading &&
                            !ordersError &&
                            orders.slice(0, 3).map((o) => (
                              <button
                                key={o._id}
                                type="button"
                                onClick={() => {
                                  setShowCartDropdown(false);
                                  navigate("/order-confirmation", {
                                    state: { order: o },
                                  });
                                }}
                                style={{
                                  width: "100%",
                                  textAlign: "left",
                                  background: "transparent",
                                  border: "none",
                                  padding: "6px 0",
                                  cursor: "pointer",
                                  fontSize: "0.9rem",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <span
                                    style={{
                                      fontWeight: 600,
                                      color: "#343a40",
                                    }}
                                  >
                                    #{o.orderNo}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: "0.8rem",
                                      padding: "2px 8px",
                                      borderRadius: "12px",
                                      backgroundColor: "#e9ecef",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    {o.status || "pending"}
                                  </span>
                                </div>
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    fontSize: "0.8rem",
                                    color: "#666",
                                  }}
                                >
                                  <span>
                                    {new Date(o.createdAt).toLocaleDateString()}
                                  </span>
                                  <span>
                                    ${o.grandTotal?.toFixed(2) || "0.00"}
                                  </span>
                                </div>
                              </button>
                            ))}
                        </div>
                      )}
                    </div>
                    <button
                      className="btn btn-outline-light"
                      onClick={handleLogout}
                      style={{
                        borderRadius: "8px",
                        transition: "all 0.3s ease",
                        whiteSpace: "nowrap",
                        padding: "6px 12px",
                      }}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      className="btn auth-btn px-3"
                      onClick={() => setShowLogin(true)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "rgba(255,255,255,0.9)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "white";
                      }}
                      style={{
                        backgroundColor: "white",
                        color: "black",
                        border: "1px solid white",
                        borderRadius: "8px",
                        transition: "all 0.3s ease",
                        whiteSpace: "nowrap",
                        fontWeight: 600,
                      }}
                    >
                      <FaSignInAlt className="me-1" /> Login
                    </button>
                    <button
                      className="btn auth-btn px-3"
                      onClick={() => setShowSignup(true)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "white";
                        e.currentTarget.style.borderColor = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "white";
                        e.currentTarget.style.borderColor = "white";
                      }}
                      style={{
                        backgroundColor: "transparent",
                        color: "white",
                        border: "1px solid white",
                        borderRadius: "8px",
                        transition: "all 0.3s ease",
                        whiteSpace: "nowrap",
                        fontWeight: 600,
                      }}
                    >
                      <FaUserPlus className="me-1" /> Sign Up
                    </button>
                  </>
                ))}

              {/* Contact Us button */}
              <button
                className="btn contact-btn px-4"
                type="button"
                onClick={() => navigate("/contact")}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "black";
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "white";
                  e.currentTarget.style.color = "black";
                }}
                style={{
                  backgroundColor: "white",
                  color: "black",
                  border: "1px solid black",
                  borderRadius: "8px",
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
                  fontWeight: 600,
                }}
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>

        {/* Inline CSS */}
        <style>{`
          .navbar-bg-image {
            background-image: url('/images/navbar-bg-image.jpg');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            backdrop-filter: brightness(0.8);
          }
          .nav-link {
            color: white !important;
            transition: all 0.3s ease !important;
          }
          .nav-link:hover {
            color: white !important;
          }
          .active-link {
            background-color: rgba(255,255,255,0.25) !important;
            color: white !important;
          }
          .navbar-toggler {
            border-color: rgba(255,255,255,0.3);
          }
          .navbar-toggler-icon {
            filter: invert(1);
          }
          @media (max-width: 991.98px) {
            .navbar-nav {
              text-align: center;
            }
            .nav-item {
              margin: 0.25rem 0 !important;
            }
            .contact-btn, .auth-btn {
              width: 100%;
              margin-top: 10px;
            }
            .d-flex.ms-auto {
              padding-right: 0 !important;
              justify-content: center !important;
              flex-direction: column;
            }
          }
          @media (max-width: 575.98px) {
            .navbar-brand img {
              width: 80px;
              height: 80px;
            }
            .nav-link {
              font-size: 0.9rem !important;
              padding: 8px 12px !important;
            }
            .contact-btn, .auth-btn {
              padding: 10px 0 !important;
            }
          }
        `}</style>
      </nav>

      {/* Login/Signup modals are hidden on admin routes */}
      {!location.pathname.startsWith("/admin") && (
        <LoginModal
          show={showLogin}
          handleClose={() => setShowLogin(false)}
          handleLoginSuccess={handleLoginSuccess}
          showSignup={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
        />
      )}

      {!location.pathname.startsWith("/admin") && (
        <SignupModal
          show={showSignup}
          handleClose={() => setShowSignup(false)}
          showLogin={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
}

export default Navbar;
