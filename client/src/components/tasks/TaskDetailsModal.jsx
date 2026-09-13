import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  Clock,
  Paperclip,
  CheckSquare,
  Check,
  Edit2,
  ExternalLink,
  Users,
  AlertCircle,
} from "lucide-react";
import Modal from "../ui/Modal.jsx";
import Button from "../ui/Button.jsx";
import StatusBadge from "../ui/StatusBadge.jsx";
import PriorityBadge from "../ui/PriorityBadge.jsx";
import {
  formatDate,
  isOverdue,
  getErrorMessage,
} from "../../utils/helpers.js";
import { taskService } from "../../services/taskService.js";
import toast from "react-hot-toast";

const TaskDetailsModal = ({ task, isOpen, onClose, onTaskUpdated }) => {
  const navigate = useNavigate();
  const [currentTask, setCurrentTask] = useState(task);
  const [updatingChecklist, setUpdatingChecklist] = useState(false);

  // Sync state whenever task prop changes or modal opens
  useEffect(() => {
    setCurrentTask(task);
  }, [task]);

  if (!isOpen || !currentTask) return null;

  const overdue = isOverdue(currentTask);
  const checklist = currentTask.checklist || [];
  const totalChecklist = checklist.length;
  const completedChecklist = checklist.filter((item) => item.completed).length;
  const progressPercentage =
    totalChecklist > 0
      ? Math.round((completedChecklist / totalChecklist) * 100)
      : 0;

  // Calculate new task status based on checklist completion business rules
  const calculateAutomaticStatus = (updatedChecklist, currentStatus) => {
    if (!updatedChecklist || updatedChecklist.length === 0) {
      return currentStatus;
    }
    const completedCount = updatedChecklist.filter((item) => item.completed).length;
    if (completedCount === 0) {
      return "pending";
    }
    if (completedCount === updatedChecklist.length) {
      return "completed";
    }
    return "in-progress";
  };

  // Handle toggling checklist item with optimistic UI & rollback
  const handleToggleChecklist = async (index) => {
    if (updatingChecklist) return;

    const previousTask = { ...currentTask };
    const updatedChecklist = currentTask.checklist.map((item, i) =>
      i === index ? { ...item, completed: !item.completed } : item
    );

    const newStatus = calculateAutomaticStatus(
      updatedChecklist,
      currentTask.status
    );

    const optimisticTask = {
      ...currentTask,
      checklist: updatedChecklist,
      status: newStatus,
    };

    // Optimistic UI update
    setCurrentTask(optimisticTask);
    onTaskUpdated?.(optimisticTask);

    setUpdatingChecklist(true);
    try {
      const response = await taskService.updateTask(currentTask._id, {
        checklist: updatedChecklist,
      });

      if (response.data?.task) {
        const authoritativeTask = {
          ...previousTask,
          ...response.data.task,
        };
        setCurrentTask(authoritativeTask);
        onTaskUpdated?.(authoritativeTask);
      }
    } catch (err) {
      // Rollback on error
      setCurrentTask(previousTask);
      onTaskUpdated?.(previousTask);
      toast.error(getErrorMessage(err) || "Failed to update checklist item");
    } finally {
      setUpdatingChecklist(false);
    }
  };

  const handleEditClick = () => {
    onClose();
    navigate(`/tasks/${currentTask._id}/edit`);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentTask.title}
      size="2xl"
    >
      <div className="space-y-6">
        {/* Status, Priority and Overdue Badges */}
        <div className="flex flex-wrap items-center gap-2.5 pb-4 border-b border-border">
          <PriorityBadge priority={currentTask.priority} />
          <StatusBadge status={currentTask.status} />
          {overdue && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-danger/10 text-danger border border-danger/20">
              <AlertCircle size={13} />
              Overdue
            </span>
          )}
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Description
          </h4>
          {currentTask.description?.trim() ? (
            <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed bg-muted/20 p-3.5 rounded-xl border border-border/50">
              {currentTask.description}
            </p>
          ) : (
            <p className="text-xs italic text-muted-foreground bg-muted/20 p-3.5 rounded-xl border border-border/50">
              No description provided.
            </p>
          )}
        </div>

        {/* Interactive Checklist */}
        <div>
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2">
              <CheckSquare size={16} className="text-primary" />
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Checklist
              </h4>
            </div>
            {totalChecklist > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {completedChecklist} of {totalChecklist} completed
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {progressPercentage}%
                </span>
              </div>
            )}
          </div>

          {totalChecklist > 0 ? (
            <div className="space-y-3">
              {/* Progress Bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                  aria-valuenow={progressPercentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  role="progressbar"
                />
              </div>

              {/* Checklist Items */}
              <div className="space-y-1.5 pt-1">
                {checklist.map((item, index) => {
                  const isChecked = Boolean(item.completed);
                  const itemText = item.text || item.title;

                  return (
                    <div
                      key={item._id || index}
                      onClick={() => handleToggleChecklist(index)}
                      className={`group flex items-start gap-3 p-2.5 rounded-xl transition-all cursor-pointer border select-none ${
                        isChecked
                          ? "bg-muted/30 border-transparent hover:border-border/60"
                          : "bg-card border-border/70 hover:border-primary/40 hover:bg-muted/30"
                      }`}
                    >
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={isChecked}
                        aria-label={itemText}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleChecklist(index);
                        }}
                        className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center border transition-all shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                          isChecked
                            ? "bg-primary border-primary text-white shadow-sm"
                            : "bg-card border-muted-foreground/30 hover:border-primary group-hover:border-primary/70"
                        }`}
                      >
                        {isChecked && (
                          <Check size={13} className="stroke-[3]" />
                        )}
                      </button>

                      <span
                        className={`text-sm leading-relaxed transition-all ${
                          isChecked
                            ? "line-through text-muted-foreground"
                            : "text-card-foreground font-normal"
                        }`}
                      >
                        {itemText}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-muted/20 border border-border/50 text-xs text-muted-foreground italic">
              No checklist items for this task.
            </div>
          )}
        </div>

        {/* Dates & Timing */}
        <div>
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5">
            Dates & Timeline
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Calendar size={13} />
                Start Date
              </span>
              <p className="text-xs font-medium text-foreground">
                {formatDate(currentTask.startDate)}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Calendar size={13} />
                Due Date
              </span>
              <p
                className={`text-xs font-medium ${
                  overdue ? "text-danger font-semibold" : "text-foreground"
                }`}
              >
                {formatDate(currentTask.dueDate)}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Clock size={13} />
                Created
              </span>
              <p className="text-xs font-medium text-foreground">
                {formatDate(currentTask.createdAt)}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
                <Clock size={13} />
                Last Updated
              </span>
              <p className="text-xs font-medium text-foreground">
                {formatDate(currentTask.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Attachments (if available) */}
        {currentTask.attachments?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Paperclip size={15} className="text-muted-foreground" />
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Attachments ({currentTask.attachments.length})
              </h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentTask.attachments.map((att, idx) => (
                <a
                  key={idx}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 p-2.5 rounded-xl border border-border bg-muted/30 hover:bg-muted/60 hover:border-primary/40 transition-all text-xs text-foreground group"
                >
                  <span className="truncate font-medium">{att.name}</span>
                  <ExternalLink
                    size={14}
                    className="text-muted-foreground group-hover:text-primary shrink-0 transition-colors"
                  />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Assigned Users (if available) */}
        {currentTask.assignedTo?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <Users size={15} className="text-muted-foreground" />
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Assigned To
              </h4>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {currentTask.assignedTo.map((user) => (
                <div
                  key={user._id || user.id || user.email}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/40 border border-border text-xs"
                >
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt={user.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-[10px]">
                      {(user.name || user.email || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium text-foreground">
                    {user.name || user.email}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-border mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={handleEditClick}
            className="inline-flex items-center gap-2"
          >
            <Edit2 size={15} />
            <span>Edit Task</span>
          </Button>

          <Button type="button" variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetailsModal;
