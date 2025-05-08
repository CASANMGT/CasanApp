import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AddBankAccountBody, ResponseSuccess } from "../../common";
import { Api } from "../../services/Api";

type AddBankAccountState = {
  data: ResponseSuccess | null;
  loading: boolean;
  error: string | null;
};

const initialState: AddBankAccountState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for add bank account
export const fetchAddBankAccount = createAsyncThunk(
  "fetchAddBankAccount",
  async (body: AddBankAccountBody, { rejectWithValue }) => {
    try {
      const res = await Api.post({
        url: "bank-accounts",
        body,
      });

      return res as ResponseSuccess;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const addBankAccountSlice = createSlice({
  name: "addBankAccount",
  initialState,
  reducers: {
    resetDataAddBankAccount: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddBankAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAddBankAccount.fulfilled,
        (state, action: PayloadAction<ResponseSuccess>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchAddBankAccount.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export const { resetDataAddBankAccount } = addBankAccountSlice.actions;
export default addBankAccountSlice.reducer;
