import { useState } from "react";
import { Gauge, MapPin, Route, TimerReset } from "lucide-react";

import { evaluateRide } from "../api";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const defaultForm = {
  offeredFare: 520,
  pickupLocation: "T Nagar",
  dropoffLocation: "Adyar",
  tripDistanceKm: 13.4,
  tripDurationMinutes: 42,
  tollCost: 60,
};

export function RideEvaluatorPage() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string | number) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await evaluateRide(form);
      setResult(response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Ride evaluator</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Assess incoming ride opportunities</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Trip inputs</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2 text-sm text-slate-600">
                  <span>Offered fare (INR)</span>
                  <input
                    type="number"
                    value={form.offeredFare}
                    onChange={(event) => handleChange("offeredFare", Number(event.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none ring-0 transition focus:border-sky-500"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-600">
                  <span>Estimated duration (mins)</span>
                  <input
                    type="number"
                    value={form.tripDurationMinutes}
                    onChange={(event) => handleChange("tripDurationMinutes", Number(event.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-sky-500"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-600 md:col-span-2">
                  <span>Pickup location</span>
                  <input
                    value={form.pickupLocation}
                    onChange={(event) => handleChange("pickupLocation", event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-sky-500"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-600 md:col-span-2">
                  <span>Drop-off location</span>
                  <input
                    value={form.dropoffLocation}
                    onChange={(event) => handleChange("dropoffLocation", event.target.value)}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-sky-500"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-600">
                  <span>Trip distance (km)</span>
                  <input
                    type="number"
                    step="0.1"
                    value={form.tripDistanceKm}
                    onChange={(event) => handleChange("tripDistanceKm", Number(event.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-sky-500"
                  />
                </label>
                <label className="space-y-2 text-sm text-slate-600">
                  <span>Toll cost (INR)</span>
                  <input
                    type="number"
                    value={form.tollCost}
                    onChange={(event) => handleChange("tollCost", Number(event.target.value))}
                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-sky-500"
                  />
                </label>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? "Evaluating…" : "Evaluate ride"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {result ? (
              <>
                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-sm text-emerald-700">{result.recommendation}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-900">{result.confidence}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 p-3">
                    <div className="mb-2 flex items-center gap-2 text-slate-500"><Route className="h-4 w-4" /> Profit</div>
                    <p className="text-xl font-semibold text-slate-900">₹{result.estimatedTripProfit}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <div className="mb-2 flex items-center gap-2 text-slate-500"><MapPin className="h-4 w-4" /> Demand</div>
                    <p className="text-xl font-semibold text-slate-900">{result.destinationDemandScore}/100</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <div className="mb-2 flex items-center gap-2 text-slate-500"><TimerReset className="h-4 w-4" /> Next pickup</div>
                    <p className="text-xl font-semibold text-slate-900">{result.probabilityWithin20Minutes * 100}%</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3">
                    <div className="mb-2 flex items-center gap-2 text-slate-500"><Gauge className="h-4 w-4" /> Fuel</div>
                    <p className="text-xl font-semibold text-slate-900">₹{result.estimatedFuelExpenditure}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {result.reasons.map((reason: string) => (
                    <div key={reason} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">{reason}</div>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500">
                Fill the form and evaluate whether this trip is worth accepting.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
