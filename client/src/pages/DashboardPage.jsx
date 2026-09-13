import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CheckSquare,
  Clock,
  Zap,
  CheckCircle2,
  Plus,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";
import { taskService } from "../services/taskService.js";
import {
  getGreeting,
  getFirstName,
  formatDate,
  getErrorMessage,
} from "../utils/helpers.js";
import { STATUS_COLORS, PRIORITY_COLORS } from "../utils/constants.js";
import StatusBadge from "../components/ui/StatusBadge.jsx";
import PriorityBadge from "../components/ui/PriorityBadge.jsx";
import { StatCardSkeleton } from "../components/ui/Skeleton.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import Button from "../components/ui/Button.jsx";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, colorClass, loading }) => {
  if (loading) return <StatCardSkeleton />;
  return (
    <div className="card-hover group">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-muted-foreground">
          {label}
        </p>
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorClass} transition-transform group-hover:scale-110`}
        >
          <Icon size={20} />
        </div>
      </div>
      <p className="text-3xl font-bold text-foreground mb-0.5">
        {value}
      </p>
    </div>
  );
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-card text-card-foreground border border-border rounded-xl shadow-xl px-3.5 py-2">
        <p className="text-sm font-semibold text-foreground">
          {payload[0].name}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {payload[0].value} task{payload[0].value !== 1 ? "s" : ""}
        </p>
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await taskService.getDashboardStats();
        setStats(data.stats);
        setRecentTasks(data.recentTasks);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const statusChartData = stats
    ? [
        {
          name: "Pending",
          value: stats.pending,
          color: STATUS_COLORS.pending.hex,
        },
        {
          name: "In Progress",
          value: stats.inProgress,
          color: STATUS_COLORS["in-progress"].hex,
        },
        {
          name: "Completed",
          value: stats.completed,
          color: STATUS_COLORS.completed.hex,
        },
      ].filter((d) => d.value > 0)
    : [];

  const priorityChartData = stats
    ? [
        {
          name: "Low",
          value: stats.byPriority.low,
          fill: PRIORITY_COLORS.low.hex,
        },
        {
          name: "Medium",
          value: stats.byPriority.medium,
          fill: PRIORITY_COLORS.medium.hex,
        },
        {
          name: "High",
          value: stats.byPriority.high,
          fill: PRIORITY_COLORS.high.hex,
        },
      ]
    : [];

  return (
    <div className="p-6 lg:p-10 space-y-8 max-w-7xl mx-auto animate-fade-in text-foreground">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title mb-1">
            {getGreeting()}, {getFirstName(user?.name)} 👋
          </h1>
          <p className="text-muted-foreground text-sm">
            Here's what's happening across your workspace today.
          </p>
        </div>
        <Link to="/tasks/create">
          <Button variant="primary" className="inline-flex items-center gap-2">
            <Plus size={16} />
            <span>New Task</span>
          </Button>
        </Link>
      </div>

      {/* Error state */}
      {error && (
        <div className="rounded-xl bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Tasks"
          value={stats?.totalTasks ?? "—"}
          loading={loading}
          colorClass="bg-primary/10 text-primary"
          icon={CheckSquare}
        />
        <StatCard
          label="Pending"
          value={stats?.pending ?? "—"}
          loading={loading}
          colorClass="bg-purple-100/80 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300"
          icon={Clock}
        />
        <StatCard
          label="In Progress"
          value={stats?.inProgress ?? "—"}
          loading={loading}
          colorClass="bg-sky-100/80 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300"
          icon={Zap}
        />
        <StatCard
          label="Completed"
          value={stats?.completed ?? "—"}
          loading={loading}
          colorClass="bg-emerald-100/80 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
          icon={CheckCircle2}
        />
      </div>

      {/* Charts row */}
      {!loading && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Pie */}
          <div className="card">
            <h2 className="font-semibold text-foreground mb-6 text-base">
              Task Distribution
            </h2>
            {statusChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => (
                      <span className="text-xs text-muted-foreground font-medium">
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[240px] flex items-center justify-center text-sm text-muted-foreground">
                No tasks yet
              </div>
            )}
          </div>

          {/* Priority Bar */}
          <div className="card">
            <h2 className="font-semibold text-foreground mb-6 text-base">
              Priority Levels
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={priorityChartData} barSize={40}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(15, 23, 42, 0.08)"}
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: isDark ? "#94a3b8" : "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: isDark ? "#94a3b8" : "#64748b" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    fill: isDark
                      ? "rgba(255, 255, 255, 0.04)"
                      : "rgba(99, 102, 241, 0.05)",
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} name="Tasks">
                  {priorityChartData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div className="card">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-foreground text-base">
            Recent Tasks
          </h2>
          <Link
            to="/tasks"
            className="text-sm font-medium text-primary hover:underline inline-flex items-center gap-1"
          >
            <span>View all</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 skeleton rounded-lg" />
            ))}
          </div>
        ) : recentTasks.length === 0 ? (
          <EmptyState
            title="No tasks yet"
            description="Create your first task to get started."
            action={
              <Link to="/tasks/create">
                <Button size="sm">Create Task</Button>
              </Link>
            }
          />
        ) : (
          <div className="divide-y divide-border">
            {recentTasks.map((task) => (
              <div
                key={task._id}
                className="flex items-center gap-4 py-3.5 group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {task.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatDate(task.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <PriorityBadge priority={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
                <Link
                  to={`/tasks/${task._id}/edit`}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-all"
                  aria-label={`Edit ${task.title}`}
                >
                  <ChevronRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
