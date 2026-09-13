import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { taskService } from "../services/taskService.js";
import { getErrorMessage } from "../utils/helpers.js";
import TaskForm from "../components/tasks/TaskForm.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import toast from "react-hot-toast";

const EditTaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await taskService.getTaskById(id);
        setTask(data.task);
      } catch (err) {
        setFetchError(getErrorMessage(err));
      } finally {
        setFetchLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async (formData) => {
    setSaveLoading(true);
    try {
      await taskService.updateTask(id, formData);
      toast.success("Task updated successfully!");
      navigate("/tasks");
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaveLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="p-6 lg:p-10 max-w-3xl mx-auto flex items-center justify-center min-h-[40vh]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (fetchError || !task) {
    return (
      <div className="p-6 lg:p-10 max-w-3xl mx-auto">
        <div className="card text-center py-16">
          <p className="text-danger font-medium mb-2">
            {fetchError || "Task not found"}
          </p>
          <button
            onClick={() => navigate("/tasks")}
            className="btn-secondary btn-sm mt-4 inline-flex items-center gap-2"
          >
            <ArrowLeft size={14} />
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

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
        <h1 className="page-title mb-1 text-2xl lg:text-3xl">Edit Task</h1>
        <p className="text-muted-foreground text-sm truncate">
          Editing "{task.title}"
        </p>
      </div>

      <div className="card shadow-sm">
        <TaskForm
          initialData={task}
          onSubmit={handleSubmit}
          loading={saveLoading}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
};

export default EditTaskPage;
