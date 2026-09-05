import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Plus, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export const AppointmentsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Appointments Management</h1>
          <p className="text-sm text-muted-foreground">Schedule and manage patient consultations.</p>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          New Appointment
        </Button>
      </div>

      <Card className="border border-border shadow-sm">
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle>Schedule Directory</CardTitle>
              <CardDescription>View upcoming, completed, and canceled visits.</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input placeholder="Search patient or doctor..." className="pl-9" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground space-y-3">
            <Calendar className="size-12 mx-auto text-muted-foreground/60" />
            <p className="font-medium">Appointments Calendar & List View</p>
            <p className="text-xs max-w-sm mx-auto">Appointments component ready for backend integration and date picking.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentsPage;
