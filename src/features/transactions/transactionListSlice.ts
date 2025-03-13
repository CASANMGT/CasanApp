import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  bodyListProps,
  DataTransaction,
  MetaResponseProps
} from "../../common";
import { Api } from "../../services/Api";

type TransactionListResponse = {
  status: string;
  message: string;
  data: DataTransaction[];
  meta: MetaResponseProps;
};

type TransactionListState = {
  data: TransactionListResponse | null;
  loading: boolean;
  error: string | null;
};

const initialState: TransactionListState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for get session list
export const fetchTransactionList = createAsyncThunk(
  "fetchTransactionList",
  async (params: bodyListProps, { rejectWithValue }) => {
    try {
      const res = await Api.get({
        url: "transactions",
        params,
      });

      return res as TransactionListResponse;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const transactionListSlice = createSlice({
  name: "transactionList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTransactionList.fulfilled,
        (state, action: PayloadAction<TransactionListResponse>) => {
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
      .addCase(fetchTransactionList.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export default transactionListSlice.reducer;
