import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

type CandidateRecord = Record<string, unknown>;

const app = express();
app.use(
  cors({
    origin: [
      "https://digitaldemocracy-iraq.vercel.app",
      "https://https-github-com-absulysuly-letsdoittonight.vercel.app",
      "https-github-com-absulysuly-letsdoi.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

const DATA_DIR = path.join(process.cwd(), "data");

function loadCSVFiles(): CandidateRecord[] {
  if (!fs.existsSync(DATA_DIR)) {
    console.warn(`⚠️ Data directory not found: ${DATA_DIR}`);
    return [];
  }

  const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".csv"));
  let allRows: CandidateRecord[] = [];

  for (const file of files) {
    const full = path.join(DATA_DIR, file);
    const content = fs.readFileSync(full, "utf-8");
    const records = parse(content, { columns: true, skip_empty_lines: true });
    allRows = allRows.concat(records as CandidateRecord[]);
  }

  return allRows;
}

const candidates = loadCSVFiles();

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/stats", (_req, res) => {
  res.json({ totalCandidates: candidates.length });
});

app.get("/api/candidates", (req, res) => {
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const page = parseInt(req.query.page as string, 10) || 1;
  const start = (page - 1) * limit;
  const data = candidates.slice(start, start + limit);

  res.json({ page, limit, total: candidates.length, data });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => console.log(`✅ CSV backend running on port ${PORT}`));
