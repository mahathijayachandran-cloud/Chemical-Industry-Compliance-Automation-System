export interface Industry {
  id: string;
  name: string;
  chemicals: string[];
}

export interface ComplianceResult {
  chemical: string;
  emissionValue?: number;
  exposureValue?: number;
  limit: number;
  isViolation: boolean;
  citation: string;
  explanation: string;
  recommendedAction: string;
}

export interface Penalty {
  id: number;
  facility: string;
  chemical: string;
  amount: number;
  date: string;
  violation: string;
  status: string;
}
