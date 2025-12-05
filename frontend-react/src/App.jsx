import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import ServiceDetails from "./pages/ServiceDetails.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import StudentIdPage from "./pages/StudentIdPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";

// Admin Imports
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import BookingList from "./pages/admin/BookingList";
import StudentIDList from "./pages/admin/StudentIDList";
import ManageServices from "./pages/admin/ManageServices";
import Reports from "./pages/admin/Reports";

// Basic Route Protection
const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public User Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/student-id" element={<StudentIdPage />} />
        <Route path="/service/:serviceId" element={<ServiceDetails />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="bookings" element={<BookingList />} />
          <Route path="students" element={<StudentIDList />} />
          <Route path="manage" element={<ManageServices />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
