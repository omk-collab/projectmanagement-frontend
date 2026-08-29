import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getProjects, createProject } from "../api/project.api";
import { useAuth } from "../context/AuthContext";
import ProfileMenu from "../components/layout/ProfileMenu";
import Spinner from "../components/common/Spinner";
import {
  Plus,
  X,
  FolderKanban,
  Users,
  Crown,
  ArrowRight,
  Search,
  ArrowUpDown,
} from "lucide-react";

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="w-9 h-9 rounded-lg bg-slate-100" />
        <div className="w-14 h-5 rounded-full bg-slate-100" />
      </div>
      <div className="h-4 w-2/3 bg-slate-100 rounded mb-2" />
      <div className="h-3 w-full bg-slate-100 rounded mb-1" />
      <div className="h-3 w-1/2 bg-slate-100 rounded mb-4" />
      <div className="h-3 w-20 bg-slate-100 rounded" />
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data.data);
    } catch (err) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await createProject(formData);
      setFormData({ name: "", description: "" });
      setShowForm(false);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  const adminCount = projects.filter((p) => p.role === "admin").length;
  const totalMembers = projects.reduce(
    (sum, p) => sum + (p.project.members || 0),
    0,
  );

  const visibleProjects = useMemo(() => {
    let list = projects.filter((p) =>
      p.project.name.toLowerCase().includes(search.toLowerCase()),
    );
    if (sortBy === "name") {
      list = [...list].sort((a, b) =>
        a.project.name.localeCompare(b.project.name),
      );
    } else if (sortBy === "members") {
      list = [...list].sort((a, b) => b.project.members - a.project.members);
    } else {
      list = [...list].sort(
        (a, b) => new Date(b.project.createdAt) - new Date(a.project.createdAt),
      );
    }
    return list;
  }, [projects, search, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <nav className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span
            className="font-semibold text-slate-900 text-lg"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Project Camp
          </span>
          <ProfileMenu />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Greeting */}
        <div className="mb-8 animate-fade-up">
          <h1
            className="text-2xl sm:text-3xl font-semibold text-slate-900"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Welcome back, {user?.username}
          </h1>
          <p className="text-slate-500 mt-1">
            Here's what's happening across your projects.
          </p>
        </div>

        {/* Stats */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              {
                icon: FolderKanban,
                value: projects.length,
                label: "Total projects",
              },
              { icon: Crown, value: adminCount, label: "You own as admin" },
              { icon: Users, value: totalMembers, label: "Total team members" },
            ].map(({ icon: Icon, value, label }, i) => (
              <div
                key={label}
                className="bg-white border border-slate-200 rounded-lg p-5 flex items-center gap-4 animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
                </div>
                <div>
                  <p
                    className="text-xl font-semibold text-slate-900"
                    style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {value}
                  </p>
                  <p className="text-xs text-slate-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <h2
            className="text-lg font-semibold text-slate-900"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Your Projects
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium px-4 py-2 rounded-md transition flex items-center gap-1.5 w-fit"
          >
            {showForm ? (
              <>
                <X className="w-4 h-4" /> Cancel
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> New Project
              </>
            )}
          </button>
        </div>

        {/* Search + Sort */}
        {!loading && projects.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              />
            </div>
            <div className="relative">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-8 pr-8 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 appearance-none bg-white"
              >
                <option value="recent">Most recent</option>
                <option value="name">Name (A-Z)</option>
                <option value="members">Most members</option>
              </select>
            </div>
          </div>
        )}

        {/* Create form */}
        {showForm && (
          <form
            onSubmit={handleCreate}
            className="bg-white border border-slate-200 rounded-lg p-6 mb-6 space-y-4 animate-fade-up"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-md transition flex items-center gap-2"
            >
              {submitting && <Spinner />}
              {submitting ? "Creating..." : "Create Project"}
            </button>
          </form>
        )}

        {/* Projects */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-14 text-center animate-fade-up">
            <div className="w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <FolderKanban
                className="w-6 h-6 text-slate-400"
                strokeWidth={1.5}
              />
            </div>
            <p className="text-slate-600 font-medium">No projects yet</p>
            <p className="text-sm text-slate-400 mt-1">
              Create your first project to get started.
            </p>
          </div>
        ) : visibleProjects.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-10 text-center">
            <p className="text-slate-500 text-sm">
              No projects match "{search}"
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleProjects.map(({ project, role }, i) => (
              <div
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="group bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer transition-all duration-200 animate-fade-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center transition-transform group-hover:scale-105">
                    <FolderKanban
                      className="w-4 h-4 text-white"
                      strokeWidth={1.75}
                    />
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      role === "admin"
                        ? "bg-slate-900 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {role}
                  </span>
                </div>
                <h3 className="font-medium text-slate-900 mb-1">
                  {project.name}
                </h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                  {project.description || "No description"}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {project.members} member{project.members !== 1 ? "s" : ""}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
