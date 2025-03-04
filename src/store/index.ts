import { configureStore } from "@reduxjs/toolkit";

import globalReducer from "../features/globalSlice";
import toastReducer from "../features/toastSlice";
import chargingSessionReducer from "../redux/charging/chargingSessionSlice";
import chargingStartReducer from "../redux/charging/chargingStartSlice";
import formChargingReducer from "../redux/charging/formChargingSlice";
import sessionSettingReducer from "../redux/session/sessionSettingsSlice";
import loginReducer from "../features/auth/loginSlice";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    toast: toastReducer,

    // AUTH
    login: loginReducer,

    // SESSION
    sessionSetting: sessionSettingReducer,

    // CHARGING
    formCharging: formChargingReducer,
    chargingStart: chargingStartReducer,
    chargingSession: chargingSessionReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
