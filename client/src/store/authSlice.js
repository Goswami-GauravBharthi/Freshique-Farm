import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: null,
    isLogin: null,
    isLoading:true,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoading=false;
    },
    setIsLoading: (state, action) => {
      state.isLoading = false;
    },
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setLogout: (state) => {
      state.user = false;
      state.isLogin = false;
    },
  },
});

export const { setUser, setLogout, setIsLogin, setIsLoading } = authSlice.actions;
export default authSlice.reducer;
