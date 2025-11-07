"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Users,
  Store,
  TrendingUp,
  Shield,
  Settings,
  BarChart3,
  Activity,
  Layers,
  Building2,
  UserCheck,
  Briefcase,
  DollarSign,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  LabelList,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { BukkaButton } from "@/components/ui/button-variants";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers";
import { useAdminOverview } from "@/data/queries/use-analytics-query";
import { UserRole } from "@/data/interfaces/Auth";
import { TextHelper } from "@/helpers";

const ICON_KEYWORDS: Record<string, any> = {
  user: Users,
  business: Store,
  order: Activity,
  revenue: TrendingUp,
  growth: LineChart,
  admin: UserCheck,
  system: Shield,
  setting: Settings,
  category: Layers,
  company: Building2,
  employee: Briefcase,
  sales: DollarSign,
  income: DollarSign,
};

function getIconForStat(title: string) {
  const lowerTitle = title.toLowerCase();

  for (const [keyword, Icon] of Object.entries(ICON_KEYWORDS)) {
    if (lowerTitle.includes(keyword)) {
      return Icon;
    }
  }

  // Default fallback icon
  return BarChart3;
}

export function AdminOverview() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: adminOverview } = useAdminOverview({
    userId: user?.id as number,
    role: user?.role as UserRole,
  });
  const overviewData = adminOverview?.responseData;

  // const icon = [
  //   {
  //     title: "Total Users",
  //     value: "12,543",
  //     change: "+12.3%",
  //     icon: Users,
  //     positive: true,
  //   },
  //   {
  //     title: "Active Businesses",
  //     value: "234",
  //     change: "+5.2%",
  //     icon: Store,
  //     positive: true,
  //   },
  //   {
  //     title: "Total Orders",
  //     value: "3,456",
  //     change: "+18.7%",
  //     icon: Activity,
  //     positive: true,
  //   },
  //   {
  //     title: "Revenue",
  //     value: "₦2.4M",
  //     change: "+8.9%",
  //     icon: TrendingUp,
  //     positive: true,
  //   },
  // ];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            System overview and management
          </p>
        </div>
        <BukkaButton
          onClick={() => router.push(`/dashboard/${user?.role}/settings`)}
          variant="hero"
        >
          <Settings className="w-4 h-4 mr-2" />
          System Settings
        </BukkaButton>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewData?.stats.map((stat, index) => {
          const Icon = getIconForStat(stat.title);

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Card className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <Badge
                        variant={stat.positive ? "default" : "destructive"}
                        className="mt-1"
                      >
                        {stat.change}
                      </Badge>
                    </div>
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              User Growth
            </CardTitle>
            <CardDescription>Monthly user registration trends</CardDescription>
          </CardHeader>

          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overviewData?.userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, "auto"]} allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Business Status */}

        {/* <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="w-5 h-5" />
              Business Status
            </CardTitle>
            <CardDescription>Current business distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={overviewData?.businessCategoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {overviewData?.businessCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {overviewData?.businessCategoryData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-sm">
                    {entry.name}: {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card> */}
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Business Categories
          </CardTitle>
          <CardDescription>
            Current distribution by business categories
          </CardDescription>
        </CardHeader>

        <CardContent>
          {overviewData?.businessCategoryData?.length ? (
            <>
              {/* 🧮 Metric Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {/* Total Businesses */}
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/40 border">
                  <Building2 className="w-6 h-6 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Businesses
                    </p>
                    <p className="text-lg font-semibold">
                      {overviewData.businessCategoryData.reduce(
                        (acc, cat) => acc + cat.value,
                        0
                      )}
                    </p>
                  </div>
                </div>

                {/* Top Category */}
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/40 border">
                  <TrendingUp className="w-6 h-6 text-green-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Top Category
                    </p>
                    <p className="text-lg font-semibold capitalize">
                      {
                        [...overviewData.businessCategoryData].sort(
                          (a, b) => b.value - a.value
                        )[0]?.name
                      }
                    </p>
                  </div>
                </div>

                {/* Active Categories */}
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/40 border">
                  <Layers className="w-6 h-6 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Active Categories
                    </p>
                    <p className="text-lg font-semibold">
                      {
                        overviewData.businessCategoryData.filter(
                          (cat) => cat.value > 0
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* 📊 Bar Chart */}
              <ResponsiveContainer
                width="100%"
                height={300}
                className="capitalize"
              >
                <BarChart
                  data={overviewData.businessCategoryData}
                  margin={{ top: 10, right: 30, left: 10, bottom: 50 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="name"
                    angle={-30}
                    textAnchor="end"
                    interval={0}
                    height={60}
                    className="text-xs sm:text-base"
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value} business${value !== 1 ? "es" : ""}`,
                      "Count",
                    ]}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {overviewData.businessCategoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                    <LabelList dataKey="value" position="top" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </>
          ) : (
            <p className="text-center text-muted-foreground">
              No business category data available
            </p>
          )}
        </CardContent>
      </Card>
      {/* Orders Chart */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Daily Orders
          </CardTitle>
          <CardDescription>Order volume for the past week</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={overviewData?.orderData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="orders" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest system events and user actions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {overviewData?.recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
            >
              <div>
                <p className="font-medium">{activity.action}</p>
                <p className="text-sm text-muted-foreground">{activity.user}</p>
              </div>
              <span className="text-sm text-muted-foreground">
                {TextHelper.smartTimeAgo(activity?.time)}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}
