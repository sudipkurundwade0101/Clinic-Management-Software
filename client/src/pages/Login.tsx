import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Stethoscope } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login logic
    if (login) {
      login({ name: 'Dr. Sarah Smith', email: 'sarah.smith@medicare.com' });
    }
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md border border-border shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto size-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
            <Stethoscope className="size-6" />
          </div>
          <CardTitle className="text-2xl font-bold">MediCare Portal</CardTitle>
          <CardDescription>Sign in to access Clinic Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Email / Username</label>
              <Input type="email" placeholder="doctor@medicare.com" defaultValue="sarah.smith@medicare.com" required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground">Password</label>
              <Input type="password" placeholder="••••••••" defaultValue="password123" required />
            </div>
            <Button type="submit" className="w-full">
              Sign In to Portal
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
