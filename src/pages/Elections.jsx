import { useState } from "react";

export default function ElectionPage({ electionData, displayElectionResults }) {
  // 🔍 Helper: extract file or video ID from Google Drive or YouTube URLs
  function extractFileId(url) {
    if (!url) return null;
    if (url.includes("drive.google.com")) {
      const match = url.match(/[-\w]{25,}/);
      return match ? { type: "drive", id: match[0] } : null;
    }
    if (url.includes("youtu.be") || url.includes("youtube.com")) {
      const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/
      );
      return match ? { type: "youtube", id: match[1] } : null;
    }
    return null;
  }

  // 🎞️ Automatically embed Drive or YouTube videos
  const VideoEmbed = ({ url }) => {
    const info = extractFileId(url);
    if (!info) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" className="petition-link">
          Watch Petition
        </a>
      );
    }

    if (info.type === "drive") {
      return (
        <iframe
          src={`https://drive.google.com/file/d/${info.id}/preview`}
          width="480"
          height="270"
          allow="autoplay"
          className="video-frame"
          title="Drive Petition"
        />
      );
    }

    if (info.type === "youtube") {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${info.id}`}
          width="480"
          height="270"
          allow="autoplay"
          className="video-frame"
          title="YouTube Petition"
        />
      );
    }

    return null;
  };

  // 🧩 Candidate component
  const CandidateCard = ({ candidate }) => {
    const [showPetition, setShowPetition] = useState(true);

    const togglePetition = () => setShowPetition(prev => !prev);

    return (
      <div className="candidate">
        <h3>{candidate.Name}</h3>
        <button className="petition-toggle" onClick={togglePetition}>
          {showPetition ? "Hide Petition" : "Show Petition"}
        </button>

        {showPetition && <p className="petition-text">{candidate.WrittenPetition}</p>}

        {candidate.VideoPetition && (
          <div className="video-container">
            <VideoEmbed url={candidate.VideoPetition} />
          </div>
        )}
      </div>
    );
  };

  // 🧠 Guard: handle missing or empty election data
  if (!electionData || electionData.length === 0) {
    return <p>No election data available.</p>;
  }

  // 🗳️ Group data by section and position
  const groupedCandidates = {};

  for (let i = 0; i < electionData.length; i++) {
    const candidate = electionData[i];
    const boardType = candidate.Board;
    const grade = candidate.Grade;
    const position = candidate.Position;
    const boardSectionTitle = boardType === "LSA" ? `LSA ${grade}` : "SBC";

    if (!groupedCandidates[boardSectionTitle]) groupedCandidates[boardSectionTitle] = {};
    if (!groupedCandidates[boardSectionTitle][position]) groupedCandidates[boardSectionTitle][position] = [];

    groupedCandidates[boardSectionTitle][position].push(candidate);
  }

  // 🎓 Position orders
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

  // 🧱 Render dynamic sections
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

  // 🧾 Final return
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
