import { Inbox } from "lucide-react";

const EmptyState = ({
  icon: Icon,
  title = "Nothing here yet",
  description,
  action,
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in">
    <div className="w-16 h-16 rounded-2xl bg-muted border border-border flex items-center justify-center mb-4 text-muted-foreground">
      {Icon ? <Icon size={28} /> : <Inbox size={28} />}
    </div>
    <h3 className="text-base font-semibold text-foreground mb-1">
      {title}
    </h3>
    {description && (
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
        {description}
      </p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
