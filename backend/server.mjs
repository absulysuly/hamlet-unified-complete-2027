import express from "express";
import logger from "./middleware/logger.js";
import healthRoutes from "./src/routes/health.js";
import statsRoutes from "./src/routes/stats.js";

const app = express();

app.use(express.json());
app.use(logger);

console.log("🩺 Mounting routes…");
app.use("/api/health", healthRoutes);
app.use("/api/stats", statsRoutes);
console.log("✅ Routes mounted: /api/health, /api/stats");

app.get("/debug", (req, res) => {
  res.json({ alive: true, timestamp: new Date().toISOString() });
});

app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Not Found",
    route: req.originalUrl,
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`🚀 Server ready on port ${port}`);
});
