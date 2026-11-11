import { useEffect, useState } from "react";
import { Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { fetchExpenses } from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function ExpensesPage() {
  const [expenses, setExpenses] = useState<any>(null);

  useEffect(() => {
    fetchExpenses().then(setExpenses).catch(console.error);
  }, []);

  if (!expenses) {
    return <div className="p-8 text-slate-500">Loading expenses…</div>;
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Expenses</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Operating cost analysis</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Monthly total</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">₹{expenses.totals.monthly.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Fuel</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">₹{expenses.totals.fuel.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Maintenance</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">₹{expenses.totals.maintenance.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <p className="text-sm text-slate-500">Tolls</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">₹{expenses.totals.tolls.toLocaleString("en-IN")}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1.2fr]">
        <Card>
          <CardHeader>
            <CardTitle>Cost mix</CardTitle>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenses.items} dataKey="amount" nameKey="title" outerRadius={92} innerRadius={52} fill="#0ea5e9" />
                <Tooltip formatter={(value: any) => [`₹${Number(value ?? 0)}`, "Amount"]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expense entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenses.items.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                  <div>
                    <p className="font-medium text-slate-800">{item.title}</p>
                    <p className="text-sm text-slate-500">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">₹{item.amount}</p>
                    <p className="text-sm text-slate-500">{item.percentage}%</p>
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
