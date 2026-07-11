require("dotenv").config({ path: require("path").join(__dirname, "../.env") });
const fs   = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

(async () => {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST     || "localhost",
    port:     process.env.DB_PORT     || 3306,
    user:     process.env.DB_USER     || "root",
    password: process.env.DB_PASSWORD || "",
    multipleStatements: true,
  });

  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await conn.query(sql);
  console.log("✔  Base de données initialisée");
  await conn.end();
})().catch((e) => { console.error("✘", e.message); process.exit(1); });
