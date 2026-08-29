import { useState, useEffect } from "react";
import {
  getProjectMembers,
  addMember,
  updateMemberRole,
  removeMember,
} from "../../api/project.api";
import { useToast } from "../../context/ToastContext";
import Spinner from "../common/Spinner";
import {
  UserPlus,
  Trash2,
  Shield,
  Crown,
  User as UserIcon,
  Mail,
} from "lucide-react";
import ConfirmDialog from "../common/ConfirmDialog";

const ROLES = ["admin", "project_admin", "member"];

const ROLE_CONFIG = {
  admin: { label: "Admin", icon: Crown, badge: "bg-slate-900 text-white" },
  project_admin: {
    label: "Project Admin",
    icon: Shield,
    badge: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  member: {
    label: "Member",
    icon: UserIcon,
    badge: "bg-slate-100 text-slate-600",
  },
};

function MembersPanel({ projectId, currentUserRole }) {
  const [confirmRemove, setConfirmRemove] = useState(null); // userId jo remove hone wala hai
  const { showToast } = useToast();
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
      showToast("Member added successfully!");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add member";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateMemberRole(projectId, userId, newRole);
      fetchMembers();
      showToast("Role updated");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update role";
      showToast(msg, "error");
    }
  };

  const handleRemove = async (userId) => {
    try {
      await removeMember(projectId, userId);
      fetchMembers();
      showToast("Member removed");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to remove member";
      showToast(msg, "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="md" />
      </div>
    );
  }

  const adminCount = members.filter((m) => m.role === "admin").length;

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p
            className="text-xl font-semibold text-slate-900"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {members.length}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Total members</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p
            className="text-xl font-semibold text-slate-900"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {adminCount}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Admins</p>
        </div>
        <div className="hidden sm:block bg-white border border-slate-200 rounded-lg p-4">
          <p
            className="text-xl font-semibold text-slate-900"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {members.length - adminCount}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">Other roles</p>
        </div>
      </div>

      {/* Member list */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3
            className="text-base font-semibold text-slate-900"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Team Members
          </h3>
        </div>

        <div className="divide-y divide-slate-100">
          {members.map((m, i) => {
            const cfg = ROLE_CONFIG[m.role] || ROLE_CONFIG.member;
            const RoleIcon = cfg.icon;
            return (
              <div
                key={m.user._id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 transition animate-fade-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-900 text-white text-sm font-semibold flex items-center justify-center shrink-0">
                    {m.user.username?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">
                      {m.user.username}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full mt-0.5 ${cfg.badge}`}
                    >
                      <RoleIcon className="w-3 h-3" />
                      {cfg.label}
                    </span>
                  </div>
                </div>

                {isAdmin ? (
                  <div className="flex items-center gap-3">
                    <select
                      value={m.role}
                      onChange={(e) =>
                        handleRoleChange(m.user._id, e.target.value)
                      }
                      className="text-xs border border-slate-300 rounded-md px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_CONFIG[r].label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => setConfirmRemove(m.user._id)}
                      className="text-slate-300 hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-400">{cfg.label}</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add member */}
      {isAdmin && (
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h4 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-slate-400" />
            Invite a member
          </h4>
          <form
            onSubmit={handleAddMember}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Member's email"
                required
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {ROLE_CONFIG[r].label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={submitting}
              className="bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-md transition flex items-center justify-center gap-2"
            >
              {submitting && <Spinner />}
              {submitting ? "Adding..." : "Add"}
            </button>
          </form>
          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        </div>
      )}
      <ConfirmDialog
        open={!!confirmRemove}
        title="Remove member?"
        message="This person will lose access to this project immediately."
        confirmLabel="Remove"
        onCancel={() => setConfirmRemove(null)}
        onConfirm={() => {
          handleRemove(confirmRemove);
          setConfirmRemove(null);
        }}
      />
    </div>
  );
}

export default MembersPanel;
