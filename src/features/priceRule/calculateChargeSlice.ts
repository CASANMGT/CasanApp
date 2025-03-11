import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Api } from "../../services/jel";
import { CalculateChargeBody } from "../../common";

type CalculateChargeState = {
  data: number | null;
  loading: boolean;
  error: string | null;
};

const initialState: CalculateChargeState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for calculation charge
export const fetchCalculateCharge = createAsyncThunk(
  "fetchCalculateCharge",
  async (body: CalculateChargeBody, { rejectWithValue }) => {
    try {
      const res = await Api.post({
        url: "price-settings/calculate-charge",
        body,
      });

      return res?.data?.charge as number;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const calculateChargeSlice = createSlice({
  name: "calculateCharge",
  initialState,
  reducers: {
    resetDataCalculateCharge: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalculateCharge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCalculateCharge.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchCalculateCharge.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export const { resetDataCalculateCharge } = calculateChargeSlice.actions;
export default calculateChargeSlice.reducer;
