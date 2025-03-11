import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Api } from "../../services/jel";

export type FeeSettingsResponseProps = {
  Code: string;
  Name: string;
  IsPercentage: boolean;
  Value: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
};

type FeeSettingsState = {
  data: FeeSettingsResponseProps[] | null;
  loading: boolean;
  error: string | null;
};

const initialState: FeeSettingsState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for get fee settings
export const fetchFeeSettings = createAsyncThunk(
  "fetchFeeSettings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get({
        url: "fee-settings",
        params: {},
      });

      return res?.data as FeeSettingsResponseProps[];
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const feeSettingsSlice = createSlice({
  name: "feeSettings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFeeSettings.fulfilled,
        (state, action: PayloadAction<FeeSettingsResponseProps[]>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchFeeSettings.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export default feeSettingsSlice.reducer;
