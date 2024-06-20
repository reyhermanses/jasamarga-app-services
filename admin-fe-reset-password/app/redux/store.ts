"use client";

import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./features/counterSlice";
import authReducer from "./features/auth/authSlice";
import stepperReducer from "./features/stepperSlice";
import modalReducer from "./features/modalSlice";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    authenticate: authReducer,
    stepper: stepperReducer,
    modalRedux: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
