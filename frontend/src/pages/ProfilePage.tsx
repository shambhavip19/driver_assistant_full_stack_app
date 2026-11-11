import { useEffect, useState } from "react";

import { fetchVehicleProfile } from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetchVehicleProfile().then(setProfile).catch(console.error);
  }, []);

  if (!profile) {
    return <div className="p-8 text-slate-500">Loading profile…</div>;
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Vehicle & profile</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Driver identity and operating profile</h2>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Driver details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <div className="flex justify-between border-b border-slate-200 py-2"><span>Name</span><span className="font-medium text-slate-900">{profile.driverName}</span></div>
            <div className="flex justify-between border-b border-slate-200 py-2"><span>City</span><span className="font-medium text-slate-900">{profile.city}</span></div>
            <div className="flex justify-between border-b border-slate-200 py-2"><span>Home zone</span><span className="font-medium text-slate-900">{profile.preferredZone}</span></div>
            <div className="flex justify-between border-b border-slate-200 py-2"><span>Platform status</span><span className="font-medium text-slate-900">{profile.platformStatus}</span></div>
            <div className="flex justify-between border-b border-slate-200 py-2"><span>Rating</span><span className="font-medium text-slate-900">{profile.rating}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicle details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <div className="flex justify-between border-b border-slate-200 py-2"><span>Vehicle</span><span className="font-medium text-slate-900">{profile.vehicle}</span></div>
            <div className="flex justify-between border-b border-slate-200 py-2"><span>Type</span><span className="font-medium text-slate-900">{profile.vehicleType}</span></div>
            <div className="flex justify-between border-b border-slate-200 py-2"><span>Fuel efficiency</span><span className="font-medium text-slate-900">{profile.fuelEfficiencyKmpl} km/l</span></div>
            <div className="flex justify-between border-b border-slate-200 py-2"><span>Operating cost</span><span className="font-medium text-slate-900">₹{profile.operatingCostPerKm}/km</span></div>
            <div className="flex justify-between border-b border-slate-200 py-2"><span>Preferred window</span><span className="font-medium text-slate-900">{profile.preferredWorkWindow}</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
