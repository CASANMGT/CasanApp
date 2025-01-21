import { createAsyncThunk } from "@reduxjs/toolkit";
import { SessionProps } from "../../common";
import { Api } from "../api";

export const fetchSessionSetting = createAsyncThunk<SessionProps, number>(
  "fetchSessionSetting",
  async (deviceId, { rejectWithValue }) => {
    try {
      const res = await Api.get({
        url: "/heartbeat",
        params: { deviceId },
        showLog: true,
      });

      return res;
    } catch (e) {
      console.log("cek e", e);

      return rejectWithValue(e);
    }
  }
);
