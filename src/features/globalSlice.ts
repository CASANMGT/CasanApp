import { createSlice } from "@reduxjs/toolkit";
import { globalProps } from "../common";

export interface CounterState {
  value: number;
}

const initialState: globalProps = {
  loading: false,
};

const counterSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    showLoading: (state) => {
      state.loading = true;
    },
    hideLoading: (state) => {
      state.loading = false;
    },
  },
});

export const { showLoading, hideLoading } = counterSlice.actions;
export default counterSlice.reducer;
