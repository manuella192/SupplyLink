import React from "react";
import { FileText } from "lucide-react";
import "./PageLegale.css";

const CGV = () => (
  <div className="pl-page">
    <div className="pl-header">
      <div className="pl-badge"><FileText size={12} /> Légal</div>
      <h1 className="pl-title">Conditions générales de vente</h1>
      <p className="pl-updated">Dernière mise à jour : 1er janvier 2026</p>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">1. Objet</h2>
      <p>Les présentes conditions générales de vente (CGV) régissent l'ensemble des transactions conclues entre SupplyLink (ci-après « la Plateforme ») et tout acheteur (ci-après « le Client ») effectuant un achat via le site <strong>supplylink.ma</strong>.</p>
      <p>Tout achat implique l'acceptation pleine et entière des présentes CGV.</p>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">2. Identification de la plateforme</h2>
      <div className="pl-info-box">
        <p><strong>Dénomination :</strong> SupplyLink</p>
        <p><strong>Siège social :</strong> Casablanca, Maroc</p>
        <p><strong>Email :</strong> contact@supplylink.ma</p>
        <p><strong>Téléphone :</strong> +212 6 00 00 00 00</p>
      </div>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">3. Produits et disponibilité</h2>
      <p>Les articles proposés sur SupplyLink sont publiés par des fournisseurs partenaires vérifiés. Chaque fiche article précise : la description, le prix TTC en dirhams (MAD), les photos et la disponibilité.</p>
      <p>SupplyLink se réserve le droit de retirer tout article à tout moment sans préavis. En cas d'indisponibilité après commande, le Client sera informé et remboursé intégralement.</p>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">4. Prix</h2>
      <p>Tous les prix sont exprimés en <strong>dirhams marocains (MAD)</strong>, toutes taxes comprises (TTC). SupplyLink se réserve le droit de modifier ses prix à tout moment. Les prix appliqués sont ceux en vigueur au moment de la validation de la commande.</p>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">5. Commande</h2>
      <p>La commande est validée après :</p>
      <ul>
        <li>Sélection des articles et confirmation du panier</li>
        <li>Saisie des informations de livraison</li>
        <li>Choix du mode de paiement (carte bancaire ou cash à la livraison)</li>
        <li>Validation finale par le Client</li>
      </ul>
      <p>Un email de confirmation est envoyé dès réception de la commande.</p>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">6. Paiement</h2>
      <p>Deux modes de paiement sont proposés :</p>
      <ul>
        <li><strong>Carte bancaire (Stripe) :</strong> paiement sécurisé en ligne. La transaction est traitée par Stripe Inc., certifié PCI-DSS.</li>
        <li><strong>Cash à la livraison :</strong> règlement en espèces au livreur lors de la réception.</li>
      </ul>
      <p>SupplyLink ne stocke aucune donnée bancaire. En cas d'échec du paiement en ligne, la commande n'est pas validée.</p>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">7. Livraison</h2>
      <p>Les livraisons sont assurées du lundi au vendredi, sur des créneaux de 90 minutes entre 9h00 et 17h00. Un créneau est attribué automatiquement et communiqué par email.</p>
      <p>SupplyLink ne peut être tenu responsable des retards dus à des événements imprévisibles (météo, grève, etc.).</p>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">8. Droit de rétractation et retours</h2>
      <p>Conformément à notre <strong>Politique de retour</strong>, le Client dispose de <strong>7 jours</strong> suivant la livraison pour demander un retour. Se référer à la page « Politique de retour » pour le détail de la procédure.</p>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">9. Responsabilité</h2>
      <p>SupplyLink agit en qualité d'intermédiaire de marché. La responsabilité contractuelle du fournisseur est engagée pour tout défaut de conformité du produit livré.</p>
      <p>SupplyLink ne saurait être tenu responsable des dommages indirects résultant de l'utilisation d'un produit acheté sur la plateforme.</p>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">10. Droit applicable</h2>
      <p>Les présentes CGV sont soumises au droit marocain. En cas de litige, les tribunaux compétents de Casablanca sont seuls habilités à trancher.</p>
    </div>
  </div>
);

export default CGV;
