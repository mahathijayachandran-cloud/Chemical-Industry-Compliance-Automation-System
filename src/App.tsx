import { useState, useEffect } from "react";
import Header from "./components/Header";
import IndustrySelector from "./components/IndustrySelector";
import EPAComponent from "./components/EPAComponent";
import OSHAComponent from "./components/OSHAComponent";
import PenaltiesDashboard from "./components/PenaltiesDashboard";
import { Industry, Penalty } from "./types";
import { cn } from "./lib/utils";
import { LayoutDashboard, ShieldCheck, UserCheck, History, Loader2 } from "lucide-react";

export default function App() {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [selectedIndustryId, setSelectedIndustryId] = useState("");
  const [activeTab, setActiveTab] = useState<"epa" | "osha" | "penalties">("epa");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [indRes, penRes] = await Promise.all([
          fetch("/api/industries"),
          fetch("/api/penalties")
        ]);
        const indData = await indRes.json();
        const penData = await penRes.json();
        setIndustries(indData);
        setPenalties(penData);
        if (indData.length > 0) setSelectedIndustryId(indData[0].id);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const selectedIndustry = industries.find(i => i.id === selectedIndustryId);
  const chemicals = selectedIndustry ? selectedIndustry.chemicals : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="text-yellow-400 animate-spin w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-yellow-400 selection:text-zinc-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <IndustrySelector 
              industries={industries} 
              selectedIndustryId={selectedIndustryId} 
              onSelect={setSelectedIndustryId} 
            />

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab("epa")}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all",
                  activeTab === "epa" ? "bg-yellow-400 text-zinc-900 shadow-lg shadow-yellow-400/20" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                )}
              >
                <ShieldCheck size={18} />
                EPA Compliance
              </button>
              <button
                onClick={() => setActiveTab("osha")}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all",
                  activeTab === "osha" ? "bg-yellow-400 text-zinc-900 shadow-lg shadow-yellow-400/20" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                )}
              >
                <UserCheck size={18} />
                OSHA Standards
              </button>
              <button
                onClick={() => setActiveTab("penalties")}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all",
                  activeTab === "penalties" ? "bg-yellow-400 text-zinc-900 shadow-lg shadow-yellow-400/20" : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                )}
              >
                <History size={18} />
                Penalty History
              </button>
            </nav>

            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
              <h4 className="text-xs font-bold text-zinc-500 uppercase mb-3 tracking-widest">System Status</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Database Connection</span>
                  <span className="text-green-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Gemini AI Engine</span>
                  <span className="text-green-400 flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400">Last Audit</span>
                  <span className="text-zinc-500 font-mono">09 APR 2026</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {activeTab === "epa" && <EPAComponent chemicals={chemicals} />}
            {activeTab === "osha" && <OSHAComponent chemicals={chemicals} />}
            {activeTab === "penalties" && <PenaltiesDashboard penalties={penalties} />}
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-900 bg-zinc-950 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-zinc-500 text-xs uppercase tracking-widest font-bold">
          <div>
            <p className="mb-2 text-zinc-400">EPA Reference</p>
            <p className="font-normal normal-case text-zinc-600">40 CFR Part 61 - National Emission Standards for Hazardous Air Pollutants.</p>
          </div>
          <div>
            <p className="mb-2 text-zinc-400">OSHA Reference</p>
            <p className="font-normal normal-case text-zinc-600">29 CFR 1910.1000 - Air Contaminants, Table Z-1 Limits for Air Contaminants.</p>
          </div>
          <div>
            <p className="mb-2 text-zinc-400">System Version</p>
            <p className="font-normal normal-case text-zinc-600">v2.4.0-Industrial. Built with Google Gemini AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
