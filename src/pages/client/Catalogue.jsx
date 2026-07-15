import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, X, Loader, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../../components/ProductCard";
import { getArticles } from "../../services/articles.service";
import { toProductUrl } from "../../utils/slug";
import "./Catalogue.css";

const BASE_URL = process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:5000";

const CATS = ["Tout", "Mobilier", "Électroménager", "Décoration", "Literie"];
const SORTS = [
  { val: "default",    label: "Par défaut"      },
  { val: "price_asc",  label: "Prix croissant"  },
  { val: "price_desc", label: "Prix décroissant" },
  { val: "rating",     label: "Mieux notés"     },
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

const Catalogue = () => {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const qParam         = searchParams.get("q") || "";

  const [search,      setSearch]      = useState(qParam);
  const [cat,         setCat]         = useState("Tout");
  const [sort,        setSort]        = useState("default");

  const [articles, setArticles] = useState([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [pages,    setPages]    = useState(1);
  const [loading,  setLoading]  = useState(true);

  const fetchArticles = useCallback(async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit: 20, sort };
      if (search)         params.q        = search;
      if (cat !== "Tout") params.categorie = cat;

      const { data } = await getArticles(params);
      setArticles((data.data || []).map(normalize));
      setTotal(data.total  || 0);
      setPage(data.page    || 1);
      setPages(data.pages  || 1);
    } catch {
      setArticles([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [search, cat, sort]);

  useEffect(() => {
    setPage(1);
    fetchArticles(1);
  }, [fetchArticles]);

  useEffect(() => {
    setSearch(qParam);
  }, [qParam]);

  const goProduct = (p) => navigate(toProductUrl(p.id, p.name));

  return (
    <div className="cat-page">
      {/* Barre de filtres */}
      <div className="cat-toolbar">
        <div className="cat-search-wrap">
          <Search size={15} className="cat-si" />
          <input
            type="search"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="cat-search"
          />
          {search && (
            <button className="cat-clear" onClick={() => setSearch("")}><X size={13} /></button>
          )}
        </div>

        <button className="cat-filter-btn" onClick={() => setSort(sort === "default" ? "rating" : "default")}>
          <SlidersHorizontal size={16} />
          Filtres
        </button>

        <select value={sort} onChange={(e) => setSort(e.target.value)} className="cat-sort">
          {SORTS.map((s) => <option key={s.val} value={s.val}>{s.label}</option>)}
        </select>
      </div>

      {/* Chips catégories */}
      <div className="cat-chips">
        {CATS.map((c) => (
          <button
            key={c}
            className={`cat-chip-btn ${cat === c ? "active" : ""}`}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Résultats */}
      <div className="cat-results-header">
        <span className="cat-count">{total} article{total > 1 ? "s" : ""}</span>
        {search && <span className="cat-query">pour « {search} »</span>}
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
          <Loader size={32} className="spin" style={{ color: "var(--color-primary)" }} />
        </div>
      ) : articles.length === 0 ? (
        <div className="empty-state">Aucun article trouvé.</div>
      ) : (
        <>
          <div className="grid-products">
            {articles.map((p) => (
              <ProductCard key={p.id} product={p} onClick={() => goProduct(p)} />
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="cat-pagination">
              <button
                className="cat-page-btn"
                disabled={page <= 1}
                onClick={() => fetchArticles(page - 1)}
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  className={`cat-page-btn ${n === page ? "active" : ""}`}
                  onClick={() => fetchArticles(n)}
                >
                  {n}
                </button>
              ))}

              <button
                className="cat-page-btn"
                disabled={page >= pages}
                onClick={() => fetchArticles(page + 1)}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Catalogue;
