import React, { useState, useEffect } from "react";
import { getStandings } from "../../api/nba";
import "./BlindRankPage.css";
import TeamReveal from "../../components/TeamReveal/TeamReveal";
import RankSlots from "../../components/RankSlots/rankSlots";

export default function BlindRankPage() {
  const [conference, setConference] = useState(null); 
  const [teams, setTeams] = useState([]);           // the five shuffled teams to rank
  const [ranked, setRanked] = useState([]);           // users choice
  const [currentIndex, setCurrentIndex] = useState(0);    // keeps track of which team is being ranked

  useEffect(() => {
    if (!conference) return;                // If no conference selected, don't load

    async function load() {
      try {
        const standings = await getStandings();
        const filtered = standings.filter(              // only get teams from selected conference
          (s) => s.conference.name.toLowerCase() === conference
        );

        const allTeams = filtered.map((s) => ({         // map to team conference rank
          ...s.team,
          realRank: s.conference.rank,
        }));

        const shuffled = allTeams.sort(() => Math.random() - 0.5);      // shuffle teams around
        setTeams(shuffled.slice(0, 5));                               // take first five teams  
        setRanked(new Array(5).fill(null));                         // initialize empty array for users choices
        setCurrentIndex(0);
      } catch (err) {
        console.error(err);
      }
    }

    load();
  }, [conference]);

  function handleChooseSlot(slotIndex) {
    if (ranked[slotIndex] !== null) return;

    const newRanked = [...ranked];
    newRanked[slotIndex] = teams[currentIndex];
    setRanked(newRanked);
    setCurrentIndex(currentIndex + 1);
  }

  const currentTeam = teams[currentIndex];
  const isFinished = currentIndex >= teams.length;

  if (!conference) {
    return (
      <div className="conference-select-container">
        <h1>Blind Rank NBA Teams 2021</h1>
        <h2>Select a Conference to Begin</h2>
        <button className="conference-button" onClick={() => setConference("west")}>
          Western Conference
        </button>
        <button className="conference-button" onClick={() => setConference("east")}>
          Eastern Conference
        </button>
      </div>
    );
  }

  return (
    <div className="blindrank-container">
      <h1>
        Blind Rank NBA Teams 2021 -{" "}
        {conference.charAt(0).toUpperCase() + conference.slice(1)}ern Conference
      </h1>

      {isFinished ? (
        <FinalRanking ranked={ranked} />
      ) : (
        <>
          <TeamReveal team={currentTeam} />
          <RankSlots ranked={ranked} onChoose={handleChooseSlot} />
        </>
      )}
    </div>
  );
}

// ---------------- Final Ranking Component ----------------

export function FinalRanking({ ranked }) {
  const validRanked = ranked.filter((team) => team != null);
  const correctOrder = [...validRanked].sort((a, b) => a.realRank - b.realRank);

  return (
    <div className="final-ranking">
      <h2>Final Ranking</h2>
      <div className="final-ranking-list">
        {validRanked.map((team, i) => {
          const isCorrect = team.id === correctOrder[i].id;
          return (
            <div
              key={team.id}
              className={`final-ranking-item ${isCorrect ? "correct" : "incorrect"}`}
            >
              <div>
                <strong>Rank {i + 1}:</strong>{" "}
                <img src={team.logo} width={38} alt={team.name} className="team-logo" />
                <span className="team-name">{team.name}</span>
              </div>

              <div className="ranking-feedback">
                {isCorrect ? (
                  <span>
                    Correct! This team's actual conference rank is <b>#{team.realRank}</b>.
                  </span>
                ) : (
                  <span>
                    Incorrect. This team's actual conference rank is <b>#{team.realRank}</b>.
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <button className="play-again-button" onClick={() => window.location.reload()}>
        Play Again
      </button>
    </div>
  );
}
