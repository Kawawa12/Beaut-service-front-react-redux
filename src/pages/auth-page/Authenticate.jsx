import { useLocation, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingSpinner from "../../components/common/LoadingSpinner";

function Authenticate({ children }) {
  const location = useLocation();
  const { isAuthenticated, role, isLoading } = useSelector((state) => state.auth);
  const path = location.pathname.toLowerCase();

  const isAuthPage = path.includes("/login") || path.includes("/register");
  const isAdminRoute = path.startsWith("/admin");
  const isReceptionRoute = path.startsWith("/reception");

  // Show loading state while checking auth
  if (isLoading) {
    return  <LoadingSpinner/>; // Or your custom loading component
  }

  // Not authenticated, and trying to access protected layout
  if (!isAuthenticated && (isAdminRoute || isReceptionRoute)) {
    return <Navigate to="/" replace />;
  }

  // Authenticated but trying to access login/register
  if (isAuthenticated && isAuthPage) {
    if (role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
    if (role === "RECEPTIONIST") return <Navigate to="/reception/dashboard" replace />;
    return <Navigate to="/service-page" replace />;
  }

  // Prevent unauthorized role access
  if (isAuthenticated) {
    if (isAdminRoute && role !== "ADMIN") {
      return <Navigate to="/unauthorized" replace />;
    }
    if (isReceptionRoute && role !== "RECEPTIONIST") {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}

export default Authenticate;