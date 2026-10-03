"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type UserRole =
  | "director"
  | "energy_engineer"
  | "maintenance_tech"
  | "safety_officer"
  | "operator";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  avatar: string;
  permissions: string[];
}

export interface DemoPersona {
  id: UserRole;
  title: string;
  name: string;
  email: string;
  password: string;
  badge: string;
  color: string;
  description: string;
  permissions: string[];
}

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: "director",
    title: "Facility Director",
    name: "Dr. Rajeshwar Patnaik",
    email: "director@campusiq.ai",
    password: "demo-password-123",
    badge: "Super Admin",
    color: "from-amber-500 to-orange-600",
    description: "Full institutional governance, ESG scorecard approval & multi-sector policy simulations.",
    permissions: ["*"],
  },
  {
    id: "energy_engineer",
    title: "Energy & BMS Engineer",
    name: "Ananya Tripathy",
    email: "energy@campusiq.ai",
    password: "demo-password-123",
    badge: "Specialist",
    color: "from-orange-500 to-amber-500",
    description: "Prophet + XGBoost load forecasting, HVAC chiller optimization & peak tariff shifting.",
    permissions: ["view_all", "energy_control", "retrain_models", "simulation_run", "esg_export"],
  },
  {
    id: "maintenance_tech",
    title: "Asset Operations Lead",
    name: "Subhendu Mishra",
    email: "maintenance@campusiq.ai",
    password: "demo-password-123",
    badge: "Operations",
    color: "from-sky-500 to-blue-600",
    description: "Random Forest equipment vibration diagnosis, RUL forecasting & work order automation.",
    permissions: ["view_all", "work_orders", "asset_diagnostics", "feedback_submit"],
  },
  {
    id: "safety_officer",
    title: "Safety & Compliance Officer",
    name: "Priyanka Mohanty",
    email: "safety@campusiq.ai",
    password: "demo-password-123",
    badge: "Compliance",
    color: "from-purple-500 to-indigo-600",
    description: "Spatial cluster risk hotspots, hazard escalation & fire/electrical protocol signoffs.",
    permissions: ["view_all", "safety_dispatch", "incident_resolve", "audit_signoff"],
  },
  {
    id: "operator",
    title: "Campus Duty Operator",
    name: "Debasis Rout",
    email: "operator@campusiq.ai",
    password: "demo-password-123",
    badge: "Read-Only",
    color: "from-emerald-500 to-teal-600",
    description: "Live sensor telemetry monitoring, GIS satellite map inspection & shift handover log.",
    permissions: ["view_overview", "view_map", "view_insights"],
  },
];

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  quickDemoLogin: (personaId: UserRole) => Promise<void>;
  logout: () => void;
  hasPermission: (perm: string) => boolean;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Check local storage for authenticated session
    const stored = localStorage.getItem("campusiq_user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setIsAuthenticated(true);
      } catch (e) {
        localStorage.removeItem("campusiq_user");
      }
    } else {
      // Default to Facility Director for seamless demo on first load or allow login
      const defaultPersona = DEMO_PERSONAS[0];
      const defaultUser: UserProfile = {
        id: "usr-01",
        name: defaultPersona.name,
        email: defaultPersona.email,
        role: defaultPersona.id,
        roleTitle: defaultPersona.title,
        department: "Operations & Governance",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        permissions: defaultPersona.permissions,
      };
      setUser(defaultUser);
      setIsAuthenticated(true);
      localStorage.setItem("campusiq_user", JSON.stringify(defaultUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Validate against demo personas
    const matched = DEMO_PERSONAS.find((p) => p.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      const newUser: UserProfile = {
        id: `usr-${matched.id}`,
        name: matched.name,
        email: matched.email,
        role: matched.id,
        roleTitle: matched.title,
        department:
          matched.id === "director"
            ? "Operations & Governance"
            : matched.id === "energy_engineer"
            ? "Energy Management"
            : matched.id === "maintenance_tech"
            ? "Mechanical & Electrical"
            : matched.id === "safety_officer"
            ? "Campus Safety"
            : "Central Monitoring",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        permissions: matched.permissions,
      };
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem("campusiq_user", JSON.stringify(newUser));
      return { success: true };
    }
    return { success: false, error: "Invalid credentials. Please select one of the 1-click Demo Personas." };
  };

  const quickDemoLogin = async (personaId: UserRole) => {
    const matched = DEMO_PERSONAS.find((p) => p.id === personaId) || DEMO_PERSONAS[0];
    const newUser: UserProfile = {
      id: `usr-${matched.id}`,
      name: matched.name,
      email: matched.email,
      role: matched.id,
      roleTitle: matched.title,
      department:
        matched.id === "director"
          ? "Operations & Governance"
          : matched.id === "energy_engineer"
          ? "Energy Management"
          : matched.id === "maintenance_tech"
          ? "Mechanical & Electrical"
          : matched.id === "safety_officer"
          ? "Campus Safety"
          : "Central Monitoring",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
      permissions: matched.permissions,
    };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem("campusiq_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("campusiq_user");
  };

  const hasPermission = (perm: string) => {
    if (!user) return false;
    if (user.permissions.includes("*")) return true;
    return user.permissions.includes(perm);
  };

  const switchRole = (newRole: UserRole) => {
    quickDemoLogin(newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        quickDemoLogin,
        logout,
        hasPermission,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
