import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check,
  Plus,
  Trash2,
  Paperclip,
  ExternalLink,
  ListTodo,
} from "lucide-react";
import Input from "../ui/Input.jsx";
import TextArea from "../ui/TextArea.jsx";
import Select from "../ui/Select.jsx";
import Button from "../ui/Button.jsx";
import { formatDateInput } from "../../utils/helpers.js";

const initialForm = {
  title: "",
  description: "",
  priority: "low",
  status: "pending",
  startDate: "",
  dueDate: "",
  checklist: [],
  attachments: [],
};

const TaskForm = ({
  initialData = {},
  onSubmit,
  submitLabel = "Create Task",
  loading = false,
}) => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    ...initialForm,
    ...initialData,
    startDate: initialData.startDate
      ? formatDateInput(initialData.startDate)
      : "",
    dueDate: initialData.dueDate ? formatDateInput(initialData.dueDate) : "",
  });

  const [errors, setErrors] = useState({});
  const [newCheckItem, setNewCheckItem] = useState("");
  const [newAttachName, setNewAttachName] = useState("");
  const [newAttachUrl, setNewAttachUrl] = useState("");

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Title is required";
    if (form.title.length > 200)
      errs.title = "Title cannot exceed 200 characters";
    if (form.description.length > 2000)
      errs.description = "Description cannot exceed 2000 characters";
    if (form.dueDate && form.startDate && form.dueDate < form.startDate) {
      errs.dueDate = "Due date cannot be before start date";
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    onSubmit({
      ...form,
      startDate: form.startDate || undefined,
      dueDate: form.dueDate || undefined,
    });
  };

  // Checklist Helpers
  const addCheckItem = () => {
    const text = newCheckItem.trim();
    if (!text) return;
    setForm((prev) => ({
      ...prev,
      checklist: [...prev.checklist, { text, completed: false }],
    }));
    setNewCheckItem("");
  };

  const toggleCheckItem = (idx) => {
    setForm((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item, i) =>
        i === idx ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  const removeCheckItem = (idx) => {
    setForm((prev) => ({
      ...prev,
      checklist: prev.checklist.filter((_, i) => i !== idx),
    }));
  };

  // Attachments Helpers
  const addAttachment = () => {
    const name = newAttachName.trim();
    const url = newAttachUrl.trim();
    if (!name || !url) return;
    try {
      new URL(url);
    } catch {
      return;
    }
    setForm((prev) => ({
      ...prev,
      attachments: [...prev.attachments, { name, url }],
    }));
    setNewAttachName("");
    setNewAttachUrl("");
  };

  const removeAttachment = (idx) => {
    setForm((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== idx),
    }));
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* ─── Task Title ────────────────────────────────────────── */}
      <Input
        id="task-title"
        label="Task Title"
        required
        placeholder="What needs to be done?"
        value={form.title}
        onChange={set("title")}
        error={errors.title}
        maxLength={200}
      />

      {/* ─── Description ───────────────────────────────────────── */}
      <TextArea
        id="task-description"
        label="Description"
        placeholder="Add details, notes, or acceptance criteria…"
        value={form.description}
        onChange={set("description")}
        error={errors.description}
        rows={4}
      />

      {/* ─── Priority & Status (2 cols on desktop, 1 col on mobile) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Select
          id="task-priority"
          label="Priority"
          value={form.priority}
          onChange={set("priority")}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </Select>

        <Select
          id="task-status"
          label="Status"
          value={form.status}
          onChange={set("status")}
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </Select>
      </div>

      {/* ─── Dates (2 cols on desktop, 1 col on mobile) ─────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          id="task-start-date"
          label="Start Date"
          type="date"
          value={form.startDate}
          onChange={set("startDate")}
        />
        <Input
          id="task-due-date"
          label="Due Date"
          type="date"
          value={form.dueDate}
          onChange={set("dueDate")}
          error={errors.dueDate}
          min={form.startDate || undefined}
        />
      </div>

      <div className="h-[1px] bg-border" aria-hidden="true" />

      {/* ─── Checklist ─────────────────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground flex items-center gap-2">
            <ListTodo size={16} className="text-primary" />
            <span>Checklist</span>
          </label>
          {form.checklist.length > 0 && (
            <span className="text-xs text-muted-foreground font-medium">
              {form.checklist.filter((c) => c.completed).length} of{" "}
              {form.checklist.length} completed
            </span>
          )}
        </div>

        {form.checklist.length > 0 && (
          <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {form.checklist.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 p-2 rounded-lg bg-muted/40 border border-border group transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleCheckItem(idx)}
                  className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                    item.completed
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border hover:border-primary"
                  }`}
                  aria-label={
                    item.completed ? "Mark incomplete" : "Mark complete"
                  }
                >
                  {item.completed && <Check size={12} strokeWidth={3} />}
                </button>
                <span
                  className={`text-sm flex-1 truncate ${
                    item.completed
                      ? "line-through text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {item.text}
                </span>
                <button
                  type="button"
                  onClick={() => removeCheckItem(idx)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-danger transition-all rounded"
                  aria-label="Remove checklist item"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a checklist item…"
            value={newCheckItem}
            onChange={(e) => setNewCheckItem(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCheckItem();
              }
            }}
            className="input-base flex-1 text-sm"
            maxLength={500}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={addCheckItem}
            className="shrink-0 px-3.5"
            aria-label="Add checklist item"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </div>

      {/* ─── Attachments ───────────────────────────────────────── */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Paperclip size={16} className="text-primary" />
          <span>Attachments & Links</span>
        </label>

        {form.attachments.length > 0 && (
          <ul className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {form.attachments.map((att, idx) => (
              <li
                key={idx}
                className="flex items-center gap-3 p-2 rounded-lg bg-muted/40 border border-border group transition-colors text-sm"
              >
                <ExternalLink
                  size={14}
                  className="text-primary shrink-0"
                />
                <a
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline truncate flex-1 font-medium"
                >
                  {att.name}
                </a>
                <span className="text-xs text-muted-foreground truncate max-w-[150px] hidden sm:inline">
                  {att.url}
                </span>
                <button
                  type="button"
                  onClick={() => removeAttachment(idx)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-danger transition-all rounded"
                  aria-label="Remove attachment"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Link title (e.g. Figma, PR, Docs)"
            value={newAttachName}
            onChange={(e) => setNewAttachName(e.target.value)}
            className="input-base text-sm sm:w-2/5"
          />
          <input
            type="url"
            placeholder="https://..."
            value={newAttachUrl}
            onChange={(e) => setNewAttachUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addAttachment();
              }
            }}
            className="input-base text-sm flex-1"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={addAttachment}
            className="shrink-0 px-3.5"
            aria-label="Add attachment link"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </div>

      {/* ─── Form Actions ──────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate(-1)}
          disabled={loading}
          className="w-full sm:w-auto px-6"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          loading={loading}
          disabled={!form.title.trim() || loading}
          className="w-full sm:w-auto px-8"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
