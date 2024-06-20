import { configureStore } from "@reduxjs/toolkit";

import summarySlice from './summary/slice'
import headerSlice from "./header/slice";

const store = configureStore({
  reducer: {
    summary: summarySlice,
    header: headerSlice
  },
});

export default store;