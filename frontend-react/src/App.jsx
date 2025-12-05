import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "../src/pages/LandingPage.jsx";
import ServiceDetails from "../src/pages/ServiceDetails.jsx";
import BookingPage from "../src/pages/BookingPage.jsx";
import StudentIdPage from "../src/pages/StudentIdPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/student-bookings" element={<div>Student Bookings Page - Placeholder</div>} />
        <Route path="/student-id" element={ <StudentIdPage/> } />

        {/* Separate booking pages per category */}
        <Route path="/service/:serviceId" element={<ServiceDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
