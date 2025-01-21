import { createAsyncThunk } from "@reduxjs/toolkit";
import { SessionProps } from "../../common";
import { Api } from "../api";

export const fetchSessionSetting = createAsyncThunk<SessionProps, number>(
  "fetchSessionSetting",
  async (deviceId, { rejectWithValue }) => {
    try {
      // const res = await Api.get({
      //   url: "/heartbeat",
      //   params: { deviceId },
      //   showLog: true,
      // });

      const response = await fetch(`http://35.240.182.255:9556/heartbeat?deviceId=${deviceId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("cek data", data);

      return data
    } catch (e) {
      console.log("cek e", e);

      return rejectWithValue(e);
    }
  }
);
