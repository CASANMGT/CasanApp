import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Location } from "../../common";
import { Api } from "../../services/Api";

type LocationByIdResponse = {
  status: string;
  message: string;
  data: Location;
  meta: MetaResponseProps;
};

type LocationByIdState = {
  data: LocationByIdResponse | null;
  loading: boolean;
  error: string | null;
};

const initialState: LocationByIdState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for get session list
export const fetchLocationById = createAsyncThunk(
  "fetchLocationById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await Api.get({
        url: `locations/${id}`,
      });

      return res as LocationByIdResponse;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const locationByIdSlice = createSlice({
  name: "locationById",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchLocationById.fulfilled,
        (state, action: PayloadAction<LocationByIdResponse>) => {
          state.loading = false;
          state.data = action?.payload;
          state.error = null;
        }
      )
      .addCase(fetchLocationById.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error?.message ?? "failed";
      });
  },
});

export default locationByIdSlice.reducer;
