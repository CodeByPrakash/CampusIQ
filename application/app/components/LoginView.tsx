"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  Zap,
  Building2,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Activity,
  Layers,
  Shield,
  Loader2,
} from "lucide-react";
import { DEMO_PERSONAS, UserRole, useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function LoginView() {
  const { login, quickDemoLogin } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [email, setEmail] = useState("director@campusiq.ai");
  const [password, setPassword] = useState("demo-password-123");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<UserRole>("director");

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error || "Authentication failed.");
      }
    } catch (err) {
      setError("An unexpected authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPersona = (p: typeof DEMO_PERSONAS[0]) => {
    setSelectedPersona(p.id);
    setEmail(p.email);
    setPassword(p.password);
    setError(null);
  };

  const handleInstantLogin = async (pId: UserRole) => {
    setLoading(true);
    setError(null);
    try {
      await quickDemoLogin(pId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-stretch bg-slate-900 text-slate-100 selection:bg-orange-500 selection:text-white transition-colors duration-300">
      {/* Left Column: Ambient Cyber-Physical Intelligence Showcase */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 lg:p-16 overflow-hidden bg-gradient-to-br from-slate-950 via-[#0c1220] to-[#151c2f] border-r border-slate-800">
        {/* Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Top brand header */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <Zap className="w-7 h-7 text-white fill-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white block leading-none">
                Campus<span className="text-orange-500">IQ</span>
              </span>
              <span className="text-[11px] font-extrabold text-slate-400 tracking-wider uppercase">
                Autonomous Facility AI OS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-800/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/80 text-xs font-black text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>FastAPI ML v2.4 Live</span>
          </div>
        </div>

        {/* Center Headline & AI Capabilities */}
        <div className="relative z-10 my-auto py-12 space-y-7 max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black">
            <Sparkles className="w-4 h-4" />
            <span>BPUT Hackathon • PS-4 Smart Facility Solution</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
            Institutional Energy & Sustainability Command Center
          </h1>

          <p className="text-base text-slate-400 leading-relaxed font-semibold">
            Unified multi-criteria intelligence for Engineering Colleges, Hospitals, Industrial Estates, and Municipal campuses with active anomaly retraining.
          </p>

          {/* 3 Live Feature Highlight Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5 fill-orange-400" />
              </div>
              <h4 className="text-sm font-black text-white">Hybrid Forecast</h4>
              <p className="text-xs text-slate-400 mt-1">Prophet + XGBoost load residuals</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-3">
                <Building2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-white">GIS Satellite</h4>
              <p className="text-xs text-slate-400 mt-1">Real-time GPS coordinate HUD</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/70 backdrop-blur-md">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black text-white">Active Feedback</h4>
              <p className="text-xs text-slate-400 mt-1">Isolation Forest continuous learning</p>
            </div>
          </div>
        </div>

        {/* Footer Security Badges */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 font-bold border-t border-slate-800/80 pt-6">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>Role-Based Access Control (RBAC) & AES-256 Mock Encrypted</span>
          </div>
          <span>BPUT 2026</span>
        </div>
      </div>

      {/* Right Column: Login Form & 1-Click Demo Persona Grid */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 sm:p-12 lg:p-16 bg-slate-900 overflow-y-auto">
        {/* Top Controls: Dark/Light Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex lg:hidden items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="text-xl font-black text-white">
              Campus<span className="text-orange-500">IQ</span>
            </span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer border border-slate-700 shadow-xs"
              title="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-300" />}
            </button>
          </div>
        </div>

        <div className="max-w-md w-full mx-auto space-y-7">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">Welcome to CampusIQ</h2>
            <p className="text-sm font-semibold text-slate-400 mt-1.5">
              Sign in with your institutional credentials or select a quick demo persona.
            </p>
          </div>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black animate-shake">
              {error}
            </div>
          )}

          {/* 1-Click Demo Account Quick Personas */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-orange-500" /> Instant 1-Click Demo Accounts (RBAC)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {DEMO_PERSONAS.map((p) => {
                const isSelected = selectedPersona === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPersona(p)}
                    onDoubleClick={() => handleInstantLogin(p.id)}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? "border-orange-500 bg-orange-500/15 ring-2 ring-orange-500/30 shadow-md"
                        : "border-slate-800 bg-slate-800/60 hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-white">{p.title}</span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                          isSelected ? "bg-orange-500 text-white" : "bg-slate-700 text-slate-300"
                        }`}
                      >
                        {p.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{p.name}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="text-xs font-black text-slate-300 uppercase tracking-wider block mb-2">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="engineer@campusiq.ai"
                  className="w-full bg-slate-800/80 border border-slate-700 text-sm font-bold text-white rounded-2xl pl-12 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-300 uppercase tracking-wider block mb-2">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="w-full bg-slate-800/80 border border-slate-700 text-sm font-bold text-white rounded-2xl pl-12 pr-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 font-bold">
                <input
                  type="checkbox"
                  defaultChecked
                  className="rounded border-slate-700 text-orange-500 focus:ring-orange-500"
                />
                <span>Keep session active</span>
              </label>
              <a href="#" className="text-orange-400 hover:underline font-bold">
                Forgot password?
              </a>
            </div>

            {/* Login CTA Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-orange-500/30 transition-all transform active:scale-98 cursor-pointer disabled:opacity-75"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Authenticating Role & Permissions...</span>
                </>
              ) : (
                <>
                  <span>Sign In as {DEMO_PERSONAS.find((p) => p.id === selectedPersona)?.title || "User"}</span>
                  <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom copyright notice */}
        <div className="text-center text-xs text-slate-500 font-bold pt-8">
          CampusIQ Platform • Problem Statement 4 • All sectors authorized
        </div>
      </div>
    </div>
  );
}
