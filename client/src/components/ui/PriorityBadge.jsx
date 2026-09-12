import { PRIORITY_COLORS, PRIORITY_LABELS } from "../../utils/constants.js";

const PriorityBadge = ({ priority }) => {
  const colors = PRIORITY_COLORS[priority] || PRIORITY_COLORS.low;
  return (
    <span
      className={`badge ${colors.bg} ${colors.text} border ${colors.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} aria-hidden="true" />
      {PRIORITY_LABELS[priority] || priority}
    </span>
  );
};

export default PriorityBadge;
