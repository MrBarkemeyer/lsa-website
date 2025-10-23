import { useState } from "react";
import { Link } from "react-router-dom";

// Extract Google Drive file ID for embedding previews
function extractFileId(url) {
  const regex = /(?:\/file\/d\/|[?&]id=)([^/&?]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Component for a single candidate with petition toggles
const CandidateCard = ({ candidate }) => {
  const [showPetition, setShowPetition] = useState(true);

  const togglePetition = () => {
    setShowPetition((prev) => !prev);
  };

  // Support embedded Google Drive or YouTube video
  const getEmbedUrl = (url) => {
    if (!url) return null;
    // YouTube links
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    // Google Drive video preview
    const fileId = extractFileId(url);
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return url; // fallback to raw link
  };

  // Handle media petitions (like images or posters)
  const mediaFileId = extractFileId(candidate.MediaPetition);
  const mediaUrl = mediaFileId
    ? `https://drive.google.com/uc?export=view&id=${mediaFileId}`
    : candidate.MediaPetition;

  return (
    <div className="candidate">
      <h3>{candidate.Name}</h3>

      <button className="petition-toggle" onClick={togglePetition}>
        {showPetition ? "Hide Petition" : "Show Petition"}
      </button>

      {showPetition && (
        <div className="petition-section">
          {/* Written Petition */}
          {candidate.WrittenPetition && (
            <p className="petition-text">{candidate.WrittenPetition}</p>
          )}

          {/* Video Petition */}
          {candidate.VideoPetition && (
            <div className="video-container">
              <iframe
                width="560"
                height="315"
                src={getEmbedUrl(candidate.VideoPetition)}
                title={`${candidate.Name}'s Video Petition`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {/* Media Petition (like a poster or image) */}
          {candidate.MediaPetition && (
            <div className="media-container">
              <img
                src={mediaUrl}
                alt={`${candidate.Name}'s Media Petition`}
                className="petition-media"
              />
              <a
                href={candidate.MediaPetition}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Full Media Petition
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Main elections component
export default function ElectionPage({
  electionData = [],
  displayElectionResults = null,
}) {
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

        {positionsList.map((position) => (
          <div key={position}>
            <h3 className="center election-title flex-center">{position}</h3>

            {(positionsInThisSection[position] || []).map((candidate) => (
              <CandidateCard
                candidate={candidate}
                key={`${candidate.Name}-${candidate.Position}-${candidate.Grade}`}
              />
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
        <div className="quick-links flex-center">
          <a href="#LSA 2028">LSA 2028 Elections</a>
          <a href="#LSA 2027">LSA 2027 Elections</a>
          <a href="#LSA 2026">LSA 2026 Elections</a>
          <a href="#SBC">SBC Elections</a>
        </div>

        {renderedSections}

        {displayElectionResults && <div>{displayElectionResults}</div>}
      </section>
    </>
  );
}














ChatGPT can make mistakes. Check important info.
