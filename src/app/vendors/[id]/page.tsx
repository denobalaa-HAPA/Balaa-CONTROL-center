"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGuard from "../../../components/auth-guard";
import { fetchVendor, updateVendor } from "../../../lib/api-client";
import { ArrowLeft, Save, RefreshCw, AlertCircle, ShieldCheck, Megaphone, Paintbrush } from "lucide-react";
import Link from "next/link";

export default function VendorDetailCockpit() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [vendor, setVendor] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorText, setErrorText] = useState("");

  // Form states
  const [active, setActive] = useState(false);
  const [showAds, setShowAds] = useState(false);
  const [adSource, setAdSource] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [phone, setPhone] = useState("");

  const loadVendorDetails = async () => {
    setLoading(true);
    setErrorText("");
    try {
      const data = await fetchVendor(id);
      if (data) {
        setVendor(data);
        setActive(data.active);
        setShowAds(data.show_ads);
        setAdSource(data.ad_source || "");
        setBusinessName(data.business_name || "");
        setBusinessType(data.business_type || "");
        setPhone(data.phone || "");
      } else {
        setErrorText("Unable to resolve vendor configurations.");
      }
    } catch {
      setErrorText("Database fetch failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) loadVendorDetails();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updates = {
        active,
        show_ads: showAds,
        ad_source: adSource,
        business_name: businessName,
        business_type: businessType,
        phone
      };

      const res = await updateVendor(id, updates);
      if (res) {
        alert("Configuration updated successfully!");
        router.push("/vendors");
      } else {
        alert("Failed to write configurations to database.");
      }
    } catch {
      alert("Error contacting API gateway.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col font-sans">
        {/* Header */}
        <header className="border-b border-gray-900 px-8 py-5 bg-gray-950/60 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/vendors" className="p-2 border border-gray-800 rounded-lg bg-gray-900 text-gray-400 hover:text-white hover:border-gray-700 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">
                {loading ? "Resolving Configs..." : `Edit: ${vendor?.business_name}`}
              </h1>
              <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mt-0.5">Single Vendor Cockpit</p>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 bg-lime-400 hover:bg-lime-500 text-gray-950 px-4 py-2 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Cockpit Configurations</span>
          </button>
        </header>

        {/* Content */}
        <main className="flex-grow max-w-4xl w-full mx-auto px-8 py-8">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-3">
              <RefreshCw className="w-6 h-6 text-lime-400 animate-spin" />
              <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Querying config nodes...</span>
            </div>
          ) : errorText ? (
            <div className="border border-red-900/30 bg-red-950/10 p-6 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{errorText}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Card */}
              <div className="border border-gray-900 bg-gray-900/10 p-6 rounded-2xl space-y-4">
                <h2 className="text-sm font-mono uppercase text-gray-500 tracking-wider">Business Identity Profile</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-mono">Business Name</label>
                    <input
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-lime-400 text-white"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-gray-400 font-mono">WhatsApp Phone Contact</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-lime-400 text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* License State */}
              <div className="border border-gray-900 bg-gray-900/10 p-6 rounded-2xl flex items-start justify-between">
                <div className="space-y-1.5 max-w-md">
                  <div className="flex items-center gap-2 text-white">
                    <ShieldCheck className="w-5 h-5 text-lime-400" />
                    <h3 className="font-semibold text-sm">Licensing Status</h3>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Soft-suspends the vendor storefront immediately if set to inactive. Restricts client requests but preserves catalog configurations.
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setActive(!active)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    active ? "bg-lime-400" : "bg-gray-800"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-gray-950 shadow ring-0 transition duration-200 ease-in-out ${
                      active ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Theme Settings */}
              <div className="border border-gray-900 bg-gray-900/10 p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 text-white">
                  <Paintbrush className="w-5 h-5 text-lime-400" />
                  <h3 className="font-semibold text-sm">Theme Design Preset</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {["thrift", "grocery", "hardware", "restaurant", "salon"].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBusinessType(type)}
                      className={`py-3 px-4 rounded-xl border text-center font-mono text-xs uppercase font-bold tracking-wider cursor-pointer ${
                        businessType === type
                          ? "bg-lime-400/10 border-lime-400 text-lime-400"
                          : "bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sponsor Settings */}
              <div className="border border-gray-900 bg-gray-900/10 p-6 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5 max-w-md">
                    <div className="flex items-center gap-2 text-white">
                      <Megaphone className="w-5 h-5 text-lime-400" />
                      <h3 className="font-semibold text-sm">Advertising Sponsors</h3>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Inject dynamic sponsor frames (AdSense, Monetag scripts, popunders) inside vendor storefront layout slots.
                    </p>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setShowAds(!showAds)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      showAds ? "bg-lime-400" : "bg-gray-800"
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-gray-950 shadow ring-0 transition duration-200 ease-in-out ${
                        showAds ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {showAds && (
                  <div className="space-y-2 mt-4">
                    <label className="text-xs text-gray-400 font-mono">Dynamic Ad Injection Script Payload</label>
                    <textarea
                      value={adSource}
                      onChange={(e) => setAdSource(e.target.value)}
                      placeholder="Paste <script> or HTML blocks from Google AdSense or Monetag..."
                      rows={5}
                      className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-lime-400"
                    />
                  </div>
                )}
              </div>
            </form>
          )}
        </main>
      </div>
    </AuthGuard>
  );
}
