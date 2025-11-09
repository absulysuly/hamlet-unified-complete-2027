import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  const memoryUsage = process.memoryUsage();

  res.json({
    status: "ok",
    uptime: process.uptime(),
    memory: memoryUsage,
    timestamp: new Date().toISOString(),
  });
});

router.use((req, res) => {
  if (!res.headersSent) {
    res.json({
      status: "ok",
      message: "default response",
      route: req.originalUrl,
    });
  }
});

export default router;
