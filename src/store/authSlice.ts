 import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  signupApi,
  loginApi,
  logoutApi,
  fetchCurrentUserApi,
  type SignupPayload,
  type LoginPayload,
  type AuthUser,
} from "../api/authApi";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** Has the initial "am I already logged in" check (checkAuthUser) finished? */
  authChecked: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  authChecked: false,
  loading: false,
  error: null,
};

export const signupUser = createAsyncThunk<AuthUser, SignupPayload, { rejectValue: string }>(
  "auth/signup",
  async (payload, { rejectWithValue }) => {
    try {
      return await signupApi(payload);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Signup failed");
    }
  }
);

export const loginUser = createAsyncThunk<AuthUser, LoginPayload, { rejectValue: string }>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      return await loginApi(payload);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Logout failed");
    }
  }
);

/** Run once on app load to see if the auth cookie is still valid. Never throws. */
export const checkAuthUser = createAsyncThunk<AuthUser | null>("auth/checkAuth", async () => {
  try {
    return await fetchCurrentUserApi();
  } catch {
    return null;
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Signup failed";
      })
      // login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
      })
      // logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      // checkAuth (silent — no loading/error UI tied to this one)
      .addCase(checkAuthUser.fulfilled, (state, action: PayloadAction<AuthUser | null>) => {
        state.authChecked = true;
        if (action.payload) {
          state.user = action.payload;
          state.isAuthenticated = true;
        } else {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkAuthUser.rejected, (state) => {
        state.authChecked = true;
        state.isAuthenticated = false;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;