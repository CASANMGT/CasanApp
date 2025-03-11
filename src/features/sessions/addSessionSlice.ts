import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Api } from "../../services/Api";
import { AddSessionBody, Session } from "../../common";

type AddSessionState = {
  data: Session | null;
  loading: boolean;
  error: string | null;
};

const initialState: AddSessionState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for add session
export const fetchAddSession = createAsyncThunk(
  "fetchAddSession",
  async (body: AddSessionBody, { rejectWithValue }) => {
    try {
      const res = await Api.post({
        url: "sessions/users",
        body,
      });

      return res?.data as Session;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const addSessionSlice = createSlice({
  name: "addSession",
  initialState,
  reducers: {
    resetDataAddSession: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAddSession.fulfilled,
        (state, action: PayloadAction<Session>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchAddSession.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export const { resetDataAddSession } = addSessionSlice.actions;
export default addSessionSlice.reducer;
