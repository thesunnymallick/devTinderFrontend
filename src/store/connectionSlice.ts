import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  fetchPendingConnectionsApi,
  fetchAcceptedConnectionsApi,
  reviewConnectionApi,
  type PendingConnection,
  type AcceptedConnection,
  type ReviewConnectionStatus,
} from "../api/connectionApi";

interface ConnectionState {
  pending: PendingConnection[];
  accepted: AcceptedConnection[];
  loadingPending: boolean;
  loadingAccepted: boolean;
  /** requestId currently being accepted/rejected, so only that row shows a spinner */
  reviewingId: string | null;
  error: string | null;
}

const initialState: ConnectionState = {
  pending: [],
  accepted: [],
  loadingPending: false,
  loadingAccepted: false,
  reviewingId: null,
  error: null,
};

export const fetchPendingConnections = createAsyncThunk<
  PendingConnection[],
  void,
  { rejectValue: string }
>("connections/fetchPending", async (_, { rejectWithValue }) => {
  try {
    return await fetchPendingConnectionsApi();
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Failed to load requests");
  }
});

export const fetchAcceptedConnections = createAsyncThunk<
  AcceptedConnection[],
  void,
  { rejectValue: string }
>("connections/fetchAccepted", async (_, { rejectWithValue }) => {
  try {
    return await fetchAcceptedConnectionsApi();
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Failed to load connections");
  }
});

interface ReviewArgs {
  requestId: string;
  status: ReviewConnectionStatus;
}

export const reviewConnection = createAsyncThunk<
  { requestId: string },
  ReviewArgs,
  { rejectValue: string }
>("connections/review", async ({ requestId, status }, { rejectWithValue }) => {
  try {
    await reviewConnectionApi(status, requestId);
    return { requestId };
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Something went wrong");
  }
});

const connectionSlice = createSlice({
  name: "connections",
  initialState,
  reducers: {
    clearConnectionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingConnections.pending, (state) => {
        state.loadingPending = true;
        state.error = null;
      })
      .addCase(
        fetchPendingConnections.fulfilled,
        (state, action: PayloadAction<PendingConnection[]>) => {
          state.loadingPending = false;
          state.pending = action.payload;
        }
      )
      .addCase(fetchPendingConnections.rejected, (state, action) => {
        state.loadingPending = false;
        state.error = action.payload ?? "Failed to load requests";
      })
      .addCase(fetchAcceptedConnections.pending, (state) => {
        state.loadingAccepted = true;
        state.error = null;
      })
      .addCase(
        fetchAcceptedConnections.fulfilled,
        (state, action: PayloadAction<AcceptedConnection[]>) => {
          state.loadingAccepted = false;
          state.accepted = action.payload;
        }
      )
      .addCase(fetchAcceptedConnections.rejected, (state, action) => {
        state.loadingAccepted = false;
        state.error = action.payload ?? "Failed to load connections";
      })
      .addCase(reviewConnection.pending, (state, action) => {
        state.reviewingId = action.meta.arg.requestId;
      })
      .addCase(
        reviewConnection.fulfilled,
        (state, action: PayloadAction<{ requestId: string }>) => {
          state.reviewingId = null;
          state.pending = state.pending.filter(
            (p) => p.requestId !== action.payload.requestId
          );
        }
      )
      .addCase(reviewConnection.rejected, (state, action) => {
        state.reviewingId = null;
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export const { clearConnectionError } = connectionSlice.actions;
export default connectionSlice.reducer;