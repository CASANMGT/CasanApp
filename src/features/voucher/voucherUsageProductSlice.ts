import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { bodyListProps, DataUser, MetaResponseProps, Voucher, VoucherUsage } from "../../common";
import { Api } from "../../services/Api";



type VoucherUsageProductResponseProps = {
  status: string;
  message: string;
  data: VoucherUsage[];
  meta: MetaResponseProps;
};

type VoucherUsageProductState = {
  data: VoucherUsageProductResponseProps | null;
  loading: boolean;
  error: string | null;
};

const initialState: VoucherUsageProductState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for get voucher list
export const fetchVoucherUsageProduct = createAsyncThunk(
  "fetchVoucherUsageProduct",
  async (params: bodyListProps, { rejectWithValue }) => {
    try {
      const res = await Api.get({
        url: "vouchers/usage/products",
        params,
      });

      return res as VoucherUsageProductResponseProps;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const voucherUsageProductSlice = createSlice({
  name: "voucherUsageProduct",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVoucherUsageProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchVoucherUsageProduct.fulfilled,
        (state, action: PayloadAction<VoucherUsageProductResponseProps>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchVoucherUsageProduct.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export default voucherUsageProductSlice.reducer;
