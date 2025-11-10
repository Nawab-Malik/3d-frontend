// context/CartContext.js
import React, { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      return { ...state, ...action.payload, loading: false };
    case "ADD_ITEM":
      return { ...state, items: action.payload, loading: false };
    case "UPDATE_ITEM":
      return { ...state, items: action.payload, loading: false };
    case "REMOVE_ITEM":
      return { ...state, items: action.payload, loading: false };
    case "CLEAR_CART":
      return { ...state, items: [], loading: false };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    loading: false,
    error: null,
  });

  const fetchCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const token = localStorage.getItem("userToken");

      if (!token) {
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }

      const response = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch({ type: "SET_CART", payload: response.data.cart });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error.response?.data?.message || "Error fetching cart",
      });
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const token = localStorage.getItem("userToken");

      const response = await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch({ type: "ADD_ITEM", payload: response.data.cart.items });
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error adding to cart";
      dispatch({ type: "SET_ERROR", payload: errorMsg });
      return { success: false, message: errorMsg };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const token = localStorage.getItem("userToken");

      const response = await axios.put(
        `http://localhost:5000/api/cart/update/${itemId}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      dispatch({ type: "UPDATE_ITEM", payload: response.data.cart.items });
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error updating cart";
      dispatch({ type: "SET_ERROR", payload: errorMsg });
      return { success: false, message: errorMsg };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const token = localStorage.getItem("userToken");

      const response = await axios.delete(
        `http://localhost:5000/api/cart/remove/${itemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      dispatch({ type: "REMOVE_ITEM", payload: response.data.cart.items });
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Error removing from cart";
      dispatch({ type: "SET_ERROR", payload: errorMsg });
      return { success: false, message: errorMsg };
    }
  };

  const clearCart = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const token = localStorage.getItem("userToken");

      await axios.delete("http://localhost:5000/api/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });

      dispatch({ type: "CLEAR_CART" });
      return { success: true, message: "Cart cleared successfully" };
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Error clearing cart";
      dispatch({ type: "SET_ERROR", payload: errorMsg });
      return { success: false, message: errorMsg };
    }
  };

  useEffect(() => {
    // Fetch cart when component mounts if user is logged in
    const token = localStorage.getItem("userToken");
    if (token) {
      fetchCart();
    }
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart: state,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
