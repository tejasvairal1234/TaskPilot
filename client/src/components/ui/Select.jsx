import { forwardRef } from "react";
import { AlertCircle } from "lucide-react";

const Select = forwardRef(
  (
    {
      label,
      error,
      id,
      children,
      className = "",
      containerClassName = "",
      required = false,
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
        <div className="relative">
          <select
            ref={ref}
            id={id}
            className={`input-base appearance-none pr-10 cursor-pointer ${
              error ? "input-error" : ""
            } ${className}`}
            aria-invalid={!!error}
            {...props}
          >
            {children}
          </select>
          {/* Custom Chevron Icon */}
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
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

Select.displayName = "Select";

export default Select;
