
import React from 'react';
import SafeIcon from '@/components/common/SafeIcon';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';

interface BreadcrumbData {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: string;
  breadcrumbs?: BreadcrumbData[];
  actions?: React.ReactNode;
}

/**
 * PageHeader
 * A reusable header component for main application views.
 * Provides consistent structure for titles, descriptions, icons, breadcrumbs, and actions.
 */
export default function PageHeader({
  title,
  description,
  icon,
  breadcrumbs = [],
  actions,
}: PageHeaderProps) {
  return (
    <header className="mb-8 w-full">
      {/* Breadcrumbs Section */}
      {breadcrumbs.length > 0 && (
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              return (
                <React.Fragment key={`${crumb.label}-${index}`}>
                  <BreadcrumbItem>
                    {isLast || !crumb.href ? (
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={crumb.href}>
                        {crumb.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {!isLast && <BreadcrumbSeparator />}
                </React.Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      )}

      {/* Main Header Content */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Icon Section */}
          {icon && (
            <div className="mt-1 flex-shrink-0 p-2.5 rounded-lg bg-primary/10 text-primary">
              <SafeIcon name={icon} size={28} strokeWidth={2} />
            </div>
          )}

          {/* Title & Description */}
          <div className="flex flex-col gap-1">
            <h1 className="text-page-title">{title}</h1>
            {description && (
              <p className="text-caption max-w-2xl leading-relaxed">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Actions Slot */}
        {actions && (
          <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
