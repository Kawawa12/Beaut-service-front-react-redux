// src/redux/clientSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/customer";

// Async thunk to fetch client profile
export const fetchClientProfile = createAsyncThunk(
  "client/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/profile`, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch profile"
      );
    }
  }
);

// Async thunk to fetch client bookings
export const fetchMyBookings = createAsyncThunk(
  "client/fetchMyBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/my-bookings`, {
        withCredentials: true,
      });
      return response.data; // Array of bookings
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

// Update profile
export const updateClientProfile = createAsyncThunk(
  "client/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${BASE_URL}/profile`, profileData, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

const clientSlice = createSlice({
  name: "client",
  initialState: {
    profile: null,
    bookings: [],
    loading: false,
    error: null,
    bookingLoading: false,
    bookingError: null,
  },
  reducers: {
    clearClientProfile: (state) => {
      state.profile = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Profile fetching
      .addCase(fetchClientProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchClientProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      //  Booking fetching
      .addCase(fetchMyBookings.pending, (state) => {
        state.bookingLoading = true;
        state.bookingError = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.bookingLoading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.bookingLoading = false;
        state.bookingError = action.payload;
      })

      //Update profile
      .addCase(updateClientProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(updateClientProfile.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearClientProfile } = clientSlice.actions;
export default clientSlice.reducer;
