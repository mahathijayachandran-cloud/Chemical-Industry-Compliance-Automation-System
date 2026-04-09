import { Penalty } from "../types";
import { TrendingDown, DollarSign, AlertCircle } from "lucide-react";

interface PenaltiesDashboardProps {
  penalties: Penalty[];
}

export default function PenaltiesDashboard({ penalties }: PenaltiesDashboardProps) {
  const totalPenalties = penalties.reduce((sum, p) => sum + p.amount, 0);
  const avgPenalty = totalPenalties / penalties.length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex items-center gap-4">
          <div className="bg-red-900/20 p-3 rounded-lg">
            <DollarSign className="text-red-400 w-8 h-8" />
          </div>
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Total Enforcement Penalties</p>
            <p className="text-3xl font-mono text-white">${totalPenalties.toLocaleString()}</p>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex items-center gap-4">
          <div className="bg-yellow-900/20 p-3 rounded-lg">
            <TrendingDown className="text-yellow-400 w-8 h-8" />
          </div>
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest">Average Penalty Amount</p>
            <p className="text-3xl font-mono text-white">${avgPenalty.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertCircle className="text-red-400" />
            Recent Enforcement Actions
          </h2>
          <span className="text-xs font-mono text-zinc-500 uppercase">FY 2023-2024 Database</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-800/50 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                <th className="px-6 py-4">Facility</th>
                <th className="px-6 py-4">Chemical</th>
                <th className="px-6 py-4">Violation</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {penalties.map((penalty) => (
                <tr key={penalty.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{penalty.facility}</td>
                  <td className="px-6 py-4 text-zinc-400">{penalty.chemical}</td>
                  <td className="px-6 py-4 text-zinc-400 text-sm">{penalty.violation}</td>
                  <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{penalty.date}</td>
                  <td className="px-6 py-4 text-right font-mono text-red-400 font-bold">${penalty.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-tighter ${
                      penalty.status === 'Paid' ? 'bg-green-900/30 text-green-400' : 
                      penalty.status === 'Appealed' ? 'bg-yellow-900/30 text-yellow-400' : 
                      'bg-zinc-800 text-zinc-400'
                    }`}>
                      {penalty.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-red-950/20 border border-red-900/30 p-4 rounded-lg">
        <p className="text-red-200 text-xs leading-relaxed italic">
          <strong>Note:</strong> Non-compliance can lead to significant financial penalties, criminal charges, and immediate facility closure. This dashboard provides real-time monitoring to mitigate these risks.
        </p>
      </div>
    </div>
  );
}
