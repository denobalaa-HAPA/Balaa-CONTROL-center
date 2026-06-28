"use client";

import React, { useState, useEffect } from "react";
import { Lock, RefreshCw } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [errorText, setErrorText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authState = sessionStorage.getItem("balaa-admin-auth");
    if (authState === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    // Simple gatekeeping password (can be customized or integrated with authentication endpoints)
    if (password === "balaa2026") {
      sessionStorage.setItem("balaa-admin-auth", "true");
      setIsAuthenticated(true);
    } else {
      setErrorText("Incorrect admin credential passcode.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-lime-400 animate-spin" />
        <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">Verifying session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <div className="w-full max-w-sm border border-gray-900 bg-gray-900/40 p-8 rounded-2xl shadow-xl flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-lime-400/10 border border-lime-400/20 flex items-center justify-center mb-4">
            <Lock className="w-5 h-5 text-lime-400" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white mb-2">Balaa Control Center</h1>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Enter admin passcode to authenticate your terminal.
          </p>

          <form onSubmit={handleLogin} className="w-full space-y-4">
            <input
              type="password"
              placeholder="Admin Passcode"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-400 text-center"
              required
            />
            {errorText && <p className="text-red-400 text-[11px] font-mono">{errorText}</p>}
            <button
              type="submit"
              className="w-full bg-lime-400 hover:bg-lime-500 text-gray-950 font-semibold py-2.5 rounded-xl text-sm transition-colors cursor-pointer"
            >
              Unlock Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
