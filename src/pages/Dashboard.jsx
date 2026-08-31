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
  BriefcaseBusiness,
  CheckCircle2,
} from "lucide-react";

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="w-11 h-11 rounded-xl bg-slate-100" />
        <div className="w-16 h-6 rounded-full bg-slate-100" />
      </div>

      <div className="h-5 w-2/3 bg-slate-100 rounded mt-5 mb-3" />
      <div className="h-3 w-full bg-slate-100 rounded mb-2" />
      <div className="h-3 w-1/2 bg-slate-100 rounded mb-6" />

      <div className="h-3 w-24 bg-slate-100 rounded" />
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data.data || []);
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

      setFormData({
        name: "",
        description: "",
      });

      setShowForm(false);

      await fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  const adminCount = projects.filter((p) => p.role === "admin").length;

  const totalMembers = projects.reduce(
    (sum, p) => sum + Number(p.project?.members || 0),
    0,
  );

  const visibleProjects = useMemo(() => {
    let list = projects.filter((p) =>
      p.project?.name?.toLowerCase().includes(search.toLowerCase()),
    );

    if (sortBy === "name") {
      list = [...list].sort((a, b) =>
        a.project.name.localeCompare(b.project.name),
      );
    }

    if (sortBy === "members") {
      list = [...list].sort(
        (a, b) =>
          Number(b.project.members || 0) - Number(a.project.members || 0),
      );
    }

    if (sortBy === "recent") {
      list = [...list].sort(
        (a, b) => new Date(b.project.createdAt) - new Date(a.project.createdAt),
      );
    }

    return list;
  }, [projects, search, sortBy]);

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* ================= NAVBAR ================= */}

      <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-[68px] flex items-center justify-between">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center">
              <BriefcaseBusiness
                className="w-4.5 h-4.5 text-white"
                strokeWidth={1.8}
              />
            </div>

            <span
              className="font-semibold text-slate-900 text-lg"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Project Camp
            </span>
          </button>

          <ProfileMenu />
        </div>
      </nav>

      {/* ================= MAIN ================= */}

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
        {/* ================= WELCOME ================= */}

        <section className="mb-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">
                Workspace
              </p>

              <h1
                className="text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Welcome back, {user?.username}
              </h1>

              <p className="text-slate-500 mt-2">
                Manage your projects, tasks and team from one place.
              </p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>
        </section>

        {/* ================= STATS ================= */}

        {!loading && projects.length > 0 && (
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-9">
            <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Projects</p>

                  <p
                    className="text-3xl font-semibold text-slate-900 mt-2"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {projects.length}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <FolderKanban
                    className="w-5 h-5 text-slate-700"
                    strokeWidth={1.8}
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 mt-4 text-xs text-slate-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Active workspace
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">Projects You Own</p>

                  <p
                    className="text-3xl font-semibold text-slate-900 mt-2"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {adminCount}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Crown className="w-5 h-5 text-slate-700" strokeWidth={1.8} />
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-400">Admin access</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">Team Members</p>

                  <p
                    className="text-3xl font-semibold text-slate-900 mt-2"
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {totalMembers}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Users className="w-5 h-5 text-slate-700" strokeWidth={1.8} />
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-400">
                Across your projects
              </div>
            </div>
          </section>
        )}

        {/* ================= PROJECT HEADER ================= */}

        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2
                className="text-xl font-semibold text-slate-900"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                Your Projects
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Open a project to manage tasks and team activity.
              </p>
            </div>

            {projects.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search projects"
                    className="w-full sm:w-56 pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400"
                  />
                </div>

                <div className="relative hidden sm:block">
                  <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="pl-8 pr-8 py-2.5 bg-white border border-slate-200 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-slate-300"
                  >
                    <option value="recent">Recent</option>

                    <option value="name">Name A-Z</option>

                    <option value="members">Members</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* ================= CREATE PROJECT ================= */}

          {showForm && (
            <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6 shadow-sm">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Create a new project
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    Give your project a name and a short description.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setError("");
                  }}
                  className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Project name
                  </label>

                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    placeholder="e.g. College Management System"
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Description
                  </label>

                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        description: e.target.value,
                      })
                    }
                    placeholder="What is this project about?"
                    rows={3}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400"
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition"
                  >
                    {submitting && <Spinner />}

                    {submitting ? "Creating..." : "Create Project"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= PROJECT LIST ================= */}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-300 rounded-xl py-16 px-6 text-center">
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <FolderKanban
                  className="w-7 h-7 text-slate-500"
                  strokeWidth={1.5}
                />
              </div>

              <h3 className="font-semibold text-slate-900">No projects yet</h3>

              <p className="text-sm text-slate-500 mt-1 mb-5">
                Create your first project and start organizing your work.
              </p>

              <button
                onClick={() => setShowForm(true)}
                className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg text-sm font-medium inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create Project
              </button>
            </div>
          ) : visibleProjects.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl py-12 text-center">
              <Search className="w-6 h-6 text-slate-300 mx-auto mb-3" />

              <p className="text-sm text-slate-500">
                No projects match "{search}"
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleProjects.map(({ project, role }, i) => (
                <div
                  key={project._id}
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="group relative bg-white border border-slate-200 rounded-xl p-6 cursor-pointer hover:border-slate-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
                  style={{
                    animationDelay: `${i * 40}ms`,
                  }}
                >
                  {/* top */}

                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-xl bg-slate-900 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <FolderKanban
                        className="w-5 h-5 text-white"
                        strokeWidth={1.7}
                      />
                    </div>

                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                        role === "admin"
                          ? "bg-slate-900 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {role}
                    </span>
                  </div>

                  {/* content */}

                  <div className="mt-5">
                    <h3
                      className="text-lg font-semibold text-slate-900 group-hover:text-slate-700"
                      style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {project.name}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1.5 line-clamp-2 min-h-[40px]">
                      {project.description ||
                        "No description added for this project."}
                    </p>
                  </div>

                  {/* bottom */}

                  <div className="border-t border-slate-100 mt-6 pt-4 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Users className="w-3.5 h-3.5" />
                      {project.members || 0} member
                      {project.members !== 1 ? "s" : ""}
                    </span>

                    <span className="flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-slate-900 transition">
                      Open project
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
