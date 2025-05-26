import React, { useState } from "react";
import { updateTask, deleteTask } from "../utils/api";
import TaskStatusSelect from "./TaskStatusSelect";

const TaskList = ({ tasks, onTasksChange }) => {
  const [editingTask, setEditingTask] = useState(null);
  const [showTaskDetails, setShowTaskDetails] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdminOrManager = ["admin", "manager"].includes(user?.role);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "text-red-600";
      case "Medium":
        return "text-yellow-600";
      case "Low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      onTasksChange();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const handleTaskEdit = async (taskId, updatedData) => {
    try {
      await updateTask(taskId, updatedData);
      setEditingTask(null);
      onTasksChange();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTask(taskId);
      onTasksChange();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const canEditTaskStatus = (task) => {
    return task.assignedTo._id === user?.id || isAdminOrManager;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assigned To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {task.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {task.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {task.assignedTo.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {task.assignedTo.email}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <TaskStatusSelect
                    status={task.status}
                    onStatusChange={(newStatus) =>
                      handleStatusChange(task._id, newStatus)
                    }
                    isExpired={task.status === "Expired"}
                    canEdit={canEditTaskStatus(task)}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`${getPriorityColor(task.priority)} font-medium`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{task.category}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {formatDate(task.dueDate)}
                  </span>
                </td>{" "}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setShowTaskDetails(task)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Details
                  </button>
                  {isAdminOrManager && (
                    <>
                      <button
                        onClick={() => setEditingTask(task)}
                        className="text-gray-600 hover:text-gray-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Task Details Modal */}
      {showTaskDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{showTaskDetails.title}</h2>
              <button
                onClick={() => setShowTaskDetails(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">Description</h3>
                <p className="text-gray-700">{showTaskDetails.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold">Assigned To</h3>
                  <p className="text-gray-700">
                    {showTaskDetails.assignedTo.name}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Created by</h3>
                  <p className="text-gray-700">
                    {showTaskDetails.createdBy.name}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Status</h3>
                  <p className="text-gray-700">{showTaskDetails.status}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Priority</h3>
                  <p className={getPriorityColor(showTaskDetails.priority)}>
                    {showTaskDetails.priority}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold">Category</h3>
                  <p className="text-gray-700">{showTaskDetails.category}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Due Date</h3>
                  <p className="text-gray-700">
                    {formatDate(showTaskDetails.dueDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Edit Task</h2>
              <button
                onClick={() => setEditingTask(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleTaskEdit(editingTask._id, editingTask);
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  value={editingTask.title}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, title: e.target.value })
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={editingTask.description}
                  onChange={(e) =>
                    setEditingTask({
                      ...editingTask,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Priority
                  </label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        priority: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    value={editingTask.category}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        category: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  >
                    <option value="Bug">Bug</option>
                    <option value="Feature">Feature</option>
                    <option value="Improvement">Improvement</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editingTask.dueDate.split("T")[0]}
                    onChange={(e) =>
                      setEditingTask({
                        ...editingTask,
                        dueDate: e.target.value,
                      })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gray-800 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
