// src/features/toast/toastSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

interface ToastState {
  message: string | null;
}

const initialState: ToastState = {
  message: null,
};

const toastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<string>) => {
      state.message = action.payload;
      toast.success(action.payload); // Show toast when action is dispatched
    },
    clearToast: (state) => {
      state.message = null;
    },
  },
});

export const { showToast, clearToast } = toastSlice.actions;
export default toastSlice.reducer;
