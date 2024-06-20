"use client";

import { createSlice } from "@reduxjs/toolkit";
import { SetStateAction } from "react";

export interface ModalState {
  modalOpened: boolean;
  modalOnClosed: any;
  modalCloseOnClickOutside: Boolean;
  size: string | number;
  title: string;
  child: any;
}

const initialState: ModalState = {
  modalOpened: false,
  modalOnClosed: null,
  modalCloseOnClickOutside: false,
  size: "",
  title: "",
  child: null,
};

export const modalSlice = createSlice({
  name: "modalRedux",
  initialState,
  reducers: {
    fnModalOpened: (state, event) => {
      state.modalOpened = !event.payload;
    },
    fnModalOnClosed: (state) => {
      // state.modalOnClosed = event.payload;
      state.modalOpened = false;
      state.modalOnClosed = null;
      state.modalCloseOnClickOutside = false;
      state.size = "";
      state.title = "";
      state.child = null;
    },
    fnModalCloseOnClickOutside: (state, event) => {
      state.modalOpened = false;
      state.modalOnClosed = null;
      state.modalCloseOnClickOutside = false;
      state.size = "";
      state.title = "";
      state.child = null;
    },
    fnSize: (state, event) => {
      state.size = event.payload;
    },
    fnTitle: (state, event) => {
      state.title = event.payload;
    },
    fnChild: (state, event) => {
      state.child = event.payload;
    },
  },
});

export const {
  fnModalOpened,
  fnModalOnClosed,
  fnModalCloseOnClickOutside,
  fnSize,
  fnTitle,
  fnChild,
} = modalSlice.actions;

export default modalSlice.reducer;
