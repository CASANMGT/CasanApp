import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Api } from "../../services";

export type LoginRequest = {
  code: string;
  phone_number: string;
};

type LoginResponseProps = {
  token: string;
};

type AuthState = {
  data: LoginResponseProps | null;
  loading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for user login
export const fetchLogin = createAsyncThunk(
  "fetchLogin",
  async (body: LoginRequest) => {
    const res = await Api.post({
      url: "login",
      body,
    });

    return res?.data as LoginResponseProps;
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = null;
      localStorage.removeItem("token");
    },

    resetDataLogin: (state) => {
      state.data = null;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchLogin.fulfilled,
        (state, action: PayloadAction<LoginResponseProps>) => {
          state.loading = false;
          state.data = action.payload;
          localStorage.setItem("token", JSON.stringify(action.payload?.token));
        }
      )
      .addCase(fetchLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Login failed";
      });
  },
});

export const { logout, resetDataLogin } = loginSlice.actions;
export default loginSlice.reducer;
