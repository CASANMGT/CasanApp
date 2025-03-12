import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SessionListBody, SessionListResponse } from "../../common";
import { Api } from "../../services/Api";

type FinishSessionListState = {
  data: SessionListResponse | null;
  loading: boolean;
  error: string | null;
};

const initialState: FinishSessionListState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for get session list
export const fetchFinishSessionList = createAsyncThunk(
  "fetchFinishSessionList",
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

const finishSessionListSlice = createSlice({
  name: "finishSessionList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFinishSessionList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchFinishSessionList.fulfilled,
        (state, action: PayloadAction<SessionListResponse>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchFinishSessionList.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export default finishSessionListSlice.reducer;
