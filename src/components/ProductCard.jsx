import React from "react";
import { Star, StarHalf } from "lucide-react";
import "./ProductCard.css";

const StarRating = ({ rating = 0, count }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<Star key={i} size={12} className="star filled" />);
    } else if (rating >= i - 0.5) {
      stars.push(<StarHalf key={i} size={12} className="star filled" />);
    } else {
      stars.push(<Star key={i} size={12} className="star" />);
    }
  }
  return (
    <div className="pc-stars">
      {stars}
      {count !== undefined && <span className="pc-count">({count})</span>}
    </div>
  );
};

const ProductCard = ({ product, onClick }) => {
  const {
    name, price, oldPrice, discount, image,
    rating = 0, reviewCount, category, isPromoted
  } = product;

  return (
    <div className="pc-card" onClick={onClick} tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}>
      <div className="pc-image-wrap">
        <img
          src={image}
          alt={name}
          className="pc-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect fill='%23f3f4f6' width='200' height='200'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-size='14' font-family='sans-serif'%3EImage%3C/text%3E%3C/svg%3E";
          }}
        />
        {isPromoted && <span className="pc-promo-badge">Sponsorisé</span>}
        {discount && <span className="pc-discount-badge">{discount}</span>}
      </div>

      <div className="pc-body">
        {category && <span className="pc-category">{category}</span>}
        <h3 className="pc-name">{name}</h3>

        {rating > 0 && (
          <StarRating rating={rating} count={reviewCount} />
        )}

        <div className="pc-price-row">
          <span className="pc-price">{price} <span className="pc-currency">dh</span></span>
          {oldPrice && <span className="pc-old-price">{oldPrice} dh</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
