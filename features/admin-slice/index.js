// features/admin-slice/index.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080/api/auth/admin";

//  Fetch all receptionists
export const fetchReceptionists = createAsyncThunk(
  "admin/fetchReceptionists",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/all-receptionist`, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch receptionists"
      );
    }
  }
);

//  Fetch all customers
export const fetchAllCustomers = createAsyncThunk(
  "admin/fetchAllCustomers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/all-customers`, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch customers"
      );
    }
  }
);

//  Deactivate account
export const deactivateAccount = createAsyncThunk(
  "admin/deactivateAccount",
  async (id, { rejectWithValue }) => {
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
      return rejectWithValue(
        error.response?.data?.message || "Failed to deactivate account"
      );
    }
  }
);

// Activate account
export const activateAccount = createAsyncThunk(
  "admin/activateAccount",
  async (id, { rejectWithValue }) => {
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
      return rejectWithValue(
        error.response?.data?.message || "Failed to activate account"
      );
    }
  }
);

// Fetch dashboard counts
export const fetchDashboardCounts = createAsyncThunk(
  "admin/fetchDashboardCounts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/dashboard/counts",
        {
          withCredentials: true,
        }
      );
      return response.data; // directly returning DashboardCountDto
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch dashboard counts"
      );
    }
  }
);

//  Slice definition
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    receptionists: [],
    customers: [],
    dashboardCounts: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // === Fetch Receptionists ===
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

      // === Fetch Customers ===
      .addCase(fetchAllCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === Deactivate Account ===
      .addCase(deactivateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deactivateAccount.fulfilled, (state, action) => {
        state.loading = false;
        const rec = state.receptionists.find((r) => r.id === action.payload.id);
        if (rec) rec.active = false;
      })
      .addCase(deactivateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // === Activate Account ===
      .addCase(activateAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateAccount.fulfilled, (state, action) => {
        state.loading = false;
        const rec = state.receptionists.find((r) => r.id === action.payload.id);
        if (rec) rec.active = true;
      })
      .addCase(activateAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // === Fetch Dashboard Counts ===
      .addCase(fetchDashboardCounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardCounts.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardCounts = action.payload;
      })
      .addCase(fetchDashboardCounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const adminReducer = adminSlice.reducer;
