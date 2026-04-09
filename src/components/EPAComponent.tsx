import { useState } from "react";
import { AlertTriangle, CheckCircle, Loader2, ShieldAlert } from "lucide-react";
import { ComplianceResult } from "../types";
import { cn } from "../lib/utils";

interface EPAComponentProps {
  chemicals: string[];
}

export default function EPAComponent({ chemicals }: EPAComponentProps) {
  const [chemical, setChemical] = useState("");
  const [emissionValue, setEmissionValue] = useState<number | "">("");
  const [result, setResult] = useState<ComplianceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (!chemical || emissionValue === "") return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/check/epa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chemical, emissionValue }),
      });
      if (!response.ok) throw new Error("Failed to check compliance");
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ShieldAlert className="text-yellow-400" />
          EPA Emission Compliance Checker
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2 tracking-wider">
              Chemical Substance
            </label>
            <select
              value={chemical}
              onChange={(e) => setChemical(e.target.value)}
              className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select Chemical</option>
              {chemicals.map((c) => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-2 tracking-wider">
              Annual Emission (tons/year)
            </label>
            <input
              type="number"
              value={emissionValue}
              onChange={(e) => setEmissionValue(Number(e.target.value))}
              placeholder="Enter value"
              className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>

        <button
          onClick={handleCheck}
          disabled={loading || !chemical || emissionValue === ""}
          className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-zinc-900 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 uppercase tracking-widest"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Check EPA Compliance"}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded-lg text-sm">
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className={cn(
          "p-6 rounded-xl border animate-in fade-in slide-in-from-bottom-4 duration-500",
          result.isViolation 
            ? "bg-red-950/30 border-red-900/50" 
            : "bg-green-950/30 border-green-900/50"
        )}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className={cn(
                "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2",
                result.isViolation ? "bg-red-900 text-red-100" : "bg-green-900 text-green-100"
              )}>
                {result.isViolation ? <AlertTriangle size={14} /> : <CheckCircle size={14} />}
                {result.isViolation ? "Violation Detected" : "Compliant"}
              </div>
              <h3 className="text-2xl font-bold text-white">
                {result.chemical.charAt(0).toUpperCase() + result.chemical.slice(1)} Analysis
              </h3>
            </div>
            <div className="text-right">
              <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Regulation</p>
              <p className="text-white font-mono">{result.citation}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
              <p className="text-zinc-500 text-xs uppercase font-bold">Reported</p>
              <p className="text-xl font-mono text-white">{result.emissionValue} t/y</p>
            </div>
            <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
              <p className="text-zinc-500 text-xs uppercase font-bold">Limit</p>
              <p className="text-xl font-mono text-white">{result.limit} t/y</p>
            </div>
            <div className="bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
              <p className="text-zinc-500 text-xs uppercase font-bold">Variance</p>
              <p className={cn(
                "text-xl font-mono",
                result.isViolation ? "text-red-400" : "text-green-400"
              )}>
                {((result.emissionValue || 0) - result.limit).toFixed(2)} t/y
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-1">AI Regulatory Analysis</h4>
              <div className="text-zinc-300 text-sm leading-relaxed bg-zinc-900/80 p-4 rounded-lg border border-zinc-800 whitespace-pre-wrap">
                {result.explanation}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-1">Recommended Action</h4>
              <div className={cn(
                "text-sm font-medium p-4 rounded-lg border",
                result.isViolation ? "bg-red-900/20 border-red-900/30 text-red-200" : "bg-green-900/20 border-green-900/30 text-green-200"
              )}>
                {result.recommendedAction}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
