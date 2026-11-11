import { useEffect, useState } from "react";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowUpRight, Fuel, MapPinned, Route, TrendingUp, Wallet } from "lucide-react";

import { fetchOverview } from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function OverviewPage() {
  const [overview, setOverview] = useState<any>(null);

  useEffect(() => {
    fetchOverview().then(setOverview).catch(console.error);
  }, []);

  if (!overview) {
    return <div className="p-8 text-slate-500">Loading dashboard…</div>;
  }

  const metricCards = [
    { label: "Today's gross", value: `₹${overview.grossEarnings.toLocaleString("en-IN")}`, icon: Wallet, tone: "bg-sky-50 text-sky-700" },
    { label: "Today's net", value: `₹${overview.netEarnings.toLocaleString("en-IN")}`, icon: TrendingUp, tone: "bg-emerald-50 text-emerald-700" },
    { label: "Trips", value: `${overview.totalTrips}`, icon: Route, tone: "bg-violet-50 text-violet-700" },
    { label: "Distance", value: `${overview.totalDistance} km`, icon: MapPinned, tone: "bg-amber-50 text-amber-700" },
    { label: "Fuel", value: `₹${overview.fuelExpenditure.toLocaleString("en-IN")}`, icon: Fuel, tone: "bg-rose-50 text-rose-700" },
    { label: "Avg / Online hour", value: `₹${overview.avgEarningsPerOnlineHour.toLocaleString("en-IN")}`, icon: ArrowUpRight, tone: "bg-cyan-50 text-cyan-700" },
  ];

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Overview</p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">Chennai driver performance</h2>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
          {overview.date} • Demand score {overview.currentDemandScore}/100
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metricCards.map(({ label, value, icon: Icon, tone }) => (
          <Card key={label}>
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm text-slate-500">{label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>
                <Icon className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Weekly earnings</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={overview.weeklyEarnings}>
                <defs>
                  <linearGradient id="earningsFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" tickFormatter={(value) => `₹${value / 1000}k`} />
                <Tooltip formatter={(value: any) => [`₹${Number(value ?? 0).toLocaleString("en-IN")}`, "Earnings"]} />
                <Area type="monotone" dataKey="earnings" stroke="#0ea5e9" strokeWidth={3} fill="url(#earningsFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense breakdown</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overview.expenseBreakdown} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" stroke="#64748b" />
                <YAxis type="category" dataKey="name" width={80} stroke="#64748b" />
                <Tooltip formatter={(value: any) => [`${Number(value ?? 0)}%`, "Share"]} />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} fill="#14b8a6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {overview.recentTrips.map((trip: any) => (
                <div key={trip.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                  <div>
                    <p className="font-medium text-slate-800">{trip.pickup} → {trip.dropoff}</p>
                    <p className="text-sm text-slate-500">Demand score {trip.demandScore}/100</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">₹{trip.fare}</p>
                    <p className="text-sm text-emerald-600">₹{trip.net} net</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Best-performing working hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {overview.bestHours.map((entry: any) => (
                <div key={entry.hour}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="text-slate-600">{entry.hour}</span>
                    <span className="font-medium text-slate-900">{entry.value}/100</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400" style={{ width: `${entry.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
