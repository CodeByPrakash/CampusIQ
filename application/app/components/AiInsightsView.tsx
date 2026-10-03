"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Zap,
  Droplets,
  Trash2,
  Wind,
  Wrench,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Sparkles,
  Lightbulb,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Send,
  Loader2,
  Copy,
  Download,
  Bot,
  RotateCcw,
  FileText,
  Building
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
} from "recharts";
import { sendAnomalyFeedback, fetchAiLlmChat, buildFacilityPrompt } from "../lib/api";

interface AiInsightsViewProps {
  data: any;
  facilityName?: string;
  facilityType?: string;
  onRefresh?: () => void;
}

export default function AiInsightsView({
  data,
  facilityName = "GCEK Kalahandi Campus",
  facilityType = "engineering_college",
  onRefresh
}: AiInsightsViewProps) {
  const [selectedTab, setSelectedTab] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>("insight_energy_01");
  const [feedbackStatus, setFeedbackStatus] = useState<Record<string, string>>({});

  // AI Briefing & Data Summarization State
  const [briefingText, setBriefingText] = useState<string | null>(null);
  const [briefingLoading, setBriefingLoading] = useState(false);
  const [briefingQuery, setBriefingQuery] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState(true);

  const tabs = ["All", "Energy", "Water", "Waste", "Air Quality", "Safety", "Assets"];

  const insights = data?.insights || [
    {
      id: "insight_energy_01",
      domain: "Energy",
      title: "Unusual energy spike detected",
      severity: "Critical",
      description:
        "Energy consumption in Academic Block B is 35% higher than predicted baseline between 2:00 PM - 5:00 PM.",
      timestamp: "Today, 10:24 AM",
      sparkline_data: [950, 1100, 1050, 980, 1680, 1200, 1350],
      root_cause:
        "HVAC chillers and laboratory exhaust fans operating simultaneously during non-peak occupancy hours.",
      recommended_actions: [
        "Audit HVAC schedules in Academic Block & set thermostat baseline to 24°C.",
        "Implement automated chiller stage-down during 2:00 PM - 3:30 PM.",
        "Potential estimated savings: ~₹12,000 / month and 1.2 tCO₂.",
      ],
      estimated_monthly_savings_inr: 12000,
    },
    {
      id: "insight_water_01",
      domain: "Water",
      title: "Abnormal continuous night flow",
      severity: "Warning",
      description:
        "Water distribution sensor indicates night flow ratio exceeding threshold (300 L/hr continuous between 1 AM - 4 AM).",
      timestamp: "Today, 08:12 AM",
      sparkline_data: [80, 95, 110, 105, 145, 135, 160],
      root_cause:
        "Underground distribution pipe fracture or stuck overhead flush valve in Hostel A wing.",
      recommended_actions: [
        "Inspect main overhead line valve and ground acoustic sensor telemetry in Hostel A.",
        "Enable automated pump cutoff during 00:00 - 05:00 window.",
        "Estimated water loss prevention: ~4,500 Litres / day.",
      ],
      estimated_monthly_savings_inr: 6500,
    },
    {
      id: "insight_waste_01",
      domain: "Waste",
      title: "Waste bin near overflow threshold",
      severity: "Info",
      description:
        "Smart bin ultrasonic sensor at Cafeteria is 82% full. Predicted to breach 95% within 3 hours.",
      timestamp: "Today, 07:45 AM",
      sparkline_data: [30, 45, 55, 68, 75, 82, 90],
      root_cause: "High food preparation volume ahead of campus lunch rush.",
      recommended_actions: [
        "Dynamic dispatch waste route vehicle #3 to Cafeteria by 11:30 AM.",
        "Deploy secondary organic compost segregation bin.",
      ],
      estimated_monthly_savings_inr: 2000,
    },
    {
      id: "insight_aqi_01",
      domain: "Air Quality",
      title: "Air quality optimal - Fresh air opportunity",
      severity: "Info",
      description:
        "Outdoor AQI improved to 42 (Good). Ambient temperature and particulate density allow natural ventilation.",
      timestamp: "Today, 06:30 AM",
      sparkline_data: [88, 76, 68, 54, 46, 42],
      root_cause: "Favorable wind dispersion (9.4 km/h) and minimal vehicular emission.",
      recommended_actions: [
        "Switch AHU dampers to 100% fresh ambient air intake mode to reduce chiller load.",
        "Permit open outdoor sports and campus gatherings.",
      ],
      estimated_monthly_savings_inr: 4000,
    },
    {
      id: "insight_asset_01",
      domain: "Assets",
      title: "Predictive maintenance: Chiller bearing fatigue",
      severity: "Warning",
      description:
        "Vibration telemetry on Chiller-01 increased from 2.1 mm/s to 4.8 mm/s. RUL estimated at 14 days.",
      timestamp: "Yesterday, 09:15 PM",
      sparkline_data: [95, 88, 80, 68, 62, 54],
      root_cause:
        "Motor bearing lubricant degradation leading to early mechanical harmonic fatigue.",
      recommended_actions: [
        "Issue preventive work order #WO-418 for bearing lubrication & balancing.",
        "Prevents sudden equipment breakdown and ₹45,000 emergency replacement expense.",
      ],
      estimated_monthly_savings_inr: 15000,
    },
  ];

  const filtered =
    selectedTab === "All"
      ? insights
      : insights.filter((i: any) => i.domain.toLowerCase() === selectedTab.toLowerCase());

  const getDomainIcon = (domain: string) => {
    switch (domain.toLowerCase()) {
      case "energy":
        return <Zap className="w-7 h-7 fill-amber-500 text-amber-500" />;
      case "water":
        return <Droplets className="w-7 h-7 fill-sky-500 text-sky-500" />;
      case "waste":
        return <Trash2 className="w-7 h-7 text-emerald-600 stroke-[2.5]" />;
      case "air quality":
        return <Wind className="w-7 h-7 text-indigo-500 stroke-[2.5]" />;
      case "assets":
        return <Wrench className="w-7 h-7 text-slate-700 stroke-[2.5]" />;
      case "safety":
        return <ShieldAlert className="w-7 h-7 text-purple-600 stroke-[2.5]" />;
      default:
        return <Sparkles className="w-7 h-7 text-orange-500" />;
    }
  };

  const getDomainBg = (domain: string) => {
    switch (domain.toLowerCase()) {
      case "energy":
        return "bg-gradient-to-tr from-amber-100 to-amber-50 dark:from-amber-950/60 dark:to-amber-900/40 border border-amber-200/60 dark:border-amber-800/60";
      case "water":
        return "bg-gradient-to-tr from-sky-100 to-sky-50 dark:from-sky-950/60 dark:to-sky-900/40 border border-sky-200/60 dark:border-sky-800/60";
      case "waste":
        return "bg-gradient-to-tr from-emerald-100 to-emerald-50 dark:from-emerald-950/60 dark:to-emerald-900/40 border border-emerald-200/60 dark:border-emerald-800/60";
      case "air quality":
        return "bg-gradient-to-tr from-indigo-100 to-indigo-50 dark:from-indigo-950/60 dark:to-indigo-900/40 border border-indigo-200/60 dark:border-indigo-800/60";
      case "assets":
        return "bg-gradient-to-tr from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700/60 border border-slate-300/60 dark:border-slate-700";
      case "safety":
        return "bg-gradient-to-tr from-purple-100 to-purple-50 dark:from-purple-950/60 dark:to-purple-900/40 border border-purple-200/60 dark:border-purple-800/60";
      default:
        return "bg-orange-50 dark:bg-orange-950/60 border border-orange-200/60 dark:border-orange-800/60";
    }
  };

  const handleFeedback = async (insightId: string, domain: string, isTrue: boolean) => {
    try {
      await sendAnomalyFeedback({
        domain: domain.toLowerCase(),
        entity_id: insightId,
        timestamp: new Date().toISOString(),
        is_true_anomaly: isTrue,
        operator_notes: isTrue ? "Confirmed by facility engineer" : "Marked as false alarm",
      });
      setFeedbackStatus((prev) => ({
        ...prev,
        [insightId]: isTrue ? "confirmed" : "false_alarm",
      }));
    } catch (e) {
      console.error("Feedback error:", e);
      setFeedbackStatus((prev) => ({
        ...prev,
        [insightId]: isTrue ? "confirmed" : "false_alarm",
      }));
    }
  };

  // Generate or Ask AI Briefing
  const handleGenerateBriefing = async (promptOverride?: string) => {
    setBriefingLoading(true);
    const anomaliesList = insights.map(
      (i: any) => `${i.domain}: ${i.title} (${i.description})`
    );

    const prompt =
      promptOverride ||
      briefingQuery.trim() ||
      buildFacilityPrompt({
        facilityName,
        healthScore: data?.facility_health_pct || 94,
        energyKwh: data?.total_energy_kwh || 14280,
        peakKw: 480,
        anomalies: anomaliesList,
        maintenanceAlerts: [
          "Chiller-01 bearing lubrication work order #WO-418 (RUL 14d)",
          "Hostel A underground water distribution acoustic check",
        ],
        safetyStatus: "97.1% SLA Compliant",
        sustainabilityScore: 91,
      });

    try {
      const reply = await fetchAiLlmChat(prompt);
      setBriefingText(reply);
      setBriefingQuery("");
      setIsBriefingOpen(true);
    } catch (err) {
      console.error(err);
      setBriefingText("Could not reach neural LLM engine. Please verify network connectivity or try again.");
    } finally {
      setBriefingLoading(false);
    }
  };

  const handleCopyBriefing = () => {
    if (!briefingText) return;
    navigator.clipboard.writeText(briefingText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleExportBriefing = () => {
    if (!briefingText) return;
    const blob = new Blob([briefingText], { type: "text/markdown;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `CampusIQ_${facilityType}_AI_Insights_Briefing.md`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const quickBriefingPrompts = [
    {
      icon: Zap,
      label: "Synthesize All Domain Anomalies",
      prompt: "Synthesize all active anomalies across Energy, Water, Waste, AQI, and Asset telemetry for GCEK Kalahandi with a prioritized 30-day action plan.",
    },
    {
      icon: Building,
      label: "Academic Block Energy Spike Audit",
      prompt: "Provide a root cause analysis and prescriptive BMS setback strategy for the 35% energy spike in Academic Block B.",
    },
    {
      icon: Droplets,
      label: "Hostel A Water Leakage Remediation",
      prompt: "Detail an immediate acoustic sensor inspection and night-flow cutoff protocol to stop the 4,500 L/day water loss in Hostel A.",
    },
    {
      icon: Wrench,
      label: "Chiller-01 Predictive Overhaul (RUL 14d)",
      prompt: "Generate a condition-based maintenance (CBM) overhaul procedure for Chiller-01 harmonic vibration fatigue before failure.",
    },
  ];

  return (
    <div className="space-y-7">
      {/* AI Multi-Domain Executive Briefing & Data Summarizer Card */}
      <div className="dashboard-card p-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/25 shrink-0">
              <Sparkles className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  AI Multi-Domain Executive Briefing &amp; Data Summarizer
                </h3>
                <span className="px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-400 border border-orange-300/80 dark:border-orange-800">
                  Neural LLM Live
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">
                Real-time ML anomaly synthesis, root-cause diagnostics, and step-by-step engineering roadmap for {facilityName}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleGenerateBriefing()}
              disabled={briefingLoading}
              className="flex items-center gap-2 px-5 py-3 rounded-full text-xs font-black bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/25 transition cursor-pointer disabled:opacity-50"
            >
              {briefingLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Telemetry...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>{briefingText ? "Regenerate Live Briefing" : "Generate AI Executive Report"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Question Prompt Chips with Lucide Icons */}
        <div className="pt-4 flex items-center gap-2 overflow-x-auto pb-2">
          {quickBriefingPrompts.map((qp, idx) => {
            const Icon = qp.icon;
            return (
              <button
                key={idx}
                onClick={() => handleGenerateBriefing(qp.prompt)}
                disabled={briefingLoading}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-slate-50 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-orange-600 dark:hover:text-orange-400 border border-slate-200 dark:border-slate-700 transition cursor-pointer disabled:opacity-50"
              >
                <Icon className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                <span>{qp.label}</span>
              </button>
            );
          })}
        </div>

        {/* Render Formatted Markdown Report */}
        {briefingText && (
          <div className="mt-5 p-6 rounded-3xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200/90 dark:border-slate-700/80 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-200/80 dark:border-slate-700/80 text-xs">
              <span className="font-extrabold text-orange-600 dark:text-orange-400 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Executive Operations Report &bull; {facilityName}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyBriefing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 text-xs font-bold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Markdown</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleExportBriefing}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 text-xs font-bold border border-slate-200 dark:border-slate-700 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export .md</span>
                </button>
              </div>
            </div>

            <div className="ai-markdown-content space-y-3">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-xl font-black text-slate-900 dark:text-white mt-4 mb-2 pb-2 border-b border-orange-500/30 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-orange-500 shrink-0" />
                      <span>{children}</span>
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base font-black text-orange-600 dark:text-orange-400 mt-4 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 shrink-0" />
                      <span>{children}</span>
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm font-black text-slate-900 dark:text-white mt-3 mb-1.5 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{children}</span>
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed my-2 font-medium">
                      {children}
                    </p>
                  ),
                  strong: ({ children }) => (
                    <strong className="text-slate-900 dark:text-white font-black">
                      {children}
                    </strong>
                  ),
                  table: ({ children }) => (
                    <div className="w-full my-3.5 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs">
                      <table className="w-full text-left border-collapse bg-white dark:bg-slate-900 text-xs">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black border-b border-slate-200 dark:border-slate-700">
                      {children}
                    </thead>
                  ),
                  tbody: ({ children }) => (
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                      {children}
                    </tbody>
                  ),
                  tr: ({ children }) => (
                    <tr className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      {children}
                    </tr>
                  ),
                  th: ({ children }) => (
                    <th className="p-3 text-xs font-black uppercase tracking-wider text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="p-3 text-xs font-semibold leading-relaxed">
                      {children}
                    </td>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-1.5 my-2.5 pl-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="space-y-1.5 my-2.5 pl-4 list-decimal text-xs text-slate-700 dark:text-slate-200 font-bold">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                      <div className="flex-1">{children}</div>
                    </li>
                  ),
                  code: ({ children }) => (
                    <code className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-orange-600 dark:text-orange-400 font-mono text-[11px]">
                      {children}
                    </code>
                  ),
                }}
              >
                {briefingText}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Diagnostic Query Input Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={briefingQuery}
              onChange={(e) => setBriefingQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerateBriefing()}
              placeholder="Ask AI Engineer a diagnostic question (e.g., 'How to resolve the 4,500 L water leak in Hostel A?')..."
              disabled={briefingLoading}
              className="w-full pl-5 pr-12 py-3 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/25 transition disabled:opacity-50"
            />
            <button
              onClick={() => handleGenerateBriefing()}
              disabled={!briefingQuery.trim() || briefingLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition cursor-pointer disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Material 3 Filter Tabs Bar */}
      <div className="flex items-center gap-3 border-b border-slate-200/90 dark:border-slate-800 pb-3 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = selectedTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-6 py-3 rounded-full text-xs font-black tracking-wide whitespace-nowrap transition cursor-pointer ${
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

      {/* Insights Cards List */}
      <div className="space-y-5">
        {filtered.map((item: any) => {
          const isCrit = item.severity === "Critical";
          const isWarn = item.severity === "Warning";
          const isExpanded = expandedId === item.id;
          const feedback = feedbackStatus[item.id];

          // Formatted sparkline array for Recharts
          const sparkData = (item.sparkline_data || [50, 70, 60, 90, 80, 110]).map(
            (val: number, idx: number) => ({
              point: `T${idx + 1}`,
              value: val,
            })
          );

          const strokeColor = isCrit ? "#f97316" : isWarn ? "#0ea5e9" : "#10b981";

          return (
            <div
              key={item.id}
              className="dashboard-card bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-7 transition-all duration-200 hover:border-orange-300 dark:hover:border-orange-600 shadow-xs"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Left details */}
                <div className="flex items-start gap-5 flex-1">
                  <div
                    className={`w-16 h-16 rounded-3xl flex items-center justify-center shrink-0 shadow-xs ${getDomainBg(
                      item.domain
                    )}`}
                  >
                    {getDomainIcon(item.domain)}
                  </div>
                  <div>
                    <div className="flex items-center gap-3.5 flex-wrap">
                      <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{item.title}</h4>
                      <span
                        className={`text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider ${
                          isCrit
                            ? "bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60"
                            : isWarn
                            ? "bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900/60"
                            : "bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-900/60"
                        }`}
                      >
                        {item.severity}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                      {item.description}
                    </p>
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mt-2.5">{item.timestamp}</p>
                  </div>
                </div>

                {/* Right Sparkline trend with Shadcn Recharts mini chart & expand action */}
                <div className="flex items-center gap-5 shrink-0">
                  <div className="w-48 h-16 bg-slate-50 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700/80 flex items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={sparkData}>
                        <defs>
                          <linearGradient id={`grad-${item.id}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={strokeColor} stopOpacity={0.4} />
                            <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-slate-900 text-white text-[11px] font-black px-2.5 py-1 rounded-lg shadow-md">
                                  {payload[0].value}
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={strokeColor}
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill={`url(#grad-${item.id})`}
                          dot={{ r: 2.5, fill: "#ffffff", stroke: strokeColor, strokeWidth: 1.5 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="w-11 h-11 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 transition cursor-pointer border border-slate-200 dark:border-slate-700 shadow-xs"
                  >
                    {isExpanded ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
                  </button>
                </div>
              </div>

              {/* Expandable Diagnostics & Continuous Learning Action */}
              {isExpanded && (
                <div className="mt-7 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-5 animate-in fade-in duration-200">
                  {item.root_cause && (
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80">
                      <p className="text-xs font-black text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
                        <AlertTriangle className="w-4.5 h-4.5 text-orange-500" /> AI Root Cause Diagnostics & Signature Analysis
                      </p>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-bold">{item.root_cause}</p>
                    </div>
                  )}

                  {item.recommended_actions && (
                    <div className="p-5 rounded-2xl bg-orange-50/90 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-900/60">
                      <p className="text-xs font-black text-orange-950 dark:text-orange-300 mb-2.5 flex items-center gap-2">
                        <Lightbulb className="w-4.5 h-4.5 text-orange-600 dark:text-orange-400" /> Prescriptive Action Plan & Financial ROI
                      </p>
                      <ul className="space-y-2 text-xs text-slate-800 dark:text-slate-200 font-bold">
                        {item.recommended_actions.map((act: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2.5">
                            <span className="text-orange-500 font-black">•</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Active Anomaly Feedback Bar for Continuous Learning */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                      Active operator feedback loop (retrains Isolation Forest & Classifiers):
                    </span>

                    <div className="flex items-center gap-3">
                      {feedback ? (
                        <span className="text-xs font-black px-5 py-2.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-2 shadow-xs">
                          <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                          <span>
                            Feedback Synced ({feedback === "confirmed" ? "Ground Truth Anomaly Logged" : "False Alarm Ignored"})
                          </span>
                        </span>
                      ) : (
                        <>
                          <button
                            onClick={() => handleFeedback(item.id, item.domain, true)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-800 dark:text-emerald-300 font-black text-xs transition border border-emerald-300 dark:border-emerald-800 cursor-pointer shadow-xs"
                          >
                            <Check className="w-4 h-4 stroke-[3]" />
                            <span>Confirm Anomaly</span>
                          </button>
                          <button
                            onClick={() => handleFeedback(item.id, item.domain, false)}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/80 text-rose-800 dark:text-rose-300 font-black text-xs transition border border-rose-300 dark:border-rose-800 cursor-pointer shadow-xs"
                          >
                            <X className="w-4 h-4 stroke-[3]" />
                            <span>False Alarm</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
