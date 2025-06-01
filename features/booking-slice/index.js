// src/redux/bookings/bookingsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';



const BASE_URL = 'http://localhost:8080/api/bookings'; // Replace with your actual backend URL




// 🔹 Create Booking
export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/create`, bookingData, {
        withCredentials: true, // If using cookies/session auth
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.message || 'Booking failed');
    }
  }
);




// 🔹 Get All Bookings (with credentials)
export const fetchAllBookings = createAsyncThunk(
  'bookings/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/all`, {
        withCredentials: true, // send cookie token
      });
      return res.data.data; // assuming ApiResponse.data contains the list
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch bookings');
    }
  }
);


const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearBookingMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Booking
      .addCase(createBooking.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.successMessage = null;
    })
    .addCase(createBooking.fulfilled, (state, action) => {
      state.loading = false;
      state.successMessage = action.payload.message;
    })
    .addCase(createBooking.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || 'Something went wrong';
    })

      // Fetch All Bookings
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookingMessages } = bookingsSlice.actions;
export default bookingsSlice.reducer;
