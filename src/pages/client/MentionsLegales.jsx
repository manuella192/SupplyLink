import React from "react";
import { Shield } from "lucide-react";
import "./PageLegale.css";

const MentionsLegales = () => (
  <div className="pl-page">
    <div className="pl-header">
      <div className="pl-badge"><Shield size={12} /> Légal</div>
      <h1 className="pl-title">Mentions légales</h1>
      <p className="pl-updated">Dernière mise à jour : 1er janvier 2026</p>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">Éditeur du site</h2>
      <div className="pl-info-box">
        <p><strong>Dénomination :</strong> SupplyLink</p>
        <p><strong>Forme juridique :</strong> SARL (Société à Responsabilité Limitée)</p>
        <p><strong>Capital social :</strong> 100 000 MAD</p>
        <p><strong>Siège social :</strong> Casablanca, Maroc</p>
        <p><strong>Numéro RC :</strong> [En cours d'immatriculation]</p>
        <p><strong>Identifiant fiscal :</strong> [En cours]</p>
        <p><strong>Email :</strong> contact@supplylink.ma</p>
        <p><strong>Téléphone :</strong> +212 6 00 00 00 00</p>
      </div>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">Directeur de la publication</h2>
      <p>Le directeur de la publication est le représentant légal de la société SupplyLink.</p>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">Hébergement</h2>
      <div className="pl-info-box">
        <p><strong>Hébergeur :</strong> MAMP / OVH Cloud (production)</p>
        <p><strong>Adresse :</strong> 2 rue Kellermann, 59100 Roubaix, France</p>
        <p><strong>Site :</strong> www.ovhcloud.com</p>
      </div>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">Propriété intellectuelle</h2>
      <p>L'ensemble des contenus présents sur le site <strong>supplylink.ma</strong> (textes, images, logos, icônes, code source) est la propriété exclusive de SupplyLink ou de ses partenaires, et est protégé par les lois marocaines et internationales relatives à la propriété intellectuelle.</p>
      <p>Toute reproduction, représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sauf autorisation écrite préalable de SupplyLink.</p>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">Protection des données personnelles</h2>
      <p>SupplyLink s'engage à protéger la vie privée de ses utilisateurs conformément à la <strong>Loi 09-08</strong> relative à la protection des personnes physiques à l'égard du traitement des données à caractère personnel (Maroc).</p>
      <p>Les données collectées (nom, email, adresse, téléphone) sont utilisées exclusivement dans le cadre du traitement des commandes et de la relation client. Elles ne sont pas vendues ni transmises à des tiers à des fins commerciales.</p>
      <p>Conformément à la loi 09-08, vous disposez des droits suivants :</p>
      <ul>
        <li><strong>Droit d'accès :</strong> consulter les données vous concernant.</li>
        <li><strong>Droit de rectification :</strong> corriger des données inexactes.</li>
        <li><strong>Droit d'opposition :</strong> vous opposer au traitement de vos données.</li>
        <li><strong>Droit de suppression :</strong> demander la suppression de votre compte et données.</li>
      </ul>
      <p>Pour exercer ces droits : <strong>contact@supplylink.ma</strong></p>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">Cookies</h2>
      <p>Le site utilise des cookies techniques strictement nécessaires au bon fonctionnement de la plateforme (authentification, panier). Aucun cookie publicitaire ou de traçage tiers n'est utilisé.</p>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">Paiements sécurisés</h2>
      <p>Les paiements en ligne sont traités par <strong>Stripe Inc.</strong>, certifié PCI-DSS niveau 1. SupplyLink n'a pas accès aux données bancaires de ses clients et ne les stocke jamais.</p>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">Droit applicable et juridiction</h2>
      <p>Les présentes mentions légales sont régies par le droit marocain. En cas de litige, les tribunaux de Casablanca sont seuls compétents.</p>
    </div>
  </div>
);

export default MentionsLegales;
