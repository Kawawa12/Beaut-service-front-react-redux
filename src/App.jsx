import { Routes, Route, Navigate } from "react-router-dom";
import BeautyHomePage from "./pages/client-view/HomePage";
import ReceptionDashboard from "./pages/receptionist-view/ReceptionDashboard";
import ReceptionCheckIn from "./pages/receptionist-view/ReceptionCheckIn";
import ReceptionBookings from "./pages/receptionist-view/ReceptionBookings";
import NotFound from "./pages/unavailable-page/NotFound";
import ReceptionServices from "./pages/receptionist-view/ReceptionServices";
import Notification from "./components/common/Notifications";
import SpecialOffers from "./pages/receptionist-view/SpecialOffers";
import AdminLayout from "./components/admin-view/AdminLayout";
import AdminDashboard from "./pages/admin-view/AdminDashboard";
import Customers from "./pages/admin-view/Customers";
import Receptionist from "./pages/admin-view/Receptionist";
import Reports from "./pages/admin-view/Reports";
import ReceptionistLayout from "./components/receptionist-view/ReceptionistLayout";
import Authenticate from "./pages/auth-page/Authenticate";
import UnauthorizedPage from "./pages/unauth-page/Unauthorized";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "../features/auth-slice";
import Category from "./pages/admin-view/AdminServices";
import TimeSlot from "./components/common/TimeSlot";
import Register from "./pages/auth-page/Register";
import Login from "./pages/auth-page/Login";
import VerifyOtpPage from "./components/common/VerifyOtpPage";
import BeautServices from "./pages/client-view/BeautServices";
import AboutUs from "./components/common/AboutUs";
import Contact from "./components/common/Contact";
import BookingWizard from "./pages/client-view/BookingWizard";

 
 

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check authentication when app loads
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<BeautyHomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/services" element={<BeautServices />} />
       {/* Booking wizard where user selects date/time/details */}
      <Route path="/booking/:id" element={<BookingWizard />} />
      <Route path="/about-us" element={<AboutUs />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/my-otp" element={<VerifyOtpPage />} />
      {/* Protected Admin Routes */}
      <Route
        path="/admin"
        element={
          <Authenticate>
            <AdminLayout />
          </Authenticate>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="category" element={<Category />} />
        <Route path="time-slots" element={ <TimeSlot/>} />
        <Route path="bookings" element={<ReceptionBookings />} />
        <Route path="users" element={<Customers />} />
        <Route path="receptionists" element={<Receptionist />} />
        <Route path="reports" element={<Reports />} />
      </Route>

      {/* Protected Receptionist Routes */}
      <Route
        path="/reception"
        element={
          <Authenticate>
            <ReceptionistLayout />
          </Authenticate>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<ReceptionDashboard />} />
        <Route path="check-in" element={<ReceptionCheckIn />} />
        <Route path="bookings" element={<ReceptionBookings />} />
        <Route path="services" element={<ReceptionServices />} />
        <Route path="notifications" element={<Notification />} />
        <Route path="special-offers" element={<SpecialOffers />} />
      </Route>

      {/* Not Found */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
