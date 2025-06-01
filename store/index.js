// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth-slice";
import { adminReducer } from "../features/admin-slice";
import { categoryReducer } from "../features/category-slice";
import timeSlotReducer from "../features/slot-slice";
import serviceReducer from "../features/service-slice";
import bookingSlice  from "../features/booking-slice" 



const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    categories: categoryReducer,
    timeSlots: timeSlotReducer,
    services: serviceReducer,
    bookings: bookingSlice
  },
});

export default store;
