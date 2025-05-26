import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import OrganizationMembers from "../components/OrganizationMembers";
import OrganizationSettings from "../components/OrganizationSettings";
import DashboardStats from "../components/DashboardStats";
import { getUserProfile, getAllTasks, updateOrganization } from "../utils/api";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        navigate("/login");
        return;
      }

      // Fetch user profile and tasks in parallel
      const [userResponse, tasksResponse] = await Promise.all([
        getUserProfile(),
        getAllTasks(),
      ]);

      setUser(userResponse.data);
      setTasks(tasksResponse.data);
      localStorage.setItem("user", JSON.stringify(userResponse.data));
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOrganizationUpdate = async (updatedData) => {
    try {
      await updateOrganization(updatedData);
      await fetchData(); // Refresh data
    } catch (error) {
      console.error("Error updating organization:", error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome, {user?.name}!
            </h1>
            <p className="mt-2 text-gray-600">
              Organization: {user?.organization?.name}
            </p>
            <p className="text-gray-600">
              Role: <span className="capitalize">{user?.role}</span>
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`${
                  activeTab === "overview"
                    ? "border-gray-800 text-gray-800"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab("members")}
                className={`${
                  activeTab === "members"
                    ? "border-gray-800 text-gray-800"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
              >
                Team Members
              </button>
              {user?.role === "admin" && (
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`${
                    activeTab === "settings"
                      ? "border-gray-800 text-gray-800"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium`}
                >
                  Organization Settings
                </button>
              )}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === "overview" && <DashboardStats tasks={tasks} />}
            {activeTab === "members" && <OrganizationMembers />}
            {activeTab === "settings" && user?.role === "admin" && (
              <OrganizationSettings
                organization={user?.organization}
                onUpdate={handleOrganizationUpdate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
