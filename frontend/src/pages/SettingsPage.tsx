import { useEffect, useState } from "react";

import { fetchSettings } from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

export function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    fetchSettings().then(setSettings).catch(console.error);
  }, []);

  if (!settings) {
    return <div className="p-8 text-slate-500">Loading settings…</div>;
  }

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Settings</p>
        <h2 className="mt-2 text-3xl font-semibold text-slate-900">Workspace preferences</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Operations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <div className="flex justify-between"><span>Alert threshold</span><span className="font-medium text-slate-900">{settings.alertThreshold}</span></div>
            <div className="flex justify-between"><span>Fuel price alerts</span><span className="font-medium text-slate-900">{settings.fuelPriceAlert ? "Enabled" : "Disabled"}</span></div>
            <div className="flex justify-between"><span>Demand zone alerts</span><span className="font-medium text-slate-900">{settings.demandZoneAlerts ? "Enabled" : "Disabled"}</span></div>
            <div className="flex justify-between"><span>Auto recommendations</span><span className="font-medium text-slate-900">{settings.autoRecommendations ? "Enabled" : "Disabled"}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interface</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-700">
            <div className="flex justify-between"><span>Theme</span><span className="font-medium text-slate-900">{settings.theme}</span></div>
            <div className="flex justify-between"><span>Language</span><span className="font-medium text-slate-900">{settings.language}</span></div>
            <div className="flex justify-between"><span>Date filter</span><span className="font-medium text-slate-900">{settings.dateFilter}</span></div>
            <div className="flex justify-between"><span>Notification cadence</span><span className="font-medium text-slate-900">Live</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
