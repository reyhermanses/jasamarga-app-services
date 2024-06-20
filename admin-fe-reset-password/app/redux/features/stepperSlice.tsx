"use client";

import { createSlice } from "@reduxjs/toolkit";
import { SetStateAction } from "react";

export interface StepperState {
  datas: any;
  current: number;
  setActive: SetStateAction<number>;
}

const initialState: StepperState = {
  datas: [],
  current: 0,
  setActive: 0,
};

export const stepperSlice = createSlice({
  name: "stepper",
  initialState,
  reducers: {
    nextStep: (state) => {
      state.current = state.current < 2 ? state.current + 1 : state.current;
    },
    previousStep: (state) => {
      state.current = state.current > 0 ? state.current - 1 : state.current;
    },
    setActive: (state, event) => {
      state.setActive = state.current;
    },
    reset: (state) => {
      state.current = 0;
      state.datas = [];
    },
    dataStepper: (state, event) => {
      state.datas = event.payload;
    },
  },
});

export const { nextStep, previousStep, setActive, reset, dataStepper } =
  stepperSlice.actions;

export default stepperSlice.reducer;
