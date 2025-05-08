import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ValidateBankBody,
  ValidateBankResponse
} from "../../common";
import { Api } from "../../services/Api";

type ValidateBankState = {
  data: ValidateBankResponse | null;
  loading: boolean;
  error: string | null;
};

const initialState: ValidateBankState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for validate bank account
export const fetchValidateBank = createAsyncThunk(
  "fetchValidateBank",
  async (body: ValidateBankBody, { rejectWithValue }) => {
    try {
      const res = await Api.post({
        url: "bank-accounts/validate",
        body,
      });

      return res?.data as ValidateBankResponse;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const validateBankSlice = createSlice({
  name: "validateBank",
  initialState,
  reducers: {
    resetDataValidateBank: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchValidateBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchValidateBank.fulfilled,
        (state, action: PayloadAction<ValidateBankResponse>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchValidateBank.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export const { resetDataValidateBank } = validateBankSlice.actions;
export default validateBankSlice.reducer;
