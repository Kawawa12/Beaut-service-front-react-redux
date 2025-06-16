import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

// 🔹 Create Booking
export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (bookingData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/bookings/create`, bookingData, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Booking failed");
    }
  }
);

// 🔹 Get All Bookings
export const fetchAllBookings = createAsyncThunk(
  "bookings/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/bookings/all`, {
        withCredentials: true,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch bookings"
      );
    }
  }
);

// 🔹 Confirm Booking by PIN
export const confirmBookingByPin = createAsyncThunk(
  "bookings/confirmBookingByPin",
  async ({ bookingId, pin }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/bookings/confirm?id=${bookingId}&pin=${pin}`,
        null,
        {
          withCredentials: true,
        }
      );
      if (!res.data.data) {
        return rejectWithValue(res.data.message);
      }
      return res.data;
    } catch (err) {
      console.error("Confirm booking error:", err);
      return rejectWithValue(
        err.response?.data?.message || "Failed to confirm booking"
      );
    }
  }
);

// 🔹 Mark Booking as Complete
export const markAsComplete = createAsyncThunk(
  "bookings/markAsComplete",
  async ({ bookingId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/bookings/mark-complete?id=${bookingId}`,
        null,
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark booking as complete"
      );
    }
  }
);

// 🔹 Mark Booking as In Service
export const markAsInService = createAsyncThunk(
  "bookings/inService",
  async ({ bookingId }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/bookings/mark-in-service?id=${bookingId}`,
        null,
        {
          withCredentials: true,
        }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark booking as in service"
      );
    }
  }
);

// 🔹 Get Confirmed Bookings
export const fetchConfirmedBookings = createAsyncThunk(
  "bookings/fetchConfirmed",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/bookings/confirmed`, {
        withCredentials: true,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch confirmed bookings"
      );
    }
  }
);

// 🔹 Get In-Service Bookings
export const fetchInServiceBookings = createAsyncThunk(
  "bookings/fetchInService",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/bookings/in-service`, {
        withCredentials: true,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch in-service bookings"
      );
    }
  }
);

// 🔹 Get Completed Bookings
export const fetchCompletedBookings = createAsyncThunk(
  "bookings/fetchCompleted",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/bookings/completed`, {
        withCredentials: true,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch completed bookings"
      );
    }
  }
);

// 🔹 Get Reserved Bookings
export const fetchReservedBookings = createAsyncThunk(
  "bookings/fetchReserved",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/bookings/reserved`, {
        withCredentials: true,
      });
      return res.data.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch reserved bookings"
      );
    }
  }
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
    confirmedBookings: [],
    inServiceBookings: [],
    completedBookings: [],
    reservedBookings: [],
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
        state.error = action.payload || "Something went wrong";
      })
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload || [];
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(confirmBookingByPin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(confirmBookingByPin.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const updatedBooking = action.payload.data;
        if (updatedBooking && updatedBooking.id) {
          state.bookings = (state.bookings || [])
            .filter((booking) => booking != null && booking.id != null)
            .map((booking) =>
              booking.id === updatedBooking.id ? updatedBooking : booking
            );
          state.confirmedBookings = (state.confirmedBookings || [])
            .filter((booking) => booking != null && booking.id != null)
            .map((booking) =>
              booking.id === updatedBooking.id ? updatedBooking : booking
            );
          state.reservedBookings = (state.reservedBookings || []).filter(
            (booking) => booking != null && booking.id !== updatedBooking.id
          );
        }
      })
      .addCase(confirmBookingByPin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to confirm booking";
      })
      .addCase(markAsComplete.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(markAsComplete.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const updatedBooking = action.payload.data;
        if (!updatedBooking || !updatedBooking.id) {
          console.error("Invalid updatedBooking received:", updatedBooking);
          state.error = "Invalid booking data received from server";
          return;
        }
        state.bookings = (state.bookings || [])
          .filter((booking) => booking != null && booking.id != null)
          .map((booking) =>
            booking.id === updatedBooking.id ? updatedBooking : booking
          );
        state.confirmedBookings = (state.confirmedBookings || []).filter(
          (booking) => booking != null && booking.id !== updatedBooking.id
        );
        state.inServiceBookings = (state.inServiceBookings || []).filter(
          (booking) => booking != null && booking.id !== updatedBooking.id
        );
        state.completedBookings = [
          ...(state.completedBookings || []),
          updatedBooking,
        ];
      })
      .addCase(markAsComplete.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to mark booking as complete";
      })
      .addCase(markAsInService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(markAsInService.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const updatedBooking = action.payload.data;
        if (!updatedBooking || !updatedBooking.id) {
          console.error("Invalid updatedBooking received:", updatedBooking);
          state.error = "Invalid booking data received from server";
          return;
        }
        state.bookings = (state.bookings || [])
          .filter((booking) => booking != null && booking.id != null)
          .map((booking) =>
            booking.id === updatedBooking.id ? updatedBooking : booking
          );
        state.confirmedBookings = (state.confirmedBookings || []).filter(
          (booking) => booking != null && booking.id !== updatedBooking.id
        );
        state.inServiceBookings = [
          ...(state.inServiceBookings || []),
          updatedBooking,
        ];
      })
      .addCase(markAsInService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to mark booking as in service";
      })
      .addCase(fetchConfirmedBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConfirmedBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.confirmedBookings = action.payload || [];
      })
      .addCase(fetchConfirmedBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchInServiceBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInServiceBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.inServiceBookings = action.payload || [];
      })
      .addCase(fetchInServiceBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCompletedBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompletedBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.completedBookings = action.payload || [];
      })
      .addCase(fetchCompletedBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchReservedBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservedBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.reservedBookings = action.payload || [];
      })
      .addCase(fetchReservedBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookingMessages } = bookingsSlice.actions;
export default bookingsSlice.reducer;