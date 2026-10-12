const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const HOST = "127.0.0.1";
const PORT = 3000;

// Safety: bind only to loopback. Do not expose this training app to a LAN or the internet.
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

const db = new sqlite3.Database(path.join(__dirname, "lab.sqlite"));
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    body TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
});

app.get("/", (req, res) => res.render("index"));

/*
 * INTENTIONALLY VULNERABLE TRAINING ROUTE:
 * The query parameter is rendered as unescaped HTML in reflected.ejs.
 * Use harmless proof-of-execution payloads only, such as an alert().
 */
app.get("/reflected", (req, res) => {
  const q = typeof req.query.q === "string" ? req.query.q : "";
  res.render("reflected", { q });
});

/*
 * INTENTIONALLY VULNERABLE TRAINING ROUTE:
 * User-submitted comments are stored in SQLite and later inserted as raw HTML.
 */
app.get("/stored", (req, res) => {
  db.all("SELECT id, body, created_at FROM comments ORDER BY id DESC", [], (err, rows) => {
    if (err) return res.status(500).send("Database error");
    res.render("stored", { comments: rows });
  });
});

app.post("/stored", (req, res) => {
  const body = typeof req.body.body === "string" ? req.body.body.slice(0, 2000) : "";
  if (!body.trim()) return res.redirect("/stored");
  db.run("INSERT INTO comments (body) VALUES (?)", [body], (err) => {
    if (err) return res.status(500).send("Database error");
    res.redirect("/stored");
  });
});

app.post("/reset", (req, res) => {
  db.run("DELETE FROM comments", [], (err) => {
    if (err) return res.status(500).send("Database error");
    res.redirect("/stored");
  });
});

app.get("/dom", (req, res) => res.render("dom"));

app.get("/health", (_req, res) => res.json({ status: "ok", localOnly: true }));

app.listen(PORT, HOST, () => {
  console.log(`XSS training lab running at http://${HOST}:${PORT}`);
  console.log("Local-only: do not change HOST to 0.0.0.0 or expose this port publicly.");
});

process.on("SIGINT", () => db.close(() => process.exit(0)));
