import { Link } from "react-router-dom";
import {
  FolderKanban,
  ListChecks,
  StickyNote,
  ShieldCheck,
  MailCheck,
  Users,
  ArrowRight,
  Mail,
  ExternalLink,
  Link as LinkIcon,
  Code2,
} from "lucide-react";

function Landing() {
  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <nav className="border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur-sm z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <span
            className="font-semibold text-slate-900 text-lg"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Project Camp
          </span>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-slate-600 hover:text-slate-900 transition"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="text-sm bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-md transition"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(15,23,42,0.06), transparent 40%), radial-gradient(circle at 80% 0%, rgba(15,23,42,0.05), transparent 45%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
          <span className="inline-block text-xs font-medium text-slate-500 border border-slate-200 rounded-full px-3 py-1 mb-6">
            Built with React, Node.js & MongoDB
          </span>
          <h1
            className="text-4xl sm:text-6xl font-semibold text-slate-900 max-w-3xl mx-auto leading-[1.1]"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Run your projects without the chaos
          </h1>
          <p className="text-lg text-slate-500 mt-5 max-w-xl mx-auto">
            Organize tasks, manage your team with role-based access, and keep
            everything documented — all in one clean workspace.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              to="/register"
              className="group bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-md text-sm font-medium transition flex items-center gap-2"
            >
              Create free account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="border border-slate-300 hover:border-slate-400 text-slate-700 px-6 py-3 rounded-md text-sm font-medium transition"
            >
              Log in
            </Link>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6 pb-24">
          <div className="border border-slate-200 rounded-xl shadow-sm bg-slate-50 p-4">
            <div className="flex gap-1.5 mb-3">
              <span className="w-3 h-3 rounded-full bg-slate-300" />
              <span className="w-3 h-3 rounded-full bg-slate-300" />
              <span className="w-3 h-3 rounded-full bg-slate-300" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {["To Do", "In Progress", "Done"].map((col, i) => (
                <div
                  key={col}
                  className="bg-white rounded-lg border border-slate-200 p-3"
                >
                  <p className="text-xs font-semibold text-slate-500 uppercase mb-2">
                    {col}
                  </p>
                  {[...Array(i === 1 ? 2 : 1)].map((_, j) => (
                    <div
                      key={j}
                      className="bg-slate-50 border border-slate-100 rounded-md p-2 mb-2 text-xs text-slate-600"
                    >
                      Sample task {j + 1}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-3 text-center">
          <div>
            <p
              className="text-2xl font-semibold text-slate-900"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              3
            </p>
            <p className="text-xs text-slate-500 mt-1">Role levels</p>
          </div>
          <div>
            <p
              className="text-2xl font-semibold text-slate-900"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              100%
            </p>
            <p className="text-xs text-slate-500 mt-1">JWT secured</p>
          </div>
          <div>
            <p
              className="text-2xl font-semibold text-slate-900"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Free
            </p>
            <p className="text-xs text-slate-500 mt-1">To get started</p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <h2
            className="text-2xl sm:text-3xl font-semibold text-slate-900"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Everything your team needs
          </h2>
          <p className="text-slate-500 mt-2">
            From project setup to task completion, in one place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "Organize by project",
              desc: "Create projects, invite teammates by email, and assign roles — Admin, Project Admin, or Member.",
              Icon: FolderKanban,
            },
            {
              title: "Track tasks & subtasks",
              desc: "Break work into tasks with assignees, statuses, and file attachments. Move things from To Do to Done.",
              Icon: ListChecks,
            },
            {
              title: "Shared project notes",
              desc: "Log decisions and updates in shared notes so context never gets lost between teammates.",
              Icon: StickyNote,
            },
            {
              title: "Role-based access",
              desc: "Fine-grained permissions ensure the right people can manage members, tasks, and notes.",
              Icon: ShieldCheck,
            },
            {
              title: "Email verification",
              desc: "Secure sign-up flow with email verification and password reset built in.",
              Icon: MailCheck,
            },
            {
              title: "Built for teams",
              desc: "Designed for small teams who want structure without the complexity of enterprise tools.",
              Icon: Users,
            },
          ].map(({ title, desc, Icon }) => (
            <div
              key={title}
              className="border border-slate-200 rounded-lg p-6 hover:border-slate-300 hover:shadow-sm transition"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-white" strokeWidth={1.75} />
              </div>
              <h3 className="font-medium text-slate-900 mb-1">{title}</h3>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <p
            className="text-2xl sm:text-3xl font-medium text-white leading-snug"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            "A clean, no-nonsense way to keep our small team's projects
            organized — without the overhead of bigger tools."
          </p>
          <p className="text-slate-400 text-sm mt-6">
            — Built as a full-stack learning project
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h2
          className="text-2xl sm:text-3xl font-semibold text-slate-900"
          style={{ fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Ready to get organized?
        </h2>
        <p className="text-slate-500 mt-2">
          Create your account and set up your first project in minutes.
        </p>
        <Link
          to="/register"
          className="group inline-flex items-center gap-2 mt-6 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-md text-sm font-medium transition"
        >
          Get started for free
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </section>

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <h2
              className="text-2xl sm:text-3xl font-semibold text-slate-900"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Let's connect
            </h2>
            <p className="text-slate-500 mt-2">
              Built by Om Khairnar — check out more of my work or get in touch.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
            <a
              href="https://github.com/omk-collab"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm px-5 py-2.5 rounded-md text-sm font-medium text-slate-700 transition"
            >
              <Code2 className="w-4 h-4" />
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/om-khairnar-scoe/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm px-5 py-2.5 rounded-md text-sm font-medium text-slate-700 transition"
            >
              <LinkIcon className="w-4 h-4" />
              LinkedIn
            </a>
            <a
              href="mailto:omkhairnar49@gmail.com"
              className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm px-5 py-2.5 rounded-md text-sm font-medium text-slate-700 transition"
            >
              <Mail className="w-4 h-4" />
              Email
            </a>
          </div>

          <div>
            <p className="text-center text-sm font-medium text-slate-500 mb-6">
              More projects
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <a
                href="https://omkhairnarportfolio.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 hover:shadow-sm transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-slate-900 text-sm">
                    Portfolio
                  </h3>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition" />
                </div>
                <p className="text-xs text-slate-500">
                  My personal portfolio showcasing skills and projects.
                </p>
              </a>

              <a
                href="https://weatherapp-omkhairnar.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 hover:shadow-sm transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-slate-900 text-sm">
                    Weather App
                  </h3>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition" />
                </div>
                <p className="text-xs text-slate-500">
                  A clean weather forecast app built with React.
                </p>
              </a>

              <a
                href="https://github.com/omk-collab"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-300 hover:shadow-sm transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-slate-900 text-sm">
                    All Repositories
                  </h3>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition" />
                </div>
                <p className="text-xs text-slate-500">
                  Browse all my projects and code on GitHub.
                </p>
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-center">
          <p className="text-sm text-slate-400">
            Project Camp — a full-stack project management app.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Landing;