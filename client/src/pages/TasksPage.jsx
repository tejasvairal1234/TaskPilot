import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { DragDropContext } from "@hello-pangea/dnd";
import { Search, Plus } from "lucide-react";
import { taskService } from "../services/taskService.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { getErrorMessage } from "../utils/helpers.js";
import { COLUMNS } from "../utils/constants.js";
import TaskColumn from "../components/tasks/TaskColumn.jsx";
import TaskDetailsModal from "../components/tasks/TaskDetailsModal.jsx";
import Button from "../components/ui/Button.jsx";
import Select from "../components/ui/Select.jsx";
import toast from "react-hot-toast";

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    priority: "",
    sort: "createdAt",
    order: "desc",
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        sort: filters.sort,
        order: filters.order,
        limit: 200,
      };
      if (debouncedSearch) params.search = debouncedSearch;
      if (filters.priority) params.priority = filters.priority;

      const { data } = await taskService.getTasks(params);
      setTasks(data.tasks);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, filters.priority, filters.sort, filters.order]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Group tasks by status for kanban columns
  const tasksByStatus = COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter((t) => t.status === col.id);
    return acc;
  }, {});

  // ─── Drag End Handler ─────────────────────────────────────────────────────
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const newStatus = destination.droppableId;
    const task = tasks.find((t) => t._id === draggableId);
    if (!task || task.status === newStatus) return;

    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t._id === draggableId ? { ...t, status: newStatus } : t))
    );

    try {
      await taskService.updateTask(draggableId, { status: newStatus });
      toast.success(`Moved to ${newStatus.replace("-", " ")}`);
    } catch (err) {
      // Revert on failure
      setTasks((prev) =>
        prev.map((t) =>
          t._id === draggableId ? { ...t, status: task.status } : t
        )
      );
      toast.error("Failed to update task status. Change reverted.");
    }
  };

  const handleTaskDeleted = (id) =>
    setTasks((prev) => prev.filter((t) => t._id !== id));

  const handleTaskUpdated = (updated) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === updated._id ? { ...t, ...updated } : t))
    );
    setSelectedTask((prev) =>
      prev?._id === updated._id ? { ...prev, ...updated } : prev
    );
  };

  const setFilter = (key) => (e) =>
    setFilters((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="p-6 lg:p-10 space-y-6 max-w-[1400px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title mb-1 text-2xl lg:text-3xl">My Tasks</h1>
          <p className="text-muted-foreground text-sm">
            {loading
              ? "Loading tasks…"
              : `${tasks.length} task${tasks.length !== 1 ? "s" : ""} total`}
          </p>
        </div>
        <Link to="/tasks/create">
          <Button variant="primary" className="inline-flex items-center gap-2">
            <Plus size={16} />
            <span>New Task</span>
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="search"
            placeholder="Search tasks…"
            value={filters.search}
            onChange={setFilter("search")}
            className="input-base pl-10 text-sm"
            aria-label="Search tasks"
          />
        </div>

        <Select
          id="filter-priority"
          value={filters.priority}
          onChange={setFilter("priority")}
          className="text-sm w-36"
        >
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </Select>

        <Select
          id="filter-sort"
          value={filters.sort}
          onChange={setFilter("sort")}
          className="text-sm w-40"
        >
          <option value="createdAt">Sort: Created</option>
          <option value="dueDate">Sort: Due Date</option>
          <option value="priority">Sort: Priority</option>
          <option value="title">Sort: Title</option>
        </Select>

        <Select
          id="filter-order"
          value={filters.order}
          onChange={setFilter("order")}
          className="text-sm w-36"
        >
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </Select>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-5 overflow-x-auto pb-4 pt-1">
          {COLUMNS.map((col) => (
            <TaskColumn
              key={col.id}
              columnId={col.id}
              title={col.label}
              tasks={tasksByStatus[col.id] || []}
              loading={loading}
              onTaskDeleted={handleTaskDeleted}
              onTaskUpdated={handleTaskUpdated}
              onTaskClick={(task) => setSelectedTask(task)}
            />
          ))}
        </div>
      </DragDropContext>

      {/* Task Details Modal */}
      <TaskDetailsModal
        task={selectedTask}
        isOpen={Boolean(selectedTask)}
        onClose={() => setSelectedTask(null)}
        onTaskUpdated={handleTaskUpdated}
      />
    </div>
  );
};

export default TasksPage;
