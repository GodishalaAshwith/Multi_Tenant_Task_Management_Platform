import React, { useState, useEffect } from "react";
import { getAllTasks, getMyTasks } from "../utils/api";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState("all"); // all or my-tasks
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    category: "all",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdminOrManager = ["admin", "manager"].includes(user?.role);

  const fetchTasks = async () => {
    try {
      const response = await (viewMode === "all"
        ? getAllTasks()
        : getMyTasks());
      setTasks(response.data);
      setFilteredTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [viewMode]);

  useEffect(() => {
    // Apply filters and search
    let result = tasks;

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply filters
    if (filters.status !== "all") {
      result = result.filter((task) => task.status === filters.status);
    }
    if (filters.priority !== "all") {
      result = result.filter((task) => task.priority === filters.priority);
    }
    if (filters.category !== "all") {
      result = result.filter((task) => task.category === filters.category);
    }

    setFilteredTasks(result);
  }, [searchTerm, filters, tasks]);

  const handleTaskAdded = () => {
    setShowForm(false);
    fetchTasks();
  };

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          {isAdminOrManager && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Create Task
            </button>
          )}
        </div>

        {/* View Mode and Search Controls */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setViewMode("all")}
              className={`px-4 py-2 rounded-lg ${
                viewMode === "all"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              All Tasks
            </button>
            <button
              onClick={() => setViewMode("my-tasks")}
              className={`px-4 py-2 rounded-lg ${
                viewMode === "my-tasks"
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              My Tasks
            </button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          >
            <option value="all">All Status</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Expired">Expired</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          >
            <option value="all">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
          >
            <option value="all">All Categories</option>
            <option value="Bug">Bug</option>
            <option value="Feature">Feature</option>
            <option value="Improvement">Improvement</option>
          </select>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl">
            <TaskForm
              onSuccess={handleTaskAdded}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      <TaskList tasks={filteredTasks} onTasksChange={fetchTasks} />
    </div>
  );
};

export default Tasks;
