import React, { useState, useEffect } from "react";
import {
  getOrganizationMembers,
  createInvitation,
  updateUserRole,
  removeUserFromOrg,
} from "../utils/api";

const OrganizationMembers = () => {
  const [members, setMembers] = useState([]);
  const [invitation, setInvitation] = useState({ email: "", role: "member" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const isAdmin = currentUser?.role === "admin";
  const isManager = currentUser?.role === "manager";

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await getOrganizationMembers();
      setMembers(response.data);
    } catch (error) {
      setError("Failed to fetch organization members");
      console.error(error);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await createInvitation(invitation.email, invitation.role);
      setSuccess("Invitation sent successfully");
      setInvitation({ email: "", role: "member" });
      fetchMembers();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setSuccess("Role updated successfully");
      fetchMembers();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update role");
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;

    try {
      await removeUserFromOrg(userId);
      setSuccess("Member removed successfully");
      fetchMembers();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to remove member");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Organization Members
      </h2>

      {(isAdmin || isManager) && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Invite New Member
          </h3>
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="flex space-x-4">
              <input
                type="email"
                value={invitation.email}
                onChange={(e) =>
                  setInvitation({ ...invitation, email: e.target.value })
                }
                placeholder="Email Address"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:outline-none"
                required
              />
              <select
                value={invitation.role}
                onChange={(e) =>
                  setInvitation({ ...invitation, role: e.target.value })
                }
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:outline-none"
                disabled={!isAdmin}
              >
                <option value="member">Member</option>
                <option value="manager">Manager</option>
                {isAdmin && <option value="admin">Admin</option>}
              </select>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-all disabled:bg-gray-400"
              >
                {loading ? "Sending..." : "Invite"}
              </button>
            </div>
          </form>
        </div>
      )}

      {error && <div className="text-red-600 mb-4">{error}</div>}
      {success && <div className="text-green-600 mb-4">{success}</div>}

      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Role
              </th>
              {isAdmin && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map((member) => (
              <tr key={member._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                  {member.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-gray-800">
                  {member.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {isAdmin && member._id !== currentUser?.id ? (
                    <select
                      value={member.role}
                      onChange={(e) =>
                        handleRoleUpdate(member._id, e.target.value)
                      }
                      className="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-gray-500 focus:border-gray-500 focus:outline-none"
                    >
                      <option value="member">Member</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span className="capitalize text-gray-800">
                      {member.role}
                    </span>
                  )}
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    {member._id !== currentUser?.id && (
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrganizationMembers;
