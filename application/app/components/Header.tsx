"use client";

import React, { useState } from "react";
import {
  Calendar,
  ChevronDown,
  Building2,
  UserCheck,
  Activity,
  Sun,
  Moon,
  LogOut,
  Shield,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth, DEMO_PERSONAS, UserRole } from "../context/AuthContext";

interface HeaderProps {
  title: string;
  subtitle: string;
  selectedFacility: string;
  onFacilityChange: (facility: string) => void;
  userRole?: string;
  onRoleChange?: (role: string) => void;
  apiConnected?: boolean;
}

export default function Header({
  title,
  subtitle,
  selectedFacility,
  onFacilityChange,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { user, logout, switchRole } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);

  const facilities = [
    { id: "engineering_college", label: "GCEK Kalahandi Campus" },
    { id: "hospital", label: "District Hospital Complex" },
    { id: "industrial_estate", label: "Industrial Estate Zone" },
    { id: "municipal_campus", label: "Municipal Corporation Center" },
  ];

  return (
    <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-7 border-b border-slate-200/90 dark:border-slate-800 transition-colors">
      <div>
        <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {title}
        </h1>
        <p className="text-sm lg:text-[15px] font-semibold text-slate-500 dark:text-slate-400 mt-1.5">
          {subtitle}
        </p>
      </div>

      <div className="flex items-center flex-wrap gap-3.5">
        {/* ML Engine Status Pill */}
        <div className="hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-full text-xs font-black bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800 shadow-xs">
          <Activity className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
          <span className="tracking-wide uppercase text-[11px]">FastAPI ML Live</span>
        </div>

        {/* Sector / Facility Selector Pill */}
        <div className="relative">
          <select
            value={selectedFacility}
            onChange={(e) => onFacilityChange(e.target.value)}
            className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-extrabold rounded-full pl-10 pr-10 py-3 hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-orange-500/25 shadow-xs cursor-pointer transition"
          >
            {facilities.map((f) => (
              <option key={f.id} value={f.id} className="dark:bg-slate-800">
                {f.label}
              </option>
            ))}
          </select>
          <Building2 className="w-4.5 h-4.5 text-orange-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <ChevronDown className="w-4.5 h-4.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
          className="p-3 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-orange-300 dark:hover:border-orange-500 shadow-xs transition cursor-pointer flex items-center justify-center"
          title={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
        >
          {theme === "dark" ? (
            <Sun className="w-4.5 h-4.5 text-amber-400 animate-spin-once" />
          ) : (
            <Moon className="w-4.5 h-4.5 text-slate-600" />
          )}
        </button>

        {/* Live Current Date Display Pill */}
        <div className="hidden xl:flex items-center gap-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black rounded-full px-4 py-3 shadow-xs">
          <Calendar className="w-4.5 h-4.5 text-orange-500" />
          <span>
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {/* Authenticated User Profile & Role Switcher */}
        {user && (
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full pl-2 pr-4 py-1.5 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 text-white font-black text-xs flex items-center justify-center shadow-xs">
                {user.name[0]}
              </div>
              <div className="text-left hidden md:block">
                <span className="text-xs font-black text-slate-900 dark:text-white block leading-tight">
                  {user.name.split(" ")[0]}
                </span>
                <span className="text-[10px] font-extrabold text-orange-600 dark:text-orange-400 uppercase tracking-wider block">
                  {user.roleTitle}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Profile Dropdown Menu */}
            {profileOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl p-4 z-50 animate-in fade-in-0 zoom-in-95">
                <div className="pb-3 border-b border-slate-100 dark:border-slate-800 mb-3">
                  <p className="text-sm font-black text-slate-900 dark:text-white">{user.name}</p>
                  <p className="text-xs text-slate-400 font-semibold">{user.email}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-black px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800">
                    <Shield className="w-3 h-3" />
                    <span>{user.roleTitle}</span>
                  </div>
                </div>

                {/* Quick Role Switcher */}
                <div className="space-y-1 mb-3">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2 mb-1">
                    Switch Active Persona (Demo)
                  </p>
                  {DEMO_PERSONAS.map((p) => {
                    const isCurrent = user.role === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => {
                          switchRole(p.id);
                          setProfileOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-left transition cursor-pointer ${
                          isCurrent
                            ? "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 font-black"
                            : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <span>{p.title}</span>
                        {isCurrent && <span className="text-[10px] font-black">Active</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    logout();
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-black transition cursor-pointer border border-rose-200 dark:border-rose-900"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
