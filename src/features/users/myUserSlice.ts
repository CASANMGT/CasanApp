import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Api } from "../../services/jel";

export type MyUserResponse = {
  ID: number;
  Name: string;
  Phone: string;
  IsVerified: boolean;
  Email: string | null;
  Balance: number;
  Status: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
};

type MyUserState = {
  data: MyUserResponse | null;
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

      return res?.data as MyUserResponse;
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
        (state, action: PayloadAction<MyUserResponse>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchMyUser.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export default myUserSlice.reducer;
