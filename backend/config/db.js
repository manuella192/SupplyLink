const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host:               process.env.DB_HOST     || "localhost",
  port:               parseInt(process.env.DB_PORT || "3306"),
  user:               process.env.DB_USER     || "root",
  password:           process.env.DB_PASSWORD || "",
  database:           process.env.DB_NAME     || "supplylink",
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  charset:            "utf8mb4",
  timezone:           "+01:00",
});

pool.getConnection()
  .then((conn) => { conn.release(); console.log("✔  MySQL connecté"); })
  .catch((err) => { console.error("✘  MySQL erreur:", err.message); process.exit(1); });

module.exports = pool;
