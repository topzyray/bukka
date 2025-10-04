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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { BukkaButton } from "@/components/ui/button-variants";

// Mock data for charts
const userGrowthData = [
  { month: "Jan", users: 1200 },
  { month: "Feb", users: 1900 },
  { month: "Mar", users: 2800 },
  { month: "Apr", users: 3900 },
  { month: "May", users: 4600 },
  { month: "Jun", users: 5400 },
];

const restaurantStatusData = [
  { name: "Active", value: 234, color: "hsl(var(--primary))" },
  { name: "Pending", value: 45, color: "hsl(var(--accent))" },
  { name: "Suspended", value: 12, color: "hsl(var(--destructive))" },
];

const orderData = [
  { day: "Mon", orders: 245 },
  { day: "Tue", orders: 312 },
  { day: "Wed", orders: 389 },
  { day: "Thu", orders: 445 },
  { day: "Fri", orders: 567 },
  { day: "Sat", orders: 689 },
  { day: "Sun", orders: 445 },
];

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "12,543",
      change: "+12.3%",
      icon: Users,
      positive: true,
    },
    {
      title: "Active Restaurants",
      value: "234",
      change: "+5.2%",
      icon: Store,
      positive: true,
    },
    {
      title: "Total Orders",
      value: "3,456",
      change: "+18.7%",
      icon: Activity,
      positive: true,
    },
    {
      title: "Revenue",
      value: "₦2.4M",
      change: "+8.9%",
      icon: TrendingUp,
      positive: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* <Header /> */}

      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Shield className="w-8 h-8 text-primary" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                System overview and management
              </p>
            </div>
            <BukkaButton variant="hero">
              <Settings className="w-4 h-4 mr-2" />
              System Settings
            </BukkaButton>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
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
                      <stat.icon className="w-8 h-8 text-primary" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
                <CardDescription>
                  Monthly user registration trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={userGrowthData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Restaurant Status */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  Restaurant Status
                </CardTitle>
                <CardDescription>
                  Current restaurant distribution
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={restaurantStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {restaurantStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {restaurantStatusData.map((entry) => (
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
            </Card>
          </div>

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
                <BarChart data={orderData}>
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
              {[
                {
                  action: "New restaurant registered",
                  user: "Mama Cass Restaurant",
                  time: "2 minutes ago",
                },
                {
                  action: "User account suspended",
                  user: "john.doe@email.com",
                  time: "15 minutes ago",
                },
                {
                  action: "Restaurant approved",
                  user: "Spice Garden",
                  time: "1 hour ago",
                },
                {
                  action: "System maintenance completed",
                  user: "System",
                  time: "2 hours ago",
                },
              ].map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                >
                  <div>
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.user}
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* <Footer /> */}
    </div>
  );
};

export default AdminDashboard;
