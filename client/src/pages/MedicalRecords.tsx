import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Plus } from 'lucide-react';

export const MedicalRecordsPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Electronic Medical Records (EMR)</h1>
          <p className="text-sm text-muted-foreground">Access patient prescriptions, lab test results, and clinical diagnoses.</p>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          Add EMR Record
        </Button>
      </div>

      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle>Clinical Records Archive</CardTitle>
          <CardDescription>Secure electronic health records system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground space-y-3">
            <FileText className="size-12 mx-auto text-muted-foreground/60" />
            <p className="font-medium">Medical Records Directory</p>
            <p className="text-xs max-w-sm mx-auto">Contains diagnosis notes, digital prescriptions, vital signs logs, and lab uploads.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalRecordsPage;
