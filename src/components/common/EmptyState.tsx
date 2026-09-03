
import { Button } from '@/components/ui/button';
import SafeIcon from '@/components/common/SafeIcon';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export default function EmptyState({
  icon = "SearchX",
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div 
      className={cn(
        "empty-state min-h-[400px] flex flex-col items-center justify-center p-8",
        className
      )}
    >
      <div className="mb-4 text-muted-foreground/40">
        <SafeIcon 
          name={icon} 
          size={64} 
          strokeWidth={1.5} 
        />
      </div>
      
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-muted-foreground max-w-sm mx-auto mb-6">
          {description}
        </p>
      )}

      {actionLabel && onAction && (
        <Button 
          variant="outline" 
          onClick={onAction}
          className="mt-2"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
