import { createContext, useState, useEffect, useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const adminToken = localStorage.getItem("userToken");
    const adminData = localStorage.getItem("userData");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        setIsAdmin(false);
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } else if (adminToken && adminData) {
      try {
        const parsedAdminData = JSON.parse(adminData);
        setToken(adminToken);
        setUser(parsedAdminData);
        setIsAdmin(parsedAdminData?.role === "admin");
      } catch (err) {
        console.error("Error parsing admin data from localStorage:", err);
        localStorage.removeItem("userToken");
        localStorage.removeItem("userData");
      }
    }

    setLoading(false);
  }, []);

  const login = useCallback((userData, authToken, isAdminUser = false) => {
    setUser(userData);
    setToken(authToken);
    setIsAdmin(isAdminUser);

    if (isAdminUser) {
      localStorage.setItem("userToken", authToken);
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } else {
      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.removeItem("userToken");
      localStorage.removeItem("userData");
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userData");
  }, []);

  const value = {
    user,
    token,
    loading,
    isAdmin,
    login,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
