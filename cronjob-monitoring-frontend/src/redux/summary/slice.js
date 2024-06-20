import { createSlice } from "@reduxjs/toolkit";

const summarySlice = createSlice({
  name: 'summary',
  initialState: {
    status: null,
    code: null,
    data: {}
  },
  reducers: {
    fetchDataSuccess: (state, { payload }) => {
      state.status = payload.status;
      state.code = payload.code;
      state.data = payload.data;
    }
  }
})

export const { fetchDataSuccess } = summarySlice.actions;
export default summarySlice.reducer;