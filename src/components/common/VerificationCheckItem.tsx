
import React from 'react';
import SafeIcon from '@/components/common/SafeIcon';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface VerificationCheckItemProps {
  label: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  description?: string;
  expandable?: boolean;
  children?: React.ReactNode;
}

const VerificationCheckItem: React.FC<VerificationCheckItemProps> = ({
  label,
  status,
  description,
  expandable = false,
  children,
}) => {
  const [isClient, setIsClient] = React.useState(true);

  React.useEffect(() => {
    setIsClient(false);
    const raf = requestAnimationFrame(() => {
      setIsClient(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!isClient) return null;

  const statusConfig = {
    pass: {
      icon: 'CheckCircle2',
      colorClass: 'text-emerald-600',
      badgeClass: 'badge-clear',
      badgeText: 'PASS',
      borderClass: 'check-item-pass',
    },
    fail: {
      icon: 'XCircle',
      colorClass: 'text-destructive',
      badgeClass: 'badge-risk',
      badgeText: 'FAIL',
      borderClass: 'check-item-fail',
    },
    warning: {
      icon: 'AlertTriangle',
      colorClass: 'text-amber-500',
      badgeClass: 'badge-review',
      badgeText: 'REVIEW',
      borderClass: 'check-item-warning',
    },
    pending: {
      icon: 'Clock',
      colorClass: 'text-muted-foreground',
      badgeClass: 'badge-processing',
      badgeText: 'PENDING',
      borderClass: 'border-l-4 border-l-muted',
    },
  };

  const config = statusConfig[status];

  const content = (
    <div className={cn("w-full flex items-start gap-3", !expandable && "check-item", config.borderClass)}>
      <div className={cn("mt-0.5 shrink-0", config.colorClass)}>
        <SafeIcon name={config.icon} size={20} strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-item-title truncate">{label}</span>
          <span className={config.badgeClass}>{config.badgeText}</span>
        </div>
        {description && (
          <p className="text-caption mt-1 leading-snug">{description}</p>
        )}
      </div>
    </div>
  );

  if (expandable && children) {
    return (
      <div className={cn("surface-base overflow-hidden", config.borderClass)}>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="details" className="border-none">
            <AccordionTrigger className="hover:no-underline px-4 py-3 group">
              {content}
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4 pt-0 border-t border-border/50 bg-muted/10">
              <div className="mt-4 text-sm text-body">
                {children}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

  return (
    <div className="w-full">
      {content}
    </div>
  );
};

export default VerificationCheckItem;
