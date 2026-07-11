import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Star, Minus, Plus, ShoppingCart,
  ShieldCheck, Truck, RotateCcw, Loader,
  ChevronLeft, ChevronRight, Store
} from "lucide-react";
import ProductCard from "../../components/ProductCard";
import { getArticle, getArticles } from "../../services/articles.service";
import { idFromSlug, toProductUrl } from "../../utils/slug";
import "./ProductDetail.css";

const BASE_URL = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";

const normalizeImg = (img) =>
  !img ? null : img.startsWith("http") ? img : BASE_URL + img;

const normalize = (a) => ({
  id:          a.id,
  name:        a.nom,
  price:       parseFloat(a.prix),
  oldPrice:    a.prix_barre ? parseFloat(a.prix_barre) : null,
  discount:    a.prix_barre ? Math.round((1 - a.prix / a.prix_barre) * 100) : null,
  image:       normalizeImg(a.image),
  rating:      parseFloat(a.note_moy) || 0,
  reviewCount: parseInt(a.nb_avis)    || 0,
  category:    a.categorie,
  isPromoted:  !!a.is_promoted,
  boutique:    a.boutique,
  description: a.description,
  avis:        a.avis || [],
});

/* ── Étoiles ── */
const Stars = ({ rating, size = 16 }) => (
  <div className="pd-stars">
    {[1,2,3,4,5].map((i) => (
      <Star key={i} size={size}
        className={`pd-star ${i <= Math.round(rating) ? "filled" : ""}`} />
    ))}
    <span className="pd-rating-val">{rating.toFixed(1)}</span>
  </div>
);

