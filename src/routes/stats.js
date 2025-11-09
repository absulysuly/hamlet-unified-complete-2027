import express from "express";
import fs from "fs";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const filePath = "./backend/data/candidates_cache.json";
    const cache = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, "utf-8"))
      : [];
    res.json({
      status: "ok",
      totalCandidates: cache.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

export default router;
