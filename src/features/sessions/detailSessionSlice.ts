import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Session } from "../../common";
import { Api } from "../../services/jel";

type DetailSessionState = {
  data: Session | null;
  loading: boolean;
  error: string | null;
};

const initialState: DetailSessionState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for get session by id
export const fetchDetailSession = createAsyncThunk(
  "fetchDetailSession",
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await Api.get({
        url: `sessions/${id}`,
      });

      return res?.data as Session;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const detailSessionSlice = createSlice({
  name: "detailSession",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDetailSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDetailSession.fulfilled,
        (state, action: PayloadAction<Session>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchDetailSession.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export default detailSessionSlice.reducer;
