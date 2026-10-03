"use client";

import React, { useState, useEffect } from "react";
import Sidebar, { NavItem } from "./components/Sidebar";
import Header from "./components/Header";
import DashboardView from "./components/DashboardView";
import CampusMapView from "./components/CampusMapView";
import EnergyAnalyticsView from "./components/EnergyAnalyticsView";
import AiInsightsView from "./components/AiInsightsView";
import AssetsOperationsView from "./components/AssetsOperationsView";
import SimulationView from "./components/SimulationView";
import ReportsView from "./components/ReportsView";
import SafetyView from "./components/SafetyView";
import LoginView from "./components/LoginView";
import SmoothScroll from "./components/SmoothScroll";
import AiExecutiveAssistantModal from "./components/AiExecutiveAssistantModal";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Lock, ShieldAlert, ArrowRight, Shield } from "lucide-react";
import {
  getDashboardOverview,
  getCampusMapData,
  getEnergyAnalytics,
  getAiInsights,
  getAssetOperations,
  getSustainabilityReports,
  getSafetyOverview,
} from "./lib/api";

function AppContent() {
  const { user, isAuthenticated, hasPermission, quickDemoLogin } = useAuth();
  const [activeNav, setActiveNav] = useState<NavItem>("dashboard");
  const [facilityType, setFacilityType] = useState("engineering_college");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [mapData, setMapData] = useState<any>(null);
  const [energyData, setEnergyData] = useState<any>(null);
  const [insightsData, setInsightsData] = useState<any>(null);
  const [assetsData, setAssetsData] = useState<any>(null);
  const [reportsData, setReportsData] = useState<any>(null);
  const [safetyData, setSafetyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const facilityLabels: Record<string, string> = {
    engineering_college: "GCEK Kalahandi Campus",
    hospital: "District Hospital Complex",
    industrial_estate: "Industrial Estate Zone",
    municipal_campus: "Municipal Corporation Center",
  };

  // Load sector data from ML backend
  useEffect(() => {
    if (!isAuthenticated) return;
    let isMounted = true;
    async function loadAllData() {
      setLoading(true);
      try {
        const [d, m, e, i, a, r, s] = await Promise.all([
          getDashboardOverview(facilityType),
          getCampusMapData(facilityType),
          getEnergyAnalytics(facilityType),
          getAiInsights(facilityType),
          getAssetOperations(facilityType),
          getSustainabilityReports(facilityType),
          getSafetyOverview(facilityType),
        ]);

        if (isMounted) {
          setDashboardData(d);
          setMapData(m);
          setEnergyData(e);
          setInsightsData(i);
          setAssetsData(a);
          setReportsData(r);
          setSafetyData(s);
        }
      } catch (err) {
        console.error("Error loading ML data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAllData();
    return () => {
      isMounted = false;
    };
  }, [facilityType, isAuthenticated]);

  if (!isAuthenticated) {
    return <LoginView />;
  }

  // Permission mapping per view
  const viewPermissions: Record<NavItem, string> = {
    dashboard: "view_overview",
    "campus-map": "view_map",
    "energy-analytics": "energy_control",
    "ai-insights": "view_insights",
    "assets-operations": "asset_diagnostics",
    simulation: "simulation_run",
    reports: "esg_export",
    safety: "safety_dispatch",
  };

  const isViewAuthorized =
    hasPermission(viewPermissions[activeNav]) ||
    hasPermission("view_all") ||
    activeNav === "dashboard";

  // Headers metadata mapped per navigation view
  const headerMeta: Record<NavItem, { title: string; subtitle: string }> = {
    dashboard: {
      title: `Welcome, ${user?.name || "Officer"}`,
      subtitle: `Multi-sector telemetry synthesis and active anomaly learning (${user?.roleTitle} Mode).`,
    },
    "campus-map": {
      title: "GIS Satellite Campus View",
      subtitle: "High-resolution satellite mapping, GPS coordinates, and real-time building telemetry.",
    },
    "energy-analytics": {
      title: "Energy Intelligence & Forecasting",
      subtitle: "Prophet + XGBoost load forecasting, tariff cost metrics, and peak-shaving analytics.",
    },
    "ai-insights": {
      title: "AI Insights & Anomaly Diagnostics",
      subtitle: "Continuous active learning engine with operator feedback confirmation loops.",
    },
    "assets-operations": {
      title: "Asset Operations & Health",
      subtitle: "Random Forest predictive maintenance, RUL estimation, and vibration telemetry.",
    },
    simulation: {
      title: "What-If Scenario Simulation",
      subtitle: "Parameterized Monte Carlo policy impact simulator for energy, cost, and ESG carbon cuts.",
    },
    reports: {
      title: "Sustainability & ESG Reports",
      subtitle: "6-Axis ESG compliance scorecard, radar metrics, and period-over-period comparison.",
    },
    safety: {
      title: "Safety & Hazard Hotspot Analysis",
      subtitle: "Spatial risk cluster detection, IoT compliance checklists, and response time metrics.",
    },
  };

  const currentMeta = headerMeta[activeNav] || headerMeta.dashboard;

  return (
    <div className="min-h-screen bg-[#f4f6fb] dark:bg-[#090d16] flex text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar
        activeNav={activeNav}
        onSelectNav={(nav) => setActiveNav(nav)}
        userRole={user?.roleTitle}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Content Area */}
      <main
        className={`flex-1 flex flex-col min-w-0 min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarCollapsed ? "ml-20" : "ml-80"
        }`}
      >
        <div className="p-8 lg:p-10 max-w-[1700px] w-full mx-auto space-y-8">
          {/* Header */}
          <Header
            title={currentMeta.title}
            subtitle={currentMeta.subtitle}
            selectedFacility={facilityType}
            onFacilityChange={(f) => setFacilityType(f)}
          />

          {/* Active View Rendering or RBAC Guard */}
          <div className="transition-all duration-200">
            {!isViewAuthorized ? (
              <div className="dashboard-card p-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center max-w-xl mx-auto space-y-5 my-12 shadow-xl">
                <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto">
                  <Lock className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                  Access Restricted by Role
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  Your current persona (<strong className="text-orange-600 dark:text-orange-400">{user?.roleTitle}</strong>) does not have authorization to view this module.
                </p>
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => setActiveNav("dashboard")}
                    className="px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-black transition cursor-pointer"
                  >
                    Back to Overview
                  </button>
                  <button
                    onClick={() => quickDemoLogin("director")}
                    className="px-6 py-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-black shadow-md shadow-orange-500/30 transition cursor-pointer flex items-center gap-2"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Elevate to Facility Director</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {activeNav === "dashboard" && (
                  <DashboardView
                    data={dashboardData}
                    onNavigate={(v) => setActiveNav(v as NavItem)}
                  />
                )}
                {activeNav === "campus-map" && <CampusMapView data={mapData} facilityType={facilityType} />}
                {activeNav === "energy-analytics" && <EnergyAnalyticsView data={energyData} />}
                {activeNav === "ai-insights" && (
                  <AiInsightsView
                    data={insightsData}
                    facilityName={facilityLabels[facilityType] || "GCEK Kalahandi Campus"}
                    facilityType={facilityType}
                    onRefresh={() => getAiInsights(facilityType).then(setInsightsData)}
                  />
                )}
                {activeNav === "assets-operations" && <AssetsOperationsView data={assetsData} />}
                {activeNav === "simulation" && (
                  <SimulationView
                    facilityName={facilityLabels[facilityType] || "GCEK Kalahandi Campus"}
                    facilityType={facilityType}
                  />
                )}
                {activeNav === "reports" && <ReportsView data={reportsData} />}
                {activeNav === "safety" && <SafetyView data={safetyData} />}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Interactive Neural LLM Executive Assistant Modal */}
      <AiExecutiveAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        facilityType={facilityType}
        facilityName={facilityLabels[facilityType] || "Campus Facility"}
        currentData={{
          healthScore: dashboardData?.facility_health?.overall_health_pct || 92,
          energyKwh: dashboardData?.kpi_cards?.energy_usage_kwh || 24850,
          peakKw: energyData?.kpis?.peak_demand_kw || 480,
          anomalies: dashboardData?.recent_alerts?.map((a: any) => `${a.severity}: ${a.message}`) || [],
          maintenanceAlerts: assetsData?.priority_maintenance?.map((m: any) => `${m.asset_name}: ${m.action_required}`) || [],
          safetyStatus: safetyData?.safety_analytics?.overall_safety_status || "97.1% SLA Compliant",
          sustainabilityScore: reportsData?.sustainability_score || 91,
        }}
      />
    </div>
  );
}

export default function Home() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SmoothScroll>
          <AppContent />
        </SmoothScroll>
      </AuthProvider>
    </ThemeProvider>
  );
}
