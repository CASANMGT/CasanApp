import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { bodyListProps, DataUser, MetaResponseProps, Voucher } from "../../common";
import { Api } from "../../services/Api";



type VoucherListResponseProps = {
  status: string;
  message: string;
  data: Voucher[];
  meta: MetaResponseProps;
};

type VoucherListState = {
  data: VoucherListResponseProps | null;
  loading: boolean;
  error: string | null;
};

const initialState: VoucherListState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for get voucher list
export const fetchVoucherList = createAsyncThunk(
  "fetchVoucherList",
  async (params: bodyListProps, { rejectWithValue }) => {
    try {
      const res = await Api.get({
        url: "vouchers",
        params,
      });

      return res as VoucherListResponseProps;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const voucherListSlice = createSlice({
  name: "voucherList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVoucherList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchVoucherList.fulfilled,
        (state, action: PayloadAction<VoucherListResponseProps>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchVoucherList.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export default voucherListSlice.reducer;
