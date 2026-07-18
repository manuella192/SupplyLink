import React, { useState, useEffect, useCallback } from "react";
import {
  Truck, CheckCircle, Clock, MapPin, Phone,
  Package, Loader, ChevronDown, ChevronUp, RotateCcw, AlertTriangle,
} from "lucide-react";
import { getLivreurCommandes, advanceCommande, getLitigesLivreur, recupereLitige } from "../../services/commandes.service";

const fmt = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("fr-MA", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit",
  });
};

const fmtHeure = (iso) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("fr-MA", { hour: "2-digit", minute: "2-digit" });
};

const fmtDate = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  const today = new Date();
  const tmrw  = new Date(); tmrw.setDate(tmrw.getDate() + 1);
  if (d.toDateString() === today.toDateString()) return "Aujourd'hui";
  if (d.toDateString() === tmrw.toDateString())  return "Demain";
  return d.toLocaleDateString("fr-MA", { weekday: "long", day: "numeric", month: "long" });
};

const groupByDate = (orders) => {
  const groups = {};
  for (const o of orders) {
    const key = o.heure_livraison ? new Date(o.heure_livraison).toDateString() : "Sans date";
    if (!groups[key]) groups[key] = { label: fmtDate(o.heure_livraison) || "Sans date", items: [] };
    groups[key].items.push(o);
  }
  return Object.values(groups);
};

const STATUT = {
  expedie:  { label: "À livrer", cls: "badge-shipped",   icon: Truck       },
  livre:    { label: "Livré",    cls: "badge-delivered", icon: CheckCircle },
  retourné: { label: "Retourné", cls: "badge-blocked",   icon: RotateCcw   },
};

const RAISONS = {
  non_conforme: "Non conforme", endommage: "Endommagé",
  manquant: "Manquant", autre: "Autre",
};

/* ── Carte livraison ── */
const DeliveryCard = ({ cmd, onDeliver, delivering }) => {
  const [open, setOpen] = useState(false);
  const s = STATUT[cmd.statut] || STATUT.expedie;
  const Icon = s.icon;

  return (
    <div className="lv-card" style={{ borderLeft: cmd.statut === "livre" ? "4px solid var(--color-green)" : "4px solid #f59e0b" }}>
      <div className="lv-card-header" onClick={() => setOpen((v) => !v)}>
        <div className="lv-card-time">
          <Clock size={16} style={{ color: "#f59e0b" }} />
          <span className="lv-time-big">{fmtHeure(cmd.heure_livraison)}</span>
        </div>

        <div className="lv-card-main">
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontWeight: 800, fontSize: 14 }}>{cmd.ref}</span>
            <span className={`badge ${s.cls}`} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Icon size={11} /> {s.label}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-2)", marginTop: 2 }}>
            {cmd.prenom_livr} {cmd.nom_livr}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--color-text-3)", marginTop: 3 }}>
            <MapPin size={12} />
            <span>{cmd.adresse_livr}, {cmd.ville_livr}</span>
          </div>
        </div>

        <button style={{ background: "none", border: "none", color: "var(--color-text-3)", cursor: "pointer", padding: 4 }}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {open && (
        <div className="lv-card-body">
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13 }}>
              <Phone size={14} style={{ color: "var(--color-primary)" }} />
              <a href={`tel:${cmd.telephone_livr}`} style={{ color: "var(--color-primary)", fontWeight: 700 }}>
                {cmd.telephone_livr}
              </a>
            </div>
          </div>

          {cmd.items?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-3)", margin: "0 0 6px", textTransform: "uppercase" }}>Articles</p>
              {cmd.items.map((it, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, padding: "4px 0" }}>
                  <Package size={13} style={{ color: "var(--color-text-3)", flexShrink: 0 }} />
                  <span>{it.nom_article}</span>
                  <span style={{ color: "var(--color-text-3)" }}>× {it.quantite}</span>
                </div>
              ))}
            </div>
          )}

          {cmd.statut === "expedie" && (
            <button
              className="btn btn-primary"
              style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
              disabled={delivering === cmd.id}
              onClick={() => onDeliver(cmd.id)}
            >
              {delivering === cmd.id ? <Loader size={15} className="spin" /> : <CheckCircle size={15} />}
              {delivering === cmd.id ? "Confirmation…" : "Confirmer la livraison"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/* ── Carte retour à récupérer ── */
const LitigeCard = ({ litige, onRecupere, loading }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      background: "#fff", borderRadius: "var(--radius-lg)", border: "1px solid #fcd34d",
      borderLeft: "4px solid #f59e0b", overflow: "hidden",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", cursor: "pointer" }}
        onClick={() => setOpen((v) => !v)}>
        <AlertTriangle size={18} style={{ color: "#f59e0b", flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 800, fontSize: 14 }}>{litige.ref}</span>
            <span style={{ fontSize: 11, background: "#fef3c7", color: "#92400e", borderRadius: 4, padding: "2px 8px", fontWeight: 700 }}>
              Retour
            </span>
          </div>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--color-text-2)" }}>{litige.client_nom}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "var(--color-text-3)", marginTop: 3 }}>
            <MapPin size={12} />
            <span>{litige.adresse_livr}, {litige.ville_livr}</span>
          </div>
        </div>
        <button style={{ background: "none", border: "none", color: "var(--color-text-3)", cursor: "pointer", padding: 4 }}>
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {open && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid #fef3c7" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, margin: "12px 0 8px" }}>
            <Phone size={14} style={{ color: "var(--color-primary)" }} />
            <a href={`tel:${litige.telephone_livr}`} style={{ color: "var(--color-primary)", fontWeight: 700 }}>
              {litige.telephone_livr}
            </a>
          </div>
          <div style={{ fontSize: 13, color: "var(--color-text-2)", marginBottom: 4 }}>
            <strong>Commande :</strong> {litige.commande_ref}
          </div>
          <div style={{ fontSize: 13, color: "var(--color-text-2)", marginBottom: 12 }}>
            <strong>Motif :</strong> {RAISONS[litige.raison] || litige.raison}
          </div>
          <button
            className="btn btn-primary"
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, background: "#f59e0b", borderColor: "#f59e0b" }}
            disabled={loading === litige.id}
            onClick={() => onRecupere(litige.id)}
          >
            {loading === litige.id ? <Loader size={15} className="spin" /> : <RotateCcw size={15} />}
            {loading === litige.id ? "Confirmation…" : "Marquer comme récupéré"}
          </button>
        </div>
      )}
    </div>
  );
};

