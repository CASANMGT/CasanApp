import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Api } from "../../services";

type ChargingStationResponseProps = {
  status: string;
  message: string;
  data: ChargingStation[];
  meta: MetaResponseProps;
};

type ChargingStationState = {
  data: ChargingStationResponseProps | null;
  loading: boolean;
  error: string | null;
};

const initialState: ChargingStationState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for get charging station
export const fetchChargingStation = createAsyncThunk(
  "fetchChargingStation",
  async (params: ChargingStationBody, { rejectWithValue }) => {
    try {
      const res = await Api.get({
        url: "stations/locations",
        params,
      });

      return res as ChargingStationResponseProps;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const chargingStationSlice = createSlice({
  name: "chargingStation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChargingStation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchChargingStation.fulfilled,
        (state, action: PayloadAction<ChargingStationResponseProps>) => {
          const newData = action?.payload;

          if (
            action?.payload?.meta?.page > 1 &&
            state.data?.data &&
            state.data?.data.length
          ) {
            const groupingData = [
              ...state?.data?.data,
              ...action?.payload?.data,
            ];
            newData.data = groupingData;
          }

          state.loading = false;
          state.data = newData;
          state.error = null;
        }
      )
      .addCase(fetchChargingStation.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export default chargingStationSlice.reducer;
