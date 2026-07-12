export type AnalyticsPeriod = "24h" | "1w" | "1m" | "3m" | "6m" | "1y";

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

const DAY_LABELS = ["9 AM", "11 AM", "1 PM", "3 PM", "5 PM"];
const WEEK_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const MONTH_LABELS = ["Week 1", "Week 2", "Week 3", "Week 4"];
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
 "24h": {
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
 [4, 6, 8, 4, 2],
 [3, 5, 4, 2, 0],
 ),
 revenue: {
 labels: DAY_LABELS,
 values: [120, 150, 100, 80, 30],
 yTicks: ["$0.2k", "$0.1k", "$0.1k", "$0.0k"],
 periodLabel: "Today —",
 },
 trend: {
 labels: DAY_LABELS,
 values: [4, 7, 6, 5, 2],
 },
 },
 "1w": {
 kpi: {
 appointments: 142,
 treated: 120,
 pending: 12,
 completed: 10,
 satisfaction: "4.8",
 revenueLabel: "$2,760",
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
 "1m": {
 kpi: {
 appointments: 640,
 treated: 512,
 pending: 45,
 completed: 83,
 satisfaction: "4.8",
 revenueLabel: "$12,200",
 },
 chart: toChartItems(MONTH_LABELS, [140, 180, 160, 160], [110, 150, 130, 122]),
 revenue: {
 labels: MONTH_LABELS,
 values: [2800, 3400, 3100, 2900],
 yTicks: ["$4.0k", "$2.0k", "$1.0k", "$0.0k"],
 periodLabel: "This Month —",
 },
 trend: { labels: MONTH_LABELS, values: [6, 8, 7, 6] },
 },
 "3m": {
 kpi: {
 appointments: 1920,
 treated: 1536,
 pending: 90,
 completed: 250,
 satisfaction: "4.8",
 revenueLabel: "$36,600",
 },
 chart: toChartItems(MONTH_LABELS, [440, 580, 460, 440], [310, 450, 330, 322]),
 revenue: {
 labels: MONTH_LABELS,
 values: [8800, 10200, 9100, 8900],
 yTicks: ["$12.0k", "$6.0k", "$3.0k", "$0.0k"],
 periodLabel: "Last 3 Months —",
 },
 trend: { labels: MONTH_LABELS, values: [18, 24, 21, 18] },
 },
 "6m": {
 kpi: {
 appointments: 3840,
 treated: 3072,
 pending: 150,
 completed: 500,
 satisfaction: "4.8",
 revenueLabel: "$73,200",
 },
 chart: toChartItems(MONTH_LABELS, [880, 1160, 920, 880], [620, 900, 660, 644]),
 revenue: {
 labels: MONTH_LABELS,
 values: [17600, 20400, 18200, 17800],
 yTicks: ["$24.0k", "$12.0k", "$6.0k", "$0.0k"],
 periodLabel: "Last 6 Months —",
 },
 trend: { labels: MONTH_LABELS, values: [36, 48, 42, 36] },
 },
 "1y": {
 kpi: {
 appointments: 7200,
 treated: 6100,
 pending: 120,
 completed: 980,
 satisfaction: "4.8",
 revenueLabel: "$140,000",
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
 {
 id: "a3",
 patient: "Michael Brown",
 condition: "Orthodontic Consultation",
 time: "02:15 PM",
 status: "rescheduled",
 avatar: "MB",
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