/* ── Page principale ── */
const LivraisonsLivreur = () => {
  const [orders,     setOrders]     = useState([]);
  const [litiges,    setLitiges]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [delivering, setDelivering] = useState(null);
  const [recupering, setRecupering] = useState(null);

  const load = useCallback(async () => {
    try {
      const [{ data: cmds }, { data: lits }] = await Promise.all([
        getLivreurCommandes(),
        getLitigesLivreur(),
      ]);
      setOrders(cmds);
      setLitiges(lits);
    } catch { /* état vide */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDeliver = async (id) => {
    setDelivering(id);
    try {
      const { data } = await advanceCommande(id);
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, statut: data.statut } : o));
    } catch { /* ignore */ }
    finally { setDelivering(null); }
  };

  const handleRecupere = async (id) => {
    setRecupering(id);
    try {
      await recupereLitige(id);
      setLitiges((prev) => prev.filter((l) => l.id !== id));
    } catch { /* ignore */ }
    finally { setRecupering(null); }
  };

  const today    = orders.filter((o) => o.statut === "expedie");
  const done     = orders.filter((o) => o.statut === "livre" || o.statut === "retourné");
  const groups     = groupByDate(today);
  const doneGroups = groupByDate(done);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
      <Loader size={28} className="spin" style={{ color: "#f59e0b" }} />
    </div>
  );

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 20px" }}>Mes livraisons</h1>

      {/* ── Retours à récupérer ── */}
      {litiges.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ background: "#fef3c7", borderRadius: "var(--radius-full)", padding: "4px 14px" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>
                Retours à récupérer
              </span>
            </div>
            <span style={{ fontSize: 12, color: "var(--color-text-3)" }}>
              {litiges.length} demande{litiges.length > 1 ? "s" : ""}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {litiges.map((l) => (
              <LitigeCard key={l.id} litige={l} onRecupere={handleRecupere} loading={recupering} />
            ))}
          </div>
        </div>
      )}

      {today.length === 0 && done.length === 0 && litiges.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--color-text-3)" }}>
          <Truck size={40} strokeWidth={1.2} style={{ marginBottom: 12 }} />
          <p style={{ fontWeight: 700 }}>Aucune livraison assignée</p>
          <p style={{ fontSize: 13 }}>Vos livraisons apparaîtront ici dès qu'une commande vous sera attribuée.</p>
        </div>
      )}

      {/* ── À livrer ── */}
      {groups.map((group) => (
        <div key={group.label} style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ background: "#fef3c7", borderRadius: "var(--radius-full)", padding: "4px 14px" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#92400e" }}>{group.label}</span>
            </div>
            <span style={{ fontSize: 12, color: "var(--color-text-3)" }}>
              {group.items.length} livraison{group.items.length > 1 ? "s" : ""}
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {group.items.map((cmd) => (
              <DeliveryCard key={cmd.id} cmd={cmd} onDeliver={handleDeliver} delivering={delivering} />
            ))}
          </div>
        </div>
      ))}

      {/* ── Historique ── */}
      {done.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ background: "var(--color-bg)", borderRadius: "var(--radius-full)", padding: "4px 14px", border: "1px solid var(--color-border)" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text-2)" }}>Historique</span>
            </div>
            <span style={{ fontSize: 12, color: "var(--color-text-3)" }}>
              {done.filter(o => o.statut === "livre").length} livrée{done.filter(o => o.statut === "livre").length > 1 ? "s" : ""}
              {done.filter(o => o.statut === "retourné").length > 0 && ` · ${done.filter(o => o.statut === "retourné").length} retournée${done.filter(o => o.statut === "retourné").length > 1 ? "s" : ""}`}
            </span>
          </div>
          {doneGroups.map((group) => (
            <div key={group.label} style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: "var(--color-text-3)", margin: "0 0 8px", fontWeight: 600 }}>{group.label || "—"}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {group.items.map((cmd) => (
                  <DeliveryCard key={cmd.id} cmd={cmd} onDeliver={handleDeliver} delivering={delivering} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LivraisonsLivreur;
