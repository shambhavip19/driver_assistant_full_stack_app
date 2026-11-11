import { useEffect, useState } from "react";

import { fetchTrips } from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
    fetchTrips().then(setTrips).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Trips</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Trip history</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent rides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="pb-3 pr-4">Route</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Distance</th>
                  <th className="pb-3 pr-4">Fare</th>
                  <th className="pb-3 pr-4">Net</th>
                  <th className="pb-3 pr-4">Demand</th>
                  <th className="pb-3 pr-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip) => (
                  <tr key={trip.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 pr-4 font-medium text-slate-800">{trip.pickup} → {trip.dropoff}</td>
                    <td className="py-3 pr-4 text-slate-600">{trip.date}</td>
                    <td className="py-3 pr-4 text-slate-600">{trip.distanceKm} km</td>
                    <td className="py-3 pr-4 text-slate-600">₹{trip.fareInr}</td>
                    <td className="py-3 pr-4 text-emerald-600">₹{trip.netEarnings}</td>
                    <td className="py-3 pr-4 text-slate-600">{trip.demandScore}</td>
                    <td className="py-3 pr-4 text-slate-600">{trip.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
