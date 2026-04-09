import { Industry } from "../types";

interface IndustrySelectorProps {
  industries: Industry[];
  selectedIndustryId: string;
  onSelect: (id: string) => void;
}

export default function IndustrySelector({ industries, selectedIndustryId, onSelect }: IndustrySelectorProps) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl mb-6">
      <label className="block text-xs font-bold text-zinc-500 uppercase mb-2 tracking-wider">
        Select Industry Sector
      </label>
      <select
        value={selectedIndustryId}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full bg-zinc-800 text-white border border-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all font-medium"
      >
        <option value="" disabled>Choose an industry...</option>
        {industries.map((industry) => (
          <option key={industry.id} value={industry.id}>
            {industry.name}
          </option>
        ))}
      </select>
    </div>
  );
}
