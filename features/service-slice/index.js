import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api/services";



// Backend endpoint: POST /api/beaut-services
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
        withCredentials: true // if using secure cookies
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Failed to create service');
    }
  }
);

// Async thunk to fetch all services
export const fetchAllServices = createAsyncThunk(
  'services/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data.data; // the "data" field from your JSON response
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
    }
  }
);





const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    services: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
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
      .addCase(createBeautService.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createBeautService.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(createBeautService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default serviceSlice.reducer;
