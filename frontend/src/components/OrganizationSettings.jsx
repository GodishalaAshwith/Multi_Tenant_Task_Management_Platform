import React, { useState } from "react";

const OrganizationSettings = ({ organization, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: organization?.name || "",
    theme: organization?.theme || "light",
    // Add more settings as needed
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onUpdate(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating organization:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Organization Settings
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Edit Settings
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Organization Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Theme
            </label>
            <select
              value={formData.theme}
              onChange={(e) =>
                setFormData({ ...formData, theme: e.target.value })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">
              Organization Name
            </h3>
            <p className="mt-1 text-lg text-gray-900">{organization?.name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Theme</h3>
            <p className="mt-1 text-lg text-gray-900 capitalize">
              {organization?.theme || "Light"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizationSettings;
