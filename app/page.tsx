import { DashboardHeader } from "@/components/dashboard-header"
import { StatsCards } from "@/components/stats-cards"
import { CommissionTable } from "@/components/commission-table"

export default function CommissionDashboard() {
  return (
    <div className="space-y-8">
      <DashboardHeader />
      <StatsCards />
      <CommissionTable />
    </div>
  )
}
