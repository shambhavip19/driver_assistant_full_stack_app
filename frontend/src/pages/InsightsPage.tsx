import { useEffect, useState } from "react";

import { fetchInsights } from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function InsightsPage() {
  const [insights, setInsights] = useState<any>(null);

  useEffect(() => {
    fetchInsights().then(setInsights).catch(console.error);
  }, []);

  if (!insights) {
    return <div className="p-8 text-slate-500">Loading recommendations…</div>;
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Insights</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Decision support and trends</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What the data says</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {insights.summary.map((line: string) => (
              <div key={line} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{line}</div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {insights.recommendations.map((item: any) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm font-medium text-emerald-700">{item.impact}</p>
              <p className="mt-3 text-sm text-slate-600">{item.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
