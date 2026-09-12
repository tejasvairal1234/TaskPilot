const Skeleton = ({ className = "", count = 1 }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={`skeleton ${className}`} aria-hidden="true" />
    ))}
  </>
);

export const TaskCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="flex items-start justify-between mb-3">
      <div className="skeleton h-4 w-20 rounded" />
      <div className="skeleton h-5 w-14 rounded-full" />
    </div>
    <div className="skeleton h-5 w-3/4 rounded mb-2" />
    <div className="skeleton h-3.5 w-full rounded mb-1" />
    <div className="skeleton h-3.5 w-2/3 rounded mb-4" />
    <div className="flex items-center justify-between">
      <div className="skeleton h-3.5 w-24 rounded" />
      <div className="flex gap-1">
        <div className="skeleton w-6 h-6 rounded-full" />
        <div className="skeleton w-6 h-6 rounded-full" />
      </div>
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="card animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="skeleton h-4 w-28 rounded" />
      <div className="skeleton w-10 h-10 rounded-lg" />
    </div>
    <div className="skeleton h-8 w-16 rounded mb-1" />
    <div className="skeleton h-3.5 w-32 rounded" />
  </div>
);

export const TableRowSkeleton = ({ cols = 5 }) => (
  <tr>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} className="px-4 py-3">
        <div className="skeleton h-4 rounded w-full max-w-[120px]" />
      </td>
    ))}
  </tr>
);

export default Skeleton;
