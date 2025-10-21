import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Extract Google Drive file ID
function extractFileId(url) {
  const regex = /(?:\/file\/d\/|[?&]id=)([^/&?]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Component for a single candidate
const CandidateCard = ({ candidate, isVisible, toggleVisibility }) => {
  return (
    <div className="candidate">
      <h3>{candidate.Name}</h3>
      <button onClick={() => toggleVisibility(candidate.ID)}>
        {isVisible ? "Hide Petition" : "Show Petition"}
      </button>
      {isVisible && <p className="petition-text">{candidate.WrittenPetition}</p>}
      {candidate.VideoPetition && (
        <a
          className="petition-link"
          target="_blank"
          rel="noopener noreferrer"
          href={candidate.VideoPetition}
        >
          My Video Petition
        </a>
      )}
    </div>
  );
};

export default function ElectionPage({ electionData, displayElectionResults }) {
  // Track visibility for all candidates
  const [petitionVisibility, setPetitionVisibility] = useState({});

  // Initialize visibility when electionData changes
  useEffect(() => {
    const initialVisibility = {};
    electionData.forEach((candidate) => {
      // Use unique ID if exists; fallback to Name + Position + Grade
      const id = candidate.ID || `${candidate.Name}-${candidate.Position}-${candidate.Grade}`;
      initialVisibility[id] = true;
    });
    setPetitionVisibility(initialVisibility);
  }, [electionData]);

  const togglePetition = (candidateId) => {
    setPetitionVisibility((prev) => ({
      ...prev,
      [candidateId]: !prev[candidateId],
    }));
  };

  // Group candidates by board and position
  const groupedCandidates = {};
  electionData.forEach((candidate) => {
    const boardType = candidate.Board;
    const grade = candidate.Grade;
    const position = candidate.Position;
    const boardSectionTitle = boardType === "LSA" ? `LSA ${grade}` : "SBC";

    if (!groupedCandidates[boardSectionTitle]) groupedCandidates[boardSectionTitle] = {};
    if (!groupedCandidates[boardSectionTitle][position])
      groupedCandidates[boardSectionTitle][position] = [];

    groupedCandidates[boardSectionTitle][position].push(candidate);
  });

  const LSA_POSITIONS = [
    "President",
    "Vice President",
    "Secretary",
    "Treasurer",
    "Public Relations",
    "Historian",
  ];

  const SBC_POSITIONS = [
    "President",
    "Vice President",
    "Secretary",
    "Treasurer",
    "Event Coordinator",
    "Club Coordinator",
    "Dance Coordinator",
    "Public Relations",
    "Community Liaison",
  ];

  // Render sections
  const renderedSections = Object.keys(groupedCandidates).map((sectionTitle) => {
    const isSBC = sectionTitle === "SBC";
    const positionsList = isSBC ? SBC_POSITIONS : LSA_POSITIONS;
    const positionsInThisSection = groupedCandidates[sectionTitle];

    return (
      <div className="elections" key={sectionTitle} id={sectionTitle}>
        <h2 className="center election-title flex-center">
          {sectionTitle} Elections
        </h2>

        {positionsList.map((position) => (
          <div key={position}>
            <h3 className="center election-title flex-center">{position}</h3>
            {(positionsInThisSection[position] || []).map((candidate) => {
              const id =
                candidate.ID || `${candidate.Name}-${candidate.Position}-${candidate.Grade}`;
              return (
                <CandidateCard
                  candidate={candidate}
                  key={id}
                  isVisible={petitionVisibility[id]}
                  toggleVisibility={togglePetition}
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  });

  return (
    <>
      <div className="title">
        <h1>
          Fall '25 <br />
          Freshmen Elections
        </h1>
      </div>

      <section className="info-page">
        {/* Quick links optional */}
        {/* <div className="quick-links flex-center">
          <a href="#LSA 2028">LSA 2028 Elections</a>
          <a href="#LSA 2027">LSA 2027 Elections</a>
          <a href="#LSA 2026">LSA 2026 Elections</a>
          <a href="#SBC">SBC Elections</a>
        </div> */}
        {renderedSections}
        <div>{displayElectionResults}</div>
      </section>
    </>
  );
}
