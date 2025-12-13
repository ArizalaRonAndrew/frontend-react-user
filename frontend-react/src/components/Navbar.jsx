// src/components/Navbar.jsx - UPDATED VERSION
import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import UserNotificationDropdown from "./UserNotificationDropdown";

export default function Navbar() {
  // Get current user info
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem("currentUser");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      return null;
    }
  };

  const user = getCurrentUser();

  return (
    <nav className="bg-slate-900 text-white px-4 py-4 flex items-center justify-between shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="text-white size-7"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 7.5A2.5 2.5 0 0 1 5.5 5h2.086c.404 0 .787-.162 1.07-.45l1.378-1.378c.283-.288.666-.45 1.07-.45h3.692c.404 0 .787.162 1.07.45l1.378 1.378c.283.288.666.45 1.07.45H18.5A2.5 2.5 0 0 1 21 7.5v9A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
          />
        </svg>
        <span className="text-lg font-semibold">SnapHub</span>
      </div>

      <ul className="hidden md:flex gap-6 text-base font-medium">
        <li>
          <Link to="/home" className="hover:text-slate-300">
            Home
          </Link>
        </li>
        <li>
          <Link to="/booking" className="hover:text-slate-300">
            Booking Session
          </Link>
        </li>
        <li>
          <Link to="/student-id" className="hover:text-slate-300">
            Student ID
          </Link>
        </li>
      </ul>

      <div className="flex items-center gap-4">
        {/* Notification Dropdown */}
        {user && <UserNotificationDropdown />}

        {/* User Info & Logout */}
        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{user.userName}</span>
            </div>
            <Link
              to="/user-logout"
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition shadow-md"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
