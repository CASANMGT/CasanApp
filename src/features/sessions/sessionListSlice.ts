import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { bodyListProps, MetaResponseProps, Session } from "../../common";
import { Api } from "../../services/Api";

type SessionListResponseProps = {
  status: string;
  message: string;
  data: Session[];
  meta: MetaResponseProps;
};

type SessionListState = {
  data: SessionListResponseProps | null;
  loading: boolean;
  error: string | null;
};

const initialState: SessionListState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for get session list
export const fetchSessionList = createAsyncThunk(
  "fetchSessionList",
  async (params: bodyListProps, { rejectWithValue }) => {
    try {
      const res = await Api.get({
        url: "sessions",
        params,
      });

      return res as SessionListResponseProps;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const sessionListSlice = createSlice({
  name: "sessionList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessionList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSessionList.fulfilled,
        (state, action: PayloadAction<SessionListResponseProps>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchSessionList.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export default sessionListSlice.reducer;
