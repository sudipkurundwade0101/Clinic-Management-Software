import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CalendarPlus, Loader2 } from 'lucide-react';

interface NewAppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (event: any) => Promise<void>;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({ open, onOpenChange, onSave }) => {
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      setLoading(true);
      await onSave({
        summary,
        description,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
      });
      onOpenChange(false);
      setSummary('');
      setDescription('');
      setStartTime('');
      setEndTime('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to save appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 shadow-2xl rounded-3xl bg-background/95 backdrop-blur-3xl">
        <div className="h-2 bg-gradient-to-r from-primary to-primary/40 w-full" />
        <div className="p-6 md:p-8 space-y-6">
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 text-primary rounded-xl shrink-0">
                <CalendarPlus className="size-6" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold tracking-tight">New Appointment</DialogTitle>
                <DialogDescription className="text-sm font-medium mt-1">
                  Schedule a follow-up consultation. Syncs automatically.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="summary" className="font-semibold text-muted-foreground">Title / Patient Name</Label>
              <Input 
                id="summary" 
                className="h-11 rounded-xl bg-card border-border/50 focus-visible:ring-primary/20 focus-visible:ring-offset-0 focus-visible:border-primary shadow-inner"
                placeholder="Follow-up with John Doe" 
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="startTime" className="font-semibold text-muted-foreground">Start Time</Label>
                <Input 
                  id="startTime" 
                  type="datetime-local" 
                  className="h-11 rounded-xl bg-card border-border/50 focus-visible:ring-primary/20 shadow-inner"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime" className="font-semibold text-muted-foreground">End Time</Label>
                <Input 
                  id="endTime" 
                  type="datetime-local" 
                  className="h-11 rounded-xl bg-card border-border/50 focus-visible:ring-primary/20 shadow-inner"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-semibold text-muted-foreground">Notes (Optional)</Label>
              <Textarea 
                id="description" 
                className="resize-none min-h-[100px] rounded-xl bg-card border-border/50 focus-visible:ring-primary/20 shadow-inner"
                placeholder="Discuss blood test results..." 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <DialogFooter className="pt-4 flex items-center justify-end gap-3 sm:gap-3">
              <Button variant="ghost" type="button" className="rounded-xl font-semibold px-6 hover:bg-muted" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="rounded-xl shadow-lg shadow-primary/25 hover:shadow-primary/40 px-8 transition-all hover:scale-[1.02]">
                {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
                {loading ? "Saving..." : "Save Appointment"}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
