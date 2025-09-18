import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Api } from "../../services/Api";

type DeleteBankAccountState = {
  data: ResponseSuccess | null;
  loading: boolean;
  error: string | null;
};

const initialState: DeleteBankAccountState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for delete charging station
export const fetchDeleteBankAccount = createAsyncThunk(
  "fetchDeleteBankAccount",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await Api.delete({
        url: `bank-accounts/${id}`,
      });

      return res as ResponseSuccess;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const deleteBankAccountSlice = createSlice({
  name: "deleteBankAccount",
  initialState,
  reducers: {
    resetDataDeleteBankAccount: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeleteBankAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDeleteBankAccount.fulfilled,
        (state, action: PayloadAction<ResponseSuccess>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchDeleteBankAccount.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);
        
        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export const { resetDataDeleteBankAccount } =
  deleteBankAccountSlice.actions;
export default deleteBankAccountSlice.reducer;
