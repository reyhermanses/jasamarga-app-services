import { createSlice } from "@reduxjs/toolkit";

const headerSlice = createSlice({
  name: 'header',
  initialState: {
    dashboard: false,
    monitoring: false,
    information: false,
    leader: false
  },
  reducers: {
    inHome: (state) => {
      state.dashboard = true;
      state.monitoring = false;
      state.information = false;
      state.leader = false;
    },
    inMonitoring: (state) => {
      state.dashboard = false;
      state.monitoring = true;
      state.information = false;
      state.leader = false;
    },
    inInformation: (state) => {
      state.dashboard = false;
      state.monitoring = false;
      state.information = true;
      state.leader = false;
    },
    inLeader: (state) => {
      state.dashboard = false;
      state.monitoring = false;
      state.information = false;
      state.leader = true;
    },
    clearAll: (state) => {
      state.dashboard = false;
      state.monitoring = false;
      state.information = false;
      state.leader = false;
    }
  }
})

export const { inHome, inMonitoring, inInformation, inLeader, clearAll } = headerSlice.actions;
export default headerSlice.reducer;