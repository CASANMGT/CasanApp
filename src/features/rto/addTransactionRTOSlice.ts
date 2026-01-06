import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Api } from "../../services/Api";

type AddTransactionRTOState = {
  data: RTOTransactionProps | null;
  loading: boolean;
  error: string | null;
};

const initialState: AddTransactionRTOState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for start session
export const fetchAddTransactionRTO = createAsyncThunk(
  "fetchAddTransactionRTO",
  async (body: AddTransactionRTOBodyProps, { rejectWithValue }) => {
    try {
      const res = await Api.post({
        url: "rto-transactions",
        body,
      });

      return res?.data as RTOTransactionProps;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const addTransactionRTOSlice = createSlice({
  name: "addTransactionRTO",
  initialState,
  reducers: {
    resetDataAddTransactionRTO: (state) => {
      state.data = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddTransactionRTO.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAddTransactionRTO.fulfilled,
        (state, action: PayloadAction<RTOTransactionProps>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchAddTransactionRTO.rejected, (state, action) => {
        const dataError: any = action?.payload;
        if (dataError?.message) alert(dataError?.message);

        state.loading = false;
        state.data = null;
        state.error = action.error.message ?? "failed";
      });
  },
});

export const { resetDataAddTransactionRTO } = addTransactionRTOSlice.actions;
export default addTransactionRTOSlice.reducer;
