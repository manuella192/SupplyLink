import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Truck, ShieldCheck, RotateCcw, CreditCard,
  Loader, Zap, Star, Clock, TrendingUp,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import ProductCard from "../../components/ProductCard";
import { getHomepage } from "../../services/articles.service";
import { toProductUrl } from "../../utils/slug";
import "./Accueil.css";

const BASE_URL = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";

const SLIDES = [
  {
    badge: "Catalogue 2026",
    title: "Mobilier design",
    accent: "pour votre intérieur",
    sub: "Des milliers d'articles sélectionnés par nos fournisseurs partenaires. Livraison rapide partout au Maroc.",
    img: "/assets/canape.jpg",
    cta: { label: "Explorer le catalogue", to: "/catalogue" },
    cta2: { label: "Nous contacter", to: "/contact" },
  },
  {
    badge: "Électroménager premium",
    title: "Équipez votre cuisine",
    accent: "aux meilleurs prix",
    sub: "Fours, réfrigérateurs, lave-linge — les grandes marques au meilleur rapport qualité/prix.",
    img: "/assets/four.jpg",
    cta: { label: "Voir l'électroménager", to: "/catalogue" },
    cta2: { label: "Nous contacter", to: "/contact" },
  },
  {
    badge: "Literie & Confort",
    title: "Dormez mieux,",
    accent: "vivez mieux",
    sub: "Lits, matelas et accessoires de chambre. La qualité que vous méritez, au prix marocain.",
    img: "/assets/lit.jpg",
    cta: { label: "Voir la literie", to: "/catalogue" },
    cta2: { label: "Nous contacter", to: "/contact" },
  },
];

const REASSURANCE = [
  { icon: Truck,       label: "Livraison rapide",     sub: "Partout au Maroc"        },
  { icon: ShieldCheck, label: "Paiement sécurisé",    sub: "Stripe & cash"           },
  { icon: RotateCcw,   label: "Retour facile",        sub: "7 jours après livraison" },
  { icon: CreditCard,  label: "Payer à la livraison", sub: "Option disponible"       },
];

const SECTIONS = [
  { key: "sponsorises", label: "Articles sponsorisés", icon: Zap,       color: "#f59e0b" },
  { key: "topNotes",    label: "Mieux notés",          icon: Star,       color: "#8b5cf6" },
  { key: "tendances",   label: "Tendances",            icon: TrendingUp, color: "#009fe3" },
  { key: "nouveautes",  label: "Nouveautés",           icon: Clock,      color: "#2cb34a" },
];

const normalize = (a) => ({
  id:          a.id,
  name:        a.nom,
  price:       parseFloat(a.prix),
  oldPrice:    a.prix_barre ? parseFloat(a.prix_barre) : null,
  discount:    a.prix_barre ? Math.round((1 - a.prix / a.prix_barre) * 100) : null,
  image:       a.image?.startsWith("http") ? a.image : a.image ? BASE_URL + a.image : null,
  rating:      parseFloat(a.note_moy) || 0,
  reviewCount: parseInt(a.nb_avis)    || 0,
  category:    a.categorie,
  isPromoted:  !!a.is_promoted,
  boutique:    a.boutique,
});

/* ── Hero Slider ── */
const HeroSlider = () => {
  const navigate        = useNavigate();
  const [cur, setCur]   = useState(0);
  const len             = SLIDES.length;

  useEffect(() => {
    const t = setInterval(() => setCur((c) => (c + 1) % len), 5000);
    return () => clearInterval(t);
  }, [len]);

  const prev = () => setCur((c) => (c - 1 + len) % len);
  const next = () => setCur((c) => (c + 1) % len);

  return (
    <div className="hero-slider">
      {SLIDES.map((s, i) => (
        <div key={i} className={`hero-slide ${i === cur ? "active" : ""}`}>
          <div className="hero-slide-left">
            <span className="hero-badge-tag">{s.badge}</span>
            <h1 className="hero-slide-title">
              {s.title}<br />
              <span className="hero-title-accent">{s.accent}</span>
            </h1>
            <p className="hero-slide-sub">{s.sub}</p>
            <div className="hero-slide-actions">
              <button className="btn-hero-primary" onClick={() => navigate(s.cta.to)}>
                {s.cta.label}
              </button>
              <button className="btn-hero-outline" onClick={() => navigate(s.cta2.to)}>
                {s.cta2.label}
              </button>
            </div>
          </div>
          <div className="hero-slide-right">
            <img src={s.img} alt={s.title} className="hero-img" />
          </div>
        </div>
      ))}

      <button className="hero-nav hero-nav--prev" onClick={prev} aria-label="Précédent">
        <ChevronLeft size={20} />
      </button>
      <button className="hero-nav hero-nav--next" onClick={next} aria-label="Suivant">
        <ChevronRight size={20} />
      </button>

      <div className="hero-dots">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            className={`hero-dot ${i === cur ? "active" : ""}`}
            onClick={() => setCur(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

/* ── Scroll Section ── */
const ScrollSection = ({ label, icon: Icon, color, data, onSelect }) => {
  const rowRef                  = useRef(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = rowRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [data, checkScroll]);

  const scroll = (dir) => rowRef.current?.scrollBy({ left: dir * 480, behavior: "smooth" });

  if (!data?.length) return null;

  return (
    <section className="home-section">
      <div className="home-section-head">
        <div className="home-section-label">
          <span className="home-section-icon" style={{ background: color + "1a", color }}>
            <Icon size={16} />
          </span>
          <h2 className="home-section-title">{label}</h2>
        </div>
      </div>
      <div className="scroll-wrap">
        {canLeft && (
          <button className="scroll-arrow scroll-arrow--left" onClick={() => scroll(-1)} aria-label="Précédent">
            <ChevronLeft size={20} />
          </button>
        )}
        <div className="scroll-row" ref={rowRef}>
          {data.map((p) => (
            <ProductCard key={p.id} product={p} onClick={() => onSelect(p)} />
          ))}
        </div>
        {canRight && (
          <button className="scroll-arrow scroll-arrow--right" onClick={() => scroll(1)} aria-label="Suivant">
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </section>
  );
};

/* ── Page principale ── */
const Accueil = () => {
  const navigate                = useNavigate();
  const [sections, setSections] = useState({});
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await getHomepage();
        const norm = {};
        for (const key of Object.keys(data)) norm[key] = data[key].map(normalize);
        setSections(norm);
      } catch { /* état vide */ }
      finally { setLoading(false); }
    })();
  }, []);

  const goProduct = (p) => navigate(toProductUrl(p.id, p.name));

  return (
    <div className="accueil">

      {/* ── Hero ── */}
      <HeroSlider />

      {/* ── Sections articles ── */}
      <div id="sections-start">
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <Loader size={32} style={{ color: "var(--color-primary)" }} className="spin" />
          </div>
        ) : (
          SECTIONS.map(({ key, label, icon, color }) => (
            <ScrollSection
              key={key}
              label={label}
              icon={icon}
              color={color}
              data={sections[key]}
              onSelect={goProduct}
            />
          ))
        )}
      </div>

      {/* ── Réassurance — après le contenu ── */}
      <section className="reassurance-strip">
        {REASSURANCE.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="reassurance-item">
            <div className="reassurance-icon"><Icon size={20} /></div>
            <div>
              <strong>{label}</strong>
              <small>{sub}</small>
            </div>
          </div>
        ))}
      </section>

    </div>
  );
};

export default Accueil;
