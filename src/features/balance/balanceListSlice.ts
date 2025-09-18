import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Balance } from "../../common";
import { Api } from "../../services/Api";

type BalanceListResponse = {
  status: string;
  message: string;
  data: Balance[];
  meta: MetaResponseProps;
};

type BalanceListState = {
  data: BalanceListResponse | null;
  loading: boolean;
  error: string | null;
};

const initialState: BalanceListState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for get session list
export const fetchBalanceList = createAsyncThunk(
  "fetchBalanceList",
  async (params: bodyListProps, { rejectWithValue }) => {
    try {
      const res = await Api.get({
        url: "users/balance-history",
        params,
      });

      return res as BalanceListResponse;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const balanceListSlice = createSlice({
  name: "balanceList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBalanceList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchBalanceList.fulfilled,
        (state, action: PayloadAction<BalanceListResponse>) => {
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
      .addCase(fetchBalanceList.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error?.message ?? "failed";
      });
  },
});

export default balanceListSlice.reducer;
