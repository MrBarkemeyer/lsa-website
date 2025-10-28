import { useState } from "react";
import { Link } from "react-router-dom";

// Component for a single candidate with petition toggles
const CandidateCard = ({ candidate }) => {
  const [showPetition, setShowPetition] = useState(true);

  const togglePetition = () => setShowPetition((prev) => !prev);

  const extractFileId = (url) => {
    if (!url) return null;
    const regex = /(?:\/file\/d\/|[?&]id=)([^/&?]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getEmbedUrl = (url) => {
    if (!url) return null;
    if (url.includes("youtube.com/watch?v=")) {
      return url.replace("watch?v=", "embed/");
    }
    const fileId = extractFileId(url);
    if (fileId) {
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return null;
  };

  const getMediaUrl = (url) => {
    if (!url) return null;
    if (url.match(/\.(jpeg|jpg|png|gif|webp)$/i)) return url;
    const fileId = extractFileId(url);
    if (fileId) return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
    return url;
  };

  const videoUrl = getEmbedUrl(candidate.VideoPetition);
  const mediaUrl = getMediaUrl(candidate.MediaPetition);

  return (
    <div className="candidate">
      <h3>{candidate.Name}</h3>

      <button className="petition-toggle" onClick={togglePetition}>
        {showPetition ? "Hide Petition" : "Show Petition"}
      </button>

      {showPetition && (
        <div className="petition-section">
          {candidate.WrittenPetition && (
            <p className="petition-text">{candidate.WrittenPetition}</p>
          )}

          {videoUrl && (
            <div className="video-container">
              <iframe
                width="560"
                height="315"
                src={videoUrl}
                title={`${candidate.Name}'s Video Petition`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {mediaUrl && (
            <div className="media-container">
              <img
                src={mediaUrl}
                alt={`${candidate.Name}'s Media Petition`}
                className="petition-media"
                style={{ maxWidth: "100%", height: "auto", borderRadius: "12px", marginTop: "10px" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
              <a
                href={candidate.MediaPetition}
                target="_blank"
                rel="noopener noreferrer"
                className="media-link"
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
export default function ElectionPage({ electionData = [], displayElectionResults = null }) {
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

  const LSA_POSITIONS = ["President","Vice President","Secretary","Treasurer","Public Relations","Historian"];
  const SBC_POSITIONS = ["President","Vice President","Secretary","Treasurer","Event Coordinator","Club Coordinator","Dance Coordinator","Public Relations","Community Liaison"];

  const sectionTitles = Object.keys(groupedCandidates);

  const renderedSections = sectionTitles.map((sectionTitle) => {
    const isSBC = sectionTitle === "SBC";
    const positionsList = isSBC ? SBC_POSITIONS : LSA_POSITIONS;
    const positionsInThisSection = groupedCandidates[sectionTitle];

    return (
      <div className="elections" key={sectionTitle} id={sectionTitle}>
        <h2 className="center election-title flex-center">{sectionTitle} Elections</h2>

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
  });

  return (
    <>
      <div className="title">
        <h1>Fall '25 <br /> Freshmen Elections</h1>
      </div>

      <section className="info-page">
        {renderedSections}
        {displayElectionResults && <div>{displayElectionResults}</div>}
      </section>
    </>
  );
}
