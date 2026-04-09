import { Factory } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-zinc-900 border-b border-zinc-800 p-6 mb-8">
      <div className="max-w-7xl mx-auto flex items-center gap-4">
        <div className="bg-yellow-400 p-3 rounded-lg">
          <Factory className="text-zinc-900 w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight uppercase">
            Chemical Industry Compliance Automation System
          </h1>
          <p className="text-zinc-400 text-sm font-mono uppercase tracking-widest">
            Industry-Specific EPA & OSHA Compliance Monitoring
          </p>
        </div>
      </div>
    </header>
  );
}
