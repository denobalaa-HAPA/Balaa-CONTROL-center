"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, ShieldCheck, ShieldAlert, Sparkles, MapPin, Eye, Lock } from "lucide-react";
import Link from "next/link";

interface Vendor {
  id: string;
  business_name: string;
  business_type: string;
  vendor_slug: string;
  county?: string;
  sub_county?: string;
  ward?: string;
  phone?: string;
  active: boolean;
  show_ads: boolean;
  subscription_status: string;
}

interface VendorTableProps {
  vendors: Vendor[];
  onToggleActive: (slug: string, currentStatus: boolean) => Promise<void>;
}

export default function VendorTable({ vendors, onToggleActive }: VendorTableProps) {
  const [togglingSlug, setTogglingSlug] = useState<string | null>(null);

  const handleToggle = async (slug: string, currentStatus: boolean) => {
    setTogglingSlug(slug);
    try {
      await onToggleActive(slug, currentStatus);
    } finally {
      setTogglingSlug(null);
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "thrift": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "grocery": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "hardware": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "salon": return "bg-pink-500/10 text-pink-400 border-pink-500/20";
      case "restaurant": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default: return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  return (
    <div className="overflow-x-auto w-full border border-gray-900 rounded-xl bg-gray-950/40 backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-900 bg-gray-950/80 font-mono text-[10px] text-gray-400 uppercase tracking-wider">
            <th className="px-6 py-4">Vendor Details</th>
            <th className="px-6 py-4">Location</th>
            <th className="px-6 py-4">Niche Template</th>
            <th className="px-6 py-4">License State</th>
            <th className="px-6 py-4">Sponsor Mode</th>
            <th className="px-6 py-4 text-right">Console Controls</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-900/60 text-sm">
          {vendors.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-10 text-center text-gray-500 font-mono text-xs">
                No active vendor records resolved in directory database.
              </td>
            </tr>
          ) : (
            vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-gray-900/10 transition-colors">
                {/* Details */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">{vendor.business_name}</span>
                    <span className="text-xs text-gray-500 font-mono mt-0.5">{vendor.phone || "No contact info"}</span>
                  </div>
                </td>
                
                {/* Location */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 text-gray-300">
                    <MapPin className="w-3.5 h-3.5 text-gray-500" />
                    <span>{vendor.sub_county || vendor.county || "Nairobi"}</span>
                  </div>
                </td>

                {/* Template */}
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 rounded-full border text-[10px] uppercase font-mono tracking-wider ${getBadgeColor(vendor.business_type)}`}>
                    {vendor.business_type}
                  </span>
                </td>

                {/* License State */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {vendor.active ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-red-400 font-medium">
                        <XCircle className="w-4 h-4 text-red-400" />
                        <span>Suspended</span>
                      </span>
                    )}
                  </div>
                </td>

                {/* Ads */}
                <td className="px-6 py-4">
                  <span className={`text-xs ${vendor.show_ads ? "text-amber-400" : "text-gray-500"}`}>
                    {vendor.show_ads ? "Injected Ads Active" : "No Sponsor Ads"}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {/* Toggle Active Button */}
                    <button
                      onClick={() => handleToggle(vendor.vendor_slug, vendor.active)}
                      disabled={togglingSlug === vendor.vendor_slug}
                      className={`inline-flex items-center justify-center p-1.5 rounded-lg border text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                        vendor.active
                          ? "border-red-900/30 bg-red-950/20 text-red-400 hover:bg-red-900/20"
                          : "border-emerald-900/30 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-900/20"
                      }`}
                    >
                      {vendor.active ? <ShieldAlert className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                    </button>

                    {/* View Details Link */}
                    <Link
                      href={`/vendors/${vendor.id}`}
                      className="inline-flex items-center justify-center p-1.5 rounded-lg border border-gray-800 bg-gray-900 hover:bg-gray-850 text-gray-400 hover:text-white transition-colors"
                      title="Vendor Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
