import { useState, useEffect } from "react";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../../api/note.api";

function NotesPanel({ projectId, currentUserRole }) {
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
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add note");
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
    } catch (err) {
      setError("Failed to update note");
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await deleteNote(projectId, noteId);
      fetchNotes();
    } catch (err) {
      setError("Failed to delete note");
    }
  };

  if (loading) return <p className="text-gray-500 text-sm">Loading notes...</p>;

  return (
    <div className="bg-white rounded-xl shadow p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Project Notes
      </h3>

      <div className="space-y-3 mb-4">
        {notes.length === 0 && (
          <p className="text-sm text-gray-400">No notes yet.</p>
        )}
        {notes.map((note) => (
          <div key={note._id} className="bg-gray-50 rounded-lg px-4 py-3">
            {editingId === note._id ? (
              <div className="space-y-2">
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(note._id)}
                    className="text-xs bg-blue-600 text-white px-3 py-1 rounded-lg"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-xs text-gray-500"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-start gap-3">
                <div>
                  <p className="text-sm text-gray-700">{note.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    by {note.createdBy?.username || "unknown"}
                  </p>
                </div>
                {isAdmin && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => startEdit(note)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {isAdmin && (
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Add a note..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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

export default NotesPanel;
