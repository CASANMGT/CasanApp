import { createSlice } from "@reduxjs/toolkit";
import { chargingSessionProps } from "../../common";
import { fetchChargingSession } from "../../services/request/chargingRequest";

const initialState: chargingSessionProps = {
  data: null,
  loading: false,
  error: null,
};

const chargingSessionSlice = createSlice({
  name: "chargingSession",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChargingSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChargingSession.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchChargingSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default chargingSessionSlice.reducer;
