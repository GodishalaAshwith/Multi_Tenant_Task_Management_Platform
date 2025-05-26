import React, { useState, useEffect } from "react";
import { getMyNotifications, markNotificationsAsRead } from "../utils/api";

const NotificationPanel = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await getMyNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const handleMarkAsRead = async (taskId) => {
    try {
      await markNotificationsAsRead(taskId);
      fetchNotifications(); // Refresh notifications
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-end">
      <div className="bg-white w-96 h-screen overflow-y-auto shadow-lg">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No new notifications
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map((notification, index) => (
              <div
                key={index}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <p className="text-sm text-gray-800">{notification.message}</p>
                <div className="mt-2 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.taskId)}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
