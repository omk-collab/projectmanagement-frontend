import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getTasks, createTask } from "../api/task.api";
import { getProjectMembers, getProjectById } from "../api/project.api";
import MembersPanel from "../components/project/MembersPanel";
import { useAuth } from "../context/AuthContext";
import NotesPanel from "../components/project/NotesPanel";
import { useToast } from "../context/ToastContext";
import Spinner from "../components/common/Spinner";
import {
  ArrowLeft,
  Plus,
  X,
  ListTodo,
  Loader2,
  CheckCircle2,
  Users,
  StickyNote,
  LayoutGrid,
} from "lucide-react";

const STATUS_OPTIONS = ["todo", "in_progress", "done"];

const STATUS_CONFIG = {
  todo: { label: "To Do", icon: ListTodo, dot: "bg-slate-400" },
  in_progress: { label: "In Progress", icon: Loader2, dot: "bg-amber-400" },
  done: { label: "Done", icon: CheckCircle2, dot: "bg-emerald-400" },
};

function ProjectDetails() {
  const { showToast } = useToast();
  const { projectId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
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
  const [tab, setTab] = useState("tasks");

  const fetchProject = async () => {
    try {
      const res = await getProjectById(projectId);
      setProject(res.data.data);
    } catch (err) {
      // non-critical
    }
  };

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
      // non-critical
    }
  };

  const myRole = members.find((m) => m.user._id === user?._id)?.role;

  useEffect(() => {
    fetchProject();
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
      showToast("Task created!");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create task";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const TABS = [
    { key: "tasks", label: "Tasks", icon: LayoutGrid },
    { key: "members", label: "Members", icon: Users, count: members.length },
    { key: "notes", label: "Notes", icon: StickyNote },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center">
          <Link
            to="/dashboard"
            className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Project header */}
        <div className="mb-8 animate-fade-up">
          <h1
            className="text-2xl sm:text-3xl font-semibold text-slate-900"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {project?.name || "Loading..."}
          </h1>
          {project?.description && (
            <p className="text-slate-500 mt-1">{project.description}</p>
          )}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-slate-200">
          {TABS.map(({ key, label, icon: Icon, count }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition -mb-px ${
                tab === key
                  ? "border-slate-900 text-slate-900"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {count !== undefined && count > 0 && (
                <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-full">
                  {count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tasks tab */}
        {tab === "tasks" && (
          <div className="animate-fade-up">
            <div className="flex justify-between items-center mb-5">
              <p className="text-sm text-slate-500">
                {tasks.length} task{tasks.length !== 1 ? "s" : ""} total
              </p>
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-md transition flex items-center gap-1.5"
              >
                {showForm ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {showForm ? "Cancel" : "New Task"}
              </button>
            </div>

            {showForm && (
              <form
                onSubmit={handleCreate}
                className="bg-white border border-slate-200 rounded-lg p-6 mb-6 space-y-4 animate-fade-up"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_CONFIG[s].label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Assign To
                    </label>
                    <select
                      name="assignedTo"
                      value={formData.assignedTo}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
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
                  className="bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-md transition flex items-center gap-2"
                >
                  {submitting && <Spinner />}
                  {submitting ? "Creating..." : "Create Task"}
                </button>
              </form>
            )}

            {loading ? (
              <div className="flex justify-center py-16">
                <Spinner size="md" />
              </div>
            ) : tasks.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-lg p-14 text-center">
                <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <ListTodo
                    className="w-6 h-6 text-slate-400"
                    strokeWidth={1.5}
                  />
                </div>
                <p className="text-slate-600 font-medium">No tasks yet</p>
                <p className="text-sm text-slate-400 mt-1">
                  Create your first task to get moving.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {STATUS_OPTIONS.map((status, colIdx) => {
                  const { label, dot } = STATUS_CONFIG[status];
                  const colTasks = tasks.filter((t) => t.status === status);
                  return (
                    <div
                      key={status}
                      className="bg-slate-100/60 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-2 mb-3 px-1">
                        <span className={`w-2 h-2 rounded-full ${dot}`} />
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                          {label}
                        </h3>
                        <span className="text-xs text-slate-400 ml-auto">
                          {colTasks.length}
                        </span>
                      </div>
                      <div className="space-y-2.5">
                        {colTasks.map((task, i) => (
                          <div
                            key={task._id}
                            onClick={() =>
                              navigate(
                                `/projects/${projectId}/tasks/${task._id}`,
                              )
                            }
                            className="group bg-white rounded-lg border border-slate-200 p-4 cursor-pointer hover:border-slate-300 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200 animate-fade-up"
                            style={{
                              animationDelay: `${colIdx * 60 + i * 40}ms`,
                            }}
                          >
                            <h4 className="font-medium text-slate-900 text-sm mb-1">
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-xs text-slate-500 line-clamp-2 mb-3">
                                {task.description}
                              </p>
                            )}
                            {task.assignedTo && (
                              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                                <div className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-semibold flex items-center justify-center">
                                  {task.assignedTo.username?.[0]?.toUpperCase()}
                                </div>
                                <span className="text-xs text-slate-500">
                                  {task.assignedTo.username}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                        {colTasks.length === 0 && (
                          <p className="text-xs text-slate-400 text-center py-6">
                            Nothing here
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Members tab */}
        {tab === "members" && (
          <div className="animate-fade-up">
            <MembersPanel projectId={projectId} currentUserRole={myRole} />
          </div>
        )}

        {/* Notes tab */}
        {tab === "notes" && (
          <div className="animate-fade-up">
            <NotesPanel projectId={projectId} currentUserRole={myRole} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectDetails;
