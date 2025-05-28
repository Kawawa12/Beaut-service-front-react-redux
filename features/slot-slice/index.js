// src/features/slot-slice/index.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = "http://localhost:8080/api/time-slots";

export const fetchTimeSlots = createAsyncThunk(
  'timeSlots/fetchTimeSlots',
  async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
);

export const addTimeSlot = createAsyncThunk(
  'timeSlots/addTimeSlot',
  async ({ startTime, endTime }) => {
    const response = await axios.post(API_URL, { startTime, endTime });
    return response.data;
  }
);

export const toggleTimeSlotAvailability = createAsyncThunk(
  'timeSlots/toggleAvailability',
  async (id) => {
    const response = await axios.post(`${API_URL}/${id}/toggle`);
    return response.data;
  }
);

const timeSlotSlice = createSlice({
  name: 'timeSlots',
  initialState: {
    items: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTimeSlots.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTimeSlots.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchTimeSlots.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addTimeSlot.fulfilled, (state, action) => { 
        state.items.push(action.payload);
      })
      .addCase(toggleTimeSlotAvailability.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  }
});

export default timeSlotSlice.reducer;