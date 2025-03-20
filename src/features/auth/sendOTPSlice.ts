import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Api } from "../../services";

type SendOTPState = {
  data: string | null;
  token: string | null;
  loading: boolean;
  error: string | null;
};

const initialState: SendOTPState = {
  data: null,
  token: null,
  loading: false,
  error: null,
};

// Async thunk for user sendOTP
export const fetchSendOTP = createAsyncThunk(
  "fetchSendOTP",
  async (phone_number: string, { rejectWithValue }) => {
    try {
      const res = await Api.post({
        url: "send-otp",
        body: { phone_number },
      });

      return res?.data as string;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const sendOTPSlice = createSlice({
  name: "sendOTP",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSendOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSendOTP.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchSendOTP.rejected, (state, action) => {
        const dataError: any = action?.payload;
        state.loading = false;
        state.error = dataError.message ?? "SendOTP failed";
      });
  },
});

export default sendOTPSlice.reducer;
