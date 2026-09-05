import React from 'react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowLeft,
  CalendarDays,
  Download,
  FileText,
  Printer,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { ChartConfig } from '@/components/ui/chart';
import { ROUTES } from '@/constants/routes';

const monthlyData = [
  { month: 'Mar', patients: 176, revenue: 352000 },
  { month: 'Apr', patients: 194, revenue: 388000 },
  { month: 'May', patients: 181, revenue: 365000 },
  { month: 'Jun', patients: 208, revenue: 421000 },
  { month: 'Jul', patients: 212, revenue: 414000 },
  { month: 'Aug', patients: 221, revenue: 482000 },
];

const serviceData = [
  { name: 'Consultations', revenue: 278000 },
  { name: 'Diagnostics', revenue: 112000 },
  { name: 'Procedures', revenue: 64000 },
  { name: 'Vaccinations', revenue: 28000 },
];

const diagnosisData = [
  { condition: 'Hypertension', cases: 38, fill: 'var(--color-hypertension)' },
  { condition: 'Type 2 diabetes', cases: 31, fill: 'var(--color-diabetes)' },
  { condition: 'URI', cases: 26, fill: 'var(--color-uri)' },
  { condition: 'MSK pain', cases: 19, fill: 'var(--color-msk)' },
  { condition: 'Thyroid', cases: 14, fill: 'var(--color-thyroid)' },
];

const prescriptionData = [
  { medicine: 'Metformin', prescriptions: 42, fill: 'var(--color-metformin)' },
  { medicine: 'Amlodipine', prescriptions: 36, fill: 'var(--color-amlodipine)' },
  { medicine: 'Atorvastatin', prescriptions: 29, fill: 'var(--color-atorvastatin)' },
  { medicine: 'Pantoprazole', prescriptions: 24, fill: 'var(--color-pantoprazole)' },
  { medicine: 'Vitamin D3', prescriptions: 21, fill: 'var(--color-vitamin)' },
];

const paymentData = [
  { status: 'Paid', visits: 186, fill: 'var(--color-paid)' },
  { status: 'Pending', visits: 25, fill: 'var(--color-pending)' },
  { status: 'Insurance', visits: 10, fill: 'var(--color-insurance)' },
];

const careQualityData = [
  { metric: 'Follow-up', value: 87, fill: 'var(--color-followup)' },
  { metric: 'Confirmed', value: 91, fill: 'var(--color-confirmed)' },
  { metric: 'Bills settled', value: 84, fill: 'var(--color-settled)' },
];

const diagnosisRows = [
  ['Hypertension', '38', '17.2%', '+2.4%'],
  ['Type 2 diabetes', '31', '14.0%', '+1.8%'],
  ['Upper respiratory infection', '26', '11.8%', '-0.6%'],
  ['Musculoskeletal pain', '19', '8.6%', '+0.9%'],
  ['Thyroid disorders', '14', '6.3%', '0.0%'],
];

const patients = [
  ['Maria Gonzales', 'Follow-up', '₹1,200', 'Paid'],
  ['James Wilson', 'Consultation', '₹1,500', 'Paid'],
  ['Aisha Patel', 'Wellness visit', '₹1,100', 'Pending'],
  ['Rohan Shah', 'Diagnostic review', '₹2,400', 'Paid'],
];

const monthlyConfig = {
  patients: { label: 'Patients', color: '#2563eb' },
  revenue: { label: 'Revenue', color: '#0f766e' },
} satisfies ChartConfig;

const serviceConfig = {
  revenue: { label: 'Revenue', color: '#7c3aed' },
} satisfies ChartConfig;

const diagnosisConfig = {
  cases: { label: 'Cases' },
  hypertension: { label: 'Hypertension', color: '#2563eb' },
  diabetes: { label: 'Type 2 diabetes', color: '#0f766e' },
  uri: { label: 'URI', color: '#f59e0b' },
  msk: { label: 'MSK pain', color: '#db2777' },
  thyroid: { label: 'Thyroid', color: '#7c3aed' },
} satisfies ChartConfig;

const prescriptionConfig = {
  prescriptions: { label: 'Prescriptions' },
  metformin: { label: 'Metformin', color: '#0f766e' },
  amlodipine: { label: 'Amlodipine', color: '#2563eb' },
  atorvastatin: { label: 'Atorvastatin', color: '#7c3aed' },
  pantoprazole: { label: 'Pantoprazole', color: '#f59e0b' },
  vitamin: { label: 'Vitamin D3', color: '#db2777' },
} satisfies ChartConfig;

