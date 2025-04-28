import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResponseSuccess } from "../../common";
import { Api } from "../../services/Api";

type EditPinState = {
  data: ResponseSuccess | null;
  loading: boolean;
  error: any | null;
};

const initialState: EditPinState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for edit pin
export const fetchEditPin = createAsyncThunk(
  "fetchEditPin",
  async (pin: string, { rejectWithValue }) => {
    try {
      const res = await Api.put({
        url: `users/pin`,
        body: { pin },
      });

      return res as ResponseSuccess;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const editPinSlice = createSlice({
  name: "editPinSlice",
  initialState,
  reducers: {
    resetDataEditPin: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEditPin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchEditPin.fulfilled,
        (state, action: PayloadAction<ResponseSuccess>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchEditPin.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        state.error = action?.payload ?? "failed";
      });
  },
});

export const { resetDataEditPin } = editPinSlice.actions;
export default editPinSlice.reducer;
