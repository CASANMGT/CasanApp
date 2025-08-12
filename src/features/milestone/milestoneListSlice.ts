import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { INVALID_TOKEN } from "../../common";
import { Api } from "../../services/Api";

type MilestoneListState = {
  data: Milestone[] | null;
  loading: boolean;
  error: string | null;
};

const initialState: MilestoneListState = {
  data: null,
  loading: false,
  error: null,
};

// Async thunk for get milestone list
export const fetchMilestoneList = createAsyncThunk(
  "fetchMilestoneList",
  async (_, { rejectWithValue }) => {
    try {
      const res = await Api.get({
        url: "milestones",
        params: { page: 1, limit: 5 },
      });

      return res?.data as Milestone[];
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

const milestoneListSlice = createSlice({
  name: "milestoneList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMilestoneList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMilestoneList.fulfilled,
        (state, action: PayloadAction<Milestone[]>) => {
          state.loading = false;
          state.data = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchMilestoneList.rejected, (state, action) => {
        const dataError: any = action?.payload;

        if (dataError?.message) {
          if (dataError?.message !== INVALID_TOKEN) alert(dataError?.message);
        }

        state.loading = false;
        state.data = null;
        state.error = dataError?.message || "";
      });
  },
});

export default milestoneListSlice.reducer;
