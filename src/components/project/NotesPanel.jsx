import { useState, useEffect } from "react";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../../api/note.api";
import { useToast } from "../../context/ToastContext";
import Spinner from "../common/Spinner";
import { StickyNote, Pencil, Trash2, Check, X, Plus } from "lucide-react";
import ConfirmDialog from "../common/ConfirmDialog";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function NotesPanel({ projectId, currentUserRole }) {
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const { showToast } = useToast();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newContent, setNewContent] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  const isAdmin = currentUserRole === "admin";

  const fetchNotes = async () => {
    try {
      const res = await getNotes(projectId);
      setNotes(res.data.data);
    } catch (err) {
      setError("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [projectId]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    setSubmitting(true);
    try {
      await createNote(projectId, { content: newContent });
      setNewContent("");
      fetchNotes();
      showToast("Note added");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add note";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (note) => {
    setEditingId(note._id);
    setEditContent(note.content);
  };

  const handleUpdate = async (noteId) => {
    try {
      await updateNote(projectId, noteId, { content: editContent });
      setEditingId(null);
      fetchNotes();
      showToast("Note updated");
    } catch (err) {
      showToast("Failed to update note", "error");
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await deleteNote(projectId, noteId);
      fetchNotes();
      showToast("Note deleted");
    } catch (err) {
      showToast("Failed to delete note", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner size="md" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {isAdmin && (
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h4 className="text-sm font-medium text-slate-900 mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-slate-400" />
            Add a note
          </h4>
          <form
            onSubmit={handleAdd}
            className="flex flex-col sm:flex-row gap-2"
          >
            <input
              type="text"
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Write something for the team..."
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
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

      {notes.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-14 text-center">
          <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <StickyNote className="w-6 h-6 text-slate-400" strokeWidth={1.5} />
          </div>
          <p className="text-slate-600 font-medium">No notes yet</p>
          <p className="text-sm text-slate-400 mt-1">
            {isAdmin ? "Add the first note above." : "Nothing shared here yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {notes.map((note, i) => (
            <div
              key={note._id}
              className="bg-white border border-slate-200 rounded-lg p-4 animate-fade-up"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              {editingId === note._id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(note._id)}
                      className="flex items-center gap-1 text-xs bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-md transition"
                    >
                      <Check className="w-3.5 h-3.5" /> Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 transition"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
                    <StickyNote
                      className="w-4 h-4 text-amber-500"
                      strokeWidth={1.75}
                    />
                  </div>
                  <p className="text-sm text-slate-700 mb-3 whitespace-pre-wrap">
                    {note.content}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <p className="text-xs text-slate-400">
                      {note.createdBy?.username || "unknown"} ·{" "}
                      {timeAgo(note.createdAt)}
                    </p>
                    {isAdmin && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEdit(note)}
                          className="text-slate-300 hover:text-slate-700 transition"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(note._id)}
                          className="text-slate-300 hover:text-red-500 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={!!confirmDeleteId}
        title="Delete this note?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        onCancel={() => setConfirmDeleteId(null)}
        onConfirm={() => {
          handleDelete(confirmDeleteId);
          setConfirmDeleteId(null);
        }}
      />
    </div>
  );
}

export default NotesPanel;
