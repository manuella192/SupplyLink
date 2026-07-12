import React, { useState, useEffect, useCallback } from "react";
import {
  Truck, CheckCircle, Clock, MapPin, Phone,
  Package, Loader, ChevronDown, ChevronUp,
} from "lucide-react";
import { getLivreurCommandes, advanceCommande } from "../../services/commandes.service";

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
  expedie: { label: "À livrer",   cls: "badge-shipped",    icon: Truck         },
  livre:   { label: "Livré",      cls: "badge-delivered",  icon: CheckCircle   },
};

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
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--color-text-2)" }}>
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
              {delivering === cmd.id
                ? <Loader size={15} className="spin" />
                : <CheckCircle size={15} />}
              {delivering === cmd.id ? "Confirmation…" : "Confirmer la livraison"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const LivraisonsLivreur = () => {
  const [orders,     setOrders]     = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [delivering, setDelivering] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await getLivreurCommandes();
      setOrders(data);
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

  const today    = orders.filter((o) => o.statut === "expedie");
  const done     = orders.filter((o) => o.statut === "livre");
  const groups   = groupByDate(today);
  const doneGroups = groupByDate(done);

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
      <Loader size={28} className="spin" style={{ color: "#f59e0b" }} />
    </div>
  );

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 20px" }}>Mes livraisons</h1>

      {today.length === 0 && done.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--color-text-3)" }}>
          <Truck size={40} strokeWidth={1.2} style={{ marginBottom: 12 }} />
          <p style={{ fontWeight: 700 }}>Aucune livraison assignée</p>
          <p style={{ fontSize: 13 }}>Vos livraisons apparaîtront ici dès qu'une commande vous sera attribuée.</p>
        </div>
      )}

      {/* À livrer */}
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

      {/* Livrées */}
      {doneGroups.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-3)", textTransform: "uppercase", margin: "0 0 12px" }}>
            Livraisons effectuées
          </p>
          {doneGroups.map((group) => (
            <div key={group.label} style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, color: "var(--color-text-3)", margin: "0 0 8px", fontWeight: 600 }}>{group.label}</p>
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
