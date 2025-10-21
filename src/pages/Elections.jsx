import { useState } from "react";

export default function ElectionPage({ electionData, displayElectionResults }) {
  // Optional helper (currently unused)
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
      <div className="candidate">
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
      </div>
    );
  };

  // 🧠 Guard: handle missing or empty election data
  if (!electionData || electionData.length === 0) {
    return <p>No election data available.</p>;
  }

  // Group data by board section and position
  const groupedCandidates = {};

  for (let i = 0; i < electionData.length; i++) {
    const candidate = electionData[i];
    const boardType = candidate.Board;
    const grade = candidate.Grade;
    const position = candidate.Position;

    const boardSectionTitle = boardType === "LSA" ? `LSA ${grade}` : "SBC";

    if (!groupedCandidates[boardSectionTitle]) {
      groupedCandidates[boardSectionTitle] = {};
    }

    if (!groupedCandidates[boardSectionTitle][position]) {
      groupedCandidates[boardSectionTitle][position] = [];
    }

    groupedCandidates[boardSectionTitle][position].push(candidate);
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

  const renderedSections = [];

  for (const sectionTitle in groupedCandidates) {
    const isSBC = sectionTitle === "SBC";
    const positionsList = isSBC ? SBC_POSITIONS : LSA_POSITIONS;
    const positionsInThisSection = groupedCandidates[sectionTitle];

    renderedSections.push(
      <div className="elections" key={sectionTitle} id={sectionTitle}>
        <h2 className="center election-title flex-center">
          {sectionTitle} Elections
        </h2>

        {positionsList.map(position => (
          <div key={position}>
            <h3 className="center election-title flex-center">{position}</h3>

            {(positionsInThisSection[position] || []).map(candidate => (
              <CandidateCard candidate={candidate} key={candidate.Name} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="title">
        <h1>
          Fall '25 <br />
          Freshmen Elections
        </h1>
      </div>

      <section className="info-page">
        {/* Uncomment if you want quick nav */}
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
