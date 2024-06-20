"use client";

import { createSlice } from "@reduxjs/toolkit";
import { useRouter } from "next/router";

export interface AuthState {
  value: boolean;
}

const initialState: AuthState = {
  value: false,
};

export const AuthSlice = createSlice({
  name: "authencticate",
  initialState,
  reducers: {
    setAuthSession: (state, event) => {
      localStorage.setItem("auth", event.payload);
      state.value = event.payload;
    },
    unSetAuthSession: (state) => {
      state.value = false;
    },
  },
});

export const { setAuthSession, unSetAuthSession } = AuthSlice.actions;

export default AuthSlice.reducer;
