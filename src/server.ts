import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

interface CandidateRecord {
  [key: string]: string;
}

const app = express();
app.use(cors());
app.use(express.json());

const DATA_DIR = path.join(process.cwd(), "data");

function loadCSVFiles(): CandidateRecord[] {
  if (!fs.existsSync(DATA_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(DATA_DIR)
    .filter((file) => file.toLowerCase().endsWith(".csv"));

  const rows: CandidateRecord[] = [];

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const parsed = parse(content, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
      trim: true,
    }) as CandidateRecord[];

    rows.push(...parsed);
  }

  return rows;
}

const candidates = loadCSVFiles();

app.get("/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/stats", (_req: Request, res: Response) => {
  res.json({ totalCandidates: candidates.length });
});

app.get("/api/candidates", (req: Request, res: Response) => {
  const page = Number.parseInt((req.query.page as string) ?? "1", 10);
  const limit = Number.parseInt((req.query.limit as string) ?? "10", 10);

  const safePage = Number.isNaN(page) || page < 1 ? 1 : page;
  const safeLimit = Number.isNaN(limit) || limit < 1 ? 10 : limit;

  const start = (safePage - 1) * safeLimit;
  const data = candidates.slice(start, start + safeLimit);

  res.json({
    page: safePage,
    limit: safeLimit,
    total: candidates.length,
    data,
  });
});

const PORT = Number.parseInt(process.env.PORT ?? "4001", 10);

app.listen(PORT, () => {
  console.log(`✅ Express backend live on port ${PORT}`);
});

export { app };
