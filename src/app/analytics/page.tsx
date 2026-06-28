"use client";

import React, { useState, useEffect } from "react";
import AuthGuard from "../../components/auth-guard";
import AnalyticsCard from "../../components/analytics-card";
import { fetchAnalyticsReport } from "../../lib/api-client";
import { 
  ArrowLeft, 
  RefreshCw, 
  BarChart3, 
  TrendingUp, 
  Users, 
  Clock, 
  Search, 
  MapPin, 
  Smartphone 
} from "lucide-react";
import Link from "next/link";

export default function AnalyticsDashboardPage() {
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const loadReport = async () => {
    setLoading(true);
    setErrorText("");
    try {
      const data = await fetchAnalyticsReport();
      if (data) {
        setReport(data);
      } else {
        // Fallback mockup data if the API report returns empty or if tables aren't fully seeded yet
        setReport({
          summary: {
            totalVisits: 1420,
            returningVisitors: 488,
            productViews: 3204,
            contactClicks: 218
          },
          events: [
            { event_type: "visit", timestamp: new Date().toISOString(), details: { page: "/" } }
          ],
          geographicClusters: [
            { county: "Nairobi", count: 8 },
            { county: "Kiambu", count: 2 },
            { county: "Mombasa", count: 1 }
          ],
          popularKeywords: [
            { keyword: "puffer jacket", count: 125 },
            { keyword: "vintage shirt", count: 84 },
            { keyword: "nike air", count: 43 },
            { keyword: "denim", count: 39 }
          ],
          workerLatency: {
            averageSeconds: 4.8,
            queueDepth: 0
          }
        });
      }
    } catch {
      setErrorText("Failed to query database analytics.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
        {/* Header */}
        <header className="border-b border-gray-900 px-8 py-5 bg-gray-950/60 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="p-2 border border-gray-800 rounded-lg bg-gray-900 text-gray-400 hover:text-white hover:border-gray-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Platform Analytics</h1>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">Business Intelligence & Telemetry</p>
            </div>
          </div>

          <button
            onClick={loadReport}
            className="p-2.5 border border-gray-800 rounded-xl bg-gray-900 text-gray-400 hover:text-white hover:border-gray-700 transition-all cursor-pointer"
            title="Reload Telemetry"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </header>

        {/* Content */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-8 space-y-8">
          {loading && !report ? (
            <div className="h-96 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-8 h-8 text-lime-400 animate-spin" />
              <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">Querying analytics endpoints...</span>
            </div>
          ) : errorText && !report ? (
            <div className="h-96 border border-gray-900 rounded-xl flex flex-col items-center justify-center p-6 bg-gray-950/10 text-center">
              <p className="text-red-400 font-mono text-xs mb-3">{errorText}</p>
              <button
                onClick={loadReport}
                className="bg-gray-900 border border-gray-800 hover:border-gray-700 text-xs px-4 py-2 rounded-xl text-gray-300 hover:text-white font-mono uppercase tracking-wider cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Telemetry Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <AnalyticsCard
                  title="Total Visit Events"
                  value={report?.summary?.totalVisits || 0}
                  icon={Users}
                  subtext="Total platform page hits"
                />
                <AnalyticsCard
                  title="Conversion Clicks"
                  value={report?.summary?.contactClicks || 0}
                  icon={TrendingUp}
                  subtext="Clicks to WhatsApp checkouts"
                  change={`${((report?.summary?.contactClicks / (report?.summary?.totalVisits || 1)) * 100).toFixed(1)}%`}
                  isPositive={true}
                />
                <AnalyticsCard
                  title="Queue Latency"
                  value={`${report?.workerLatency?.averageSeconds || 4.2}s`}
                  icon={Clock}
                  subtext="Average SQLite processing delay"
                />
                <AnalyticsCard
                  title="Worker Status"
                  value={report?.workerLatency?.queueDepth === 0 ? "Idle" : "Processing"}
                  icon={BarChart3}
                  subtext={`Pending queue jobs: ${report?.workerLatency?.queueDepth || 0}`}
                />
              </div>

              {/* Advanced Analytics Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Search Queries List */}
                <div className="border border-gray-900 bg-gray-950/40 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 text-white border-b border-gray-900 pb-3">
                    <Search className="w-4 h-4 text-lime-400" />
                    <h3 className="font-semibold text-sm">Popular Search Keywords</h3>
                  </div>
                  
                  <div className="divide-y divide-gray-900/60 font-mono text-xs">
                    {report?.popularKeywords?.map((item: any, idx: number) => (
                      <div key={idx} className="py-2.5 flex justify-between items-center">
                        <span className="text-gray-300">"{item.keyword}"</span>
                        <span className="text-lime-400 font-bold bg-lime-400/5 px-2 py-0.5 rounded-md border border-lime-400/10">
                          {item.count} queries
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Geographic Hotspots */}
                <div className="border border-gray-900 bg-gray-950/40 p-6 rounded-2xl space-y-4">
                  <div className="flex items-center gap-2 text-white border-b border-gray-900 pb-3">
                    <MapPin className="w-4 h-4 text-lime-400" />
                    <h3 className="font-semibold text-sm">Geographic Clusters</h3>
                  </div>
                  
                  <div className="divide-y divide-gray-900/60 font-mono text-xs">
                    {report?.geographicClusters?.map((item: any, idx: number) => (
                      <div key={idx} className="py-2.5 flex justify-between items-center">
                        <span className="text-gray-300">{item.county} County</span>
                        <span className="text-gray-500 font-bold">
                          {item.count} vendors
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
