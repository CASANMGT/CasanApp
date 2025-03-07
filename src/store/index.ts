import { configureStore } from "@reduxjs/toolkit";

import loginReducer from "../features/auth/loginSlice";
import chargingStationReducer from "../features/chargingStations/chargingStationSlice";
import feeSettingsReducer from "../features/feeSettings/feeSettingsSlice";
import globalReducer from "../features/globalSlice";
import calculateChargeReducer from "../features/priceRule/calculateChargeSlice";
import calculateDurationReducer from "../features/priceRule/calculateDurationSlice";
import toastReducer from "../features/toastSlice";
import chargingSessionReducer from "../redux/charging/chargingSessionSlice";
import chargingStartReducer from "../redux/charging/chargingStartSlice";
import formChargingReducer from "../redux/charging/formChargingSlice";
import sessionSettingReducer from "../redux/session/sessionSettingsSlice";
import myUserReducer from "../features/users/myUserSlice.ts";
import addSessionReducer from "../features/sessions/addSessionSlice.ts";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    toast: toastReducer,

    // AUTH
    login: loginReducer,

    // USER
    myUser: myUserReducer,

    // CHARGING STATION
    chargingStation: chargingStationReducer,

    // SESSION
    sessionSetting: sessionSettingReducer,

    // CHARGING
    formCharging: formChargingReducer,
    chargingStart: chargingStartReducer,
    chargingSession: chargingSessionReducer,

    // PRICE RULE
    calculateCharge: calculateChargeReducer,
    calculateDuration: calculateDurationReducer,

    // FEE SETTINGS
    feeSettings: feeSettingsReducer,

    // SESSION:
    addSession: addSessionReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
