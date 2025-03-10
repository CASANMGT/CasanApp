import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  chargingSessionResponseProps,
  portReportBodyProps
} from "../../common";
const apiUrl = import.meta.env.VITE_API_URL;

export const fetchPortReport = createAsyncThunk<number, portReportBodyProps>(
  "fetchPortReport",
  async (body, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${apiUrl}/port-report?deviceId=${body?.deviceID}&port=${body?.port}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      return data?.currentPower;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const fetchChargingSession = createAsyncThunk<
  chargingSessionResponseProps,
  portReportBodyProps
>("fetchChargingSession", async (body, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${apiUrl}/charging-session?deviceId=${body?.deviceID}&port=${body?.port}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (e) {
    return rejectWithValue(e);
  }
});
