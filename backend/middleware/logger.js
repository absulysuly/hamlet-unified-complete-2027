export default function logger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const color =
      res.statusCode < 300
        ? "\x1b[32m" // green
        : res.statusCode < 400
        ? "\x1b[33m" // yellow
        : "\x1b[31m"; // red
    console.log(
      `${color}${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)\x1b[0m`
    );
  });
  next();
}
