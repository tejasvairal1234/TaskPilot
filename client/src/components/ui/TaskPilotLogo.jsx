/**
 * Authentic TaskPilot Logo Component
 * Renders the original scalloped badge with verified checkmark
 * Preserves original proportions and styling
 */
const TaskPilotLogo = ({ size = 36, className = "" }) => {
  const iconSize = Math.round(size * (20 / 36));

  return (
    <div
      className={`rounded-xl bg-brand-600 flex items-center justify-center shrink-0 shadow-sm ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      aria-hidden="true"
    >
      <svg
        className="text-white"
        style={{
          width: `${iconSize}px`,
          height: `${iconSize}px`,
        }}
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    </div>
  );
};

export default TaskPilotLogo;
