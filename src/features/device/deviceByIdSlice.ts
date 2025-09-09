import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Device,
  
} from "../../common";
import { Api } from "../../services/Api";

type DeviceByIdResponse = {
  status: string;
  message: string;
  data: Device;
  meta: MetaResponseProps;
};

type DeviceByIdState = {
  data: DeviceByIdResponse | null;
  loading: boolean;
  error: string | null;
};

const initialState: DeviceByIdState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for get session list
export const fetchDeviceById = createAsyncThunk(
  "fetchDeviceById",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await Api.get({
        url: `devices/${id}`,
      });

      return res as DeviceByIdResponse;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const deviceByIdSlice = createSlice({
  name: "deviceById",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDeviceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchDeviceById.fulfilled,
        (state, action: PayloadAction<DeviceByIdResponse>) => {
          state.loading = false;
          state.data = action?.payload;
          state.error = null;
        }
      )
      .addCase(fetchDeviceById.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error?.message ?? "failed";
      });
  },
});

export default deviceByIdSlice.reducer;
