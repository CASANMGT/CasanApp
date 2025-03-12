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
import finishSessionListReducer from "../features/sessions/finishSessionListSlice.ts";
import onGoingSessionListReducer from "../features/sessions/onGoingSessionListSlice.ts";
import startSessionReducer from "../features/sessions/startSessionSlice.ts";
import stopSessionReducer from "../features/sessions/stopSessionSlice.ts";
import toastReducer from "../features/toastSlice";
import myUserReducer from "../features/users/myUserSlice.ts";

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

    // PRICE RULE
    calculateCharge: calculateChargeReducer,
    calculateDuration: calculateDurationReducer,

    // FEE SETTINGS
    feeSettings: feeSettingsReducer,

    // SESSION:
    onGoingSessionList: onGoingSessionListReducer,
    finishSessionList: finishSessionListReducer,
    addSession: addSessionReducer,
    detailSession: detailSessionReducer,
    cancelSession: cancelSessionReducer,
    startSession: startSessionReducer,
    stopSession: stopSessionReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
