import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api/rooms";

// 🔹 Fetch all rooms
export const fetchAllRooms = createAsyncThunk(
  "serviceRooms/fetchAll",
  async (_, thunkAPI) => {
    try {
      const { data } = await axios.get(BASE_URL);
      return data.data || [];
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🔹 Create a room
export const createRoom = createAsyncThunk(
  "serviceRooms/create",
  async (roomDto, thunkAPI) => {
    try {
      const { data } = await axios.post(BASE_URL, roomDto, {
        withCredentials: true,
      });
      return data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// 🔹 Assign a confirmed booking to a specific room
export const assignBookingToRoom = createAsyncThunk(
  "serviceRooms/assignBooking",
  async ({ bookingId, roomId }, thunkAPI) => {
    try {
      const { data } = await axios.post(
        `${BASE_URL}/assign-booking`,
        null,
        { params: { bookingId, roomId } }
      );
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const serviceRoomSlice = createSlice({
  name: "serviceRooms",
  initialState: {
    rooms: [],
    loading: false,
    error: null,
    successMessage: null,
    assignError: null,
    assignSuccess: null,
  },
  reducers: {
    clearRoomMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearAssignStatus: (state) => {
      state.assignError = null;
      state.assignSuccess = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAllRooms
      .addCase(fetchAllRooms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRooms.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.rooms = payload;
      })
      .addCase(fetchAllRooms.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
        state.rooms = [];
      })

      // createRoom
      .addCase(createRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createRoom.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.rooms.push(payload);
        state.successMessage = "Room created successfully";
      })
      .addCase(createRoom.rejected, (state, { payload }) => {
        state.loading = false;
        state.error = payload;
      })

      // assignBookingToRoom
      .addCase(assignBookingToRoom.pending, (state) => {
        state.loading = true;
        state.assignError = null;
        state.assignSuccess = null;
      })
      .addCase(assignBookingToRoom.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.assignSuccess = payload.message;
      })
      .addCase(assignBookingToRoom.rejected, (state, { payload }) => {
        state.loading = false;
        state.assignError = payload;
      });
  },
});

export const { clearRoomMessages, clearAssignStatus } = serviceRoomSlice.actions;
export default serviceRoomSlice.reducer;