import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ChargingStation,
  ChargingStationBody,
} from "../../common";
import { Api } from "../../services/Api";

type ChargingStationLocationsResponseProps = {
  status: string;
  message: string;
  data: ChargingStation[];
  meta: MetaResponseProps;
};

type ChargingStationLocationsState = {
  data: ChargingStationLocationsResponseProps | null;
  loading: boolean;
  error: string | null;
};

const initialState: ChargingStationLocationsState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for get charging station
export const fetchChargingStationLocations = createAsyncThunk(
  "fetchChargingStationLocations",
  async (params: ChargingStationBody, { rejectWithValue }) => {
    try {
      const res = await Api.get({
        url: "stations",
        params,
      });

      return res as ChargingStationLocationsResponseProps;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const chargingStationLocationsSlice = createSlice({
  name: "chargingStationLocations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChargingStationLocations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchChargingStationLocations.fulfilled,
        (
          state,
          action: PayloadAction<ChargingStationLocationsResponseProps>
        ) => {
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
      .addCase(fetchChargingStationLocations.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export default chargingStationLocationsSlice.reducer;
