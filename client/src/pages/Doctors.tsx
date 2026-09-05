import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, UserPlus } from 'lucide-react';

export const DoctorsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Doctors & Medical Staff</h1>
          <p className="text-sm text-muted-foreground">Manage practitioner profiles, departments, and shift schedules.</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="size-4" />
          Add Doctor
        </Button>
      </div>

      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle>Medical Staff Directory</CardTitle>
          <CardDescription>View doctor specialties, schedules, and active duty status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground space-y-3">
            <Stethoscope className="size-12 mx-auto text-muted-foreground/60" />
            <p className="font-medium">Doctors List & Schedules</p>
            <p className="text-xs max-w-sm mx-auto">Manage staff shifts, consultation hours, and department assignments.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorsPage;
