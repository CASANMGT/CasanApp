import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DataUser } from "../../common";
import { Api } from "../../services/Api";

type MyUserState = {
  data: DataUser | null;
  loading: boolean;
  error: string | null;
};

const initialState: MyUserState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for get user by id
export const fetchMyUser = createAsyncThunk(
  "fetchMyUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get({
        url: `users/me`,
      });

      return res?.data as DataUser;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const myUserSlice = createSlice({
  name: "myUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMyUser.fulfilled,
        (state, action: PayloadAction<DataUser>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchMyUser.rejected, (state, action) => {
        const dataError: any = action?.payload;

        state.loading = false;
        state.data = null;
        state.error = dataError?.message || "";
      });
  },
});

export default myUserSlice.reducer;
