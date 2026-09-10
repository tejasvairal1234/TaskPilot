import { Outlet } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle.jsx";
import TaskPilotLogo from "../ui/TaskPilotLogo.jsx";

const AuthLayout = () => (
  <div className="min-h-screen bg-background text-foreground flex relative transition-colors duration-200">
    {/* Floating Theme Toggle in top-right */}
    <div className="absolute top-4 right-4 z-20">
      <ThemeToggle />
    </div>

    {/* Left panel — decorative */}
    <div className="hidden lg:flex lg:w-[45%] bg-brand-600 dark:bg-brand-700 relative overflow-hidden flex-col justify-between p-12 select-none">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      {/* Decorative circles */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/10 rounded-full" />
      <div className="absolute -bottom-32 -left-16 w-96 h-96 bg-white/5 rounded-full" />

      {/* Logo */}
      <div className="relative flex items-center gap-3">
        <TaskPilotLogo size={38} />
        <div>
          <span className="text-white font-bold text-xl tracking-tight block leading-tight">
            TaskPilot
          </span>
          <p className="text-[10px] text-brand-100 font-semibold uppercase tracking-widest leading-none mt-0.5">
            WORKSPACE
          </p>
        </div>
      </div>

      {/* Headline */}
      <div className="relative">
        <h1 className="text-4xl font-bold text-white leading-tight mb-4">
          Organize work,<br />ship faster.
        </h1>
        <p className="text-brand-100 text-lg leading-relaxed">
          The modern task management platform built for high-performance teams.
        </p>

        {/* Feature list */}
        <div className="mt-8 space-y-3">
          {[
            "Smart task board with drag-and-drop",
            "Real-time progress tracking",
            "Priority & status management",
            "Checklist & attachment support",
          ].map((feature) => (
            <div key={feature} className="flex items-center gap-3 text-brand-100">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-sm font-medium">{feature}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="relative text-brand-200 text-sm">© TaskPilot. All rights reserved.</p>
    </div>

    {/* Right panel — form */}
    <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
      <div className="w-full max-w-[420px]">
        <Outlet />
      </div>
    </div>
  </div>
);

export default AuthLayout;
