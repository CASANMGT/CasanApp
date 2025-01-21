import { createSlice } from "@reduxjs/toolkit";
import { SessionSettingProps } from "../../common";
import { fetchSessionSetting } from "../../services/request/sessionRequest";

const initialState: SessionSettingProps = {
  data: null,
  loading: false,
  error: null,
};

const sessionSettingsSlice = createSlice({
  name: "sessionSettings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessionSetting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessionSetting.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchSessionSetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default sessionSettingsSlice.reducer;
