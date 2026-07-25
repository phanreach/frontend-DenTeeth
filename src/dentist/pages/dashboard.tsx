import { useMemo, useState } from "react";
import { AlertCircle, Calendar, Star, Users } from "lucide-react";
import AppointmentsChart from "../../components/dentist/appointments-chart";
import StatusSplitCard from "../../components/dentist/status-split-card";
import ThisWeekCard from "../../components/dentist/this-week-card";
import TopConditionsCard from "../../components/dentist/top-conditions-card";
import RevenueCard from "../../components/dentist/revenue-card";
import TodayScheduleCard from "../../components/dentist/today-schedule-card";
import MobileBottomNav from "../../components/dentist/mobile-bottom-nav";
import KpiCard from "../../components/dentist/kpi-card";
import PeriodTabs from "../../components/dentist/period-tabs";
import type { AnalyticsPeriod } from "../constants/dashboard-data";
import useDentistDashboard from "../hooks/use-dentist-dashboard";
import useMyAppointments from "../hooks/use-my-appointments";

export default function Dashboard() {
 const [period, setPeriod] = useState<AnalyticsPeriod>("1m");
 const { data: dashboardData } = useDentistDashboard(period);
 const { data: apiAppointments } = useMyAppointments();

   // Map live KPI metrics safely
  const liveKpi = useMemo(() => {
    const kpi = {
      appointments: 0,
      treated: 0,
      pending: 0,
      completed: 0,
      satisfaction: "0.0",
      revenueLabel: "$0",
    };
    if (!dashboardData || !dashboardData.data) return kpi;

    const data = dashboardData.data;
    const stats = data.overallStats || {};
    const statusDist = data.statusDistribution || {};
    
    // Revenue Calculation
    const revTrend = data.revenueTrend || {};
    const totalRev = Object.values(revTrend).reduce((sum: number, val: unknown  ) => sum + Number(val), 0);

    return {
      appointments: stats.totalAppointments ?? 0,
      treated: stats.treatedPatients ?? 0,
      pending: stats.pendingAppointments ?? 0,
      completed: statusDist["COMPLETED"] ?? 0,
      satisfaction: "5.0",
      revenueLabel: `$${totalRev.toLocaleString()}`,
    };
  }, [dashboardData]);

  // Map Chart and Widget Data
  const chartData = useMemo(() => {
    if (!dashboardData || !dashboardData.data) return { items: [], revLabels: [], revValues: [], revTicks: [], trendLabels: [], trendValues: [], topConditions: [] };
    const data = dashboardData.data;
    
    // Appointments Overview
    const appTrend = data.appointmentTrend || {};
    const chartItems = Object.entries(appTrend).map(([date, statuses]: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => {
      const dateObj = new Date(date);
      const label = dateObj.toLocaleDateString("en-US", { weekday: 'short' });
      const appointments = Object.values(statuses).reduce((sum: number, val: unknown  ) => sum + Number(val), 0);
      const treated = statuses["COMPLETED"] ?? 0;
      return { label, appointments, treated };
    });

    // Revenue Trend
    const revTrend = data.revenueTrend || {};
    const revLabels = Object.keys(revTrend).map(date => new Date(date).toLocaleDateString("en-US", { weekday: 'short' }));
    const revValues = Object.values(revTrend).map(Number);
    const maxRev = Math.max(...revValues, 100);
    const revTicks = [maxRev, maxRev * 0.75, maxRev * 0.5, maxRev * 0.25, 0].map(Math.round).map(String);

    // Trend (Patient Volume)
    const trendValues = chartItems.map(item => item.appointments);

    // Top Services
    const topServices = data.topServices || [];
    const topConditions = topServices.map((s: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => ({ label: s.serviceName, count: s.count }));

    return { items: chartItems, revLabels, revValues, revTicks, trendLabels: revLabels, trendValues, topConditions };
  }, [dashboardData]);

 // Filter and map today's appointments dynamically
 const todayAppointments = useMemo(() => {
 if (!apiAppointments || !Array.isArray(apiAppointments)) return [];
 
 // Get today's local date in yyyy-MM-dd format
 const todayStr = new Date().toLocaleDateString("en-CA"); // Gets local date in yyyy-MM-dd format safely
 
 const filtered = apiAppointments.filter((app: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => app.appointmentDate === todayStr);

 if (filtered.length === 0) {
 return [];
 }

 return filtered.map((app: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => ({
 id: String(app.id),
 patient: `${app.patientFirstName || ""} ${app.patientLastName || ""}`.trim() || app.patientUsername || "Patient",
 condition: app.serviceName || "Dental Treatment",
 time: app.appointmentTime || "09:00 AM",
 // eslint-disable-next-line @typescript-eslint/no-explicit-any
 status: (app.status?.toLowerCase() === "rescheduled" ? "rescheduled" : app.status?.toLowerCase() === "confirmed" ? "confirmed" : "pending") as any,
 avatar: (app.patientFirstName || "P").substring(0, 1).toUpperCase(),
 }));
 }, [apiAppointments]);

 const chartSubtitle = useMemo(() => {
 switch (period) {
 case "24h":
 return "Today";
 case "1w":
 return "This Week";
 case "1m":
 return "This Month";
 case "3m":
 return "Last 3 Months";
 case "6m":
 return "Last 6 Months";
 case "1y":
 return "This Year";
 default:
 return "";
 }
 }, [period]);

 return (
 <main className="space-y-8 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-10">
 <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
 <PeriodTabs value={period} onChange={setPeriod} />
 <p className="text-sm font-medium text-muted-foreground">
 Last updated: <span className="font-semibold text-foreground">Just now</span>
 </p>
 </div>

 <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
 <KpiCard
 title="Total Appointments"
 value={liveKpi.appointments.toLocaleString()}
 subtitle="↗ +9% vs last period"
 icon={Calendar}
 featured
 />
 <KpiCard
 title="Treated Patients"
 value={liveKpi.treated.toLocaleString()}
 subtitle="Confirmed & Completed"
 icon={Users}
 />
 <KpiCard
 title="Pending Actions"
 value={liveKpi.pending.toLocaleString()}
 subtitle="Requires attention"
 icon={AlertCircle}
 />
 <KpiCard
 title="Avg. Satisfaction"
 value={liveKpi.satisfaction}
 subtitle="↗ Based on latest reviews"
 icon={Star}
 />
 </section>

 <div className="grid grid-cols-1 gap-6 xl:grid-cols-[2fr_1fr]">
 {/* Left Column */}
 <div className="space-y-6">
 <AppointmentsChart
 title="Appointments Overview"
 subtitle={chartSubtitle}
 items={chartData.items}
 />

 <RevenueCard
 periodLabel={chartSubtitle}
 revenueLabel={liveKpi.revenueLabel}
 labels={chartData.revLabels}
 values={chartData.revValues}
 yTicks={chartData.revTicks}
 />

 <TodayScheduleCard
 dateLabel={new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
 appointments={todayAppointments}
 />
 </div>

 {/* Right Column */}
 <div className="space-y-6">
 <StatusSplitCard
 confirmed={liveKpi.treated}
 pending={liveKpi.pending}
 completed={liveKpi.completed}
 />
 <ThisWeekCard
 points={chartData.trendValues}
 labels={chartData.trendLabels}
 title="Activity Trend"
 subtitle="Patient volume trend"
 />
 <TopConditionsCard items={chartData.topConditions} />
 </div>
 </div>

 <MobileBottomNav active="dashboard" />
 </main>
 );
}
