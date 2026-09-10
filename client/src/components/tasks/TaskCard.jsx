import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Draggable } from "@hello-pangea/dnd";
import { Calendar, Paperclip, Edit2, Trash2 } from "lucide-react";
import StatusBadge from "../ui/StatusBadge.jsx";
import PriorityBadge from "../ui/PriorityBadge.jsx";
import ConfirmDialog from "../ui/ConfirmDialog.jsx";
import {
  formatDate,
  getChecklistProgress,
  isOverdue,
} from "../../utils/helpers.js";
import { taskService } from "../../services/taskService.js";
import { getErrorMessage } from "../../utils/helpers.js";
import toast from "react-hot-toast";

const TaskCard = ({ task, index, onDeleted, onUpdated }) => {
  const navigate = useNavigate();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const checklistProgress = getChecklistProgress(task.checklist);
  const overdue = isOverdue(task);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await taskService.deleteTask(task._id);
      toast.success("Task deleted");
      onDeleted?.(task._id);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <Draggable draggableId={task._id} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`card-hover cursor-grab active:cursor-grabbing select-none
              ${snapshot.isDragging ? "task-card-dragging" : ""}
              animate-fade-in`}
            aria-label={`Task: ${task.title}`}
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <PriorityBadge priority={task.priority} />
              <StatusBadge status={task.status} />
            </div>

            {/* Title */}
            <h3 className="font-semibold text-card-foreground text-sm leading-snug mb-1.5 line-clamp-2">
              {task.title}
            </h3>

            {/* Description preview */}
            {task.description && (
              <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Checklist progress */}
            {task.checklist?.length > 0 && (
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Checklist</span>
                  <span className="font-medium">{checklistProgress}%</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-300"
                    style={{ width: `${checklistProgress}%` }}
                    aria-valuenow={checklistProgress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    role="progressbar"
                  />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-border">
              {/* Due date */}
              <div className="flex items-center gap-1.5 min-w-0">
                {task.dueDate ? (
                  <span
                    className={`text-xs flex items-center gap-1.5 truncate ${
                      overdue
                        ? "text-danger font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Calendar size={13} className="shrink-0" />
                    {overdue && <span className="font-semibold">Overdue · </span>}
                    {formatDate(task.dueDate)}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground/70">
                    No due date
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 shrink-0">
                {/* Attachments */}
                {task.attachments?.length > 0 && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground mr-1">
                    <Paperclip size={13} />
                    {task.attachments.length}
                  </span>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/tasks/${task._id}/edit`);
                  }}
                  className="p-1.5 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                  aria-label={`Edit ${task.title}`}
                >
                  <Edit2 size={13} />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteOpen(true);
                  }}
                  className="p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  aria-label={`Delete ${task.title}`}
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        )}
      </Draggable>

      <ConfirmDialog
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this task?"
        message="This action cannot be undone. The task and all its data will be permanently deleted."
      />
    </>
  );
};

export default TaskCard;
