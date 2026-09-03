
import type { ReactNode } from 'react';
import SafeIcon from '@/components/common/SafeIcon';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: string;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  variant?: 'default' | 'accent';
  className?: string;
}

/**
 * StatsCard component for displaying key metrics in the VerifAI dashboard.
 * Designed to provide a high-level overview of case data, risk monitoring, or analytics.
 */
export default function StatsCard({
  label,
  value,
  icon,
  trend,
  variant = 'default',
  className,
}: StatsCardProps) {
  const isUp = trend?.direction === 'up';
  
  // Define variant-specific background and border styles
  const variantStyles = {
    default: "surface-raised",
    accent: "bg-primary text-primary-foreground border-primary",
  };

  // Define icon container styles based on variant
  const iconContainerStyles = {
    default: "bg-muted text-primary",
    accent: "bg-primary-foreground/20 text-primary-foreground",
  };

  return (
    <Card 
      className={cn(
        "stats-card group relative overflow-hidden transition-all duration-200",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex flex-col gap-1 w-full">
        <span className={cn(
          "text-caption font-medium uppercase tracking-wider",
          variant === 'accent' ? "text-primary-foreground/80" : "text-muted-foreground"
        )}>
          {label}
        </span>
        
        <div className="flex items-baseline gap-2 mt-1">
          <span className={cn(
            "stats-value tracking-tight",
            variant === 'accent' ? "text-primary-foreground" : "text-foreground"
          )}>
            {value}
          </span>
          
          {trend && (
            <div className={cn(
              "flex items-center text-xs font-semibold px-1.5 py-0.5 rounded-sm",
              isUp 
                ? (variant === 'accent' ? "bg-primary-foreground/20 text-white" : "text-[hsl(var(--success))]") 
                : (variant === 'accent' ? "bg-destructive/20 text-destructive-foreground" : "text-[hsl(var(--destructive))]")
            )}>
              <SafeIcon 
                name={isUp ? "ArrowUpRight" : "ArrowDownRight"} 
                size={14} 
                className="mr-0.5"
                strokeWidth={2.5}
              />
              {trend.value}%
            </div>
          )}
        </div>
      </div>

      {icon && (
        <div className={cn(
          "p-3 rounded-lg flex items-center justify-center shrink-0",
          iconContainerStyles[variant]
        )}>
          <SafeIcon 
            name={icon} 
            size={24} 
            strokeWidth={2} 
          />
        </div>
      )}

      {/* Decorative accent for the default variant hover state */}
      {variant === 'default' && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
      )}
    </Card>
  );
}
