import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Transaction } from "../../common";
import { Api } from "../../services/Api";

type TransactionByIdState = {
  data: Transaction | null;
  loading: boolean;
  error: string | null;
};

const initialState: TransactionByIdState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for get transaction by id
export const fetchTransactionById = createAsyncThunk(
  "fetchTransactionById",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await Api.get({
        url: `transactions/${id}`,
      });

      return res?.data as Transaction;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const transactionByIdSlice = createSlice({
  name: "transactionById",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTransactionById.fulfilled,
        (state, action: PayloadAction<Transaction>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchTransactionById.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export default transactionByIdSlice.reducer;
