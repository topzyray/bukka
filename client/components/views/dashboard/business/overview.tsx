"use client";

import React from "react";
import { motion } from "framer-motion";
import { Store, Users, Star, TrendingUp, Eye, DollarSign } from "lucide-react";
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
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { BukkaButton } from "@/components/ui/button-variants";

// Mock data for restaurant metrics
const weeklyVisitors = [
  { day: "Mon", visitors: 45 },
  { day: "Tue", visitors: 52 },
  { day: "Wed", visitors: 38 },
  { day: "Thu", visitors: 61 },
  { day: "Fri", visitors: 78 },
  { day: "Sat", visitors: 92 },
  { day: "Sun", visitors: 67 },
];

const monthlyRevenue = [
  { month: "Jan", revenue: 15000 },
  { month: "Feb", revenue: 18000 },
  { month: "Mar", revenue: 22000 },
  { month: "Apr", revenue: 25000 },
  { month: "May", revenue: 28000 },
  { month: "Jun", revenue: 32000 },
];

export function BusinessOverview() {
  const stats = [
    {
      title: "Monthly Visitors",
      value: "1,234",
      change: "+12%",
      icon: Users,
      positive: true,
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "+0.2",
      icon: Star,
      positive: true,
    },
    {
      title: "Profile Views",
      value: "3,456",
      change: "+18%",
      icon: Eye,
      positive: true,
    },
    {
      title: "Revenue",
      value: "₦32K",
      change: "+14%",
      icon: DollarSign,
      positive: true,
    },
  ];

  const recentReviews = [
    {
      user: "John D.",
      rating: 5,
      comment: "Amazing food and great service!",
      time: "2 hours ago",
    },
    {
      user: "Sarah M.",
      rating: 4,
      comment: "Good atmosphere, will come back.",
      time: "1 day ago",
    },
    {
      user: "Mike R.",
      rating: 5,
      comment: "Best jollof rice in Lagos!",
      time: "2 days ago",
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
                <Store className="w-8 h-8 text-primary" />
                Mama Cass Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your restaurant presence on Bukka
              </p>
            </div>
            <div className="flex gap-2">
              <BukkaButton variant="outline">Edit Profile</BukkaButton>
              <BukkaButton variant="hero">View Public Page</BukkaButton>
            </div>
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
            {/* Weekly Visitors */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Weekly Visitors
                </CardTitle>
                <CardDescription>
                  Visitors to your restaurant this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyVisitors}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visitors" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Monthly Revenue */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Revenue Trend
                </CardTitle>
                <CardDescription>Monthly revenue growth</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyRevenue}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="opacity-30"
                    />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reviews */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Recent Reviews
              </CardTitle>
              <CardDescription>
                What customers are saying about you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReviews.map((review, index) => (
                <div key={index} className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.user}</span>
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {review.time}
                    </span>
                  </div>
                  <p className="text-sm">{review.comment}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Manage your restaurant efficiently
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <BukkaButton
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                >
                  <Store className="w-6 h-6" />
                  <span>Update Menu</span>
                </BukkaButton>
                <BukkaButton
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                >
                  <Users className="w-6 h-6" />
                  <span>View Analytics</span>
                </BukkaButton>
                <BukkaButton
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                >
                  <Star className="w-6 h-6" />
                  <span>Respond to Reviews</span>
                </BukkaButton>
                <BukkaButton
                  variant="outline"
                  className="h-auto py-4 flex-col gap-2"
                >
                  <TrendingUp className="w-6 h-6" />
                  <span>Boost Visibility</span>
                </BukkaButton>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      {/* <Footer /> */}
    </div>
  );
}
