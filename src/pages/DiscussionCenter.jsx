import React from "react";
import "./DiscussionCenter.css";

const DiscussionCenter = ({ conversations, onSelectConv, onBackToHome }) => {
  return (
    <div className="discussion-center">
      <header className="dc-header">
        <button className="back-btn" onClick={onBackToHome}>✕</button>
        <h2>Mes Discussions</h2>
      </header>

      <div className="conv-list">
        {conversations.length > 0 ? (
          conversations.map((conv, index) => (
            <div key={index} className="conv-item" onClick={() => onSelectConv(conv)}>
              <img src={conv.image} alt={conv.name} />
              <div className="conv-info">
                <h3>{conv.name}</h3>
                <p className="last-msg">Cliquez pour reprendre la discussion...</p>
              </div>
              <div className="arrow">›</div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>Aucune discussion en cours.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscussionCenter;