import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SessionListBody, SessionListResponse } from "../../common";
import { Api } from "../../services/Api";

type OnGoingSessionListState = {
  data: SessionListResponse | null;
  loading: boolean;
  error: string | null;
};

const initialState: OnGoingSessionListState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for get session list
export const fetchOnGoingSessionList = createAsyncThunk(
  "fetchOnGoingSessionList",
  async (params: SessionListBody, { rejectWithValue }) => {
    try {
      const res = await Api.get({
        url: "sessions",
        params,
      });

      return res as SessionListResponse;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const onGoingSessionListSlice = createSlice({
  name: "onGoingSessionList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOnGoingSessionList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOnGoingSessionList.fulfilled,
        (state, action: PayloadAction<SessionListResponse>) => {
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
      .addCase(fetchOnGoingSessionList.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export default onGoingSessionListSlice.reducer;
