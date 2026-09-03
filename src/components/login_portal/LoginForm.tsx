
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SafeIcon from '@/components/common/SafeIcon';
import { DepartmentService } from '@/data/DepartmentService';
import { toast } from 'sonner';

export default function LoginForm() {
  const [departments] = useState(() => DepartmentService.getAll());
  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!officerId.trim()) {
      toast.error('Officer ID is required');
      return;
    }
    if (!password.trim()) {
      toast.error('Password is required');
      return;
    }
    if (!selectedDept) {
      toast.error('Please select a department');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      toast.success('Authentication successful');
      setTimeout(() => {
        window.location.href = './case-management-dashboard.html';
      }, 800);
    }, 1200);
  };

  const handleForgotPassword = () => {
    toast.info('Password recovery email sent to registered address');
  };

  return (
    <div className="w-full max-w-md">
      <Card className="surface-raised border-2 border-primary/20 shadow-lg">
        <CardHeader className="space-y-1 text-center pb-8">
          {/* Logo Section */}
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-br from-primary to-accent p-3 rounded-xl shadow-md">
              <SafeIcon name="ShieldCheck" size={40} className="text-white" strokeWidth={2} />
            </div>
          </div>

          <CardTitle className="text-3xl font-bold tracking-tight">VerifAI</CardTitle>
          <CardDescription className="text-base text-muted-foreground mt-2">
            AI-Based Identity & Document Verification
          </CardDescription>
          <p className="text-xs text-muted-foreground/70 italic mt-3 leading-relaxed">
            "Multiple AI Layers. One Decision. Safer Tomorrow."
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-5">
            {/* Officer ID Field */}
            <div className="space-y-2">
              <Label htmlFor="officer-id" className="text-label">
                Officer ID
              </Label>
              <div className="relative">
                <Input
                  id="officer-id"
                  type="text"
                  placeholder="e.g., MHA-1001"
                  value={officerId}
                  onChange={(e) => setOfficerId(e.target.value)}
                  disabled={isLoading}
                  className="pl-10 h-11 border-border focus:ring-2 focus:ring-accent/50"
                />
                <SafeIcon
                  name="User"
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  strokeWidth={2}
                />
              </div>
            </div>

            {/* Department Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="department" className="text-label">
                Department
              </Label>
              <Select value={selectedDept} onValueChange={setSelectedDept} disabled={isLoading}>
                <SelectTrigger id="department" className="h-11 border-border focus:ring-2 focus:ring-accent/50">
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      <span className="font-medium">{dept.code}</span>
                      <span className="text-muted-foreground ml-2">— {dept.name}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-label">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="pl-10 pr-10 h-11 border-border focus:ring-2 focus:ring-accent/50"
                />
                <SafeIcon
                  name="Lock"
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                  strokeWidth={2}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <SafeIcon
                    name={showPassword ? 'Eye' : 'EyeOff'}
                    size={18}
                    strokeWidth={2}
                  />
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isLoading}
                className="text-xs text-accent hover:text-accent-hover underline transition-colors disabled:opacity-50"
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold text-base transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <SafeIcon name="Loader2" size={18} className="mr-2 animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <SafeIcon name="LogIn" size={18} className="mr-2" />
                  Sign In
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-card text-muted-foreground">
                  Government Portal
                </span>
              </div>
            </div>

            {/* System Status Link */}
            <button
              type="button"
              onClick={() => window.location.href = './analytics-reporting.html'}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border hover:bg-muted/50 transition-colors text-sm font-medium text-foreground disabled:opacity-50"
            >
              <SafeIcon name="Activity" size={16} strokeWidth={2} />
              System Status
            </button>
          </form>

          {/* Footer Text */}
          <div className="mt-8 pt-6 border-t border-border/50 text-center">
            <p className="text-[11px] text-muted-foreground/60 uppercase tracking-wider">
              Secure Government System
            </p>
            <p className="text-[10px] text-muted-foreground/50 mt-2">
              This portal is restricted to authorized personnel only.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Right-side tagline (visible on larger screens) */}
      <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 max-w-xs text-right">
        <div className="space-y-4">
          <div className="flex items-center justify-end gap-3 text-primary">
            <SafeIcon name="CheckCircle2" size={24} strokeWidth={2} />
            <span className="text-sm font-semibold">Multi-Layer AI Verification</span>
          </div>
          <div className="flex items-center justify-end gap-3 text-accent">
            <SafeIcon name="Shield" size={24} strokeWidth={2} />
            <span className="text-sm font-semibold">Enterprise Security</span>
          </div>
          <div className="flex items-center justify-end gap-3 text-primary">
            <SafeIcon name="Zap" size={24} strokeWidth={2} />
            <span className="text-sm font-semibold">Real-Time Processing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