const paymentConfig = {
  visits: { label: 'Visits' },
  paid: { label: 'Paid', color: '#059669' },
  pending: { label: 'Pending', color: '#f59e0b' },
  insurance: { label: 'Insurance', color: '#2563eb' },
} satisfies ChartConfig;

const qualityConfig = {
  value: { label: 'Score' },
  followup: { label: 'Follow-up', color: '#0f766e' },
  confirmed: { label: 'Confirmed', color: '#2563eb' },
  settled: { label: 'Bills settled', color: '#7c3aed' },
} satisfies ChartConfig;

const compactRupees = (value: number) =>
  `₹${new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)}`;

const formatRupees = (value: unknown) =>
  typeof value === 'number' ? `₹${value.toLocaleString('en-IN')}` : String(value);

export const ReportsPage: React.FC = () => (
  <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
      <div>
        <Link
          to={ROUTES.DASHBOARD}
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Practice performance report
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A complete visual summary for 1-30 August 2026.
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="gap-2">
          <Printer className="size-4" />
          Print
        </Button>
        <Button className="gap-2 bg-teal-700 hover:bg-teal-800">
          <Download className="size-4" />
          Export PDF
        </Button>
      </div>
    </div>

    <Card className="border-teal-200 bg-gradient-to-r from-teal-50 to-background dark:border-teal-900 dark:from-teal-950/30">
      <CardContent className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-teal-700 text-white">
            <FileText className="size-5" />
          </div>
          <div>
            <h2 className="font-semibold">Monthly performance at a glance</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Your clinic exceeded the August patient-volume target by 10.5%.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-5 text-sm">
          <div>
            <p className="text-muted-foreground">Report period</p>
            <p className="mt-1 font-medium">1-30 Aug 2026</p>
          </div>
          <div>
            <p className="text-muted-foreground">Prepared for</p>
            <p className="mt-1 font-medium">Dr. Alex Rivera</p>
          </div>
        </div>
      </CardContent>
    </Card>

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <ReportMetric
        icon={UsersRound}
        label="Total patient visits"
        value="221"
        detail="+8.4% vs. July"
      />
      <ReportMetric
        icon={TrendingUp}
        label="Net revenue"
        value="₹4,82,000"
        detail="+16.2% vs. July"
      />
      <ReportMetric
        icon={CalendarDays}
        label="Consultation completion"
        value="94.6%"
        detail="209 of 221 completed"
      />
      <ReportMetric
        icon={FileText}
        label="Average revenue / visit"
        value="₹2,181"
        detail="+₹146 vs. July"
      />
    </section>

    <section className="grid gap-6 xl:grid-cols-5">
      <Card className="shadow-sm xl:col-span-3">
        <CardHeader>
          <CardTitle>Six-month trend</CardTitle>
          <CardDescription>Patient volume and collections by month</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={monthlyConfig} className="min-h-[320px] w-full">
            <LineChart data={monthlyData} margin={{ left: 8, right: 16, top: 10 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} />
              <YAxis yAxisId="patients" tickLine={false} axisLine={false} width={32} />
              <YAxis
                yAxisId="revenue"
                orientation="right"
                tickLine={false}
                axisLine={false}
                tickFormatter={compactRupees}
                width={54}
              />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <Legend content={<ChartLegendContent />} />
              <Line
                yAxisId="patients"
                type="monotone"
                dataKey="patients"
                stroke="var(--color-patients)"
                strokeWidth={2.5}
                dot={false}
              />
              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2.5}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="shadow-sm xl:col-span-2">
        <CardHeader>
          <CardTitle>Revenue by service</CardTitle>
          <CardDescription>Contribution to August collections</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={serviceConfig} className="min-h-[320px] w-full">
            <BarChart data={serviceData} margin={{ left: 0, right: 8, top: 10 }}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="text-xs"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={compactRupees}
                width={52}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value) => (
                      <span className="font-mono font-medium">{formatRupees(value)}</span>
                    )}
                  />
                }
              />
              <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>

    <section className="grid gap-6 xl:grid-cols-3">
      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Diagnosed conditions</CardTitle>
          <CardDescription>Most common cases in August</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={diagnosisConfig} className="min-h-[300px] w-full">
            <BarChart
              data={diagnosisData}
              layout="vertical"
              margin={{ left: 10, right: 26, top: 8, bottom: 8 }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="condition"
                type="category"
                tickLine={false}
                axisLine={false}
                width={86}
              />
              <XAxis type="number" hide />
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="cases" radius={[0, 5, 5, 0]}>
                <LabelList dataKey="cases" position="right" className="fill-foreground" />
                {diagnosisData.map((entry) => (
                  <Cell key={entry.condition} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Prescriptions</CardTitle>
          <CardDescription>Medicines prescribed most often</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={prescriptionConfig} className="min-h-[300px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="medicine" hideLabel />} />
              <Pie
                data={prescriptionData}
                dataKey="prescriptions"
                nameKey="medicine"
                innerRadius={56}
                outerRadius={92}
                paddingAngle={3}
              />
              <Legend content={<ChartLegendContent nameKey="medicine" />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle>Payment status</CardTitle>
          <CardDescription>Billing status across all visits</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={paymentConfig} className="min-h-[300px] w-full">
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel />} />
              <Pie
                data={paymentData}
                dataKey="visits"
                nameKey="status"
                innerRadius={54}
                outerRadius={94}
                strokeWidth={3}
              />
              <Legend content={<ChartLegendContent nameKey="status" />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>

    <section className="grid gap-6 xl:grid-cols-5">
      <Card className="shadow-sm xl:col-span-2">
        <CardHeader>
          <CardTitle>Care quality</CardTitle>
          <CardDescription>Operational indicators this month</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={qualityConfig} className="min-h-[300px] w-full">
            <RadialBarChart
              data={careQualityData}
              innerRadius="28%"
              outerRadius="92%"
              startAngle={180}
              endAngle={0}
            >
              <ChartTooltip
                content={<ChartTooltipContent nameKey="metric" hideLabel indicator="line" />}
              />
              <RadialBar dataKey="value" background cornerRadius={6} />
              <Legend content={<ChartLegendContent nameKey="metric" />} />
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="shadow-sm xl:col-span-3">
        <CardHeader>
          <CardTitle>Clinical insights</CardTitle>
          <CardDescription>Detailed diagnosis distribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-left text-xs text-muted-foreground">
                <tr>
                  <th className="pb-3 font-medium">Condition</th>
                  <th className="pb-3 text-right font-medium">Cases</th>
                  <th className="pb-3 text-right font-medium">Share</th>
                  <th className="pb-3 text-right font-medium">vs. July</th>
                </tr>
              </thead>
              <tbody>
                {diagnosisRows.map(([name, cases, share, change]) => (
                  <tr key={name} className="border-b last:border-0">
                    <td className="py-3.5 font-medium">{name}</td>
                    <td className="py-3.5 text-right">{cases}</td>
                    <td className="py-3.5 text-right text-muted-foreground">{share}</td>
                    <td
                      className={`py-3.5 text-right ${
                        change.startsWith('-')
                          ? 'text-rose-600'
                          : change === '0.0%'
                            ? 'text-muted-foreground'
                            : 'text-emerald-600'
                      }`}
                    >
                      {change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </section>

    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>Recent patient activity</CardTitle>
          <CardDescription>
            Completed and outstanding visits during this reporting period
          </CardDescription>
        </div>
        <Badge variant="secondary">Latest 4</Badge>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-sm">
            <thead className="border-b text-left text-xs text-muted-foreground">
              <tr>
                <th className="pb-3 font-medium">Patient</th>
                <th className="pb-3 font-medium">Visit type</th>
                <th className="pb-3 text-right font-medium">Billed</th>
                <th className="pb-3 text-right font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {patients.map(([name, type, billed, status]) => (
                <tr key={name} className="border-b last:border-0">
                  <td className="py-3.5 font-medium">{name}</td>
                  <td className="py-3.5 text-muted-foreground">{type}</td>
                  <td className="py-3.5 text-right">{billed}</td>
                  <td className="py-3.5 text-right">
                    <Badge
                      variant={status === 'Paid' ? 'secondary' : 'outline'}
                      className={
                        status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'text-amber-700'
                      }
                    >
                      {status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </div>
);

function ReportMetric({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-5">
        <Icon className="mb-4 size-5 text-teal-700 dark:text-teal-400" />
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-semibold">{value}</p>
        <p className="mt-2 text-xs text-emerald-600">{detail}</p>
      </CardContent>
    </Card>
  );
}

export default ReportsPage;
