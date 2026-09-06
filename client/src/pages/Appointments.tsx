import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Calendar as CalendarIcon, RefreshCw, LogIn, CalendarCheck } from 'lucide-react';
import { PlaceholdersAndVanishInput } from '@/components/ui/placeholders-and-vanish-input';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './calendar-custom.css';
import { NewAppointmentModal } from '@/components/appointments/NewAppointmentModal';
import { useSearchParams } from 'react-router-dom';
import { api } from '@/lib/apiClient';

const localizer = momentLocalizer(moment);

export const AppointmentsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    checkConnectionStatus();
    
    // Check if we just redirected back from Google OAuth
    const status = searchParams.get('status');
    if (status === 'success') {
      searchParams.delete('status');
      setSearchParams(searchParams);
    }
  }, []);

  const checkConnectionStatus = async () => {
    try {
      const data = await api.get('/calendar/status');
      setConnected(data.connected);
      if (data.connected) {
        fetchEvents();
      }
    } catch (error) {
      console.error('Error checking connection status', error);
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await api.get('/calendar/events');
      
      const formattedEvents = data.map((item: any) => ({
        title: item.summary,
        start: new Date(item.start.dateTime || item.start.date),
        end: new Date(item.end.dateTime || item.end.date),
        allDay: !item.start.dateTime,
        resource: item,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error fetching events', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnectGoogle = () => {
    window.location.href = 'http://localhost:5000/api/calendar/auth/google';
  };

  const handleSaveAppointment = async (eventData: any) => {
    try {
      await api.post('/calendar/events', eventData);
      await fetchEvents();
    } catch (err: any) {
      console.error(err.message);
      throw new Error(err.message || 'Failed to create event');
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-card p-6 rounded-2xl shadow-sm border border-border/50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl">
            <CalendarCheck className="size-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Appointments
            </h1>
            <p className="text-sm text-muted-foreground font-medium mt-1">Schedule and manage patient consultations dynamically.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {!connected ? (
            <Button onClick={handleConnectGoogle} variant="default" className="gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-105 rounded-full px-6">
              <LogIn className="size-4" />
              Connect Google Calendar
            </Button>
          ) : (
            <>
              <Button onClick={fetchEvents} variant="outline" size="icon" className="rounded-full shadow-sm hover:bg-primary/5 transition-all" title="Refresh">
                <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button className="gap-2 shadow-lg shadow-primary/20 rounded-full px-6 transition-all hover:scale-105 hover:bg-primary/90" onClick={() => setModalOpen(true)}>
                <Plus className="size-4" />
                New Appointment
              </Button>
            </>
          )}
        </div>
      </div>

      <Card className="border-0 shadow-xl shadow-black/5 bg-background/50 backdrop-blur-xl overflow-hidden rounded-3xl">
        <CardHeader className="bg-card/50 border-b border-border/50 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <CardTitle className="text-xl">Schedule Directory</CardTitle>
              <CardDescription className="mt-1">Your upcoming, completed, and canceled visits at a glance.</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-full sm:w-80 z-10">
                <PlaceholdersAndVanishInput
                  placeholders={[
                    "Search patient name...",
                    "Search doctor...",
                    "Find upcoming appointments...",
                    "Search by phone number..."
                  ]}
                  onChange={(e) => console.log(e.target.value)}
                  onSubmit={(e) => { e.preventDefault(); console.log("submitted"); }}
                />
              </div>
              <Button variant="outline" size="icon" className="rounded-full shrink-0">
                <Filter className="size-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 h-[700px]">
          {!connected ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <div className="p-6 bg-card border border-border/50 rounded-3xl shadow-2xl relative">
                  <CalendarIcon className="size-20 text-primary/60" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-bold tracking-tight">Connect your calendar</p>
                <p className="text-base text-muted-foreground max-w-md mx-auto">
                  Authorize Google Calendar to unlock seamless two-way syncing. View and schedule patient appointments directly from this beautiful dashboard.
                </p>
              </div>
              <Button onClick={handleConnectGoogle} size="lg" className="rounded-full shadow-xl shadow-primary/25 hover:scale-105 transition-all text-md px-8 mt-2">
                Connect Now
              </Button>
            </div>
          ) : (
            <div className="h-full animation-fade-in">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                views={['month', 'week', 'day', 'agenda']}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <NewAppointmentModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        onSave={handleSaveAppointment} 
      />
    </div>
  );
};

export default AppointmentsPage;
