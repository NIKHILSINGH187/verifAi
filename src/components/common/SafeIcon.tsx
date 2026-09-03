
import { Circle, type LucideProps } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

interface SafeIconProps extends Omit<LucideProps, 'ref'> {
  name: string;
}

export default function SafeIcon({ name, ...props }: SafeIconProps) {
  const IconComponent = (LucideIcons as any)[name];

  if (!IconComponent) {
    return <Circle {...props} />;
  }

  return <IconComponent {...props} />;
}
