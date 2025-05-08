import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BankAccountList, MetaResponseProps } from "../../common";
import { Api } from "../../services/Api";

type BankAccountListResponseProps = {
  status: string;
  message: string;
  data: BankAccountList[];
  meta: MetaResponseProps;
};

type BankAccountListState = {
  data: BankAccountList[] | null;
  loading: boolean;
  error: string | null;
};

const initialState: BankAccountListState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for get charging station
export const fetchBankAccountList = createAsyncThunk(
  "fetchBankAccountList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get({
        url: "bank-accounts",
      });

      return res?.data as BankAccountList[];
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const bankAccountListSlice = createSlice({
  name: "bankAccountList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBankAccountList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBankAccountList.fulfilled,
        (state, action: PayloadAction<BankAccountList[]>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchBankAccountList.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export default bankAccountListSlice.reducer;
