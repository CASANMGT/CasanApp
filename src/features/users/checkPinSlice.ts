import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Api } from "../../services/Api";
import { DataUser } from "../../common";

type ResponseCheckPin = {
  data: { is_match: boolean; user: DataUser };
  message: string;
  status: string;
};

type CheckPinState = {
  data: ResponseCheckPin | null;
  loading: boolean;
  error: any | null;
};

const initialState: CheckPinState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for check pin
export const fetchCheckPin = createAsyncThunk(
  "fetchCheckPin",
  async (pin: string, { rejectWithValue }) => {
    try {
      const res = await Api.post({
        url: `users/pin/check`,
        body: { pin },
      });

      return res as ResponseCheckPin;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const checkPinSlice = createSlice({
  name: "checkPinSlice",
  initialState,
  reducers: {
    resetDataCheckPin: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCheckPin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCheckPin.fulfilled,
        (state, action: PayloadAction<ResponseCheckPin>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchCheckPin.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = action?.payload ?? "failed";
      });
  },
});

export const { resetDataCheckPin } = checkPinSlice.actions;
export default checkPinSlice.reducer;
