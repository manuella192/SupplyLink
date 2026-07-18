const router = require("express").Router();
const db     = require("../config/db");
const { verifyToken }  = require("../middleware/auth");
const { requireRole }  = require("../middleware/roles");

router.get("/stats", verifyToken, requireRole("admin"), async (_req, res) => {
  const [[users]]    = await db.query(`SELECT COUNT(*) AS total FROM users`);
  const [[usersWeek]]= await db.query(
    `SELECT COUNT(*) AS total FROM users WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)`
  );

  const [[cmds]]     = await db.query(`SELECT COUNT(*) AS total FROM commandes`);
  const [[cmdsToday]]= await db.query(
    `SELECT COUNT(*) AS total FROM commandes WHERE DATE(created_at) = CURDATE()`
  );

  const CA_COND = `(mode_paiement = 'stripe' AND statut NOT LIKE 'retourn%') OR (mode_paiement = 'cash' AND statut = 'livre')`;

  const [[ca]]       = await db.query(
    `SELECT COALESCE(SUM(total), 0) AS total FROM commandes WHERE ${CA_COND}`
  );
  const [[caMois]]   = await db.query(
    `SELECT COALESCE(SUM(total), 0) AS total FROM commandes
     WHERE (${CA_COND}) AND MONTH(created_at) = MONTH(CURDATE()) AND YEAR(created_at) = YEAR(CURDATE())`
  );
  const [[caMoisPrev]]= await db.query(
    `SELECT COALESCE(SUM(total), 0) AS total FROM commandes
     WHERE (${CA_COND})
       AND MONTH(created_at) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
       AND YEAR(created_at)  = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))`
  );

  const [[litiges]]  = await db.query(
    `SELECT COUNT(*) AS total FROM litiges WHERE statut NOT LIKE 'rejet%' AND statut NOT LIKE '%solu'`
  );
  const [[litigesUrgents]] = await db.query(
    `SELECT COUNT(*) AS total FROM litiges
     WHERE statut = 'ouvert' AND created_at <= DATE_SUB(NOW(), INTERVAL 3 DAY)`
  );

  const [[retournesRow]] = await db.query(
    `SELECT COUNT(*) AS total FROM commandes WHERE statut LIKE 'retourn%'`
  );

  const [statuts]    = await db.query(
    `SELECT statut, COUNT(*) AS cnt FROM commandes GROUP BY statut`
  );
  const totalCmds    = statuts.reduce((s, r) => s + r.cnt, 0) || 1;
  const repartition  = statuts.map((r) => ({
    statut: r.statut,
    cnt:    r.cnt,
    pct:    Math.round((r.cnt / totalCmds) * 100),
  }));

  const [weekly]     = await db.query(
    `SELECT
       DATE_FORMAT(d.dt, '%a')        AS day,
       COALESCE(SUM(c.total), 0)      AS val
     FROM (
       SELECT CURDATE() - INTERVAL 6 DAY AS dt UNION ALL
       SELECT CURDATE() - INTERVAL 5 DAY UNION ALL
       SELECT CURDATE() - INTERVAL 4 DAY UNION ALL
       SELECT CURDATE() - INTERVAL 3 DAY UNION ALL
       SELECT CURDATE() - INTERVAL 2 DAY UNION ALL
       SELECT CURDATE() - INTERVAL 1 DAY UNION ALL
       SELECT CURDATE()
     ) d
     LEFT JOIN commandes c ON DATE(c.created_at) = d.dt
       AND (
         (c.mode_paiement = 'stripe' AND c.statut NOT LIKE 'retourn%')
         OR
         (c.mode_paiement = 'cash'   AND c.statut = 'livre')
       )
     GROUP BY d.dt
     ORDER BY d.dt ASC`
  );

  const [recentCmds] = await db.query(
    `SELECT c.id, c.ref, c.prenom_livr, c.nom_livr, c.total, c.statut, c.created_at
     FROM commandes c
     ORDER BY c.created_at DESC
     LIMIT 5`
  );

  const caEvol = caMoisPrev.total > 0
    ? Math.round(((caMois.total - caMoisPrev.total) / caMoisPrev.total) * 100)
    : null;

  res.json({
    users:      { total: users.total,   deltaWeek: usersWeek.total },
    commandes:  { total: cmds.total,    deltaToday: cmdsToday.total },
    ca:         { total: parseFloat(ca.total), mois: parseFloat(caMois.total), evolPct: caEvol },
    litiges:    { ouverts: litiges.total, urgents: litigesUrgents.total },
    retournes:  retournesRow.total,
    repartition,
    weekly,
    recentCmds,
  });
});

module.exports = router;
