import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ResponseSuccess } from "../../common";
import { Api } from "../../services/Api";
import { omit } from "lodash";

export type EditUserRequestProps = {
  email: string;
  name: string;
  phone: string;
};

type EditUserState = {
  data: ResponseSuccess | null;
  loading: boolean;
  error: any | null;
};

const initialState: EditUserState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for edit user
export const fetchEditUser = createAsyncThunk(
  "fetchEditUser",
  async (body: EditUserRequestProps, { rejectWithValue }) => {
    try {
      const res = await Api.put({
        url: `users`,
        body,
      });

      return res as ResponseSuccess;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const editUserSlice = createSlice({
  name: "editUserList",
  initialState,
  reducers: {
    resetDataEditUser: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEditUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchEditUser.fulfilled,
        (state, action: PayloadAction<ResponseSuccess>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchEditUser.rejected, (state, action) => {
        console.log('cek action', action.payload);
        
        state.loading = false;
        state.data = null;
        state.error = action?.payload ?? "failed";
      });
  },
});

export const { resetDataEditUser } = editUserSlice.actions;
export default editUserSlice.reducer;
