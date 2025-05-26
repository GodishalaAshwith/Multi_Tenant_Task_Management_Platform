import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, mirror: false });

    // Check for invite code in URL
    const params = new URLSearchParams(window.location.search);
    const inviteCode = params.get("inviteCode");
    if (inviteCode) {
      setFormData((prev) => ({
        ...prev,
        organizationType: "join",
        inviteCode,
      }));
    }
  }, []);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    organizationType: "create", // 'create' or 'join'
    organizationName: "",
    inviteCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Reset org-specific fields when switching types
      ...(name === "organizationType" && {
        organizationName: value === "create" ? "" : prev.organizationName,
        inviteCode: value === "join" ? "" : prev.inviteCode,
      }),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful! Please log in.");
        navigate("/login");
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (error) {
      setError("An error occurred during registration");
      console.error("Registration Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 font-sans custom-scrollbar flex items-center justify-center min-h-screen p-6">
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
        className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-200"
        data-aos="fade-up"
      >
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          Create Account
        </h2>
        <p className="text-gray-700 mb-6">
          Join us and start managing your tasks!
        </p>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:outline-none"
            required
          />
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

          <div className="flex flex-col space-y-2">
            <div className="flex justify-center space-x-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="organizationType"
                  value="create"
                  checked={formData.organizationType === "create"}
                  onChange={handleChange}
                  className="form-radio text-gray-600"
                />
                <span className="text-gray-700">Create Organization</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="organizationType"
                  value="join"
                  checked={formData.organizationType === "join"}
                  onChange={handleChange}
                  className="form-radio text-gray-600"
                />
                <span className="text-gray-700">Join Organization</span>
              </label>
            </div>

            {formData.organizationType === "create" ? (
              <input
                type="text"
                name="organizationName"
                placeholder="Organization Name"
                value={formData.organizationName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:outline-none"
                required
              />
            ) : (
              <input
                type="text"
                name="inviteCode"
                placeholder="Invitation Code"
                value={formData.inviteCode}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:outline-none"
                required
              />
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-3 rounded-md font-semibold hover:bg-gray-700 transition-all flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <span className="animate-spin h-5 w-5 border-t-2 border-white rounded-full"></span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="mt-4 text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-gray-800 hover:text-gray-600 hover:underline"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
