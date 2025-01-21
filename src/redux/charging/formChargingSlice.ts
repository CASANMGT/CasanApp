import { createSlice } from "@reduxjs/toolkit";
import { initialStateFormChargingProps } from "../../common";

const initialState: initialStateFormChargingProps = {
  formData: null,
  data: null,
};

const formChargingSlice = createSlice({
  name: "formCharging",
  initialState,
  reducers: {
    setFormCharging: (state, { payload }) => {
      if (payload?.type !== undefined && payload?.value !== undefined) {
        state[payload?.type] = payload.value;

        if (payload?.data) state.data = payload?.data;
      }
    },
  },
});

export const { setFormCharging } = formChargingSlice.actions;

export default formChargingSlice.reducer;
