// features/admin-slice/index.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
 
const API_URL = "http://localhost:8080/api/auth/admin";


// AsyncThunk
export const fetchReceptionists = createAsyncThunk(
  "admin/fetchReceptionists",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/all-receptionist`,
      {
        withCredentials: true
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch"
      );
    }
  }
);



// Deactivate Account
export const deactivateAccount = createAsyncThunk(
  "admin/deactivateAccount",
  async (id, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/deactivate-account/${id}`,
        null,
        {
          withCredentials: true,
        }
      );
      return { id, message: response.data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to deactivate account"
      );
    }
  }
);




// Activate Account
export const activateAccount = createAsyncThunk(
  "admin/activateAccount",
  async (id, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/activate-account/${id}`,
        null,
        {
          withCredentials: true,
        }
      );
      return { id, message: response.data.message };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to activate account"
      );
    }
  }
);

 

// features/admin-slice/index.js
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    receptionists: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReceptionists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceptionists.fulfilled, (state, action) => {
        state.loading = false;
        state.receptionists = action.payload;
      })
      .addCase(fetchReceptionists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Deactivate
      .addCase(deactivateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateAccount.fulfilled, (state, action) => {
        state.loading = false;
        // Update the specific receptionist's active status
        const rec = state.receptionists.find((r) => r.id === action.payload.id);
        if (rec) rec.active = false;
      })
      .addCase(deactivateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Activate
      .addCase(activateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateAccount.fulfilled, (state, action) => {
        state.loading = false;
        // Update the specific receptionist's active status
        const rec = state.receptionists.find((r) => r.id === action.payload.id);
        if (rec) rec.active = true;
      })
      .addCase(activateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});



export const adminReducer = adminSlice.reducer;

