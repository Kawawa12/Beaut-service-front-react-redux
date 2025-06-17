import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:8080/api/categories";

// Fetch all categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create a new category
export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(API_URL, formData);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Unknown error";
      return rejectWithValue({ status: err.response?.status, message });
    }
  }
);

//  Update category
// Update category
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('name', categoryData.get('name'));
      formData.append('description', categoryData.get('description'));
      
      // Only append image if it exists
      const imageFile = categoryData.get('imageFile');
      if (imageFile) {
        formData.append('imageFile', imageFile);
      }

      const response = await axios.put(`${API_URL}/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return { data: response.data.data, message: response.data.message, id };
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Update failed";
      return rejectWithValue({ status: err.response?.status, message });
    }
  }
);

// Toggle (activate/deactivate) category
export const toggleCategoryActiveStatus = createAsyncThunk(
  "categories/toggleCategoryActiveStatus",
  async (id, { rejectWithValue }) => {
    try {
      await axios.patch(`${API_URL}/${id}/toggle`);
      return id;
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Toggle failed";
      return rejectWithValue({ status: err.response?.status, message });
    }
  }
);

const initialState = {
  loading: false,
  categories: [],
  error: null,
  successMessage: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || "Failed to fetch categories";
      })

      // Create category
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        state.categories.push(action.payload.data);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Something went wrong";
      })

      //  Update category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
        const index = state.categories.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (index !== -1) {
          state.categories[index] = action.payload.data;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Update failed";
      })

      //  Deactivate category
      //  Toggle category active status
      .addCase(toggleCategoryActiveStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleCategoryActiveStatus.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload;
        const index = state.categories.findIndex((cat) => cat.id === id);
        if (index !== -1) {
          state.categories[index].active = !state.categories[index].active; //  toggle
        }
      })

      .addCase(toggleCategoryActiveStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Deactivation or activation failed";
      });
  },
});

export const { clearError, clearSuccessMessage } = categorySlice.actions;

export const categoryReducer = categorySlice.reducer;
