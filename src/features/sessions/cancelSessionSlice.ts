import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResponseSuccess } from "../../common";
import { Api } from "../../services/Api";

type CancelSessionState = {
  data: ResponseSuccess | null;
  loading: boolean;
  error: string | null;
};

const initialState: CancelSessionState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for cancel session
export const fetchCancelSession = createAsyncThunk(
  "fetchCancelSession",
  async (session_id: number, { rejectWithValue }) => {
    try {
      const res = await Api.get({
        url: `sessions/${session_id}/cancel`,
      });

      return res?.data as ResponseSuccess;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const cancelSessionSlice = createSlice({
  name: "cancelSession",
  initialState,
  reducers: {
    resetDataCancelSession: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCancelSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCancelSession.fulfilled,
        (state, action: PayloadAction<ResponseSuccess>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchCancelSession.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);
        
        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export const { resetDataCancelSession } = cancelSessionSlice.actions;
export default cancelSessionSlice.reducer;
