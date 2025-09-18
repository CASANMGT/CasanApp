import { createSlice } from "@reduxjs/toolkit";

const initialState: initialStateFormProps = {
  loading: false,
  data: null,
};

const counterSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    showLoading: (state) => {
      state.loading = true;
    },
    hideLoading: (state) => {
      state.loading = false;
    },

    setFromGlobal: (state, { payload }) => {
      if (payload?.type !== undefined && payload?.value !== undefined) {
        state[payload?.type] = payload.value;

        if (payload?.data) state.data = payload?.data;
      }
    },
  },
});

export const { showLoading, hideLoading, setFromGlobal } = counterSlice.actions;
export default counterSlice.reducer;
