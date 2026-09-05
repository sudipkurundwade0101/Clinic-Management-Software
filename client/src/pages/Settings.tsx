import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings as SettingsIcon } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Clinic Settings</h1>
        <p className="text-sm text-muted-foreground">Configure clinic profiles, operating hours, and system preferences.</p>
      </div>

      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>Manage general settings, notification preferences, and integrations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground space-y-3">
            <SettingsIcon className="size-12 mx-auto text-muted-foreground/60" />
            <p className="font-medium">Settings & Preferences</p>
            <p className="text-xs max-w-sm mx-auto">Customize consultation fees, email reminders, and staff access roles.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
