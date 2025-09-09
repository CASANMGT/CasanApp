import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Voucher } from "../../common";
import { Api } from "../../services/Api";

type VoucherAvailableResponseProps = {
  status: string;
  message: string;
  data: Voucher[];
  meta: MetaResponseProps;
};

type VoucherAvailableState = {
  data: VoucherAvailableResponseProps | null;
  loading: boolean;
  error: string | null;
};

const initialState: VoucherAvailableState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for get voucher list
export const fetchVoucherAvailable = createAsyncThunk(
  "fetchVoucherAvailable",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get({
        url: "vouchers/available",
      });

      return res as VoucherAvailableResponseProps;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const voucherAvailableSlice = createSlice({
  name: "voucherAvailable",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVoucherAvailable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchVoucherAvailable.fulfilled,
        (state, action: PayloadAction<VoucherAvailableResponseProps>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchVoucherAvailable.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export default voucherAvailableSlice.reducer;