/* ── Scroll row avec flèches (réutilisé depuis Accueil) ── */
const RelatedRow = ({ items, onSelect }) => {
  const rowRef = useRef(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(false);

  const check = useCallback(() => {
    const el = rowRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    check();
    const el = rowRef.current;
    if (!el) return;
    el.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => { el.removeEventListener("scroll", check); window.removeEventListener("resize", check); };
  }, [items, check]);

  const scroll = (dir) => rowRef.current?.scrollBy({ left: dir * 480, behavior: "smooth" });

  if (!items.length) return null;
  return (
    <div className="scroll-wrap">
      {canLeft  && <button className="scroll-arrow scroll-arrow--left"  onClick={() => scroll(-1)}><ChevronLeft  size={20} /></button>}
      <div className="scroll-row" ref={rowRef}>
        {items.map((p) => <ProductCard key={p.id} product={p} onClick={() => onSelect(p)} />)}
      </div>
      {canRight && <button className="scroll-arrow scroll-arrow--right" onClick={() => scroll(1)}><ChevronRight size={20} /></button>}
    </div>
  );
};

/* ── Page principale ── */
const ProductDetail = () => {
  const { slug }    = useParams();
  const navigate    = useNavigate();
  const [product, setProduct]   = useState(null);
  const [related,  setRelated]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [qty, setQty]           = useState(1);
  const [added, setAdded]       = useState(false);

  const id = idFromSlug(slug);

  useEffect(() => {
    if (!id) { navigate("/", { replace: true }); return; }
    setLoading(true);
    setQty(1);
    window.scrollTo({ top: 0, behavior: "smooth" });

    (async () => {
      try {
        const { data } = await getArticle(id);
        const p = normalize(data);
        setProduct(p);
        document.title = `${p.name} — SupplyLink`;

        // Produits similaires : même catégorie, exclure le courant
        const { data: rel } = await getArticles({ categorie: p.category, limit: 10 });
        setRelated(rel.data.filter((a) => a.id !== id).slice(0, 8).map(normalize));
      } catch {
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    })();

    return () => { document.title = "SupplyLink"; };
  }, [id, navigate]);

  const handleAddToCart = () => {
    // TODO: intégrer CartContext
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
      <Loader size={32} className="spin" style={{ color: "var(--color-primary)" }} />
    </div>
  );

  if (!product) return null;

  return (
    <div className="pd-page">
      {/* Fil d'Ariane + retour */}
      <nav className="pd-breadcrumb">
        <button onClick={() => navigate(-1)} className="pd-back">
          <ArrowLeft size={16} /> Retour
        </button>
        <span className="pd-breadcrumb-sep">/</span>
        <button onClick={() => navigate("/catalogue")} className="pd-breadcrumb-link">
          {product.category}
        </button>
        <span className="pd-breadcrumb-sep">/</span>
        <span className="pd-breadcrumb-current">{product.name}</span>
      </nav>

      {/* Layout principal */}
      <div className="pd-layout">
        {/* Image */}
        <div className="pd-image-col">
          <div className="pd-image-wrap">
            {product.image
              ? <img src={product.image} alt={product.name} className="pd-image" />
              : <div className="pd-image-placeholder"><ShoppingCart size={48} strokeWidth={1} /></div>
            }
            {product.discount && (
              <span className="pd-badge-discount">-{product.discount}%</span>
            )}
            {product.isPromoted && (
              <span className="pd-badge-promo">Sponsorisé</span>
            )}
          </div>
        </div>

        {/* Infos */}
        <div className="pd-info-col">
          <span className="pd-category">{product.category}</span>
          <h1 className="pd-title">{product.name}</h1>

          {product.boutique && (
            <div className="pd-boutique">
              <Store size={13} />
              <span>Vendu par <strong>{product.boutique}</strong></span>
            </div>
          )}

          {product.rating > 0 && (
            <div className="pd-rating-row">
              <Stars rating={product.rating} />
              <span className="pd-review-count">({product.reviewCount} avis)</span>
            </div>
          )}

          <div className="pd-price-block">
            <span className="pd-price">{product.price.toLocaleString()} <span>dh</span></span>
            {product.oldPrice && (
              <span className="pd-old-price">{product.oldPrice.toLocaleString()} dh</span>
            )}
          </div>

          {product.description && (
            <p className="pd-description">{product.description}</p>
          )}

          {/* Achat */}
          <div className="pd-purchase">
            <div className="pd-qty">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>
                <Minus size={16} />
              </button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => q + 1)}>
                <Plus size={16} />
              </button>
            </div>
            <button
              className={`btn btn-primary btn-lg pd-add-btn ${added ? "added" : ""}`}
              onClick={handleAddToCart}>
              <ShoppingCart size={18} />
              {added ? "Ajouté !" : "Ajouter au panier"}
            </button>
          </div>

          {/* Réassurance */}
          <div className="pd-reas">
            <div className="pd-reas-item"><Truck size={15} /><span>Livraison partout au Maroc</span></div>
            <div className="pd-reas-item"><ShieldCheck size={15} /><span>Paiement 100% sécurisé</span></div>
            <div className="pd-reas-item"><RotateCcw size={15} /><span>Retour sous 7 jours</span></div>
          </div>
        </div>
      </div>

      {/* Avis clients */}
      {product.avis?.length > 0 && (
        <div className="pd-reviews">
          <h2 className="pd-section-title">Avis clients ({product.avis.length})</h2>
          <div className="pd-reviews-list">
            {product.avis.map((av, i) => (
              <div key={i} className="pd-review-item">
                <div className="pd-review-head">
                  <div className="pd-reviewer-avatar">{av.prenom?.[0]?.toUpperCase()}</div>
                  <div>
                    <strong className="pd-reviewer-name">{av.prenom}</strong>
                    <Stars rating={av.note} size={13} />
                  </div>
                  <span className="pd-review-date">
                    {new Date(av.created_at).toLocaleDateString("fr-MA")}
                  </span>
                </div>
                {av.commentaire && <p className="pd-review-text">{av.commentaire}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Produits similaires */}
      {related.length > 0 && (
        <div className="pd-related">
          <h2 className="pd-section-title">Produits similaires</h2>
          <RelatedRow
            items={related}
            onSelect={(p) => navigate(toProductUrl(p.id, p.name))}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
