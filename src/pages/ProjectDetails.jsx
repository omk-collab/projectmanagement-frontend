import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getTasks, createTask } from "../api/task.api";
import { getProjectMembers } from "../api/project.api";
import MembersPanel from "../components/project/MembersPanel";
import { useAuth } from "../context/AuthContext";
import NotesPanel from "../components/project/NotesPanel";

const STATUS_OPTIONS = ["todo", "in_progress", "done"];

const STATUS_LABELS = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

function ProjectDetails() {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    status: "todo",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await getTasks(projectId);
      setTasks(res.data.data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await getProjectMembers(projectId);
      setMembers(res.data.data);
    } catch (err) {
      // non-critical, ignore
    }
  };

  const myRole = members.find((m) => m.user._id === user?._id)?.role;

  useEffect(() => {
    fetchTasks();
    fetchMembers();
  }, [projectId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("status", formData.status);
      if (formData.assignedTo) data.append("assignedTo", formData.assignedTo);

      await createTask(projectId, data);
      setFormData({
        title: "",
        description: "",
        assignedTo: "",
        status: "todo",
      });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <Link to="/dashboard" className="text-blue-600 hover:underline text-sm">
          ← Back to Dashboard
        </Link>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Tasks</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition"
          >
            {showForm ? "Cancel" : "+ New Task"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleCreate}
            className="bg-white rounded-xl shadow p-6 mb-6 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign To
                </label>
                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Unassigned</option>
                  {members.map((m) => (
                    <option key={m.user._id} value={m.user._id}>
                      {m.user.username}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium px-4 py-2 rounded-lg transition"
            >
              {submitting ? "Creating..." : "Create Task"}
            </button>
          </form>
        )}

        {loading ? (
          <p className="text-gray-500">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center text-gray-500">
            No tasks yet. Create your first one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STATUS_OPTIONS.map((status) => (
              <div key={status} className="bg-gray-50 rounded-xl p-3">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase">
                  {STATUS_LABELS[status]}
                </h3>
                <div className="space-y-3">
                  {tasks
                    .filter((t) => t.status === status)
                    .map((task) => (
                      <div
                        key={task._id}
                        onClick={() =>
                          navigate(`/projects/${projectId}/tasks/${task._id}`)
                        }
                        className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition"
                      >
                        <h4 className="font-medium text-gray-800">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-sm text-gray-500 mt-1">
                            {task.description}
                          </p>
                        )}
                        {task.assignedTo && (
                          <p className="text-xs text-blue-600 mt-2">
                            👤 {task.assignedTo.username}
                          </p>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8">
          <MembersPanel projectId={projectId} currentUserRole={myRole} />
        </div>
       

        <div className="mt-8">
          <NotesPanel projectId={projectId} currentUserRole={myRole} />
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;