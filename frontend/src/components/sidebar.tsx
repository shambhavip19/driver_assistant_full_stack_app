import { BarChart3, BriefcaseBusiness, CarFront, CircleDollarSign, Map, MoonStar, Settings, ShieldCheck, Truck, WalletCards } from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Overview", to: "/", icon: BarChart3 },
  { label: "Ride Evaluator", to: "/ride-evaluator", icon: CircleDollarSign },
  { label: "Demand Map", to: "/demand-map", icon: Map },
  { label: "Wait vs Move", to: "/wait-vs-move", icon: MoonStar },
  { label: "Trips", to: "/trips", icon: Truck },
  { label: "Expenses", to: "/expenses", icon: WalletCards },
  { label: "Insights", to: "/insights", icon: ShieldCheck },
  { label: "Vehicle & Profile", to: "/vehicle-profile", icon: CarFront },
  { label: "Settings", to: "/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-full bg-slate-950 text-slate-200 lg:w-72">
      <div className="flex items-center justify-between border-b border-slate-800 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sky-400">
            <BriefcaseBusiness className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">DriverIQ</p>
            <h1 className="text-lg font-semibold text-white">Command Center</h1>
          </div>
        </div>
      </div>

      <nav className="space-y-1 p-4">
        {navItems.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? "bg-sky-500/15 text-sky-300" : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
