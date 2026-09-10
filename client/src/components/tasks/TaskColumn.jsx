import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard.jsx";
import { TaskCardSkeleton } from "../ui/Skeleton.jsx";
import { STATUS_COLORS } from "../../utils/constants.js";
import { Inbox } from "lucide-react";

const TaskColumn = ({
  columnId,
  title,
  tasks,
  loading,
  onTaskDeleted,
  onTaskUpdated,
}) => {
  const colors = STATUS_COLORS[columnId];

  return (
    <div className="flex flex-col bg-muted/40 rounded-2xl border border-border overflow-hidden min-h-[400px] flex-1 min-w-[280px] max-w-[380px] transition-colors duration-150">
      {/* Column header */}
      <div className="px-4 py-3.5 flex items-center justify-between bg-card border-b border-border">
        <div className="flex items-center gap-2.5">
          <span
            className={`w-2.5 h-2.5 rounded-full ${colors.dot}`}
            aria-hidden="true"
          />
          <h2 className="font-semibold text-foreground text-sm">
            {title}
          </h2>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${colors.bg} ${colors.text} border ${colors.border}`}
        >
          {loading ? "—" : tasks.length}
        </span>
      </div>

      {/* Droppable area */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 space-y-2.5 overflow-y-auto transition-colors duration-150
              ${snapshot.isDraggingOver ? "drop-column-over" : ""}`}
            style={{ minHeight: "160px" }}
            aria-label={`${title} column, ${tasks.length} tasks`}
          >
            {loading ? (
              <div className="space-y-2.5">
                <TaskCardSkeleton />
                <TaskCardSkeleton />
              </div>
            ) : tasks.length === 0 ? (
              <div className="py-12 flex flex-col items-center text-center px-4">
                <div
                  className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center mb-3`}
                >
                  <Inbox size={20} className={colors.text} />
                </div>
                <p className="text-xs text-muted-foreground font-medium">
                  No tasks here
                </p>
                <p className="text-xs text-muted-foreground/80 mt-0.5">
                  Drag tasks here or create one
                </p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  index={index}
                  onDeleted={onTaskDeleted}
                  onUpdated={onTaskUpdated}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default TaskColumn;
