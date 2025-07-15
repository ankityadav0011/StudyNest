import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  signupData: null,
  loading: false,
  token: localStorage.getItem("token") || null, // JWTs are plain strings, no need for JSON.parse()
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSignupData(state, action) {
      state.signupData = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem("token", action.payload); // Save token to localStorage on login
      } else {
        localStorage.removeItem("token"); // Remove token from localStorage on logout
      }
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;
export default authSlice.reducer;
