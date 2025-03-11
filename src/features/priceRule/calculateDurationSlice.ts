import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CalculateDurationBody } from "../../common";
import { Api } from "../../services/Api";

type CalculateDurationState = {
  data: number | null;
  loading: boolean;
  error: string | null;
};

const initialState: CalculateDurationState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for calculation duration
export const fetchCalculateDuration = createAsyncThunk(
  "fetchCalculateDuration",
  async (body: CalculateDurationBody, { rejectWithValue }) => {
    try {
      const res = await Api.post({
        url: "price-settings/calculate-duration",
        body,
      });

      return res?.data?.duration as number;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const calculateDurationSlice = createSlice({
  name: "calculateDuration",
  initialState,
  reducers: {
    resetDataCalculateDuration: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalculateDuration.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCalculateDuration.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchCalculateDuration.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export const { resetDataCalculateDuration } = calculateDurationSlice.actions;
export default calculateDurationSlice.reducer;
