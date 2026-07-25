import re

with open("src/dentist/pages/dashboard.tsx", "r") as f:
    content = f.read()

# Replace the liveKpi useMemo block
new_live_kpi = """  // Map live KPI metrics safely
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
    const totalRev = Object.values(revTrend).reduce((sum: number, val: any) => sum + Number(val), 0);

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
    const chartItems = Object.entries(appTrend).map(([date, statuses]: [string, any]) => {
      const dateObj = new Date(date);
      const label = dateObj.toLocaleDateString("en-US", { weekday: 'short' });
      const appointments = Object.values(statuses).reduce((sum: number, val: any) => sum + Number(val), 0);
      const treated = statuses["COMPLETED"] ?? 0;
      return { label, appointments, treated };
    });

    // Revenue Trend
    const revTrend = data.revenueTrend || {};
    const revLabels = Object.keys(revTrend).map(date => new Date(date).toLocaleDateString("en-US", { weekday: 'short' }));
    const revValues = Object.values(revTrend).map(Number);
    const maxRev = Math.max(...revValues, 100);
    const revTicks = [maxRev, maxRev * 0.75, maxRev * 0.5, maxRev * 0.25, 0].map(Math.round);

    // Trend (Patient Volume)
    const trendValues = chartItems.map(item => item.appointments);

    // Top Services
    const topServices = data.topServices || [];
    const topConditions = topServices.map((s: any) => ({ label: s.serviceName, count: s.count }));

    return { items: chartItems, revLabels, revValues, revTicks, trendLabels: revLabels, trendValues, topConditions };
  }, [dashboardData]);"""

content = re.sub(
    r'// Map live KPI metrics safely.*?\}, \[dashboardData\]\);',
    new_live_kpi,
    content,
    flags=re.DOTALL
)

# Update the jsx rendering parts
content = re.sub(
    r'<AppointmentsChart\s*title="Appointments Overview"\s*subtitle=\{chartSubtitle\}\s*items=\{.*?\}\s*/>',
    r'<AppointmentsChart\n title="Appointments Overview"\n subtitle={chartSubtitle}\n items={chartData.items}\n />',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'<RevenueCard\s*periodLabel=\{.*?\}\s*revenueLabel=\{liveKpi.revenueLabel\}\s*labels=\{.*?\}\s*values=\{.*?\}\s*yTicks=\{.*?\}\s*/>',
    r'<RevenueCard\n periodLabel={chartSubtitle}\n revenueLabel={liveKpi.revenueLabel}\n labels={chartData.revLabels}\n values={chartData.revValues}\n yTicks={chartData.revTicks}\n />',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'<ThisWeekCard\s*points=\{.*?\}\s*labels=\{.*?\}\s*title="Activity Trend"\s*subtitle="Patient volume trend"\s*/>',
    r'<ThisWeekCard\n points={chartData.trendValues}\n labels={chartData.trendLabels}\n title="Activity Trend"\n subtitle="Patient volume trend"\n />',
    content,
    flags=re.DOTALL
)

content = re.sub(
    r'<TopConditionsCard items=\{.*?\} />',
    r'<TopConditionsCard items={chartData.topConditions} />',
    content,
    flags=re.DOTALL
)

with open("src/dentist/pages/dashboard.tsx", "w") as f:
    f.write(content)

