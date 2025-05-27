// authSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

axios.defaults.withCredentials = true;

// Helper function to reset state
const resetAuthState = (state) => {
  state.user = null;
  state.isAuthenticated = false;
  state.role = null;
  state.email = null;
  state.jwtToken = null;
  state.error = null;
};

// Async Thunks
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return { message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      return {
        role: response.data.data.role,
        email: credentials.email,
        jwtToken: response.data.data.jwtToken,
        message: response.data.message,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/me`);
      return {
        email: response.data.data.email,
        role: response.data.data.role,
        jwtToken: response.data.data.jwtToken,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.status === 401 ? "Unauthorized!" : "Authentication check failed"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.get(`${API_URL}/logout`);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Logout failed"
      );
    }
  }
);

// Initial state
const initialState = {
  user: null,
  status: "idle",
  error: null,
  isAuthenticated: false,
  role: null,
  email: null,
  jwtToken: null,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: resetAuthState,
    clearError: (state) => {
      state.error = null;
    },
    clearAuthStatus: (state) => {
      state.status = "idle";
    },
    resetAuth: resetAuthState,  
  },

  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.role = action.payload.role;
        state.email = action.payload.email;
        state.jwtToken = action.payload.jwtToken;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Auth check
      .addCase(checkAuth.pending, (state) => {
        state.status = "loading";
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.isAuthenticated = true;
        state.role = action.payload.role;
        state.email = action.payload.email;
        state.jwtToken = action.payload.jwtToken;
        state.isLoading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.status = "idle";
        resetAuthState(state);
        state.isLoading = false;
      })

      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logoutUser.fulfilled, resetAuthState)
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Export all actions including clearAuthStatus
export const { logout, clearError, clearAuthStatus, resetAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.email;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthRole = (state) => state.auth.role;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectJwtToken = (state) => state.auth.jwtToken;