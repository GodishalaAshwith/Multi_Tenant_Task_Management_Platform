import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NotificationPanel from "./NotificationPanel";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login"); // Redirect to login after logout
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          to="/"
          className="text-3xl font-bold tracking-wide text-white hover:text-gray-200 transition duration-300"
        >
          TaskHub
        </Link>

        <div className="space-x-6 flex items-center">
          <Link
            to="/"
            className="text-gray-100 hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-300"
          >
            Home
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition duration-300"
              >
                Dashboard
              </Link>
              <Link
                to="/tasks"
                className="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition duration-300"
              >
                Tasks
              </Link>
              <button
                onClick={() => setShowNotifications(true)}
                className="text-white hover:text-gray-300 px-4 py-2 transition duration-300"
              >
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </div>
              </button>
              <button
                onClick={handleLogout}
                className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg font-semibold transition duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-100 hover:bg-gray-700 px-4 py-2 rounded-lg transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg transition duration-300"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </nav>
  );
};

export default Navbar;
