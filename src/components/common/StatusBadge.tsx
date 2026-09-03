
import { Badge } from "@/components/ui/badge";
import SafeIcon from "@/components/common/SafeIcon";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: 'CLEAR' | 'REVIEW' | 'HIGH_RISK' | 'PROCESSING';
  size?: 'sm' | 'md';
}

const statusConfig = {
  CLEAR: {
    label: 'CLEAR',
    className: 'badge-clear',
    iconName: 'CheckCircle2',
  },
  REVIEW: {
    label: 'REVIEW',
    className: 'badge-review',
    iconName: 'AlertCircle',
  },
  HIGH_RISK: {
    label: 'HIGH RISK',
    className: 'badge-risk',
    iconName: 'AlertTriangle',
  },
  PROCESSING: {
    label: 'PROCESSING',
    className: 'badge-processing',
    iconName: 'RefreshCw',
  },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.PROCESSING;
  
  const sizeClasses = cn(
    "flex items-center gap-1.5 whitespace-nowrap border-none",
    size === 'sm' ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"
  );

  return (
    <Badge 
      variant="outline" 
      className={cn(config.className, sizeClasses)}
    >
      <SafeIcon 
        name={config.iconName} 
        size={size === 'sm' ? 12 : 14} 
        className={cn(status === 'PROCESSING' && "animate-spin")}
      />
      <span>{config.label}</span>
    </Badge>
  );
}

export default StatusBadge;
