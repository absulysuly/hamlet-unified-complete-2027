export default function logger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const color =
      status < 300 ? "\x1b[32m" : status < 400 ? "\x1b[33m" : "\x1b[31m";
    console.log(
      `${color}${req.method} ${req.originalUrl} → ${status} (${duration}ms)\x1b[0m`
    );
  });
  next();
}
