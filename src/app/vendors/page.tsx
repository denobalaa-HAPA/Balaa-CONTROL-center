"use client";

import React, { useState, useEffect } from "react";
import AuthGuard from "../../components/auth-guard";
import VendorTable from "../../components/vendor-table";
import { fetchVendors, toggleVendorActive } from "../../lib/api-client";
import { RefreshCw, ArrowLeft, Plus, Server, User, ListFilter } from "lucide-react";
import Link from "next/link";

export default function VendorsAdminPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");
  const [filterType, setFilterType] = useState("All");

  const loadData = async () => {
    setLoading(true);
    setErrorText("");
    try {
      const data = await fetchVendors();
      if (data) {
        setVendors(data);
      } else {
        setErrorText("API connection timed out. Verify your API local server is running.");
      }
    } catch {
      setErrorText("Could not resolve vendor list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleActive = async (slug: string, currentStatus: boolean) => {
    try {
      const res = await toggleVendorActive(slug, !currentStatus);
      if (res && res.status === "updated") {
        // Optimistically update list state
        setVendors(prev =>
          prev.map(v => (v.vendor_slug === slug ? { ...v, active: !currentStatus } : v))
        );
      } else {
        alert("Failed to toggle license active status.");
      }
    } catch (err) {
      alert("Error contacting API gateway.");
    }
  };

  const filteredVendors = vendors.filter(v => 
    filterType === "All" || v.business_type?.toLowerCase() === filterType.toLowerCase()
  );

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
              <h1 className="text-xl font-black text-white tracking-tight">Vendor Management</h1>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">Control Center Cockpit</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={loadData}
              className="p-2.5 border border-gray-800 rounded-xl bg-gray-900 text-gray-400 hover:text-white hover:border-gray-700 transition-all cursor-pointer"
              title="Refresh Directory"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-grow max-w-7xl w-full mx-auto px-8 py-8 space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-gray-950/30 border border-gray-900 p-4 rounded-xl">
            <div className="flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-400 font-mono uppercase tracking-wider">Filter Template:</span>
              <div className="flex gap-1">
                {["All", "thrift", "grocery", "restaurant", "salon", "hardware"].map(type => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                      filterType === type
                        ? "bg-lime-400 text-gray-950 font-bold"
                        : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[11px] font-mono text-gray-500">
              Total resolved records: <span className="text-lime-400 font-bold">{filteredVendors.length}</span>
            </div>
          </div>

          {/* Table Area */}
          {loading ? (
            <div className="h-64 border border-gray-900 rounded-xl flex flex-col items-center justify-center space-y-3 bg-gray-950/10">
              <RefreshCw className="w-6 h-6 text-lime-400 animate-spin" />
              <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Querying API nodes...</span>
            </div>
          ) : errorText ? (
            <div className="h-64 border border-gray-900 rounded-xl flex flex-col items-center justify-center p-6 bg-gray-950/10 text-center">
              <p className="text-red-400 font-mono text-xs mb-3">{errorText}</p>
              <button
                onClick={loadData}
                className="bg-gray-900 border border-gray-800 hover:border-gray-700 text-xs px-4 py-2 rounded-xl text-gray-300 hover:text-white font-mono uppercase tracking-wider cursor-pointer"
              >
                Retry Request
              </button>
            </div>
          ) : (
            <VendorTable vendors={filteredVendors} onToggleActive={handleToggleActive} />
          )}
        </main>
      </div>
    </AuthGuard>
  );
}