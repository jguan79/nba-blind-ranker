import React from "react";
import "./RankSlots.css";

export default function RankSlots({ ranked, onChoose }) {
  return (
    <div className="rankslots-container">
      {ranked.map((team, i) => (
        <button
          key={i}
          onClick={() => onChoose(i)}
          className={`rankslots-button ${team ? "ranked" : "unranked"}`}
        >
          {team ? team.name : `Rank ${i + 1}`}
        </button>
      ))}
    </div>
  );
}
