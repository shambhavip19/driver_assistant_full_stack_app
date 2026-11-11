import { Route, Routes } from "react-router-dom";

import { Sidebar } from "./components/sidebar";
import { DemandMapPage } from "./pages/DemandMapPage";
import { ExpensesPage } from "./pages/ExpensesPage";
import { InsightsPage } from "./pages/InsightsPage";
import { OverviewPage } from "./pages/OverviewPage";
import { ProfilePage } from "./pages/ProfilePage";
import { RideEvaluatorPage } from "./pages/RideEvaluatorPage";
import { SettingsPage } from "./pages/SettingsPage";
import { TripsPage } from "./pages/TripsPage";
import { WaitMovePage } from "./pages/WaitMovePage";

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto flex max-w-[1800px] flex-col lg:flex-row">
        <Sidebar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/ride-evaluator" element={<RideEvaluatorPage />} />
            <Route path="/demand-map" element={<DemandMapPage />} />
            <Route path="/wait-vs-move" element={<WaitMovePage />} />
            <Route path="/trips" element={<TripsPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/insights" element={<InsightsPage />} />
            <Route path="/vehicle-profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
