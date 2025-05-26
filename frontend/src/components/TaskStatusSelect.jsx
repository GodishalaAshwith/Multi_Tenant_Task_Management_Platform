import React from "react";

const TaskStatusSelect = ({ status, onStatusChange, isExpired, canEdit }) => {
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

  if (!canEdit) {
    return (
      <span
        className={`inline-block text-sm rounded-full px-3 py-1 ${getStatusColor(
          status
        )}`}
      >
        {status}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        disabled={isExpired}
        className={`
          text-sm rounded-full px-3 py-1 cursor-pointer
          ${isExpired ? "opacity-50 cursor-not-allowed" : ""}
          ${getStatusColor(status)}
        `}
      >
        <option value="Todo">Todo</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
        {status === "Expired" && <option value="Expired">Expired</option>}
      </select>
      {!isExpired && (
        <span className="text-xs text-gray-500">Click to change status</span>
      )}
    </div>
  );
};

export default TaskStatusSelect;
