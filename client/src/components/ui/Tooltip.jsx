import { useState } from "react";

const positions = {
  right: "left-full top-1/2 -translate-y-1/2 ml-2.5",
  left: "right-full top-1/2 -translate-y-1/2 mr-2.5",
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
};

const arrows = {
  right: "right-full top-1/2 -translate-y-1/2 border-r-slate-900 dark:border-r-slate-800",
  left: "left-full top-1/2 -translate-y-1/2 border-l-slate-900 dark:border-l-slate-800",
  top: "top-full left-1/2 -translate-x-1/2 border-t-slate-900 dark:border-t-slate-800",
  bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-slate-900 dark:border-b-slate-800",
};

const Tooltip = ({ text, children, position = "right", disabled = false }) => {
  const [visible, setVisible] = useState(false);

  if (!text || disabled) return children;

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={`absolute ${positions[position]} z-50 px-2.5 py-1 text-xs font-medium text-white bg-slate-900 dark:bg-slate-800 rounded-md shadow-lg whitespace-nowrap pointer-events-none transition-opacity duration-150 animate-fade-in border border-slate-700/50`}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
