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
 if (!dashboardData) return kpi;

 console.log("[Dashboard] Live Backend Data:", dashboardData);

 const appointments =
 dashboardData.totalAppointments ??
 dashboardData.appointmentsCount ??
 dashboardData.appointments ??
 dashboardData.data?.totalAppointments ??
 kpi.appointments;

 const treated =
 dashboardData.treatedPatients ??
 dashboardData.treatedCount ??
 dashboardData.treated ??
 dashboardData.data?.treatedPatients ??
 kpi.treated;

 const pending =
 dashboardData.pendingActions ??
 dashboardData.pendingCount ??
 dashboardData.pending ??
 dashboardData.data?.pendingActions ??
 kpi.pending;

 const completed =
 dashboardData.completedActions ??
 dashboardData.completedCount ??
 dashboardData.completed ??
 dashboardData.data?.completedActions ??
 kpi.completed;

 const satisfaction =
 dashboardData.avgSatisfaction ??
 dashboardData.satisfaction ??
 dashboardData.rating ??
 dashboardData.data?.avgSatisfaction ??
 kpi.satisfaction;

 const revenueLabel = 
 dashboardData.revenueLabel ?? 
 dashboardData.data?.revenueLabel ?? 
 kpi.revenueLabel;

 return {
 appointments,
 treated,
 pending,
 completed,
 satisfaction: String(satisfaction),
 revenueLabel,
 };
 }, [dashboardData]);

 // Filter and map today's appointments dynamically
 const todayAppointments = useMemo(() => {
 if (!apiAppointments || !Array.isArray(apiAppointments)) return [];
 
 // Get today's local date in yyyy-MM-dd format
 const todayStr = new Date().toLocaleDateString("en-CA"); // Gets local date in yyyy-MM-dd format safely
 
 const filtered = apiAppointments.filter((app: any) => app.appointmentDate === todayStr);

 if (filtered.length === 0) {
 return [];
 }

 return filtered.map((app: any) => ({
 id: String(app.id),
 patient: `${app.patientFirstName || ""} ${app.patientLastName || ""}`.trim() || app.patientUsername || "Patient",
 condition: app.serviceName || "Dental Treatment",
 time: app.appointmentTime || "09:00 AM",
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
 items={dashboardData?.chart ?? dashboardData?.data?.chart ?? []}
 />

 <RevenueCard
 periodLabel={dashboardData?.revenue?.periodLabel ?? dashboardData?.data?.revenue?.periodLabel ?? ""}
 revenueLabel={liveKpi.revenueLabel}
 labels={dashboardData?.revenue?.labels ?? dashboardData?.data?.revenue?.labels ?? []}
 values={dashboardData?.revenue?.values ?? dashboardData?.data?.revenue?.values ?? []}
 yTicks={dashboardData?.revenue?.yTicks ?? dashboardData?.data?.revenue?.yTicks ?? []}
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
 points={dashboardData?.trend?.values ?? dashboardData?.data?.trend?.values ?? []}
 labels={dashboardData?.trend?.labels ?? dashboardData?.data?.trend?.labels ?? []}
 title="Activity Trend"
 subtitle="Patient volume trend"
 />
 <TopConditionsCard items={dashboardData?.topConditions ?? dashboardData?.data?.topConditions ?? []} />
 </div>
 </div>

 <MobileBottomNav active="dashboard" />
 </main>
 );
}
