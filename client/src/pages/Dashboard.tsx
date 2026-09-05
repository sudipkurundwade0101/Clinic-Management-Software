import React from 'react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from 'recharts';
import { ArrowUpRight, CalendarDays, ChevronRight, CircleDollarSign, ClipboardCheck, Clock3, Download, Pill, Plus, UsersRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { ROUTES } from '@/constants/routes';

const revenueData = [
  { day: 'Mon', revenue: 18400 }, { day: 'Tue', revenue: 22400 }, { day: 'Wed', revenue: 19700 },
  { day: 'Thu', revenue: 27800 }, { day: 'Fri', revenue: 24300 }, { day: 'Sat', revenue: 31600 }, { day: 'Sun', revenue: 26900 },
];
const revenueChartConfig = { revenue: { label: 'Revenue', color: '#0f766e' } } satisfies ChartConfig;
const conditionData = [
  { condition: 'Hypertension', cases: 38 }, { condition: 'Type 2 diabetes', cases: 31 }, { condition: 'Upper respiratory', cases: 26 }, { condition: 'Musculoskeletal', cases: 19 }, { condition: 'Thyroid disorders', cases: 14 },
];
const conditionChartConfig = { cases: { label: 'Patients', color: '#2563eb' } } satisfies ChartConfig;
const visitData = [{ name: 'New patients', value: 36, color: '#2563eb' }, { name: 'Follow-ups', value: 64, color: '#14b8a6' }];
const queue = [
  { time: '09:30', name: 'Maria Gonzales', reason: 'Follow-up consultation', status: 'Checked in', initials: 'MG' },
  { time: '10:00', name: 'James Wilson', reason: 'Hypertension review', status: 'Waiting', initials: 'JW' },
  { time: '10:30', name: 'Aisha Patel', reason: 'Annual wellness visit', status: 'Confirmed', initials: 'AP' },
];
const medicines = [
  { name: 'Metformin', details: '500 mg · 42 prescriptions', percent: 82, color: 'bg-blue-500' },
  { name: 'Amlodipine', details: '5 mg · 36 prescriptions', percent: 70, color: 'bg-teal-500' },
  { name: 'Atorvastatin', details: '10 mg · 29 prescriptions', percent: 57, color: 'bg-violet-500' },
];
const formatCurrency = (value: number) => `₹${new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(value)}`;

export const DashboardPage: React.FC = () => (
  <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
    <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div><div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground"><span>Saturday, 30 August 2026</span><span className="h-1 w-1 rounded-full bg-muted-foreground" /><span>Week 35</span></div><h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Good morning, Dr. Rivera</h1><p className="mt-1 text-sm text-muted-foreground">Here&apos;s a clear view of how your practice is doing.</p></div>
      <div className="flex flex-wrap items-center gap-2"><Link to={ROUTES.REPORTS}><Button variant="outline" className="gap-2"><Download className="size-4" /> View report</Button></Link><Link to={ROUTES.APPOINTMENTS}><Button className="gap-2 bg-teal-700 hover:bg-teal-800"><Plus className="size-4" /> New appointment</Button></Link></div>
    </section>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard icon={UsersRound} iconClass="bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400" label="Patients seen today" value="18" trend="12%" note="vs. 16 yesterday" />
      <MetricCard icon={ClipboardCheck} iconClass="bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400" label="This week" value="221" trend="8.4%" note="vs. last week" />
      <MetricCard icon={CircleDollarSign} iconClass="bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400" label="Revenue this month" value="₹4.8L" trend="16.2%" note="vs. July" />
      <MetricCard icon={CalendarDays} iconClass="bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400" label="Upcoming today" value="9" trend="3" note="need confirmation" trendPositive={false} />
    </section>

    <section className="grid gap-6 xl:grid-cols-5">
      <Card className="xl:col-span-3 shadow-sm"><CardHeader className="flex flex-row items-start justify-between space-y-0"><div><CardTitle>Revenue overview</CardTitle><CardDescription className="mt-1">Daily collections for this week</CardDescription></div><Badge variant="secondary" className="font-normal">This week</Badge></CardHeader><CardContent className="pt-2"><div className="mb-4 flex items-baseline gap-2"><span className="text-3xl font-semibold">₹1,71,100</span><span className="text-sm font-medium text-emerald-600">+14.6%</span></div><ChartContainer config={revenueChartConfig} className="h-[270px] w-full aspect-auto"><AreaChart data={revenueData} margin={{ left: 0, right: 12, top: 12 }}><defs><linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.34} /><stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0.02} /></linearGradient></defs><CartesianGrid vertical={false} /><XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={10} /><YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={formatCurrency} width={48} /><ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" formatter={(value) => <span className="font-mono font-medium">{formatCurrency(Number(value))}</span>} />} /><Area dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2.5} fill="url(#revenue-fill)" /></AreaChart></ChartContainer></CardContent></Card>
      <Card className="xl:col-span-2 shadow-sm"><CardHeader><CardTitle>Patient mix</CardTitle><CardDescription>New visits compared with follow-ups</CardDescription></CardHeader><CardContent className="flex flex-col items-center gap-4 pt-0 sm:flex-row sm:justify-around"><ChartContainer config={{ new: { label: 'New patients', color: '#2563eb' }, follow: { label: 'Follow-ups', color: '#14b8a6' } }} className="h-[210px] w-[210px] shrink-0 aspect-square"><PieChart><ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} /><Pie data={visitData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={83} paddingAngle={4} strokeWidth={0}>{visitData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><text x="50%" y="47%" textAnchor="middle" className="fill-foreground text-2xl font-semibold">221</text><text x="50%" y="59%" textAnchor="middle" className="fill-muted-foreground text-xs">visits</text></PieChart></ChartContainer><div className="w-full space-y-4 sm:w-auto">{visitData.map((item) => <div key={item.name} className="flex min-w-40 items-center justify-between gap-5"><span className="flex items-center gap-2 text-sm text-muted-foreground"><span className="size-2.5 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span><span className="font-semibold">{item.value}%</span></div>)}<div className="border-t pt-3 text-sm"><span className="text-muted-foreground">Avg. visit time</span><p className="mt-1 font-semibold">22 min</p></div></div></CardContent></Card>
    </section>

    <section className="grid gap-6 xl:grid-cols-5">
      <Card className="xl:col-span-3 shadow-sm"><CardHeader className="flex flex-row items-start justify-between space-y-0"><div><CardTitle>Most common conditions</CardTitle><CardDescription>Diagnoses recorded in the past 30 days</CardDescription></div><Button variant="ghost" size="sm" className="gap-1 text-muted-foreground">View all <ChevronRight className="size-4" /></Button></CardHeader><CardContent className="pt-2"><ChartContainer config={conditionChartConfig} className="h-[265px] w-full aspect-auto"><BarChart data={conditionData} layout="vertical" margin={{ left: 8, right: 20 }}><CartesianGrid horizontal={false} /><YAxis dataKey="condition" type="category" tickLine={false} axisLine={false} width={118} className="text-xs" /><XAxis type="number" hide /><ChartTooltip cursor={{ fill: 'var(--muted)' }} content={<ChartTooltipContent hideLabel />} /><Bar dataKey="cases" fill="var(--color-cases)" radius={[0, 5, 5, 0]} barSize={22} /></BarChart></ChartContainer></CardContent></Card>
      <Card className="xl:col-span-2 shadow-sm"><CardHeader><CardTitle>Frequently prescribed</CardTitle><CardDescription>Top medicines this month</CardDescription></CardHeader><CardContent className="space-y-5">{medicines.map((medicine, index) => <div key={medicine.name} className="space-y-2"><div className="flex items-start justify-between gap-3"><div className="flex gap-3"><span className="mt-0.5 flex size-6 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">{index + 1}</span><div><p className="text-sm font-medium">{medicine.name}</p><p className="text-xs text-muted-foreground">{medicine.details}</p></div></div><Pill className="size-4 text-muted-foreground" /></div><div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${medicine.color}`} style={{ width: `${medicine.percent}%` }} /></div></div>)}</CardContent></Card>
    </section>

    <section className="grid gap-6 xl:grid-cols-5">
      <Card className="xl:col-span-3 shadow-sm"><CardHeader className="flex flex-row items-start justify-between space-y-0"><div><CardTitle>Today&apos;s schedule</CardTitle><CardDescription>3 patients are next in your queue</CardDescription></div><Link to={ROUTES.APPOINTMENTS}><Button variant="ghost" size="sm" className="gap-1">View calendar <ChevronRight className="size-4" /></Button></Link></CardHeader><CardContent><div className="divide-y">{queue.map((visit) => <div key={visit.time} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"><span className="w-10 text-xs font-medium text-muted-foreground">{visit.time}</span><div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-800 dark:bg-teal-900 dark:text-teal-100">{visit.initials}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{visit.name}</p><p className="truncate text-xs text-muted-foreground">{visit.reason}</p></div><Badge variant="secondary" className="hidden sm:inline-flex">{visit.status}</Badge><ChevronRight className="size-4 text-muted-foreground" /></div>)}</div></CardContent></Card>
      <Card className="border-teal-200 bg-teal-50/50 xl:col-span-2 dark:border-teal-900 dark:bg-teal-950/20"><CardContent className="flex h-full min-h-[205px] flex-col justify-between p-6"><div><div className="mb-4 flex size-10 items-center justify-center rounded-lg bg-teal-700 text-white"><Clock3 className="size-5" /></div><h2 className="font-semibold">Keep your day on track</h2><p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">You have 3 appointment confirmations awaiting review before noon.</p></div><Link to={ROUTES.APPOINTMENTS} className="mt-5 w-fit"><Button variant="outline" className="gap-2 border-teal-200 bg-background">Review appointments <ArrowUpRight className="size-4" /></Button></Link></CardContent></Card>
    </section>
  </div>
);

function MetricCard({ icon: Icon, iconClass, label, value, trend, note, trendPositive = true }: { icon: React.ElementType; iconClass: string; label: string; value: string; trend: string; note: string; trendPositive?: boolean }) {
  return <Card className="shadow-sm"><CardContent className="p-5"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-muted-foreground">{label}</p><p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p></div><div className={`flex size-10 items-center justify-center rounded-xl ${iconClass}`}><Icon className="size-5" /></div></div><p className="mt-4 text-xs text-muted-foreground"><span className={trendPositive ? 'font-medium text-emerald-600' : 'font-medium text-amber-600'}>{trendPositive && '↑ '}{trend}</span> {note}</p></CardContent></Card>;
}

export default DashboardPage;
