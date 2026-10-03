"use client";

import React, { useState } from "react";
import {
  Wrench,
  Building2,
  CheckCircle,
  AlertTriangle,
  AlertOctagon,
  Clock,
  ChevronRight,
  Sparkles,
  Layers,
  Activity,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { ChartTooltipContent } from "./ui/chart";

interface AssetsOperationsViewProps {
  data: any;
}

export default function AssetsOperationsView({ data }: AssetsOperationsViewProps) {
  const [activeTab, setActiveTab] = useState("Overview");

  const summary = data?.summary || {
    total_assets: 124,
    active: 118,
    under_maintenance: 4,
    critical: 2,
  };

  const donutData = [
    { name: "Active & Optimal", value: summary.active, color: "#10b981" },
    { name: "Under Maintenance", value: summary.under_maintenance, color: "#f59e0b" },
    { name: "Critical Risk", value: summary.critical, color: "#ef4444" },
  ];

  const rulData = [
    { name: "Chiller B2", days: 14, status: "Critical", fill: "#ef4444" },
    { name: "Pump H1", days: 42, status: "Warning", fill: "#f59e0b" },
    { name: "DG Admin", days: 180, status: "Good", fill: "#10b981" },
    { name: "Elevator 2", days: 320, status: "Optimal", fill: "#0ea5e9" },
    { name: "Transformer 1", days: 450, status: "Optimal", fill: "#0ea5e9" },
  ];

  const alerts = data?.maintenance_alerts || [
    {
      asset_name: "AC Chiller Unit - Block B",
      severity: "Critical",
      issue: "Performance drop detected (thermal COP efficiency degraded 24%)",
      timestamp: "Today, 05:45 AM",
    },
    {
      asset_name: "Submersible Pump - Hostel A",
      severity: "Warning",
      issue: "Vibration levels higher than normal (4.6 mm/s vs 2.1 baseline)",
      timestamp: "Today, 08:20 AM",
    },
    {
      asset_name: "Diesel Generator - Admin Block",
      severity: "Info",
      issue: "Scheduled preventive maintenance due in 5 days",
      timestamp: "Today, 07:10 AM",
    },
    {
      asset_name: "Traction Elevator #2 - Central Library",
      severity: "Info",
      issue: "Operating normally (99.8% duty cycle uptime)",
      timestamp: "Today, 06:30 AM",
    },
  ];

  return (
    <div className="space-y-7">
      {/* Sub Tabs Bar */}
      <div className="flex items-center gap-3 border-b border-slate-200/90 pb-2">
        {["Overview", "Equipment", "Maintenance", "Work Orders"].map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-full text-xs font-black tracking-wide transition cursor-pointer ${
                isActive
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/30 scale-102"
                  : "bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-xs"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 4 Large Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="dashboard-card p-7 bg-white border border-slate-200/80 flex items-center gap-5 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-sky-50 text-sky-500 flex items-center justify-center shadow-xs shrink-0 border border-sky-200/60">
            <Building2 className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Total Assets</p>
            <h3 className="text-3xl lg:text-4xl font-black text-slate-900 mt-1">{summary.total_assets}</h3>
          </div>
        </div>

        <div className="dashboard-card p-7 bg-white border border-slate-200/80 flex items-center gap-5 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs shrink-0 border border-emerald-200/60">
            <CheckCircle className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Active & Healthy</p>
            <h3 className="text-3xl lg:text-4xl font-black text-slate-900 mt-1">{summary.active}</h3>
          </div>
        </div>

        <div className="dashboard-card p-7 bg-white border border-slate-200/80 flex items-center gap-5 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-xs shrink-0 border border-amber-200/60">
            <Clock className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Maintenance</p>
            <h3 className="text-3xl lg:text-4xl font-black text-slate-900 mt-1">{summary.under_maintenance}</h3>
          </div>
        </div>

        <div className="dashboard-card p-7 bg-white border border-slate-200/80 flex items-center gap-5 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-xs shrink-0 border border-rose-200/60">
            <AlertOctagon className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Critical Risk</p>
            <h3 className="text-3xl lg:text-4xl font-black text-slate-900 mt-1">{summary.critical}</h3>
          </div>
        </div>
      </div>

      {/* Donut Chart & Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Equipment Status Donut with Shadcn Recharts Pie */}
        <div className="lg:col-span-5 dashboard-card p-8 bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Health Distribution</h3>
              <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Random Forest ML
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 mt-1">Multi-sensor degradation classification</p>
          </div>

          <div className="w-full h-64 relative flex items-center justify-center my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip content={<ChartTooltipContent />} />
                <Pie
                  data={donutData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {donutData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={3} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute text-center pointer-events-none">
              <span className="text-3xl font-black text-slate-900 block leading-none">
                {Math.round((summary.active / summary.total_assets) * 100)}%
              </span>
              <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Optimal</span>
            </div>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-black pt-4 border-t border-slate-100">
            <div>
              <span className="block text-emerald-600 text-lg">{summary.active}</span>
              <span className="text-slate-400">Optimal</span>
            </div>
            <div>
              <span className="block text-amber-500 text-lg">{summary.under_maintenance}</span>
              <span className="text-slate-400">Scheduled</span>
            </div>
            <div>
              <span className="block text-rose-500 text-lg">{summary.critical}</span>
              <span className="text-slate-400">Critical</span>
            </div>
          </div>
        </div>

        {/* Remaining Useful Life (RUL) Bar Chart */}
        <div className="lg:col-span-7 dashboard-card p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Remaining Useful Life (RUL Estimation)
              </h3>
              <span className="text-xs font-black text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950/50 px-3 py-1 rounded-full border border-orange-200 dark:border-orange-800/60">
                Predictive Maintenance
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">Estimated days before required overhaul</p>
          </div>

          <div className="w-full h-64 my-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={rulData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} unit="d" />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="days" name="Remaining Days" radius={[8, 8, 0, 0]}>
                  {rulData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-400 dark:text-slate-500">
            <span>Critical Warning Threshold: &lt; 30 Days</span>
            <span className="font-black text-rose-600 dark:text-rose-400">1 Asset Requires Immediate Dispatch</span>
          </div>
        </div>
      </div>

      {/* Priority Maintenance Alerts */}
      <div className="dashboard-card p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Active Maintenance Queue</h3>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">Automated AI dispatch work orders</p>
          </div>
          <button className="flex items-center gap-1.5 text-xs font-black text-orange-600 dark:text-orange-400 hover:text-orange-700 bg-orange-50 dark:bg-orange-950/50 px-4 py-2 rounded-full border border-orange-200/70 dark:border-orange-800/60 cursor-pointer transition">
            <span>Open Work Order System</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {alerts.map((alert: any, idx: number) => {
            const isCrit = alert.severity === "Critical";
            const isWarn = alert.severity === "Warning";
            return (
              <div
                key={idx}
                className="flex items-start justify-between gap-4 p-5 rounded-2xl border border-slate-200/80 hover:bg-slate-50 transition"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                      isCrit
                        ? "bg-rose-50 text-rose-500 border border-rose-200"
                        : isWarn
                        ? "bg-amber-50 text-amber-500 border border-amber-200"
                        : "bg-sky-50 text-sky-500 border border-sky-200"
                    }`}
                  >
                    <Wrench className="w-6 h-6 stroke-[2.5]" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">{alert.asset_name}</p>
                    <p className="text-xs font-semibold text-slate-600 mt-1">{alert.issue}</p>
                    <p className="text-[11px] font-bold text-slate-400 mt-2">{alert.timestamp}</p>
                  </div>
                </div>
                <span
                  className={`text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shrink-0 ${
                    isCrit
                      ? "bg-rose-50 text-rose-600 border border-rose-200"
                      : isWarn
                      ? "bg-amber-50 text-amber-600 border border-amber-200"
                      : "bg-sky-50 text-sky-600 border border-sky-200"
                  }`}
                >
                  {alert.severity}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
