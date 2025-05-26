import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [user, setUser] = useState(null);
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
    </nav>
  );
};

export default Navbar;
