import React, { useState, useEffect, useCallback } from "react";
import { Package, Star, RotateCcw, CheckCircle, Clock, Truck, MapPin, Loader } from "lucide-react";
import { getMyCommandes, createAvis, createLitige } from "../../services/commandes.service";
import "./CommandesClient.css";

const BASE_URL = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";

const STATUS_MAP = {
  en_attente:     { label: "En attente",    className: "badge-pending",   icon: Clock       },
  en_preparation: { label: "En préparation",className: "badge-process",   icon: CheckCircle },
  expedie:        { label: "Expédiée",      className: "badge-shipped",   icon: Truck       },
  livre:          { label: "Livrée",        className: "badge-delivered", icon: MapPin      },
};

const StarPicker = ({ value, onChange }) => (
  <div className="cmd-stars-pick">
    {[1, 2, 3, 4, 5].map((s) => (
      <button key={s} type="button" onClick={() => onChange(s)}>
        <Star size={24} className={s <= value ? "star-on" : "star-off"} />
      </button>
    ))}
  </div>
);

const ReviewModal = ({ order, onClose, onDone }) => {
  const [rating, setRating]   = useState(0);
  const [comment, setComment] = useState("");
  const [done, setDone]       = useState(false);
  const [saving, setSaving]   = useState(false);

  const submit = async () => {
    if (rating === 0) return;
    setSaving(true);
    try {
      const articleId = order.items[0]?.article_id;
      if (articleId) {
        await createAvis({ commandeId: order.id, articleId, note: rating, commentaire: comment });
      }
      setDone(true);
      onDone?.();
    } catch { /* ignore */ }
    finally { setSaving(false); }
  };

  if (done) return (
    <div className="cmd-modal-overlay" onClick={onClose}>
      <div className="cmd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-modal-success">
          <CheckCircle size={48} className="cmd-success-icon" />
          <h3>Avis publié !</h3>
          <p>Merci pour votre retour.</p>
          <button className="btn btn-primary" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cmd-modal-overlay" onClick={onClose}>
      <div className="cmd-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="cmd-modal-title">Laisser un avis</h3>
        <p className="cmd-modal-sub">{order.ref} — {order.items[0]?.nom_article}</p>
        <div className="form-group">
          <label className="form-label">Note globale</label>
          <StarPicker value={rating} onChange={setRating} />
        </div>
        <div className="form-group">
          <label className="form-label">Commentaire (optionnel)</label>
          <textarea className="form-input cmd-textarea" rows={4}
            value={comment} onChange={(e) => setComment(e.target.value)}
            placeholder="Décrivez votre expérience…" />
        </div>
        <div className="cmd-modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-primary" disabled={rating === 0 || saving} onClick={submit}>
            {saving ? <Loader size={14} className="spin" /> : null} Publier l'avis
          </button>
        </div>
      </div>
    </div>
  );
};

const ReturnModal = ({ order, onClose, onDone }) => {
  const [form, setForm] = useState({ raison: "", description: "" });
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setSaving(true);
    try {
      await createLitige({ commandeId: order.id, raison: form.raison, description: form.description });
      setDone(true);
      onDone?.();
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de la demande");
    } finally {
      setSaving(false);
    }
  };

  if (done) return (
    <div className="cmd-modal-overlay" onClick={onClose}>
      <div className="cmd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-modal-success">
          <CheckCircle size={48} className="cmd-success-icon" />
          <h3>Demande envoyée</h3>
          <p>Notre équipe vous contacte dans les 24h.</p>
          <button className="btn btn-primary" onClick={onClose}>Fermer</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cmd-modal-overlay" onClick={onClose}>
      <div className="cmd-modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="cmd-modal-title">Demande de retour</h3>
        <p className="cmd-modal-sub">{order.ref} — délai 7 jours après livraison</p>
        <div className="form-group">
          <label className="form-label">Raison</label>
          <select className="form-input" value={form.raison} onChange={(e) => set("raison", e.target.value)}>
            <option value="">Sélectionner…</option>
            <option value="non_conforme">Non conforme à la description</option>
            <option value="endommage">Endommagé à la livraison</option>
            <option value="manquant">Article manquant</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea className="form-input cmd-textarea" rows={4}
            value={form.description} onChange={(e) => set("description", e.target.value)}
            placeholder="Décrivez le problème rencontré…" />
        </div>
        <div className="cmd-modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>Annuler</button>
          <button className="btn btn-danger" disabled={!form.raison || !form.description || saving} onClick={submit}>
            {saving ? <Loader size={14} className="spin" /> : null} Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

const CommandesClient = () => {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [reviewOrder, setReview]  = useState(null);
  const [returnOrder, setReturn]  = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await getMyCommandes();
      setOrders(data);
    } catch { /* état vide */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "60px 0" }}>
      <Loader size={28} style={{ color: "var(--color-primary)" }} className="spin" />
    </div>
  );

  return (
    <div className="cmd-page">
      <h1 className="cmd-title">Mes commandes</h1>

      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--color-text-3)" }}>
          <Package size={48} strokeWidth={1.2} />
          <p style={{ marginTop: 12, fontWeight: 600 }}>Aucune commande pour le moment</p>
        </div>
      ) : (
        <div className="cmd-list">
          {orders.map((order) => {
            const st   = STATUS_MAP[order.statut] || STATUS_MAP.en_attente;
            const Icon = st.icon;
            const canReview = order.statut === "livre" && (order.articlesAvisRestants?.length > 0);
            const canReturn = order.canReturn;

            return (
              <div key={order.id} className="cmd-card">
                <div className="cmd-card-header">
                  <div className="cmd-card-id">
                    <Package size={16} />
                    <span>{order.ref}</span>
                  </div>
                  <span className={`badge ${st.className}`} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <Icon size={12} /> {st.label}
                  </span>
                </div>

                <div className="cmd-card-items">
                  {(order.items || []).map((item, i) => (
                    <div key={i} className="cmd-item">
                      <img
                        src={item.image ? BASE_URL + item.image : ""}
                        alt={item.nom_article}
                        className="cmd-item-img"
                        onError={(e) => { e.target.src = ""; }}
                      />
                      <div className="cmd-item-info">
                        <span className="cmd-item-name">{item.nom_article}</span>
                        <span className="cmd-item-qty">Qté : {item.quantite}</span>
                      </div>
                      <span className="cmd-item-price">
                        {(item.prix_unitaire * item.quantite).toLocaleString()} dh
                      </span>
                    </div>
                  ))}
                </div>

                <div className="cmd-card-footer">
                  <div className="cmd-meta">
                    <span className="cmd-date">{new Date(order.created_at).toLocaleDateString("fr-MA")}</span>
                    <span className="cmd-total">Total : <strong>{Number(order.total).toLocaleString()} dh</strong></span>
                  </div>
                  <div className="cmd-actions">
                    {canReview && (
                      <button className="btn btn-primary btn-sm" onClick={() => setReview(order)}>
                        <Star size={14} /> Laisser un avis
                      </button>
                    )}
                    {canReturn && (
                      <button className="btn btn-ghost btn-sm" onClick={() => setReturn(order)}>
                        <RotateCcw size={14} /> Retourner
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {reviewOrder && <ReviewModal order={reviewOrder} onClose={() => setReview(null)} onDone={load} />}
      {returnOrder && <ReturnModal order={returnOrder} onClose={() => setReturn(null)} onDone={load} />}
    </div>
  );
};

export default CommandesClient;
