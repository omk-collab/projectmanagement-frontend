import { Link } from "react-router-dom";
function AuthVisualPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-between w-1/2 bg-slate-900 p-10 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 40%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.06), transparent 45%)",
        }}
      />

      <Link
        to="/"
        className="relative text-white font-semibold tracking-tight text-lg"
      >
        Project Camp
      </Link>

      <div className="relative">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex gap-1.5 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {["To Do", "In Progress", "Done"].map((col, i) => (
              <div
                key={col}
                className="bg-white/5 rounded-lg p-2.5 border border-white/10"
              >
                <p className="text-[10px] font-semibold text-white/50 uppercase mb-2">
                  {col}
                </p>
                {[...Array(i === 1 ? 2 : 1)].map((_, j) => (
                  <div
                    key={j}
                    className="bg-white/5 border border-white/10 rounded-md p-2 mb-1.5 text-[11px] text-white/70"
                  >
                    Task {j + 1}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-white text-xl font-medium leading-snug">
            Organize projects, assign roles, and ship work — together.
          </p>
          <p className="text-white/50 text-sm mt-2">
            Role-based access · Task tracking · Shared notes
          </p>
        </div>
      </div>

      <p className="relative text-white/30 text-xs">
        Built with React, Node.js & MongoDB
      </p>
    </div>
  );
}

export default AuthVisualPanel;
