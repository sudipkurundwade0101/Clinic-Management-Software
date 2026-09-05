import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus } from 'lucide-react';

export const BillingPage: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Billing & Invoices</h1>
          <p className="text-sm text-muted-foreground">Manage patient invoices, insurance claims, and payment records.</p>
        </div>
        <Button className="gap-2">
          <Plus className="size-4" />
          Create Invoice
        </Button>
      </div>

      <Card className="border border-border shadow-sm">
        <CardHeader>
          <CardTitle>Invoices & Payments</CardTitle>
          <CardDescription>Track pending, paid, and claim-pending bills.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground space-y-3">
            <CreditCard className="size-12 mx-auto text-muted-foreground/60" />
            <p className="font-medium">Billing Management Hub</p>
            <p className="text-xs max-w-sm mx-auto">Generate PDF receipts, handle co-pays, and process insurance claims.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BillingPage;
