// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "../features/auth-slice";
import { adminReducer } from "../features/admin-slice";
import { categoryReducer } from "../features/category-slice";
import timeSlotReducer from "../features/slot-slice/index";
import serviceReducer from "../features/service-slice/index";



const store = configureStore({
  reducer: {
    auth: authReducer,
    admin: adminReducer,
    categories: categoryReducer,
    timeSlots: timeSlotReducer,
    services: serviceReducer,
  },
});

export default store;
