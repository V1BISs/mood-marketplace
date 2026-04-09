import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuth: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuth = true;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      console.log('=== LOGOUT ВЫЗВАН ===')
      state.user = null;
      state.isAuth = false;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }, 
    setError: (state, action) => {
        state.error = action.payload
        state.loading = false
    }
  },
});

export const { setUser, logout, setLoading, setError } = authSlice.actions
export default authSlice.reducer
