import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Api } from "../../services/Api";

type ChargingStationByIdState = {
  data: ChargingStation | null;
  loading: boolean;
  error: string | null;
};

const initialState: ChargingStationByIdState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for get charging station by id
export const fetchChargingStationById = createAsyncThunk(
  "fetchChargingStationById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await Api.get({
        url: `stations/${id}`,
      });

      return res?.data as ChargingStation;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const chargingStationByIdSlice = createSlice({
  name: "chargingStationById",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChargingStationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchChargingStationById.fulfilled,
        (state, action: PayloadAction<ChargingStation>) => {
          state.loading = false;
          state.data = action?.payload;
          state.error = null;
        }
      )
      .addCase(fetchChargingStationById.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = action.error?.message ?? "failed";
      });
  },
});

export default chargingStationByIdSlice.reducer;
