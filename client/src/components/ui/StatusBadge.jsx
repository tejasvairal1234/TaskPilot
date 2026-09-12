import { STATUS_COLORS, STATUS_LABELS } from "../../utils/constants.js";

const StatusBadge = ({ status }) => {
  const colors = STATUS_COLORS[status] || STATUS_COLORS.pending;
  return (
    <span
      className={`badge ${colors.bg} ${colors.text} border ${colors.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} aria-hidden="true" />
      {STATUS_LABELS[status] || status}
    </span>
  );
};

export default StatusBadge;
