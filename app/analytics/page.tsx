// Analytics page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, BarChart3, PieChart, LineChart, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { mockSubscriptions } from "@/lib/mock-data";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  Line,
  Legend,
} from "recharts";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview");

  // Prepare data for charts
  const categoryData = mockSubscriptions.reduce((acc, sub) => {
    const category = sub.category || "Other";
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category]++;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryData).map(([name, value]) => ({
    name,
    value,
  }));

  const frequencyData = mockSubscriptions
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10)
    .map((sub) => ({
      name: sub.name,
      frequency: sub.frequency,
    }));

  const lastOpenedData = mockSubscriptions
    .sort((a, b) => b.lastOpened - a.lastOpened)
    .slice(0, 10)
    .map((sub) => ({
      name: sub.name,
      days: sub.lastOpened,
    }));

  // Prepare data for line chart (simulated email volume over time)
  const emailVolumeData = [
    { month: "Jan", volume: 120 },
    { month: "Feb", volume: 150 },
    { month: "Mar", volume: 180 },
    { month: "Apr", volume: 170 },
    { month: "May", volume: 200 },
    { month: "Jun", volume: 220 },
    { month: "Jul", volume: 180 },
    { month: "Aug", volume: 250 },
    { month: "Sep", volume: 230 },
    { month: "Oct", volume: 210 },
    { month: "Nov", volume: 190 },
    { month: "Dec", volume: 240 },
  ];

  // Colors for pie chart
  const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Mail className="h-6 w-6" />
            <span className="text-xl font-bold">UnsubscribeMe</span>
          </Link>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="container mx-auto">
          <div className="mb-6 flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">Email Analytics</h1>
              <p className="text-muted-foreground">
                Visualize your email subscription patterns
              </p>
            </div>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="frequency">Email Frequency</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Subscriptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{mockSubscriptions.length}</div>
                    <p className="text-xs text-muted-foreground">
                      Across {Object.keys(categoryData).length} categories
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Monthly Email Volume
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {mockSubscriptions.reduce((sum, sub) => sum + sub.frequency, 0)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Emails per month
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      Inactive Subscriptions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {mockSubscriptions.filter(sub => sub.lastOpened > 30).length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Not opened in 30+ days
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Subscriptions by Category</CardTitle>
                    <CardDescription>
                      Distribution of your email subscriptions by category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => 
                              `${name}: ${(percent * 100).toFixed(0)}%`
                            }
                          >
                            {pieData.map((entry, index) => (
                              <Cell 
                                key={`cell-${index}`} 
                                fill={COLORS[index % COLORS.length]} 
                              />
                            ))}
                          </Pie>
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Email Volume Trend</CardTitle>
                    <CardDescription>
                      Monthly email volume over the past year
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                          data={emailVolumeData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="volume"
                            name="Email Volume"
                            stroke="hsl(var(--chart-1))"
                            activeDot={{ r: 8 }}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="frequency" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Email Senders</CardTitle>
                  <CardDescription>
                    Subscriptions sending the most emails per month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={frequencyData}
                        layout="vertical"
                        margin={{
                          top: 5,
                          right: 30,
                          left: 100,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          tick={{ fontSize: 12 }} 
                        />
                        <Tooltip />
                        <Bar 
                          dataKey="frequency" 
                          name="Emails per Month" 
                          fill="hsl(var(--chart-2))" 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Least Engaged Subscriptions</CardTitle>
                  <CardDescription>
                    Subscriptions you haven't opened in the longest time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={lastOpenedData}
                        layout="vertical"
                        margin={{
                          top: 5,
                          right: 30,
                          left: 100,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          tick={{ fontSize: 12 }} 
                        />
                        <Tooltip />
                        <Bar 
                          dataKey="days" 
                          name="Days Since Last Opened" 
                          fill="hsl(var(--chart-3))" 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} UnsubscribeMe. All rights reserved.
        </div>
      </footer>
    </div>
  );
}