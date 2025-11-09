import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.json({
      status: "ok",
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

export default router;
