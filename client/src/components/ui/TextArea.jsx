import { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

const TextArea = forwardRef(
  (
    {
      label,
      error,
      id,
      className = "",
      containerClassName = "",
      required = false,
      rows = 4,
      ...props
    },
    ref
  ) => {
    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="text-danger ml-0.5">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          className={`input-base resize-none min-h-[96px] ${
            error ? "input-error" : ""
          } ${className}`}
          aria-invalid={!!error}
          {...props}
        />
        {error && (
          <p className="text-xs text-danger flex items-center gap-1.5 mt-0.5">
            <AlertCircle size={14} className="shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
