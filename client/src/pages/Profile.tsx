import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Staff Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your personal account details and security settings.</p>
      </div>

      <Card className="border border-border shadow-sm max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-2xl">
              {user?.name ? user.name.split(' ').map(n => n[0]).join('') : <User className="size-8" />}
            </div>
            <div>
              <CardTitle>{user?.name || 'Dr. Medical Staff'}</CardTitle>
              <CardDescription>{user?.email || 'staff@medicareclinic.com'}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Role</p>
              <p className="font-semibold text-foreground">Clinic Administrator / Physician</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Department</p>
              <p className="font-semibold text-foreground">General Medicine</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
