import { useEffect, useState } from "react";
import { ArrowRightLeft, Gauge, MapPinned, TrendingUp } from "lucide-react";

import { fetchWaitMove } from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function WaitMovePage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetchWaitMove().then(setData).catch(console.error);
  }, []);

  if (!data) {
    return <div className="p-8 text-slate-500">Loading comparison…</div>;
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Wait vs move</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Dispatch decision assistant</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recommended action</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-2xl bg-sky-50 p-4">
            <p className="text-sm text-sky-700">Best estimated option</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{data.bestOption}</p>
            <p className="mt-2 text-sm text-slate-600">{data.reason}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {[
          { label: "Stay at current location", value: data.stay },
          { label: "Move to hotspot", value: data.move },
        ].map((option) => (
          <Card key={option.label}>
            <CardHeader>
              <CardTitle>{option.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="mb-2 flex items-center gap-2 text-slate-500"><Gauge className="h-4 w-4" /> Pickup probability</div>
                  <p className="text-xl font-semibold text-slate-900">{(option.value.pickupProbability * 100).toFixed(0)}%</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="mb-2 flex items-center gap-2 text-slate-500"><TrendingUp className="h-4 w-4" /> Earnings</div>
                  <p className="text-xl font-semibold text-slate-900">₹{option.value.potentialEarnings}</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="mb-2 flex items-center gap-2 text-slate-500"><MapPinned className="h-4 w-4" /> Distance</div>
                  <p className="text-xl font-semibold text-slate-900">{option.value.extraDistanceKm} km</p>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <div className="mb-2 flex items-center gap-2 text-slate-500"><ArrowRightLeft className="h-4 w-4" /> Net value</div>
                  <p className="text-xl font-semibold text-slate-900">₹{option.value.netValue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
