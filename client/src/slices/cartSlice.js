import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

// Helper to safely get data from localStorage
const getLocalStorageData = (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Error parsing localStorage for ${key}:`, error);
    return defaultValue;
  }
};
console.log("okkkkkkkkkkkkkk_----------------------->>>>>>>>>>>>>")
const initialState = {
  cart: getLocalStorageData("cart", []),
  total: getLocalStorageData("total", 0),
  totalItems: getLocalStorageData("totalItems", 0),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const course = action.payload;

      // Check if course already exists
      const exists = state.cart.find((item) => item._id === course._id);
      if (exists) {
        toast.error("Course already in cart");
        return;
      }

      state.cart.push(course);
      state.totalItems += 1;
      state.total += course.price;

      // Update localStorage
      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("total", JSON.stringify(state.total));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

      toast.success("Course added to cart");
    },

    removeFromCart: (state, action) => {
      const courseId = action.payload;

      const index = state.cart.findIndex((item) => item._id === courseId);
      if (index === -1) {
        toast.error("Course not found in cart");
        return;
      }

      state.total -= state.cart[index].price;
      state.totalItems -= 1;
      state.cart.splice(index, 1);

      // Update localStorage
      localStorage.setItem("cart", JSON.stringify(state.cart));
      localStorage.setItem("total", JSON.stringify(state.total));
      localStorage.setItem("totalItems", JSON.stringify(state.totalItems));

      toast.success("Course removed from cart");
    },

    resetCart: (state) => {
      state.cart = [];
      state.total = 0;
      state.totalItems = 0;

      // Clear localStorage
      localStorage.removeItem("cart");
      localStorage.removeItem("total");
      localStorage.removeItem("totalItems");
    },
  },
});

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;

export default cartSlice.reducer;
