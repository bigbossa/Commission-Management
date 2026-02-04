import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, DollarSign, TrendingUp, Package } from "lucide-react"

const stats = [
  {
    title: "Total Orders",
    value: "1,284",
    change: "+12.5%",
    trend: "up",
    icon: ShoppingCart,
  },
  {
    title: "Total Revenue",
    value: "$142,580",
    change: "+8.2%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Average Order Value",
    value: "$111.05",
    change: "+3.1%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    title: "Products Sold",
    value: "3,847",
    change: "+15.8%",
    trend: "up",
    icon: Package,
  },
]

export function SalesStats() {
  return (
    <div className="grid gap-4 mb-6 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="bg-card border-border">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-primary mt-1">
                    {stat.change} vs last month
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
