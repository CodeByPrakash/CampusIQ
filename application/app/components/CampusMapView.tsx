"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Building, Activity, AlertTriangle, Shield, Loader2 } from "lucide-react";

// Dynamically import Leaflet Satellite component to disable SSR
const SatelliteMapLeaflet = dynamic(() => import("./SatelliteMapLeaflet"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[620px] rounded-3xl bg-slate-900 flex flex-col items-center justify-center text-slate-400 gap-3.5 border border-slate-800">
      <Loader2 className="w-9 h-9 animate-spin text-orange-500" />
      <p className="text-sm font-bold tracking-wider text-slate-300">Loading Satellite GIS Telemetry Map...</p>
    </div>
  ),
});

interface CampusMapViewProps {
  data: any;
  facilityType?: string;
}

export default function CampusMapView({ data, facilityType = "engineering_college" }: CampusMapViewProps) {
  const [selectedBuilding, setSelectedBuilding] = useState<any>(null);

  const totalBuildings = data?.total_buildings || 6;
  const activeSensors = data?.active_sensors || 48;
  const liveAlerts = data?.live_alerts || 4;
  const facilityHealth = data?.facility_health_pct || 86;

  return (
    <div className="space-y-7">
      {/* High-Resolution Satellite GIS Map Engine */}
      <SatelliteMapLeaflet
        sector={facilityType || data?.facility_type || "engineering_college"}
        onSelectBuilding={setSelectedBuilding}
        selectedBuilding={selectedBuilding}
      />

        {/* Bottom Summary KPI Strip matching reference design */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          <div className="dashboard-card p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shadow-xs shrink-0 border border-amber-200/60 dark:border-amber-800/60">
              <Building className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Campus Structures</p>
              <h4 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1">11 Nodes</h4>
            </div>
          </div>

          <div className="dashboard-card p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-950/60 text-sky-500 flex items-center justify-center shadow-xs shrink-0 border border-sky-200/60 dark:border-sky-800/60">
              <Activity className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active IoT Nodes</p>
              <h4 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mt-1">118 Sensors</h4>
            </div>
          </div>

          <div className="dashboard-card p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 flex items-center justify-center shadow-xs shrink-0 border border-rose-200/60 dark:border-rose-800/60">
              <AlertTriangle className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">Active Anomalies</p>
              <h4 className="text-2xl lg:text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">2 Alerts</h4>
            </div>
          </div>

          <div className="dashboard-card p-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shadow-xs shrink-0 border border-emerald-200/60 dark:border-emerald-800/60">
              <Shield className="w-7 h-7 stroke-[2.5]" />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">GIS Health Score</p>
              <h4 className="text-2xl lg:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">94%</h4>
            </div>
          </div>
        </div>
    </div>
  );
}
