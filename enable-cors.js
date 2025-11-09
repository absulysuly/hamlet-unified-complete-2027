import fs from "fs";
import path from "path";

const targetFile = path.resolve("index.js");
let content = fs.readFileSync(targetFile, "utf8");

if (!content.includes("import cors")) {
  content = content.replace(
    /import express[^;]+;/,
    `import express from "express";
import cors from "cors";`
  );
}

if (!content.includes("app.use(cors")) {
  content = content.replace(
    /const app = express\(\);/,
    `const app = express();

app.use(cors({
  origin: [
    "https://https-github-com-absulysuly-letsdoi.vercel.app",
    "https://hamlet-unified-complete-2027-production.up.railway.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));`
  );
}

fs.writeFileSync(targetFile, content);
console.log("✅ CORS enabled successfully!");
