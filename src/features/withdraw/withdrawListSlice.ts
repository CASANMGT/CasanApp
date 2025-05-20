import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { bodyListProps, MetaResponseProps, WithdrawList } from "../../common";
import { Api } from "../../services/Api";

type WithdrawListResponseProps = {
  status: string;
  message: string;
  data: WithdrawList[];
  meta: MetaResponseProps;
};

type WithdrawListState = {
  data: WithdrawListResponseProps | null;
  loading: boolean;
  error: string | null;
};

const initialState: WithdrawListState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for get withdraw list
export const fetchWithdrawList = createAsyncThunk(
  "fetchWithdrawList",
  async (params: bodyListProps, { rejectWithValue }) => {
    try {
      const res = await Api.get({
        url: "withdraw-requests",
        params,
      });

      return res as WithdrawListResponseProps;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const withdrawListSlice = createSlice({
  name: "withdrawList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWithdrawList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWithdrawList.fulfilled,
        (state, action: PayloadAction<WithdrawListResponseProps>) => {
          state.loading = false;
          state.data = action?.payload;
          state.error = null;
        }
      )
      .addCase(fetchWithdrawList.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export default withdrawListSlice.reducer;
