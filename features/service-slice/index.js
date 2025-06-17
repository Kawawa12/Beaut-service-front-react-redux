import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api/services";

// Create
export const createBeautService = createAsyncThunk(
  'beautService/create',
  async (serviceData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('catId', serviceData.catId);
      formData.append('name', serviceData.name);
      formData.append('description', serviceData.description);
      formData.append('price', serviceData.price);
      formData.append('imageFile', serviceData.imageFile);

      const response = await axios.post(API_BASE_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create service');
    }
  }
);

// Fetch All
export const fetchAllServices = createAsyncThunk(
  'services/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
    }
  }
);


export const fetchAllAdminServices = createAsyncThunk(
  'services/fetchAllAdminServices',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/services`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
    }
  }
);

// Update
export const updateBeautService = createAsyncThunk(
  'beautService/update',
  async ({ id, serviceData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('catId', serviceData.catId);
      formData.append('name', serviceData.name);
      formData.append('description', serviceData.description);
      formData.append('price', serviceData.price);
      if (serviceData.imageFile) {
        formData.append('imageFile', serviceData.imageFile);
      }

      const response = await axios.put(`${API_BASE_URL}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to update service');
    }
  }
);

// Toggle Active Status
export const toggleServiceActiveStatus = createAsyncThunk(
  'beautService/toggleActive',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/${id}/toggle`, null, {
        withCredentials: true,
      });

      return { id, message: response.data.message };
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to toggle service status');
    }
  }
);

const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    services: [],
    loading: false,
    error: null,
    success: false,
  },
  reducers: {},
 extraReducers: (builder) => {
  builder
    // Fetch (Public)
    .addCase(fetchAllServices.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchAllServices.fulfilled, (state, action) => {
      state.loading = false;
      state.services = action.payload;
    })
    .addCase(fetchAllServices.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    //  Fetch (Admin)
    .addCase(fetchAllAdminServices.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchAllAdminServices.fulfilled, (state, action) => {
      state.loading = false;
      state.services = action.payload;
    })
    .addCase(fetchAllAdminServices.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Create
    .addCase(createBeautService.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(createBeautService.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
    })
    .addCase(createBeautService.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Update
    .addCase(updateBeautService.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.success = false;
    })
    .addCase(updateBeautService.fulfilled, (state) => {
      state.loading = false;
      state.success = true;
    })
    .addCase(updateBeautService.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Toggle
    .addCase(toggleServiceActiveStatus.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(toggleServiceActiveStatus.fulfilled, (state, action) => {
      state.loading = false;
      const updatedId = action.payload.id;
      const serviceIndex = state.services.findIndex(s => s.id === updatedId);
      if (serviceIndex !== -1) {
        state.services[serviceIndex].active = !state.services[serviceIndex].active;
      }
    })
    .addCase(toggleServiceActiveStatus.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
}

});

export default serviceSlice.reducer;
