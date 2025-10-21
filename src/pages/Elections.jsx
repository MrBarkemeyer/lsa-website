import { useState } from "react";

export default function ElectionPage({ electionData, displayElectionResults }) {
  if (!electionData || electionData.length === 0) {
    return <p>No election data available.</p>;
  }

  const CandidateCard = ({ candidate }) => {
    const [showPetition, setShowPetition] = useState(true);

    return (
      <div className="candidate">
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

  // Group data
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
        {renderedSections}
        <div>{displayElectionResults}</div>
      </section>
    </>
  );
}
