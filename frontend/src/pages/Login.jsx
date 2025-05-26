import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });

    // If already logged in, redirect to dashboard
    const loggedInUser = localStorage.getItem("user");
    if (loggedInUser) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        // Save token and user info
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Refresh page to update navbar dynamically
        window.location.reload();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Login Error:", error);
    }
  };

  return (
    <div className="bg-gray-100 font-sans custom-scrollbar flex items-center justify-center h-screen">
      <style>
        {`
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #1f2937, #111827);
            border-radius: 10px;
          }
        `}
      </style>
      <div
        className="bg-white p-10 rounded-xl shadow-xl max-w-md w-full text-center border border-gray-200"
        data-aos="fade-up"
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:outline-none"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 rounded-md font-semibold hover:bg-gray-700 transition-all"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-gray-600">
          Don't have an account?{" "}
          <a
            href="/register"
            className="text-gray-800 hover:text-gray-600 hover:underline"
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
