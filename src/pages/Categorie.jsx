import React from "react";

const Categorie = ({ onCategorySelect }) => {
  const categoriesList = [
    "Electronique", "Papeterie",
    "Construction", "Meubles",
    "Cuisine", "Technologie",
    "Décoration", "Plomberie"
  ];

  return (
    <div className="categories-container" style={{ padding: "40px 20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(2, 1fr)", 
        gap: "40px 30px", 
        padding: "20px"
      }}>
        {categoriesList.map((cat, index) => (
          <div
            key={index}
            onClick={() => onCategorySelect(cat)}
            style={{
              backgroundColor: "#fff",
              border: "7px solid #d9d9d9",
              borderRadius: "18px",
              height: "160px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
              transition: "all 0.25s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.borderColor = "#009fe3";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,159,227,0.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "#d9d9d9";
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.04)";
            }}
          >
            <span style={{ 
              fontSize: "24px", 
              fontWeight: "800", 
              color: "#222",
              letterSpacing: "0.5px"
            }}>
              {cat}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categorie;