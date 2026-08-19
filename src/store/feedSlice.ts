import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { fetchFeedApi, type FeedUser, type FeedPagination, type FeedResponse } from "../api/feedApi";
import { sendConnectionApi, type SendConnectionStatus } from "../api/connectionApi";

interface FeedState {
  users: FeedUser[];
  pagination: FeedPagination | null;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  swipeError: string | null;
}

const initialState: FeedState = {
  users: [],
  pagination: null,
  loading: false,
  loadingMore: false,
  error: null,
  swipeError: null,
};

export const fetchFeed = createAsyncThunk<FeedResponse, number, { rejectValue: string }>(
  "feed/fetch",
  async (page, { rejectWithValue }) => {
    try {
      return await fetchFeedApi(page, 10);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Failed to load feed");
    }
  }
);

interface SwipeArgs {
  userId: string;
  status: SendConnectionStatus;
}

/**
 * Fires the connection request to the backend. The card is removed from the
 * stack immediately via removeUserFromFeed (dispatched separately) so the UI
 * never waits on this network call to feel responsive.
 */
export const swipeUser = createAsyncThunk<{ userId: string }, SwipeArgs, { rejectValue: string }>(
  "feed/swipe",
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      await sendConnectionApi(status, userId);
      return { userId };
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Something went wrong");
    }
  }
);

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    clearSwipeError: (state) => {
      state.swipeError = null;
    },
    /** Optimistically pop a card off the stack the moment a swipe completes. */
    removeUserFromFeed: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((u) => u._id !== action.payload);
    },
    /**
     * Undo — puts a card back at the top of the local stack. Note this is
     * client-side only: the connection request already sent to the backend
     * on the original swipe is NOT retracted (there's no delete-connection
     * endpoint), so a differing re-swipe may surface a "already exists" error.
     */
    restoreUserToFeed: (state, action: PayloadAction<FeedUser>) => {
      if (!state.users.some((u) => u._id === action.payload._id)) {
        state.users = [action.payload, ...state.users];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state, action) => {
        if (action.meta.arg === 1) {
          state.loading = true;
        } else {
          state.loadingMore = true;
        }
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action: PayloadAction<FeedResponse, string, { arg: number }>) => {
        state.loading = false;
        state.loadingMore = false;
        // Use the page we requested (action.meta.arg) rather than trusting
        // the backend's echoed pagination.page, which comes back as a raw
        // (possibly string) query param.
        const requestedPage = action.meta.arg;
        if (requestedPage === 1) {
          state.users = action.payload.users;
        } else {
          const existingIds = new Set(state.users.map((u) => u._id));
          state.users = [
            ...state.users,
            ...action.payload.users.filter((u) => !existingIds.has(u._id)),
          ];
        }
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload ?? "Failed to load feed";
      })
      .addCase(swipeUser.rejected, (state, action) => {
        state.swipeError = action.payload ?? "Something went wrong";
      });
  },
});

export const { clearSwipeError, removeUserFromFeed, restoreUserToFeed } = feedSlice.actions;
export default feedSlice.reducer;