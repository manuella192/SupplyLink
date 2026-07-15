-- Migration : suivi des vues d'articles
-- À exécuter une seule fois dans phpMyAdmin ou MAMP

USE supplylink;

CREATE TABLE IF NOT EXISTS article_views (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  article_id INT UNSIGNED NOT NULL,
  viewed_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_article   (article_id),
  INDEX idx_viewed_at (viewed_at),
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE
) ENGINE=InnoDB;
