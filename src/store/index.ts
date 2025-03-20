import { configureStore } from "@reduxjs/toolkit";

import loginReducer from "../features/auth/loginSlice";
import sendOTPReducer from "../features/auth/sendOTPSlice.ts";
import balanceListReducer from "../features/balance/balanceListSlice.ts";
import chargingStationLocationsReducer from "../features/chargingStations/chargingStationLocationsSlice.ts";
import chargingStationReducer from "../features/chargingStations/chargingStationSlice";
import deviceByIdReducer from "../features/device/deviceByIdSlice.ts";
import feeSettingsReducer from "../features/feeSettings/feeSettingsSlice";
import globalReducer from "../features/globalSlice";
import calculateChargeReducer from "../features/priceRule/calculateChargeSlice";
import calculateDurationReducer from "../features/priceRule/calculateDurationSlice";
import addSessionReducer from "../features/sessions/addSessionSlice.ts";
import cancelSessionReducer from "../features/sessions/cancelSessionSlice.ts";
import completeSessionListReducer from "../features/sessions/completeSessionListSlice.ts";
import detailSessionReducer from "../features/sessions/detailSessionSlice.ts";
import onGoingSessionListReducer from "../features/sessions/onGoingSessionListSlice.ts";
import startSessionReducer from "../features/sessions/startSessionSlice.ts";
import stopSessionReducer from "../features/sessions/stopSessionSlice.ts";
import toastReducer from "../features/toastSlice";
import addTransactionReducer from "../features/transactions/addTransactionSlice.ts";
import transactionListReducer from "../features/transactions/transactionListSlice.ts";
import myUserReducer from "../features/users/myUserSlice.ts";

export const store = configureStore({
  reducer: {
    global: globalReducer,
    toast: toastReducer,

    // AUTH
    login: loginReducer,
    sendOTP: sendOTPReducer,

    // USER
    myUser: myUserReducer,

    // CHARGING STATION
    chargingStation: chargingStationReducer,
    chargingStationLocations: chargingStationLocationsReducer,

    // PRICE RULE
    calculateCharge: calculateChargeReducer,
    calculateDuration: calculateDurationReducer,

    // FEE SETTINGS
    feeSettings: feeSettingsReducer,

    // SESSION:
    onGoingSessionList: onGoingSessionListReducer,
    completeSessionList: completeSessionListReducer,
    addSession: addSessionReducer,
    detailSession: detailSessionReducer,
    cancelSession: cancelSessionReducer,
    startSession: startSessionReducer,
    stopSession: stopSessionReducer,

    // TRANSACTION
    transactionList: transactionListReducer,
    addTransaction: addTransactionReducer,

    // BALANCE
    balanceList: balanceListReducer,

    // DEVICE
    deviceById: deviceByIdReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
