import React from "react";
import { RotateCcw } from "lucide-react";
import "./PageLegale.css";

const PolitiqueRetour = () => (
  <div className="pl-page">
    <div className="pl-header">
      <div className="pl-badge"><RotateCcw size={12} /> Retours</div>
      <h1 className="pl-title">Politique de retour</h1>
      <p className="pl-updated">Dernière mise à jour : 1er janvier 2026</p>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">Délai de retour</h2>
      <div className="pl-highlight">
        Vous disposez de <strong>7 jours calendaires</strong> à compter de la date de livraison pour initier une demande de retour.
      </div>
      <p>Passé ce délai, aucune demande de retour ne pourra être acceptée.</p>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">Motifs acceptés</h2>
      <ul>
        <li><strong>Non conforme à la description :</strong> le produit reçu ne correspond pas à la fiche article.</li>
        <li><strong>Endommagé à la livraison :</strong> le produit est arrivé cassé ou abîmé.</li>
        <li><strong>Article manquant :</strong> un ou plusieurs articles commandés sont absents du colis.</li>
        <li><strong>Autre :</strong> tout autre motif justifié, à préciser dans la description.</li>
      </ul>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">Procédure de retour</h2>
      <div className="pl-steps">
        <div className="pl-step">
          <div className="pl-step-num">1</div>
          <div className="pl-step-body">
            <strong>Ouvrez un litige depuis votre espace client</strong>
            <span>Rendez-vous dans « Mes commandes », sélectionnez la commande concernée et cliquez sur « Retourner ».</span>
          </div>
        </div>
        <div className="pl-step">
          <div className="pl-step-num">2</div>
          <div className="pl-step-body">
            <strong>Validation par notre équipe</strong>
            <span>Notre équipe examine votre demande et la valide sous 24–48h ouvrées. Vous recevrez une confirmation par email.</span>
          </div>
        </div>
        <div className="pl-step">
          <div className="pl-step-num">3</div>
          <div className="pl-step-body">
            <strong>Récupération par le livreur</strong>
            <span>Un livreur SupplyLink se déplace à l'adresse de livraison pour récupérer l'article. Aucun déplacement de votre part n'est nécessaire.</span>
          </div>
        </div>
        <div className="pl-step">
          <div className="pl-step-num">4</div>
          <div className="pl-step-body">
            <strong>Remboursement</strong>
            <span>Dès que l'article est récupéré et validé, le remboursement est traité selon le mode de paiement initial.</span>
          </div>
        </div>
      </div>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">Modalités de remboursement</h2>
      <div className="pl-info-box">
        <p><strong>Paiement par carte bancaire (Stripe) :</strong><br/>
        Le remboursement est effectué automatiquement sur la carte ayant servi au paiement, sous <strong>3 à 5 jours ouvrés</strong>.</p>
      </div>
      <div className="pl-info-box">
        <p><strong>Paiement cash à la livraison :</strong><br/>
        Notre équipe vous communique un <strong>code de retrait</strong> utilisable dans un point Cash Plus ou Wafa Cash pour récupérer votre remboursement en espèces.</p>
      </div>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">Conditions de retour</h2>
      <ul>
        <li>L'article doit être retourné dans son état d'origine (non utilisé, non modifié).</li>
        <li>Les articles endommagés par une mauvaise utilisation ne sont pas éligibles au retour.</li>
        <li>Un seul retour par commande est autorisé.</li>
      </ul>
    </div>

    <div className="pl-section">
      <h2 className="pl-section-title">Contact</h2>
      <p>Pour toute question concernant un retour, contactez notre service client :</p>
      <p><strong>Email :</strong> contact@supplylink.ma<br/>
      <strong>Téléphone :</strong> +212 6 00 00 00 00 (lun–ven, 9h–18h)</p>
    </div>
  </div>
);

export default PolitiqueRetour;
