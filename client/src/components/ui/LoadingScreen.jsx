import Spinner from "./Spinner.jsx";
import TaskPilotLogo from "./TaskPilotLogo.jsx";

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
    <div className="flex flex-col items-center gap-3">
      <TaskPilotLogo size={44} />
      <div className="text-center">
        <span className="font-bold text-foreground text-lg tracking-tight block leading-tight">
          TaskPilot
        </span>
        <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest leading-none mt-1">
          WORKSPACE
        </p>
      </div>
      <div className="pt-2 flex flex-col items-center gap-2">
        <Spinner size="sm" />
        <span className="text-xs text-muted-foreground font-medium">Loading Workspace…</span>
      </div>
    </div>
  </div>
);

export default LoadingScreen;
