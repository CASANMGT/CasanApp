import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResponseSuccess } from "../../common";
import { Api } from "../../services/Api";

type StopSessionState = {
  data: ResponseSuccess | null;
  loading: boolean;
  error: string | null;
};

const initialState: StopSessionState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for stop session
export const fetchStopSession = createAsyncThunk(
  "fetchStopSession",
  async (session_id: number, {rejectWithValue}) => {
    try {
    const res = await Api.post({
      url: "sessions/stop",
      body: { session_id },
    });

    return res as ResponseSuccess;

    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const stopSessionSlice = createSlice({
  name: "stopSession",
  initialState,
  reducers: {
    resetDataStopSession: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStopSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchStopSession.fulfilled,
        (state, action: PayloadAction<ResponseSuccess>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchStopSession.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);
        
        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export const { resetDataStopSession } = stopSessionSlice.actions;
export default stopSessionSlice.reducer;
