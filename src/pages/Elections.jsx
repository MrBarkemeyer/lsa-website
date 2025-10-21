import { useState } from "react";
import { Link } from "react-router-dom";

export default function ElectionPage({ electionData, displayElectionResults }) {
  // Optional helper (currently unused)
  function extractFileId(url) {
    const regex = /(?:\/file\/d\/|[?&]id=)([^/&?]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  const CandidateCard = ({ candidate }) => {
    const [showPetition, setShowPetition] = useState(true);

    return (
      <div className="candidate" key={candidate.Name}>
        <h3>{candidate.Name}</h3>
        <button className="petition-toggle" onClick={() => setShowPetition(p => !p)}>
          {showPetition ? "Hide Petition" : "Show Petition"}
        </button>

        {showPetition && <p className="petition-text">{candidate.WrittenPetition}</p>}

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

  // Group data by board section and position
  const groupedCandidates = {};
  for (const candidate of electionData) {
    const { Board, Grade, Position } = candidate;
    const sectionTitle = Board === "LSA" ? `LSA ${Grade}` : "SBC";

    groupedCandidates[sectionTitle] ??= {};
    groupedCandidates[sectionTitle][Position] ??= [];
    groupedCandidates[sectionTitle][Position].push(candidate);
  }

  const LSA_POSITIONS = [
    "President",
    "Vice President",
    "Secretary",
    "Treasurer",
    "Public Relations",
    "Historian"
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
    "Community Liaison"
  ];

  const renderedSections = Object.entries(groupedCandidates).map(([sectionTitle, positions]) => {
    const isSBC = sectionTitle === "SBC";
    const positionsList = isSBC ? SBC_POSITIONS : LSA_POSITIONS;

    return (
      <div className="elections" key={sectionTitle} id={sectionTitle}>
        <h2 className="center election-title flex-center">{sectionTitle} Elections</h2>
        {positionsList.map(position => (
          <div key={position}>
            <h3 className="center election-title flex-center">{position}</h3>
            {(positions[position] || []).map(candidate => (
              <CandidateCard candidate={candidate} key={candidate.Name} />
            ))}
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
        {/* Example navigation */}
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
