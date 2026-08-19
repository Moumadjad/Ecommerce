import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, "dist");

const app = express();

app.use(express.static(distDir));

// React Router uses client-side routing, so any non-file route must fall
// back to index.html or a direct visit/refresh on e.g. /admin/products 404s.
app.get("*", (req, res) => {
  res.sendFile(path.join(distDir, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Frontend static server running on port ${PORT}`));
