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
import { updateProfileApi, type UpdateProfilePayload } from "../api/profileApi";

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  /** Has the initial "am I already logged in" check (checkAuthUser) finished? */
  authChecked: boolean;
  loading: boolean;
  error: string | null;
  /** Success message from signup, shown once on the Login page then cleared. */
  signupSuccessMessage: string | null;
  /** Separate from `loading`/`error` above so editing your profile never
   *  interferes with the login/signup loading state. */
  updatingProfile: boolean;
  profileError: string | null;
  profileSuccess: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  authChecked: false,
  loading: false,
  error: null,
  signupSuccessMessage: null,
  updatingProfile: false,
  profileError: null,
  profileSuccess: false,
};

/**
 * Only creates the account. The backend does NOT set a cookie or log the user
 * in here — that only happens in /auth/login — so this must never flip
 * isAuthenticated to true.
 */
export const signupUser = createAsyncThunk<string, SignupPayload, { rejectValue: string }>(
  "auth/signup",
  async (payload, { rejectWithValue }) => {
    try {
      return await signupApi(payload);
    } catch (err) {
      return rejectWithValue(err instanceof Error ? err.message : "Signup failed");
    }
  }
);

/**
 * Logs in (which sets the auth cookie), then immediately fetches the profile
 * since the login response body itself contains no user data.
 */
export const loginUser = createAsyncThunk<AuthUser, LoginPayload, { rejectValue: string }>(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      await loginApi(payload);
      return await fetchCurrentUserApi();
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

/** PATCH /profile/edit — updates the logged-in user's profile fields. */
export const updateUserProfile = createAsyncThunk<
  AuthUser,
  UpdateProfilePayload,
  { rejectValue: string }
>("auth/updateProfile", async (payload, { rejectWithValue }) => {
  try {
    return await updateProfileApi(payload);
  } catch (err) {
    return rejectWithValue(err instanceof Error ? err.message : "Failed to update profile");
  }
});

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
    clearSignupSuccessMessage: (state) => {
      state.signupSuccessMessage = null;
    },
    clearProfileError: (state) => {
      state.profileError = null;
    },
    clearProfileSuccess: (state) => {
      state.profileSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // signup — does NOT authenticate the user, just returns a status message
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.signupSuccessMessage = action.payload;
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
      })
      // profile update
      .addCase(updateUserProfile.pending, (state) => {
        state.updatingProfile = true;
        state.profileError = null;
        state.profileSuccess = false;
      })
      .addCase(updateUserProfile.fulfilled, (state, action: PayloadAction<AuthUser>) => {
        state.updatingProfile = false;
        state.user = action.payload;
        state.profileSuccess = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.updatingProfile = false;
        state.profileError = action.payload ?? "Failed to update profile";
      });
  },
});

export const { clearAuthError, clearSignupSuccessMessage, clearProfileError, clearProfileSuccess } =
  authSlice.actions;
export default authSlice.reducer;