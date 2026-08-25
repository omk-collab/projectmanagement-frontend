import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getTaskById,
  createSubTask,
  updateSubTask,
  deleteSubTask,
} from "../api/task.api";

const STATUS_LABELS = {
  todo: "To Do",
  in_progress: "In Progress",
  done: "Done",
};

function TaskDetails() {
  const { projectId, taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [addingSubtask, setAddingSubtask] = useState(false);

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
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add subtask");
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
      setError("Failed to update subtask");
    }
  };

  const handleDeleteSubtask = async (subtaskId) => {
    try {
      await deleteSubTask(projectId, subtaskId);
      fetchTask();
    } catch (err) {
      setError("Failed to delete subtask");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error || "Task not found"}</p>
      </div>
    );
  }

  const completedCount =
    task.subtasks?.filter((s) => s.isCompleted).length || 0;
  const totalCount = task.subtasks?.length || 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm px-6 py-4 flex items-center gap-4">
        <Link
          to={`/projects/${projectId}`}
          className="text-blue-600 hover:underline text-sm"
        >
          ← Back to Project
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {STATUS_LABELS[task.status]}
            </span>
          </div>

          {task.description && (
            <p className="text-gray-600 mb-4">{task.description}</p>
          )}

          {task.assignedTo && (
            <p className="text-sm text-gray-500">
              👤 Assigned to <strong>{task.assignedTo.username}</strong>
            </p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Subtasks</h3>
            {totalCount > 0 && (
              <span className="text-sm text-gray-500">
                {completedCount}/{totalCount} done
              </span>
            )}
          </div>

          <div className="space-y-2 mb-4">
            {task.subtasks?.length === 0 && (
              <p className="text-sm text-gray-400">No subtasks yet.</p>
            )}
            {task.subtasks?.map((subtask) => (
              <div
                key={subtask._id}
                className="flex items-center gap-3 bg-gray-50 rounded-lg px-4 py-2.5"
              >
                <input
                  type="checkbox"
                  checked={subtask.isCompleted}
                  onChange={() => handleToggleSubtask(subtask)}
                  className="w-4 h-4 accent-blue-600"
                />
                <span
                  className={`flex-1 text-sm ${
                    subtask.isCompleted
                      ? "line-through text-gray-400"
                      : "text-gray-700"
                  }`}
                >
                  {subtask.title}
                </span>
                <button
                  onClick={() => handleDeleteSubtask(subtask._id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddSubtask} className="flex gap-2">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Add a subtask..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              type="submit"
              disabled={addingSubtask}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Add
            </button>
          </form>

          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        </div>
      </div>
    </div>
  );
}

export default TaskDetails;
