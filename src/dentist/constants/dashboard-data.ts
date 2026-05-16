export type AnalyticsPeriod = "day" | "week" | "month" | "year";

export type KpiSet = {
  appointments: number;
  treated: number;
  pending: number;
  completed: number;
  satisfaction: string;
  revenueLabel: string;
};

export type ChartItem = {
  label: string;
  appointments: number;
  treated: number;
};

export type RevenueSeries = {
  labels: string[];
  values: number[];
  yTicks: string[];
  periodLabel: string;
};

export type TrendSeries = {
  labels: string[];
  values: number[];
};

export type DentistAppointment = {
  id: string;
  patient: string;
  condition: string;
  time: string;
  status: "pending" | "confirmed" | "rescheduled";
  avatar: string;
};

const DAY_LABELS = Array.from({ length: 24 }, (_, i) => `${i}:00`);
const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const YEAR_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const toChartItems = (
  labels: string[],
  appointments: number[],
  treated: number[],
): ChartItem[] => labels.map((label, i) => ({ label, appointments: appointments[i] ?? 0, treated: treated[i] ?? 0 }));

export const PERIOD_DATA: Record<
  AnalyticsPeriod,
  { kpi: KpiSet; chart: ChartItem[]; revenue: RevenueSeries; trend: TrendSeries }
> = {
  day: {
    kpi: {
      appointments: 24,
      treated: 14,
      pending: 7,
      completed: 3,
      satisfaction: "4.8",
      revenueLabel: "$480",
    },
    chart: toChartItems(
      DAY_LABELS,
      [0, 0, 0, 0, 0, 1, 2, 2, 3, 4, 3, 4, 2, 1, 2, 3, 1, 1, 0, 1, 2, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 2, 3, 2, 1, 1, 2, 1, 1, 0, 1, 1, 1, 0, 0],
    ),
    revenue: {
      labels: DAY_LABELS,
      values: [0, 0, 0, 0, 0, 20, 50, 70, 90, 120, 100, 80, 65, 50, 40, 30, 25, 20, 15, 10, 10, 5, 0, 0],
      yTicks: ["$0.2k", "$0.1k", "$0.1k", "$0.0k"],
      periodLabel: "Today — May 12 —",
    },
    trend: {
      labels: DAY_LABELS,
      values: [0, 0, 0, 0, 0, 1, 2, 3, 4, 6, 5, 7, 6, 4, 5, 6, 4, 3, 2, 2, 1, 1, 0, 0],
    },
  },
  week: {
    kpi: {
      appointments: 24,
      treated: 14,
      pending: 7,
      completed: 3,
      satisfaction: "4.8",
      revenueLabel: "$1,760",
    },
    chart: toChartItems(
      WEEK_LABELS,
      [16, 20, 24, 18, 22, 14, 10],
      [13, 17, 21, 15, 9, 8, 6],
    ),
    revenue: {
      labels: WEEK_LABELS,
      values: [560, 480, 360, 240, 380, 220, 160],
      yTicks: ["$0.6k", "$0.3k", "$0.1k", "$0.0k"],
      periodLabel: "This Week —",
    },
    trend: {
      labels: WEEK_LABELS,
      values: [4, 6, 5, 7, 3, 2, 1],
    },
  },
  month: {
    kpi: {
      appointments: 24,
      treated: 14,
      pending: 7,
      completed: 3,
      satisfaction: "4.8",
      revenueLabel: "$4,200",
    },
    chart: toChartItems(["May"], [24], [10]),
    revenue: {
      labels: ["May"],
      values: [3200],
      yTicks: ["$6.0k", "$3.0k", "$1.5k", "$0.0k"],
      periodLabel: "May 2026 —",
    },
    trend: { labels: ["May"], values: [6] },
  },
  year: {
    kpi: {
      appointments: 110,
      treated: 85,
      pending: 7,
      completed: 18,
      satisfaction: "4.8",
      revenueLabel: "$20,000",
    },
    chart: toChartItems(
      YEAR_LABELS,
      [18, 22, 26, 20, 24, 16, 19, 21, 23, 20, 18, 15],
      [12, 15, 20, 14, 18, 12, 14, 16, 17, 15, 13, 11],
    ),
    revenue: {
      labels: YEAR_LABELS,
      values: [3200, 4100, 4800, 3700, 4200, 3900, 3600, 4000, 4300, 3950, 3700, 3350],
      yTicks: ["$6.0k", "$3.0k", "$1.5k", "$0.0k"],
      periodLabel: "This Year —",
    },
    trend: {
      labels: YEAR_LABELS,
      values: [3, 4, 5, 4, 6, 5, 4, 5, 6, 5, 4, 3],
    },
  },
};

export const TODAY_APPOINTMENTS: DentistAppointment[] = [
  {
    id: "a1",
    patient: "Alex Johnson",
    condition: "Caries Detected (AI Scan)",
    time: "09:00 AM",
    status: "pending",
    avatar: "AJ",
  },
  {
    id: "a2",
    patient: "Sarah Williams",
    condition: "Routine Checkup",
    time: "11:30 AM",
    status: "confirmed",
    avatar: "SW",
  },
];

export const TOP_CONDITIONS = [
  { label: "Routine Checkup", count: 6 },
  { label: "Cavity Filling", count: 4 },
  { label: "Teeth Whitening", count: 3 },
  { label: "Scaling & Polishing", count: 3 },
  { label: "Orthodontic Consult", count: 2 },
  { label: "Root Canal", count: 2 },
];

export const MOBILE_WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MOBILE_WEEK_POINTS = [4, 6, 5, 7, 3, 2];
