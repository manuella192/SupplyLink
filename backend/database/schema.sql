-- ============================================================
-- SupplyLink — Schéma MySQL
-- ============================================================

CREATE DATABASE IF NOT EXISTS supplylink
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE supplylink;

-- ── Utilisateurs ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  prenom        VARCHAR(80)     NOT NULL,
  nom           VARCHAR(80)     NOT NULL,
  email         VARCHAR(191)    NOT NULL,
  telephone     VARCHAR(20)     NOT NULL,
  password_hash VARCHAR(255)    NOT NULL,
  ville         VARCHAR(100)    DEFAULT NULL,
  quartier      VARCHAR(100)    DEFAULT NULL,
  rue           VARCHAR(200)    DEFAULT NULL,
  statut        ENUM('actif','bloqué') NOT NULL DEFAULT 'actif',
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_email (email)
) ENGINE=InnoDB;

-- ── Rôles utilisateur (multi-rôle) ───────────────────────────
CREATE TABLE IF NOT EXISTS user_roles (
  user_id       INT UNSIGNED    NOT NULL,
  role          ENUM('client','fournisseur','admin','livreur') NOT NULL,
  PRIMARY KEY (user_id, role),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Boutiques fournisseur ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS boutiques (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id       INT UNSIGNED    NOT NULL,
  nom           VARCHAR(200)    NOT NULL,
  description   TEXT            DEFAULT NULL,
  iban          VARCHAR(40)     DEFAULT NULL,
  titulaire_iban VARCHAR(200)   DEFAULT NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Articles ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS articles (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  fournisseur_id INT UNSIGNED   NOT NULL,
  nom           VARCHAR(300)    NOT NULL,
  description   TEXT            DEFAULT NULL,
  prix          DECIMAL(10,2)   NOT NULL,
  prix_barre    DECIMAL(10,2)   DEFAULT NULL,
  stock         INT UNSIGNED    NOT NULL DEFAULT 0,
  categorie     VARCHAR(100)    NOT NULL,
  image         VARCHAR(500)    DEFAULT NULL,
  statut        ENUM('actif','suspendu') NOT NULL DEFAULT 'actif',
  is_promoted   TINYINT(1)      NOT NULL DEFAULT 0,
  note_moy      DECIMAL(3,2)    DEFAULT NULL,
  nb_avis       INT UNSIGNED    NOT NULL DEFAULT 0,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (fournisseur_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Commandes ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS commandes (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  ref           VARCHAR(20)     NOT NULL,
  client_id     INT UNSIGNED    NOT NULL,
  livreur_id    INT UNSIGNED    DEFAULT NULL,
  prenom_livr   VARCHAR(80)     NOT NULL,
  nom_livr      VARCHAR(80)     NOT NULL,
  telephone_livr VARCHAR(20)    NOT NULL,
  ville_livr    VARCHAR(100)    NOT NULL,
  adresse_livr  VARCHAR(300)    NOT NULL,
  mode_paiement ENUM('stripe','cash') NOT NULL,
  stripe_pi_id  VARCHAR(100)    DEFAULT NULL,
  statut        ENUM('en_attente','en_preparation','expedie','livre') NOT NULL DEFAULT 'en_attente',
  total         DECIMAL(10,2)   NOT NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ref (ref),
  FOREIGN KEY (client_id)   REFERENCES users(id),
  FOREIGN KEY (livreur_id)  REFERENCES users(id)
) ENGINE=InnoDB;

-- ── Lignes de commande ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS commande_items (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  commande_id   INT UNSIGNED    NOT NULL,
  article_id    INT UNSIGNED    NOT NULL,
  fournisseur_id INT UNSIGNED   NOT NULL,
  nom_article   VARCHAR(300)    NOT NULL,
  prix_unitaire DECIMAL(10,2)   NOT NULL,
  quantite      INT UNSIGNED    NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (commande_id)     REFERENCES commandes(id) ON DELETE CASCADE,
  FOREIGN KEY (article_id)      REFERENCES articles(id),
  FOREIGN KEY (fournisseur_id)  REFERENCES users(id)
) ENGINE=InnoDB;

-- ── Avis ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS avis (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  article_id    INT UNSIGNED    NOT NULL,
  commande_id   INT UNSIGNED    NOT NULL,
  client_id     INT UNSIGNED    NOT NULL,
  note          TINYINT UNSIGNED NOT NULL CHECK (note BETWEEN 1 AND 5),
  commentaire   TEXT            DEFAULT NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_avis (commande_id, article_id, client_id),
  FOREIGN KEY (article_id)  REFERENCES articles(id) ON DELETE CASCADE,
  FOREIGN KEY (commande_id) REFERENCES commandes(id),
  FOREIGN KEY (client_id)   REFERENCES users(id)
) ENGINE=InnoDB;

-- ── Litiges ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS litiges (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  ref           VARCHAR(20)     NOT NULL,
  commande_id   INT UNSIGNED    NOT NULL,
  client_id     INT UNSIGNED    NOT NULL,
  raison        ENUM('non_conforme','endommage','manquant','autre') NOT NULL,
  description   TEXT            NOT NULL,
  statut        ENUM('ouvert','en_cours','résolu','rejeté') NOT NULL DEFAULT 'ouvert',
  code_retrait  VARCHAR(50)     DEFAULT NULL,
  stripe_refund_id VARCHAR(100) DEFAULT NULL,
  montant_rembourse DECIMAL(10,2) DEFAULT NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_ref (ref),
  FOREIGN KEY (commande_id) REFERENCES commandes(id),
  FOREIGN KEY (client_id)   REFERENCES users(id)
) ENGINE=InnoDB;

-- ── Promotions ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS promotions (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  fournisseur_id INT UNSIGNED   NOT NULL,
  article_id    INT UNSIGNED    NOT NULL,
  pack          ENUM('starter','pro','elite') NOT NULL,
  montant       DECIMAL(10,2)   NOT NULL,
  stripe_pi_id  VARCHAR(100)    DEFAULT NULL,
  date_debut    DATE            NOT NULL,
  date_fin      DATE            NOT NULL,
  statut        ENUM('actif','expiré','annulé') NOT NULL DEFAULT 'actif',
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (fournisseur_id) REFERENCES users(id),
  FOREIGN KEY (article_id)     REFERENCES articles(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ── Logs sécurité (OWASP A09) ────────────────────────────────
CREATE TABLE IF NOT EXISTS security_logs (
  id            INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  user_id       INT UNSIGNED    DEFAULT NULL,
  ip            VARCHAR(45)     NOT NULL,
  action        VARCHAR(100)    NOT NULL,
  detail        TEXT            DEFAULT NULL,
  created_at    DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_user (user_id),
  INDEX idx_action (action),
  INDEX idx_created (created_at)
) ENGINE=InnoDB;
