import Modal from "./Modal.jsx";
import Button from "./Button.jsx";
import { AlertTriangle } from "lucide-react";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  loading = false,
  variant = "danger",
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col gap-5">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-10 h-10 rounded-full bg-danger/10 border border-danger/20 flex items-center justify-center text-danger">
            <AlertTriangle size={20} />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed pt-1">
            {message}
          </p>
        </div>

        <div className="flex gap-3 justify-end pt-2">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={variant} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
