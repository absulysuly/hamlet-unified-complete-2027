import express from "express";
import cors from "cors";
import healthRoutes from "./src/routes/health.js";
import statsRoutes from "./src/routes/stats.js";
import logger from "./backend/middleware/logger.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.get("/health", (req, res) =>
  res.json({ status: "ok", route: req.originalUrl, message: "responding" })
);
app.use("/api/health", healthRoutes);
app.use("/api/stats", statsRoutes);

app.use((req, res) => {
  res.status(404).json({ status: "error", message: "Not Found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running at :${PORT} | Env: ${process.env.NODE_ENV}`)
);
