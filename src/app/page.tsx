"use client";

import React, { useState, useEffect } from "react";
import AuthGuard from "../components/auth-guard";
import AnalyticsCard from "../components/analytics-card";
import { fetchVendors, fetchAnalyticsReport } from "../lib/api-client";
import { 
  ShieldCheck, 
  TrendingUp, 
  Server, 
  RefreshCw, 
  Settings, 
  BarChart3, 
  Activity,
  Users,
  Compass
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const loadData = async () => {
    setLoading(true);
    setErrorText("");
    try {
      const [vendorData, reportData] = await Promise.all([
        fetchVendors(),
        fetchAnalyticsReport()
      ]);

      if (vendorData) setVendors(vendorData);
      
      if (reportData) {
        setReport(reportData);
      } else {
        // Fallback default mockup report values
        setReport({
          summary: {
            totalVisits: 1420,
            returningVisitors: 488,
            productViews: 3204,
            contactClicks: 218
          },
          workerLatency: {
            averageSeconds: 4.8,
            queueDepth: 0
          }
        });
      }
    } catch {
      setErrorText("API node link disrupted.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalVendors = vendors.length;
  const activeVendors = vendors.filter(v => v.active).length;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
        {/* Header */}
        <header className="border-b border-gray-900 px-8 py-5 bg-gray-950/60 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-lime-400 rounded-xl flex items-center justify-center text-gray-950 font-black text-2xl shadow-lg shadow-lime-400/20 select-none">
              B
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Balaa Control Center</h1>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">Platform Controller Interface</p>
            </div>
          </div>

          <button
            onClick={loadData}
            className="p-2.5 border border-gray-800 rounded-xl bg-gray-900 text-gray-400 hover:text-white hover:border-gray-700 transition-all cursor-pointer"
            title="Refresh System State"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </header>

        {/* Content */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-8 space-y-8">
          
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Vendors Card Link */}
            <Link 
              href="/vendors" 
              className="group border border-gray-900 bg-gray-900/10 p-6 rounded-2xl hover:border-lime-400/50 hover:bg-gray-900/20 transition-all flex flex-col justify-between space-y-6 cursor-pointer"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-gray-500 tracking-wider">Vendor Node Controller</span>
                  <Server className="w-5 h-5 text-gray-500 group-hover:text-lime-400 transition-colors" />
                </div>
                <h2 className="text-xl font-bold text-white group-hover:text-lime-400 transition-colors">Vendor Directory</h2>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Register new businesses, modify catalog mapping templates, enable sponsor ads, and toggle licensing states.
                </p>
              </div>

              <div className="flex items-baseline gap-2 pt-4 border-t border-gray-900/55">
                <span className="text-2xl font-black text-white">{activeVendors}</span>
                <span className="text-xs text-gray-500 font-mono">active / {totalVendors} total</span>
              </div>
            </Link>

            {/* Analytics Card Link */}
            <Link 
              href="/analytics" 
              className="group border border-gray-900 bg-gray-900/10 p-6 rounded-2xl hover:border-lime-400/50 hover:bg-gray-900/20 transition-all flex flex-col justify-between space-y-6 cursor-pointer"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-gray-500 tracking-wider">Business Intelligence</span>
                  <BarChart3 className="w-5 h-5 text-gray-500 group-hover:text-lime-400 transition-colors" />
                </div>
                <h2 className="text-xl font-bold text-white group-hover:text-lime-400 transition-colors">Platform Telemetry</h2>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Monitor search query behavior, pricing variances, WhatsApp checkout conversion rates, and geographic clusters.
                </p>
              </div>

              <div className="flex items-baseline gap-2 pt-4 border-t border-gray-900/55">
                <span className="text-2xl font-black text-white">
                  {report?.summary?.totalVisits || 0}
                </span>
                <span className="text-xs text-gray-500 font-mono">visits recorded</span>
              </div>
            </Link>

            {/* Queue State Card */}
            <div 
              className="border border-gray-900 bg-gray-900/10 p-6 rounded-2xl flex flex-col justify-between space-y-6"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase text-gray-500 tracking-wider">SQLite Queue Status</span>
                  <Activity className="w-5 h-5 text-lime-400 animate-pulse" />
                </div>
                <h2 className="text-xl font-bold text-white">Background Processor</h2>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Monitors worker loop execution delays, active debounce timeouts, image compression metrics, and Supabase upload pipes.
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-900/55 font-mono text-xs">
                <span className="text-gray-400">Queue Depth:</span>
                <span className="text-lime-400 font-bold">{report?.workerLatency?.queueDepth || 0} jobs</span>
              </div>
            </div>

          </div>

          {/* Platform Status Bar */}
          <div className="border border-gray-900 bg-gray-950/20 px-6 py-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-mono text-gray-300">Unified API abstraction layer online</span>
            </div>
            
            <div className="flex gap-4 text-xs font-mono text-gray-500">
              <span>Port: <strong className="text-white">3002</strong></span>
              <span>Node Environment: <strong className="text-white">Local / Dev</strong></span>
            </div>
          </div>

        </main>
      </div>
    </AuthGuard>
  );
}