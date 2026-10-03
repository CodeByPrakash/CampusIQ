"use client";

import React, { useState } from "react";
import {
  Zap,
  Gauge,
  IndianRupee,
  Leaf,
  Lightbulb,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  Building2,
  Clock,
  Layers,
} from "lucide-react";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ReferenceLine,
} from "recharts";
import { ChartTooltipContent } from "./ui/chart";

interface EnergyAnalyticsViewProps {
  data: any;
}

export default function EnergyAnalyticsView({ data }: EnergyAnalyticsViewProps) {
  const [activeTab, setActiveTab] = useState<"hourly" | "daily" | "weekly">("daily");

  const kpis = data?.kpis || {
    total_consumption_kwh: 24850,
    total_consumption_delta_pct: 12,
    peak_demand_kw: 320,
    peak_demand_delta_pct: 5,
    estimated_cost_inr: 248500,
    estimated_cost_delta_pct: 10,
    carbon_emissions_tco2: 18.2,
    carbon_emissions_delta_pct: 12,
  };

  const buildingLoads = data?.consumption_by_building || [
    { building: "Academic Block", kwh: 8240, color: "#f97316" },
    { building: "Hostel A", kwh: 5420, color: "#fb923c" },
    { building: "Hostel B", kwh: 4120, color: "#fdba74" },
    { building: "Admin Block", kwh: 3210, color: "#0ea5e9" },
    { building: "Canteen", kwh: 2860, color: "#10b981" },
    { building: "Sports Complex", kwh: 1140, color: "#8b5cf6" },
  ];

  // Combined actual + forecast time series
  const forecastTimeline = [
    { time: "Mon 00:00", actual: 1120, forecast: 1100, isAnomaly: false },
    { time: "Mon 06:00", actual: 1840, forecast: 1790, isAnomaly: false },
    { time: "Mon 12:00", actual: 2950, forecast: 2800, isAnomaly: false },
    { time: "Mon 18:00", actual: 2410, forecast: 2380, isAnomaly: false },
    { time: "Tue 00:00", actual: 1080, forecast: 1120, isAnomaly: false },
    { time: "Tue 06:00", actual: 1920, forecast: 1810, isAnomaly: false },
    { time: "Tue 12:00", actual: 3890, forecast: 2920, isAnomaly: true }, // Peak anomaly
    { time: "Tue 18:00", actual: 2550, forecast: 2400, isAnomaly: false },
    { time: "Wed 00:00", actual: 1140, forecast: 1110, isAnomaly: false },
    { time: "Wed 06:00", actual: 1880, forecast: 1830, isAnomaly: false },
    { time: "Wed 12:00", actual: null, forecast: 3010, isAnomaly: false },
    { time: "Wed 18:00", actual: null, forecast: 2450, isAnomaly: false },
    { time: "Thu 00:00", actual: null, forecast: 1150, isAnomaly: false },
    { time: "Thu 06:00", actual: null, forecast: 1890, isAnomaly: false },
  ];

  const recommendations = data?.recommendations || [
    {
      title: "HVAC Night-Setback Optimization",
      impact: "Save ₹38,000 / month",
      description: "Academic block chillers run 2.4 hrs past occupancy. Automating BMS setpoint scheduling reduces baseline night load by 24%.",
      priority: "High Priority",
    },
    {
      title: "Peak Demand Tariff Shifting",
      impact: "Reduce 42 kW Peak Surcharge",
      description: "Stagger hostel water heating cycles between 05:00 - 07:00 to avoid coinciding with kitchen cold-storage compressor spikes.",
      priority: "Medium Priority",
    },
    {
      title: "Solar PV Rooftop Generation Match",
      impact: "Clean Offset 8.4 tCO2 / mo",
      description: "Shift library EV charging and lab autoclave sterilization to 11:30 - 14:30 solar peak generation window.",
      priority: "Sustainability",
    },
  ];

  return (
    <div className="space-y-7">
      {/* 4 Large KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="dashboard-card p-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Total Consumption</p>
            <div className="w-11 h-11 rounded-2xl bg-orange-50 dark:bg-orange-950/50 text-orange-500 flex items-center justify-center border border-orange-200/50 dark:border-orange-800/50">
              <Zap className="w-6 h-6 fill-orange-500" />
            </div>
          </div>
          <h3 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
            {kpis.total_consumption_kwh.toLocaleString()}{" "}
            <span className="text-sm font-bold text-slate-400 dark:text-slate-500">kWh</span>
          </h3>
          <div className="flex items-center gap-1.5 text-xs font-black text-rose-500 mt-2 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-0.5 rounded-full inline-flex border border-rose-200/60 dark:border-rose-900/60">
            <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            <span>+{kpis.total_consumption_delta_pct}% vs last wk</span>
          </div>
        </div>

        <div className="dashboard-card p-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Peak Demand</p>
            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 flex items-center justify-center border border-amber-200/50 dark:border-amber-800/50">
              <Gauge className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
            {kpis.peak_demand_kw}{" "}
            <span className="text-sm font-bold text-slate-400 dark:text-slate-500">kW</span>
          </h3>
          <div className="flex items-center gap-1.5 text-xs font-black text-rose-500 mt-2 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-0.5 rounded-full inline-flex border border-rose-200/60 dark:border-rose-900/60">
            <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            <span>+{kpis.peak_demand_delta_pct}% vs last wk</span>
          </div>
        </div>

        <div className="dashboard-card p-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Estimated Cost</p>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/50 dark:border-emerald-800/50">
              <IndianRupee className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
            ₹{kpis.estimated_cost_inr.toLocaleString()}
          </h3>
          <div className="flex items-center gap-1.5 text-xs font-black text-rose-500 mt-2 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-0.5 rounded-full inline-flex border border-rose-200/60 dark:border-rose-900/60">
            <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            <span>+{kpis.estimated_cost_delta_pct}% vs last wk</span>
          </div>
        </div>

        <div className="dashboard-card p-7 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Carbon Emissions</p>
            <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200/50 dark:border-teal-800/50">
              <Leaf className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
            {kpis.carbon_emissions_tco2}{" "}
            <span className="text-sm font-bold text-slate-400 dark:text-slate-500">tCO₂</span>
          </h3>
          <div className="flex items-center gap-1.5 text-xs font-black text-rose-500 mt-2 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-0.5 rounded-full inline-flex border border-rose-200/60 dark:border-rose-900/60">
            <ArrowUpRight className="w-4 h-4 stroke-[3]" />
            <span>+{kpis.carbon_emissions_delta_pct}% vs last wk</span>
          </div>
        </div>
      </div>

      {/* Actual vs Forecast Energy Consumption Chart with Shadcn Recharts */}
      <div className="dashboard-card p-8 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Energy Telemetry (Actual vs Prophet+XGBoost Forecast)
              </h3>
              <span className="px-3 py-1 bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300 text-xs font-black rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 fill-orange-500" /> ML Hybrid Model
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-1">
              Prophet seasonal time-series decomposition blended with XGBoost residual regressor
            </p>
          </div>

          <div className="flex items-center gap-5 text-xs font-extrabold">
            <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
              <span className="w-3.5 h-3.5 rounded-full bg-orange-500 shadow-xs" /> Actual Load (kWh)
            </span>
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <span className="w-5 h-1 border-t-2 border-dashed border-indigo-500" /> ML Forecast (kWh)
            </span>
            <span className="flex items-center gap-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2.5 py-1 rounded-full border border-rose-200 dark:border-rose-900/60">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" /> Anomaly Spike
            </span>
          </div>
        </div>

        {/* High Performance Recharts Area + Line */}
        <div className="w-full h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={forecastTimeline} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="energyActualGradShadcn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f97316" stopOpacity={0.32} />
                  <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="time"
                stroke="#94a3b8"
                fontSize={11}
                fontWeight={700}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={11}
                fontWeight={700}
                tickLine={false}
                axisLine={false}
                dx={-5}
              />
              <Tooltip content={<ChartTooltipContent />} />

              <ReferenceLine
                x="Wed 06:00"
                stroke="#94a3b8"
                strokeDasharray="4 4"
                label={{
                  value: "Forecast Horizon →",
                  position: "top",
                  fill: "#64748b",
                  fontSize: 11,
                  fontWeight: 800,
                }}
              />

              {/* Actual Load Area */}
              <Area
                type="monotone"
                dataKey="actual"
                name="Actual Load (kWh)"
                stroke="#f97316"
                strokeWidth={3.5}
                fillOpacity={1}
                fill="url(#energyActualGradShadcn)"
                dot={{ r: 4.5, fill: "#ffffff", stroke: "#f97316", strokeWidth: 3 }}
                activeDot={{ r: 8, fill: "#f97316", stroke: "#ffffff", strokeWidth: 3 }}
              />

              {/* ML Forecast Line */}
              <Line
                type="monotone"
                dataKey="forecast"
                name="AI Forecast (kWh)"
                stroke="#6366f1"
                strokeWidth={3}
                strokeDasharray="5 5"
                dot={{ r: 3.5, fill: "#ffffff", stroke: "#6366f1", strokeWidth: 2 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2-Column: Building Consumption Breakdown + Actionable Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Building Breakdown with Shadcn Recharts BarChart */}
        <div className="lg:col-span-6 dashboard-card p-8 bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Building Load Breakdown</h3>
              <p className="text-xs font-bold text-slate-400 mt-1">Spatial energy allocation across zones</p>
            </div>
            <span className="text-xs font-black text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
              Real-time Submetered
            </span>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={buildingLoads}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" stroke="#94a3b8" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} />
                <YAxis
                  dataKey="building"
                  type="category"
                  stroke="#475569"
                  fontSize={11}
                  fontWeight={800}
                  axisLine={false}
                  tickLine={false}
                  width={110}
                />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="kwh" name="Energy (kWh)" radius={[0, 10, 10, 0]}>
                  {buildingLoads.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        index === 0
                          ? "#f97316"
                          : index === 1
                          ? "#fb923c"
                          : index === 2
                          ? "#fdba74"
                          : index === 3
                          ? "#0ea5e9"
                          : index === 4
                          ? "#10b981"
                          : "#8b5cf6"
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Actionable Recommendations */}
        <div className="lg:col-span-6 dashboard-card p-8 bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">AI Optimization Advice</h3>
              <p className="text-xs font-bold text-slate-400 mt-1">Prescriptive efficiency interventions</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 fill-amber-500" />
            </div>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec: any, idx: number) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-white border border-slate-200/80 hover:border-orange-200 transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-black text-slate-900">{rec.title}</h4>
                  <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {rec.impact}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-600 mt-2 leading-relaxed">
                  {rec.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
