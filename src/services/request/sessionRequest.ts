import { createAsyncThunk } from "@reduxjs/toolkit";
import { SessionProps } from "../../common";
const apiUrl = import.meta.env.VITE_API_URL;

export const fetchSessionSetting = createAsyncThunk<SessionProps, string>(
  "fetchSessionSetting",
  async (deviceId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiUrl}/heartbeat?deviceId=${deviceId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
