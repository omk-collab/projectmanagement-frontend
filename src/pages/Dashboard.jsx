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
  LayoutDashboard,
  CheckSquare,
  StickyNote,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
} from "lucide-react";

function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 animate-pulse">
      <div className="h-4 w-1/2 bg-slate-100 rounded mb-3" />
      <div className="h-3 w-full bg-slate-100 rounded mb-2" />
      <div className="h-3 w-2/3 bg-slate-100 rounded mb-5" />
      <div className="h-2 w-full bg-slate-100 rounded" />
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

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
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create project");
    } finally {
      setSubmitting(false);
    }
  };

  const adminCount = projects.filter((p) => p.role === "admin").length;

  const totalMembers = projects.reduce(
    (sum, p) => sum + (p.project?.members || 0),
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
        (a, b) => (b.project.members || 0) - (a.project.members || 0),
      );
    }

    if (sortBy === "recent") {
      list = [...list].sort(
        (a, b) => new Date(b.project.createdAt) - new Date(a.project.createdAt),
      );
    }

    return list;
  }, [projects, search, sortBy]);

  const username = user?.username?.split("@")[0] || "there";

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-slate-900">
      {/* ================= MOBILE HEADER ================= */}

      <header className="lg:hidden h-16 bg-white border-b border-slate-200 flex items-center justify-between px-5 sticky top-0 z-40">
        <button
          onClick={() => setMobileMenu(!mobileMenu)}
          className="p-2 rounded-lg hover:bg-slate-100"
        >
          <Menu className="w-5 h-5" />
        </button>

        <span className="font-semibold tracking-tight">Project Camp</span>

        <ProfileMenu />
      </header>

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`
          fixed left-0 top-0 bottom-0 z-50
          w-64 bg-white border-r border-slate-200
          flex flex-col
          transition-transform duration-200
          lg:translate-x-0
          ${mobileMenu ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}

        <div className="h-20 px-6 flex items-center border-b border-slate-100">
          <div>
            <h1 className="font-semibold text-lg tracking-tight">
              Project Camp
            </h1>

            <p className="text-xs text-slate-400 mt-0.5">Project management</p>
          </div>
        </div>

        {/* Navigation */}

        <div className="px-3 py-6 flex-1">
          <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">
            <button
              className="
                w-full flex items-center gap-3
                px-3 py-2.5 rounded-lg
                bg-slate-900 text-white
                text-sm font-medium
              "
            >
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </button>

            <button
              onClick={() => navigate("/")}
              className="
                w-full flex items-center gap-3
                px-3 py-2.5 rounded-lg
                text-slate-600 hover:bg-slate-100
                text-sm transition
              "
            >
              <FolderKanban className="w-4 h-4" />
              Projects
            </button>

            <button
              className="
                w-full flex items-center gap-3
                px-3 py-2.5 rounded-lg
                text-slate-600 hover:bg-slate-100
                text-sm transition
              "
            >
              <CheckSquare className="w-4 h-4" />
              Tasks
            </button>

            <button
              className="
                w-full flex items-center gap-3
                px-3 py-2.5 rounded-lg
                text-slate-600 hover:bg-slate-100
                text-sm transition
              "
            >
              <StickyNote className="w-4 h-4" />
              Notes
            </button>
          </nav>

          <p className="px-3 mt-8 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Account
          </p>

          <nav className="space-y-1">
            <button
              onClick={() => navigate("/profile")}
              className="
                w-full flex items-center gap-3
                px-3 py-2.5 rounded-lg
                text-slate-600 hover:bg-slate-100
                text-sm transition
              "
            >
              <Settings className="w-4 h-4" />
              Profile
            </button>
          </nav>
        </div>

        {/* User area */}

        <div className="border-t border-slate-100 p-4">
          <div className="flex items-center gap-3">
            <div
              className="
                w-9 h-9 rounded-full
                bg-slate-900 text-white
                flex items-center justify-center
                text-sm font-medium
              "
            >
              {username.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">
                {user?.username || "User"}
              </p>

              <p className="text-xs text-slate-400 truncate">
                {user?.email || ""}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}

      {mobileMenu && (
        <div
          onClick={() => setMobileMenu(false)}
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
        />
      )}

      {/* ================= MAIN ================= */}

      <main className="lg:ml-64 min-h-screen">
        {/* Desktop topbar */}

        <div className="hidden lg:flex h-20 bg-white border-b border-slate-200 items-center justify-end px-8">
          <ProfileMenu />
        </div>

        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
          {/* ================= GREETING ================= */}

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
            <div>
              <p className="text-sm text-slate-400 mb-1">Workspace overview</p>

              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                Welcome back, {username}
              </h2>

              <p className="text-sm text-slate-500 mt-2">
                Keep track of your projects and team work.
              </p>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="
                inline-flex items-center justify-center gap-2
                bg-slate-900 hover:bg-slate-800
                text-white text-sm font-medium
                px-4 py-2.5 rounded-lg
                transition
                shadow-sm
              "
            >
              {showForm ? (
                <>
                  <X className="w-4 h-4" />
                  Close
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  New project
                </>
              )}
            </button>
          </div>

          {/* ================= STATS ================= */}

          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                      Projects
                    </p>

                    <p className="text-2xl font-semibold mt-2">
                      {projects.length}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <FolderKanban className="w-5 h-5 text-slate-700" />
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-3">
                  Projects you're part of
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                      Owned
                    </p>

                    <p className="text-2xl font-semibold mt-2">{adminCount}</p>
                  </div>

                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-slate-700" />
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-3">
                  Projects you manage
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                      Team members
                    </p>

                    <p className="text-2xl font-semibold mt-2">
                      {totalMembers}
                    </p>
                  </div>

                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Users className="w-5 h-5 text-slate-700" />
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-3">
                  Across your projects
                </p>
              </div>
            </div>
          )}

          {/* ================= PROJECT SECTION ================= */}

          <div className="bg-white border border-slate-200 rounded-xl">
            <div className="p-5 sm:p-6 border-b border-slate-100">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold">Your projects</h3>

                  <p className="text-sm text-slate-400 mt-1">
                    Open a project to manage tasks, notes and members.
                  </p>
                </div>

                {!loading && projects.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

                      <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search projects"
                        className="
                          w-full sm:w-56
                          pl-9 pr-3 py-2
                          border border-slate-200
                          rounded-lg
                          text-sm
                          bg-slate-50
                          focus:bg-white
                          focus:outline-none
                          focus:ring-2
                          focus:ring-slate-200
                        "
                      />
                    </div>

                    <div className="relative">
                      <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />

                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="
                          w-full sm:w-auto
                          pl-8 pr-8 py-2
                          border border-slate-200
                          rounded-lg
                          text-sm
                          bg-slate-50
                          focus:outline-none
                        "
                      >
                        <option value="recent">Most recent</option>

                        <option value="name">Name A-Z</option>

                        <option value="members">Most members</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ================= CREATE PROJECT ================= */}

            {showForm && (
              <form
                onSubmit={handleCreate}
                className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/60"
              >
                <div className="max-w-2xl space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">
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
                      required
                      placeholder="e.g. College Management System"
                      className="
                        w-full px-3 py-2.5
                        border border-slate-200
                        rounded-lg
                        bg-white
                        text-sm
                        focus:outline-none
                        focus:ring-2
                        focus:ring-slate-200
                      "
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5">
                      Description
                    </label>

                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      placeholder="What is this project about?"
                      className="
                        w-full px-3 py-2.5
                        border border-slate-200
                        rounded-lg
                        bg-white
                        text-sm
                        resize-none
                        focus:outline-none
                        focus:ring-2
                        focus:ring-slate-200
                      "
                    />
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="
                      inline-flex items-center gap-2
                      bg-slate-900
                      hover:bg-slate-800
                      disabled:opacity-60
                      text-white
                      text-sm font-medium
                      px-4 py-2.5
                      rounded-lg
                    "
                  >
                    {submitting && <Spinner />}
                    {submitting ? "Creating..." : "Create project"}
                  </button>
                </div>
              </form>
            )}

            {/* ================= PROJECT LIST ================= */}

            <div className="p-5 sm:p-6">
              {loading ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <SkeletonCard key={i} />
                  ))}
                </div>
              ) : projects.length === 0 ? (
                <div className="py-14 text-center">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                    <FolderKanban className="w-6 h-6 text-slate-400" />
                  </div>

                  <h4 className="font-medium">No projects yet</h4>

                  <p className="text-sm text-slate-400 mt-1 mb-5">
                    Create your first project to get started.
                  </p>

                  <button
                    onClick={() => setShowForm(true)}
                    className="
                      inline-flex items-center gap-2
                      bg-slate-900
                      text-white
                      text-sm
                      px-4 py-2.5
                      rounded-lg
                    "
                  >
                    <Plus className="w-4 h-4" />
                    Create project
                  </button>
                </div>
              ) : visibleProjects.length === 0 ? (
                <div className="py-12 text-center text-sm text-slate-400">
                  No projects match "{search}"
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {visibleProjects.map(({ project, role }) => (
                    <button
                      key={project._id}
                      onClick={() => navigate(`/projects/${project._id}`)}
                      className="
                          text-left
                          group
                          border border-slate-200
                          rounded-xl
                          p-5
                          hover:border-slate-300
                          hover:shadow-sm
                          transition
                          bg-white
                        "
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              w-10 h-10
                              rounded-lg
                              bg-slate-100
                              flex items-center justify-center
                            "
                          >
                            <FolderKanban className="w-5 h-5 text-slate-700" />
                          </div>

                          <div>
                            <h4 className="font-medium text-slate-900">
                              {project.name}
                            </h4>

                            <span className="text-xs text-slate-400">
                              {role === "admin" ? "Owner" : "Member"}
                            </span>
                          </div>
                        </div>

                        <ChevronRight
                          className="
                              w-4 h-4
                              text-slate-300
                              group-hover:text-slate-700
                              group-hover:translate-x-0.5
                              transition
                            "
                        />
                      </div>

                      <p
                        className="
                          text-sm
                          text-slate-500
                          mt-4
                          line-clamp-2
                          min-h-[40px]
                        "
                      >
                        {project.description ||
                          "No description added for this project."}
                      </p>

                      <div
                        className="
                          flex
                          items-center
                          justify-between
                          mt-5
                          pt-4
                          border-t
                          border-slate-100
                          text-xs
                          text-slate-400
                        "
                      >
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" />
                          {project.members || 0}{" "}
                          {project.members === 1 ? "member" : "members"}
                        </span>

                        <span
                          className="
                            flex items-center gap-1
                            group-hover:text-slate-700
                            transition
                          "
                        >
                          Open project
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
