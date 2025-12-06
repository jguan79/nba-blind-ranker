import React from "react";
import "./TeamReveal.css";

export default function TeamReveal({ team }) {
  if (!team) return null;

  return (
    <div className="teamreveal-container">
      <img width={80} src={team.logo} alt={team.name} className="teamreveal-logo" />
      <h2 className="teamreveal-name">{team.name}</h2>
    </div>
  );
}
