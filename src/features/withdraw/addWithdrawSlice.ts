import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AddWithdrawBody, ResponseSuccess } from "../../common";
import { Api } from "../../services/Api";

type AddWithdrawState = {
  data: ResponseSuccess | null;
  loading: boolean;
  error: string | null;
};

const initialState: AddWithdrawState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for add withdraw
export const fetchAddWithdraw = createAsyncThunk(
  "fetchAddWithdraw",
  async (body: AddWithdrawBody, { rejectWithValue }) => {
    try {
      const res = await Api.post({
        url: "withdraw-requests",
        body,
      });

      return res as ResponseSuccess;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const addWithdrawSlice = createSlice({
  name: "addWithdraw",
  initialState,
  reducers: {
    resetDataAddWithdraw: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddWithdraw.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAddWithdraw.fulfilled,
        (state, action: PayloadAction<ResponseSuccess>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchAddWithdraw.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export const { resetDataAddWithdraw } = addWithdrawSlice.actions;
export default addWithdrawSlice.reducer;
