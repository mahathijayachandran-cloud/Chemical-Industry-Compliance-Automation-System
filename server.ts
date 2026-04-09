import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// Industry Data
const industries = [
  { id: "petrochemical", name: "Petrochemicals", chemicals: ["benzene", "toluene", "xylene", "ethylene oxide", "vinyl chloride"] },
  { id: "agrochemical", name: "Agrochemicals", chemicals: ["ammonia", "formaldehyde", "chlorine", "methylene chloride"] },
  { id: "pharma", name: "Pharmaceuticals", chemicals: ["methylene chloride", "formaldehyde", "ethylene oxide"] },
  { id: "specialty", name: "Specialty Chemicals", chemicals: ["perchloroethylene", "vinyl chloride", "benzene"] },
  { id: "industrial_gases", name: "Industrial Gases", chemicals: ["ammonia", "chlorine", "ethylene oxide"] }
];

// EPA Limits (tons/year)
const epaLimits: Record<string, number> = {
  benzene: 10,
  toluene: 20,
  xylene: 50,
  formaldehyde: 5,
  ammonia: 100,
  chlorine: 2,
  "ethylene oxide": 1,
  "methylene chloride": 15,
  perchloroethylene: 12,
  "vinyl chloride": 5
};

// OSHA PELs (ppm)
const oshaLimits: Record<string, number> = {
  benzene: 1,
  toluene: 200,
  xylene: 100,
  formaldehyde: 0.75,
  ammonia: 50,
  chlorine: 1,
  "ethylene oxide": 1,
  "methylene chloride": 25,
  perchloroethylene: 25,
  "vinyl chloride": 1
};

// Real Enforcement Data (Mocked but based on real patterns)
const penalties = [
  { id: 1, facility: "Gulf Coast Refining", chemical: "Benzene", amount: 125000, date: "2024-01-15", violation: "Excessive fugitive emissions", status: "Paid" },
  { id: 2, facility: "Midwest Ag-Chem", chemical: "Ammonia", amount: 85000, date: "2023-11-20", violation: "Failure to report leak", status: "Appealed" },
  { id: 3, facility: "PharmaSource Labs", chemical: "Methylene Chloride", amount: 45000, date: "2024-02-02", violation: "Inadequate ventilation monitoring", status: "Pending" },
  { id: 4, facility: "Specialty Polymers Inc", chemical: "Vinyl Chloride", amount: 210000, date: "2023-09-12", violation: "Chronic exposure limit breach", status: "Paid" },
  { id: 5, facility: "Industrial Gas Co", chemical: "Chlorine", amount: 62000, date: "2024-03-10", violation: "Improper storage containment", status: "Paid" }
];

// API Routes
app.get("/api/industries", (req, res) => {
  res.json(industries);
});

app.post("/api/check/epa", async (req, res) => {
  const { chemical, emissionValue } = req.body;
  const limit = epaLimits[chemical.toLowerCase()];
  
  if (limit === undefined) {
    return res.status(400).json({ error: "Chemical not found in EPA database" });
  }

  const isViolation = emissionValue > limit;
  
  try {
    const prompt = `
      As a regulatory compliance expert, analyze this EPA emission report:
      Chemical: ${chemical}
      Emission Value: ${emissionValue} tons/year
      EPA Limit: ${limit} tons/year
      Status: ${isViolation ? "VIOLATION" : "COMPLIANT"}
      
      Provide a human-readable explanation citing 40 CFR Part 61. 
      If it's a violation, explain the risks and recommended immediate actions.
      Keep it professional and technical.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    res.json({
      chemical,
      emissionValue,
      limit,
      isViolation,
      citation: "40 CFR Part 61",
      explanation: response.text,
      recommendedAction: isViolation ? "Immediate shutdown of affected process line and notification to EPA regional office." : "Continue regular monitoring and maintenance."
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate AI explanation" });
  }
});

app.post("/api/check/osha", async (req, res) => {
  const { chemical, exposureValue } = req.body;
  const limit = oshaLimits[chemical.toLowerCase()];

  if (limit === undefined) {
    return res.status(400).json({ error: "Chemical not found in OSHA database" });
  }

  const isViolation = exposureValue > limit;

  try {
    const prompt = `
      As an industrial hygienist, analyze this OSHA exposure report:
      Chemical: ${chemical}
      Exposure Value: ${exposureValue} ppm
      OSHA PEL (Permissible Exposure Limit): ${limit} ppm
      Status: ${isViolation ? "VIOLATION" : "COMPLIANT"}
      
      Provide a human-readable explanation citing 29 CFR 1910.1000.
      If it's a violation, explain health risks and required PPE or engineering controls.
      Keep it professional and technical.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    res.json({
      chemical,
      exposureValue,
      limit,
      isViolation,
      citation: "29 CFR 1910.1000",
      explanation: response.text,
      recommendedAction: isViolation ? "Evacuate area, implement respiratory protection, and audit ventilation systems." : "Maintain current safety protocols."
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "Failed to generate AI explanation" });
  }
});

app.get("/api/penalties", (req, res) => {
  res.json(penalties);
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
