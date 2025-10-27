import { useState } from "react";
import { Link } from "react-router-dom";

// Extract Google Drive file ID
function extractFileId(url) {
  const regex = /(?:\/file\/d\/|[?&]id=)([^/&?]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Component for a single candidate with dropdown
const CandidateCard = ({ candidate }) => {
  const [showPetition, setShowPetition] = useState(true);

  const togglePetition = () => {
    setShowPetition(prev => !prev);
  };

  return (
    <div className="candidate" key={candidate.Name}>
      <h3>{candidate.Name}</h3>
      <button className="petition-toggle" onClick={togglePetition}>
        {showPetition ? "Hide Petition" : "Show Petition"}
      </button>

      {showPetition && (
        <p className="petition-text">{candidate.WrittenPetition}</p>
      )}

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

      {candidate.MediaPetition && (
        <a
          className="petition-link"
          target="_blank"
          rel="noopener noreferrer"
          href={candidate.MediaPetition}
        >
          My Media Petition
        </a>
      )}
    </div>
  );
};

// Main elections component
export default function ElectionPage({ electionData = [], displayElectionResults = null }) {
  // Group data by board section and position
  const groupedCandidates = {};

  // Render grouped sections (assuming you have logic elsewhere)
  const renderedSections = Object.keys(groupedCandidates).map((section) => (
    <div key={section} id={section}>
      <h2>{section}</h2>
      {groupedCandidates[section].map(candidate => (
        <CandidateCard key={candidate.Name} candidate={candidate} />
      ))}
    </div>
  ));

  return (
    <>
      <div className="title">
        <h1>Election Page</h1>
      </div>

      <section className="info-page">
        <div className="quick-links flex-center">
          <a href="#LSA2028">LSA 2028 Elections</a>
          <a href="#LSA2027">LSA 2027 Elections</a>
          <a href="#LSA2026">LSA 2026 Elections</a>
          <a href="#SBC">SBC Elections</a>
        </div>

        {/* Render grouped candidate sections */}
        {renderedSections}

        {/* Optionally, render custom election results if provided */}
        {displayElectionResults && <div>{displayElectionResults}</div>}
      </section>
    </>
  );
}
