import { configureStore } from "@reduxjs/toolkit";

import globalReducer from "../features/globalSlice";
import toastReducer from "../features/toastSlice";
import sessionSettingReducer from "../redux/session/sessionSettingsSlice";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    toast: toastReducer,

    // SESSION
    sessionSetting: sessionSettingReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
