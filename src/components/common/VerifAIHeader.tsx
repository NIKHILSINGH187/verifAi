
import React from 'react';
import SafeIcon from '@/components/common/SafeIcon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface VerifAIHeaderProps {
  currentPath?: string;
}

const VerifAIHeader: React.FC<VerifAIHeaderProps> = ({ currentPath }) => {
  const navItems = [
    { name: 'Dashboard', href: './case-management-dashboard.html' },
    { name: 'New Verification', href: './upload-capture-screen.html' },
    { name: 'Analytics', href: './analytics-reporting.html' },
    { name: 'Case Management', href: './case-management-dashboard.html' },
  ];

  const handleLogout = () => {
    toast.success('Logging out...');
    setTimeout(() => {
      window.location.href = './login-portal.html';
    }, 800);
  };

  const isActive = (href: string) => {
    if (!currentPath) return false;
    const normalizedCurrent = currentPath.replace(/^\//, '').replace(/\.html$/, '');
    const normalizedHref = href.replace(/^\.\//, '').replace(/\.html$/, '');
    return normalizedCurrent === normalizedHref;
  };

  return (
    <header className="nav-header flex items-center justify-between px-6 sticky top-0 z-50">
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => window.location.href = './case-management-dashboard.html'}
      >
        <div className="bg-white/10 p-1.5 rounded-lg border border-white/20">
          <SafeIcon name="ShieldCheck" size={24} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">VerifAI</span>
      </div>

      <nav className="hidden md:flex items-center gap-1">
        {navItems.map((item, idx) => {
          const active = isActive(item.href);
          return (
            <a
              key={`${item.name}-${idx}`}
              href={item.href}
              className={cn(
                "nav-link",
                active && "nav-link-active"
              )}
            >
              {item.name}
            </a>
          );
        })}
      </nav>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex flex-col items-end mr-2">
          <span className="text-sm font-medium text-white">Officer J. Doe</span>
          <span className="text-[10px] text-white/60 uppercase tracking-wider">Border Control</span>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full border border-white/20 p-0 overflow-hidden hover:bg-white/10">
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src="https://spark-builder.s3.us-east-1.amazonaws.com/image/2026/9/3/859f452e-1e1f-4a4c-b5e3-325e50fd02da.png" 
                  alt="Officer Profile" 
                />
                <AvatarFallback className="bg-primary-hover text-white">JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <SafeIcon name="User" size={16} className="mr-2" />
              <span>Profile Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <SafeIcon name="FileText" size={16} className="mr-2" />
              <span>Activity Logs</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={() => window.location.href = './analytics-reporting.html'}>
              <SafeIcon name="BarChart3" size={16} className="mr-2" />
              <span>System Health</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={handleLogout}
            >
              <SafeIcon name="LogOut" size={16} className="mr-2" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default VerifAIHeader;
