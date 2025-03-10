import { configureStore } from "@reduxjs/toolkit";

import loginReducer from "../features/auth/loginSlice";
import chargingStationReducer from "../features/chargingStations/chargingStationSlice";
import feeSettingsReducer from "../features/feeSettings/feeSettingsSlice";
import globalReducer from "../features/globalSlice";
import calculateChargeReducer from "../features/priceRule/calculateChargeSlice";
import calculateDurationReducer from "../features/priceRule/calculateDurationSlice";
import addSessionReducer from "../features/sessions/addSessionSlice.ts";
import cancelSessionReducer from "../features/sessions/cancelSessionSlice.ts";
import detailSessionReducer from "../features/sessions/detailSessionSlice.ts";
import toastReducer from "../features/toastSlice";
import myUserReducer from "../features/users/myUserSlice.ts";
import chargingSessionReducer from "../redux/charging/chargingSessionSlice";
import formChargingReducer from "../redux/charging/formChargingSlice";
import sessionSettingReducer from "../redux/session/sessionSettingsSlice";

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
    chargingSession: chargingSessionReducer,

    // PRICE RULE
    calculateCharge: calculateChargeReducer,
    calculateDuration: calculateDurationReducer,

    // FEE SETTINGS
    feeSettings: feeSettingsReducer,

    // SESSION:
    addSession: addSessionReducer,
    detailSession: detailSessionReducer,
    cancelSession: cancelSessionReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
