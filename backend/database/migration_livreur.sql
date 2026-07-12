-- Migration : créneau de livraison
-- À exécuter dans phpMyAdmin (base supplylink)

USE supplylink;

ALTER TABLE commandes
  ADD COLUMN heure_livraison DATETIME DEFAULT NULL AFTER adresse_livr;
