import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { taskService } from "../services/taskService.js";
import { getErrorMessage } from "../utils/helpers.js";
import TaskForm from "../components/tasks/TaskForm.jsx";
import toast from "react-hot-toast";

const CreateTaskPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await taskService.createTask(formData);
      toast.success("Task created successfully!");
      navigate("/tasks");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header & Back Link */}
      <div>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary mb-3 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Tasks</span>
        </Link>
        <h1 className="page-title mb-1 text-2xl lg:text-3xl">Create Task</h1>
        <p className="text-muted-foreground text-sm">
          Add a new task with checklist items, dates, and priorities.
        </p>
      </div>

      {/* Form Card */}
      <div className="card shadow-sm">
        <TaskForm
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Create Task"
        />
      </div>
    </div>
  );
};

export default CreateTaskPage;
