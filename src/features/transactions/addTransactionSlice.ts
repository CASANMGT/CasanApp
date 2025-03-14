import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AddTransactionBody, Session } from "../../common";
import { Api } from "../../services/Api";

type AddTransactionState = {
  data: Session | null;
  loading: boolean;
  error: string | null;
};

const initialState: AddTransactionState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for add session
export const fetchAddTransaction = createAsyncThunk(
  "fetchAddTransaction",
  async (body: AddTransactionBody, { rejectWithValue }) => {
    try {
      const res = await Api.post({
        url: "transactions",
        body,
      });

      return res?.data as Session;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const addTransactionSlice = createSlice({
  name: "addTransaction",
  initialState,
  reducers: {
    resetDataAddTransaction: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAddTransaction.fulfilled,
        (state, action: PayloadAction<Session>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchAddTransaction.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export const { resetDataAddTransaction } = addTransactionSlice.actions;
export default addTransactionSlice.reducer;
