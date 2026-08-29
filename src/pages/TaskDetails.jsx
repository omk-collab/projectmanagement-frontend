import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getTaskById,
  createSubTask,
  updateSubTask,
  deleteSubTask,
  updateTask,
} from "../api/task.api";
import { useToast } from "../context/ToastContext";
import Spinner from "../components/common/Spinner";
import ConfirmDialog from "../components/common/ConfirmDialog";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Trash2,
  Plus,
  User,
  Pencil,
  Check,
  X,
  ListChecks,
} from "lucide-react";

const STATUS_CONFIG = {
  todo: { label: "To Do", dot: "bg-slate-400", badge: "bg-slate-100 text-slate-600" },
  in_progress: { label: "In Progress", dot: "bg-amber-400", badge: "bg-amber-50 text-amber-700" },
  done: { label: "Done", dot: "bg-emerald-400", badge: "bg-emerald-50 text-emerald-700" },
};

function TaskDetails() {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const { showToast } = useToast();
  const { projectId, taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [addingSubtask, setAddingSubtask] = useState(false);

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const [savingTitle, setSavingTitle] = useState(false);

  const fetchTask = async () => {
    try {
      const res = await getTaskById(projectId, taskId);
      setTask(res.data.data);
    } catch (err) {
      setError("Failed to load task");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    setAddingSubtask(true);
    try {
      await createSubTask(projectId, taskId, { title: newSubtaskTitle });
      setNewSubtaskTitle("");
      fetchTask();
      showToast("Subtask added");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add subtask";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setAddingSubtask(false);
    }
  };

  const handleToggleSubtask = async (subtask) => {
    try {
      await updateSubTask(projectId, subtask._id, {
        title: subtask.title,
        isCompleted: !subtask.isCompleted,
      });
      fetchTask();
    } catch (err) {
      showToast("Failed to update subtask", "error");
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await deleteSubTask(projectId, subtaskId);
      fetchTask();
      showToast("Subtask deleted");
    } catch (err) {
      showToast("Failed to delete subtask", "error");
    }
  };

  const handleStatusChange = async (newStatus) => {
    const prevStatus = task.status;
    setTask({ ...task, status: newStatus }); // optimistic update
    try {
      const data = new FormData();
      data.append("status", newStatus);
      await updateTask(projectId, taskId, data);
      showToast(`Moved to ${STATUS_CONFIG[newStatus].label}`);
    } catch (err) {
      setTask({ ...task, status: prevStatus }); // revert on failure
      showToast("Failed to update status", "error");
    }
  };

  const startEditTitle = () => {
    setTitleDraft(task.title);
    setEditingTitle(true);
  };

  const saveTitle = async () => {
    if (!titleDraft.trim() || titleDraft === task.title) {
      setEditingTitle(false);
      return;
    }
    setSavingTitle(true);
    try {
      const data = new FormData();
      data.append("title", titleDraft);
      await updateTask(projectId, taskId, data);
      setTask({ ...task, title: titleDraft });
      showToast("Title updated");
      setEditingTitle(false);
    } catch (err) {
      showToast("Failed to update title", "error");
    } finally {
      setSavingTitle(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner size="md" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-red-600 text-sm">{error || "Task not found"}</p>
      </div>
    );
  }

  const completedCount = task.subtasks?.filter((s) => s.isCompleted).length || 0;
  const totalCount = task.subtasks?.length || 0;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center">
          <Link
            to={`/projects/${projectId}`}
            className="text-sm text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Project
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Task header card */}
        <div className="bg-white border border-slate-200 rounded-lg p-6 mb-6 animate-fade-up">
          <div className="flex justify-between items-start gap-4 mb-3">
            {editingTitle ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  autoFocus
                  value={titleDraft}
                  onChange={(e) => setTitleDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && saveTitle()}
                  className="flex-1 text-xl font-semibold text-slate-900 border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-slate-400"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                />
                <button
                  onClick={saveTitle}
                  disabled={savingTitle}
                  className="w-7 h-7 rounded-md bg-slate-900 hover:bg-slate-800 flex items-center justify-center shrink-0"
                >
                  {savingTitle ? (
                    <Spinner />
                  ) : (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </button>
                <button
                  onClick={() => setEditingTitle(false)}
                  className="w-7 h-7 rounded-md border border-slate-300 hover:bg-slate-50 flex items-center justify-center shrink-0"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 group flex-1">
                <h2
                  className="text-xl font-semibold text-slate-900"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {task.title}
                </h2>
                <button
                  onClick={startEditTitle}
                  className="opacity-0 group-hover:opacity-100 transition text-slate-400 hover:text-slate-700"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Status dropdown */}
            <div className="relative shrink-0">
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={`text-xs font-medium pl-5 pr-3 py-1.5 rounded-full appearance-none cursor-pointer border-0 ${status.badge}`}
              >
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>
                    {cfg.label}
                  </option>
                ))}
              </select>
              <span
                className={`absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${status.dot} pointer-events-none`}
              />
            </div>
          </div>

          {task.description && (
            <p className="text-slate-600 text-sm mb-4">{task.description}</p>
          )}

          {task.assignedTo && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <div className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-semibold flex items-center justify-center">
                {task.assignedTo.username?.[0]?.toUpperCase()}
              </div>
              Assigned to{" "}
              <span className="font-medium text-slate-700">
                {task.assignedTo.username}
              </span>
            </div>
          )}
        </div>

        {/* Subtasks card */}
        <div
          className="bg-white border border-slate-200 rounded-lg p-6 animate-fade-up"
          style={{ animationDelay: "80ms" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h3
              className="text-base font-semibold text-slate-900 flex items-center gap-2"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              <ListChecks className="w-4 h-4 text-slate-400" />
              Subtasks
            </h3>
            {totalCount > 0 && (
              <span className="text-xs text-slate-500 font-medium">
                {completedCount}/{totalCount} done
              </span>
            )}
          </div>

          {totalCount > 0 && (
            <div className="w-full h-1.5 bg-slate-100 rounded-full mb-5 overflow-hidden">
              <div
                className="h-full bg-slate-900 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <div className="space-y-1.5 mb-4">
            {totalCount === 0 && (
              <p className="text-sm text-slate-400 py-4 text-center">
                No subtasks yet — add one below.
              </p>
            )}
            {task.subtasks?.map((subtask, i) => (
              <div
                key={subtask._id}
                className="group flex items-center gap-3 hover:bg-slate-50 rounded-md px-2 py-2 transition animate-fade-up"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <button
                  onClick={() => handleToggleSubtask(subtask)}
                  className="shrink-0"
                >
                  {subtask.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-slate-900 fill-slate-900 stroke-white" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400 transition" />
                  )}
                </button>
                <span
                  className={`flex-1 text-sm transition-colors ${
                    subtask.isCompleted
                      ? "line-through text-slate-400"
                      : "text-slate-700"
                  }`}
                >
                  {subtask.title}
                </span>
                <button
                  onClick={() => setConfirmDeleteId(subtask._id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleAddSubtask}
            className="flex gap-2 pt-2 border-t border-slate-100"
          >
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Add a subtask..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm mt-2"
            />
            <button
              type="submit"
              disabled={addingSubtask}
              className="mt-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-md transition flex items-center gap-1.5"
            >
              {addingSubtask ? <Spinner /> : <Plus className="w-4 h-4" />}
              Add
            </button>
          </form>

          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        </div>
      </div>
      <ConfirmDialog
        open={!!confirmDeleteId}
        title="Delete this subtask?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          handleDeleteSubtask(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
      />
    </div>
  );
}

export default TaskDetails;