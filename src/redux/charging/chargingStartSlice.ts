import { createSlice } from "@reduxjs/toolkit";
import { chargingStartProps } from "../../common";
import { fetchChargingStart } from "../../services/request/chargingRequest";

const initialState: chargingStartProps = {
  data: null,
  loading: false,
  error: null,
};

const chargingStartSlice = createSlice({
  name: "chargingStart",
  initialState,
  reducers: {
    resetDataChargingStart: (state) => {
      state.data = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChargingStart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChargingStart.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchChargingStart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetDataChargingStart } = chargingStartSlice.actions;
export default chargingStartSlice.reducer;
