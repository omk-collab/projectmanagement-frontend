import { useState, useEffect } from "react";
import {
  getProjectMembers,
  addMember,
  updateMemberRole,
  removeMember,
} from "../../api/project.api";

const ROLES = ["admin", "project_admin", "member"];

function MembersPanel({ projectId, currentUserRole }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = currentUserRole === "admin";

  const fetchMembers = async () => {
    try {
      const res = await getProjectMembers(projectId);
      setMembers(res.data.data);
    } catch (err) {
      setError("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [projectId]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await addMember(projectId, { email, role });
      setEmail("");
      setRole("member");
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add member");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateMemberRole(projectId, userId, newRole);
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update role");
    }
  };

  const handleRemove = async (userId) => {
    try {
      await removeMember(projectId, userId);
      fetchMembers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove member");
    }
  };

  if (loading)
    return <p className="text-gray-500 text-sm">Loading members...</p>;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Team Members</h3>

      <div className="space-y-2 mb-4">
        {members.map((m) => (
          <div
            key={m.user._id}
            className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2.5"
          >
            <span className="text-sm text-gray-700">{m.user.username}</span>

            {isAdmin ? (
              <div className="flex items-center gap-2">
                <select
                  value={m.role}
                  onChange={(e) => handleRoleChange(m.user._id, e.target.value)}
                  className="text-xs border border-gray-300 rounded-lg px-2 py-1"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleRemove(m.user._id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {m.role}
              </span>
            )}
          </div>
        ))}
      </div>

      {isAdmin && (
        <form onSubmit={handleAddMember} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Member's email"
            required
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-300 rounded-lg px-2 text-sm"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
          >
            Add
          </button>
        </form>
      )}

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

      
    </div>
    
  );
}

export default MembersPanel;
