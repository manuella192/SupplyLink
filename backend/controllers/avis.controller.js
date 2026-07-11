const db = require("../config/db");

const create = async (req, res) => {
  const { commandeId, articleId, note, commentaire } = req.body;
  const clientId = req.user.id;

  // Vérifier que la commande est livrée et appartient au client
  const [cmdRows] = await db.query(
    "SELECT id FROM commandes WHERE id=? AND client_id=? AND statut='livre'",
    [commandeId, clientId]
  );
  if (!cmdRows.length) return res.status(403).json({ message: "Commande non éligible aux avis" });

  // Vérifier que l'article fait partie de la commande
  const [itemRows] = await db.query(
    "SELECT id FROM commande_items WHERE commande_id=? AND article_id=?",
    [commandeId, articleId]
  );
  if (!itemRows.length) return res.status(400).json({ message: "Article hors de cette commande" });

  await db.query(
    `INSERT INTO avis (article_id, commande_id, client_id, note, commentaire)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE note=VALUES(note), commentaire=VALUES(commentaire)`,
    [articleId, commandeId, clientId, note, commentaire || null]
  );

  // Recalculer note moyenne de l'article
  await db.query(
    `UPDATE articles SET
       note_moy = (SELECT AVG(note) FROM avis WHERE article_id=?),
       nb_avis  = (SELECT COUNT(*)  FROM avis WHERE article_id=?)
     WHERE id=?`,
    [articleId, articleId, articleId]
  );

  res.status(201).json({ message: "Avis enregistré" });
};

module.exports = { create };
