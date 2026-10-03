"use client";

import React, { useState } from "react";
import {
  Download,
  ChevronDown,
  Zap,
  Droplets,
  Trash2,
  Leaf,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from "lucide-react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ChartTooltipContent } from "./ui/chart";

interface ReportsViewProps {
  data: any;
}

export default function ReportsView({ data }: ReportsViewProps) {
  const [activeTab, setActiveTab] = useState("Overview");

  const scorecard = data?.scorecard || {
    overall_sustainability_index: 82,
    rating: "Gold",
    radar_scores: {
      Energy: 85,
      Water: 78,
      Waste: 88,
      "Air Quality": 92,
      Safety: 84,
      Assets: 80,
    },
  };

  const deltas = data?.deltas_vs_previous_month || {
    energy_pct: 12,
    water_pct: 8,
    waste_pct: 5,
    carbon_emissions_pct: -15,
  };

  // Convert radar scores to Recharts format
  const radarData = [
    { subject: "Energy", score: scorecard.radar_scores?.Energy || 85, fullMark: 100 },
    { subject: "Water", score: scorecard.radar_scores?.Water || 78, fullMark: 100 },
    { subject: "Waste", score: scorecard.radar_scores?.Waste || 88, fullMark: 100 },
    { subject: "Air Quality", score: scorecard.radar_scores?.["Air Quality"] || 92, fullMark: 100 },
    { subject: "Safety", score: scorecard.radar_scores?.Safety || 84, fullMark: 100 },
    { subject: "Assets", score: scorecard.radar_scores?.Assets || 80, fullMark: 100 },
  ];

  // Dynamic rolling 6 months based on current month/year
  const rollingMonths = (() => {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d.toLocaleDateString("en-US", { month: "short" }));
    }
    return months;
  })();

  const monthlyData = [
    { month: rollingMonths[0], Energy: 18400, Water: 340, Waste: 620 },
    { month: rollingMonths[1], Energy: 19800, Water: 360, Waste: 640 },
    { month: rollingMonths[2], Energy: 22100, Water: 390, Waste: 670 },
    { month: rollingMonths[3], Energy: 21500, Water: 380, Waste: 650 },
    { month: rollingMonths[4], Energy: 23400, Water: 410, Waste: 690 },
    { month: rollingMonths[5], Energy: 24850, Water: 430, Waste: 710 },
  ];

  return (
    <div className="space-y-7">
      {/* Sub Tabs & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/90 pb-3">
        <div className="flex items-center gap-2.5 overflow-x-auto">
          {["Overview", "Sustainability", "Energy", "Water", "Waste", "Air Quality", "Safety"].map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-xs font-black whitespace-nowrap transition cursor-pointer ${
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

        <div className="flex items-center gap-3">
          <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs font-black rounded-full px-4 py-2.5 shadow-xs cursor-pointer">
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Year to Date</option>
          </select>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-black text-xs shadow-md shadow-orange-500/30 transition cursor-pointer">
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Export ESG Report</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Large KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="dashboard-card p-7 bg-white border border-slate-200/80 flex items-center gap-5 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-xs shrink-0 border border-amber-200/60">
            <Zap className="w-8 h-8 fill-amber-500" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Energy Index</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-1.5 text-rose-500">
              <ArrowUpRight className="w-5 h-5 stroke-[3]" /> +{deltas.energy_pct}%
            </h4>
            <p className="text-xs font-bold text-slate-400 mt-0.5">vs previous period</p>
          </div>
        </div>

        <div className="dashboard-card p-7 bg-white border border-slate-200/80 flex items-center gap-5 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-sky-50 text-sky-500 flex items-center justify-center shadow-xs shrink-0 border border-sky-200/60">
            <Droplets className="w-8 h-8 fill-sky-500" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Water Index</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-1.5 text-rose-500">
              <ArrowUpRight className="w-5 h-5 stroke-[3]" /> +{deltas.water_pct}%
            </h4>
            <p className="text-xs font-bold text-slate-400 mt-0.5">vs previous period</p>
          </div>
        </div>

        <div className="dashboard-card p-7 bg-white border border-slate-200/80 flex items-center gap-5 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-500 flex items-center justify-center shadow-xs shrink-0 border border-rose-200/60">
            <Trash2 className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Waste Output</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-1.5 text-rose-500">
              <ArrowUpRight className="w-5 h-5 stroke-[3]" /> +{deltas.waste_pct}%
            </h4>
            <p className="text-xs font-bold text-slate-400 mt-0.5">vs previous period</p>
          </div>
        </div>

        <div className="dashboard-card p-7 bg-white border border-slate-200/80 flex items-center gap-5 shadow-xs">
          <div className="w-16 h-16 rounded-3xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-xs shrink-0 border border-teal-200/60">
            <Leaf className="w-8 h-8 fill-teal-600" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Carbon Footprint</p>
            <h4 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-1.5 text-emerald-600">
              <ArrowDownRight className="w-5 h-5 stroke-[3]" /> {Math.abs(deltas.carbon_emissions_pct)}%
            </h4>
            <p className="text-xs font-bold text-slate-400 mt-0.5">vs previous period</p>
          </div>
        </div>
      </div>

      {/* Radar Scorecard & Monthly Trends Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* Radar Chart with Shadcn Recharts RadarChart */}
        <div className="lg:col-span-5 dashboard-card p-8 bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">ESG Scorecard</h3>
              <p className="text-xs font-bold text-slate-400 mt-1">6-Axis Composite Compliance Radar</p>
            </div>
            <span className="text-xs font-black px-3.5 py-1.5 bg-amber-50 text-amber-700 rounded-full border border-amber-300">
              {scorecard.rating} Tier
            </span>
          </div>

          <div className="w-full h-80 my-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: "#475569", fontSize: 11, fontWeight: 800 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" />
                <Tooltip content={<ChartTooltipContent />} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#f97316"
                  fill="#f97316"
                  fillOpacity={0.45}
                  dot={{ r: 4, fill: "#f97316" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs font-bold text-slate-500">
            <span>Composite ESG Index</span>
            <span className="font-black text-slate-900 text-sm">
              {scorecard.overall_sustainability_index} / 100
            </span>
          </div>
        </div>

        {/* Monthly Resource Trend with Shadcn Recharts Grouped BarChart */}
        <div className="lg:col-span-7 dashboard-card p-8 bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Monthly Resource Consumption Trend
              </h3>
              <p className="text-xs font-bold text-slate-400 mt-1">
                Multi-utility historical trajectory
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-extrabold">
              <span className="flex items-center gap-1.5 text-orange-600">
                <span className="w-3 h-3 rounded-full bg-orange-500" /> Energy
              </span>
              <span className="flex items-center gap-1.5 text-sky-600">
                <span className="w-3 h-3 rounded-full bg-sky-500" /> Water
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-3 h-3 rounded-full bg-emerald-500" /> Waste
              </span>
            </div>
          </div>

          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} fontWeight={700} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="Energy" name="Energy (kWh)" fill="#f97316" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Water" name="Water (kL x10)" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Waste" name="Waste (kg x10)" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
