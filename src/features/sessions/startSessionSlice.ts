import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResponseSuccess } from "../../common";
import { Api } from "../../services/Api";

type StartSessionState = {
  data: ResponseSuccess | null;
  loading: boolean;
  error: string | null;
};

const initialState: StartSessionState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for start session
export const fetchStartSession = createAsyncThunk(
  "fetchStartSession",
  async (session_id: number, { rejectWithValue }) => {
    try {
      const res = await Api.post({
        url: "sessions/start",
        body: { session_id },
      });

      return res as ResponseSuccess;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const startSessionSlice = createSlice({
  name: "startSession",
  initialState,
  reducers: {
    resetDataStartSession: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStartSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchStartSession.fulfilled,
        (state, action: PayloadAction<ResponseSuccess>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchStartSession.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export const { resetDataStartSession } = startSessionSlice.actions;
export default startSessionSlice.reducer;
