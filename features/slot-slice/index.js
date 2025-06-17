import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/time-slots';

// 🔹 Fetch all time slots
export const fetchTimeSlots = createAsyncThunk(
  'timeSlots/fetchTimeSlots',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(API_URL);
       return Array.isArray(data) ? data : []; // Handle direct array
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      console.error('fetchTimeSlots error:', err.response?.data || err); // Debug log
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 Add a new time slot
export const addTimeSlot = createAsyncThunk(
  'timeSlots/addTimeSlot',
  async ({ startTime, endTime }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(API_URL, { startTime, endTime });
       return data; // Expect direct time slot object
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      console.error('addTimeSlot error:', err.response?.data || err);
      return rejectWithValue(errorMessage);
    }
  }
);

// 🔹 Update a time slot
export const editTimeSlot = createAsyncThunk(
  'timeSlots/editTimeSlot',
  async ({ id, startTime, endTime }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`${API_URL}/${id}`, { startTime, endTime });
       return data; // Expect direct time slot object
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      console.error('editTimeSlot error:', err.response?.data || err);
      return rejectWithValue(errorMessage);
    }
  }
);

const timeSlotSlice = createSlice({
  name: 'timeSlots',
  initialState: {
    items: [], // List of time slots
    status: {
      fetch: 'idle', // loading, succeeded, failed
      add: 'idle',
      edit: 'idle',
    },
    error: null, // Error message for UI display
    successMessage: null, // Success message for UI feedback
  },
  reducers: {
    // 🔹 Clear error and success messages
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Time Slots
    builder
      .addCase(fetchTimeSlots.pending, (state) => {
        state.status.fetch = 'loading';
        state.error = null;
      })
      .addCase(fetchTimeSlots.fulfilled, (state, { payload }) => {
        state.status.fetch = 'succeeded';
        state.items = payload;
      })
      .addCase(fetchTimeSlots.rejected, (state, { payload }) => {
        state.status.fetch = 'failed';
        state.error = payload;
        state.items = [];
      })

      // Add Time Slot
      .addCase(addTimeSlot.pending, (state) => {
        state.status.add = 'loading';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(addTimeSlot.fulfilled, (state, { payload }) => {
        state.status.add = 'succeeded';
        state.items.push(payload);
        state.successMessage = 'Time slot added successfully';
      })
      .addCase(addTimeSlot.rejected, (state, { payload }) => {
        state.status.add = 'failed';
        state.error = payload;
      })

      // Edit Time Slot
      .addCase(editTimeSlot.pending, (state) => {
        state.status.edit = 'loading';
        state.error = null;
        state.successMessage = null;
      })
      .addCase(editTimeSlot.fulfilled, (state, { payload }) => {
        state.status.edit = 'succeeded';
        const index = state.items.findIndex((item) => item.id === payload.id);
        if (index !== -1) {
          state.items[index] = payload;
        }
        state.successMessage = 'Time slot updated successfully';
      })
      .addCase(editTimeSlot.rejected, (state, { payload }) => {
        state.status.edit = 'failed';
        state.error = payload;
      });
  },
});

export const { clearMessages } = timeSlotSlice.actions;
export default timeSlotSlice.reducer;