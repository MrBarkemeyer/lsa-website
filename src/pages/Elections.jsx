import { useState } from "react";
import { Link } from "react-router-dom";
import electionData from "../../data/electionsdata"; 

// Extract Google Drive file ID
function extractFileId(url) {
  const regex = /(?:\/file\/d\/|[?&]id=)([^/&?]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Component for a single candidate
const CandidateCard = ({ candidate }) => {
  const [showPetition, setShowPetition] = useState(true);
  const togglePetition = () => setShowPetition((prev) => !prev);

  // Prepare Google Drive embed links
  const videoId = candidate.VideoPetition ? extractFileId(candidate.VideoPetition) : null;
  const mediaId = candidate.MediaPetition ? extractFileId(candidate.MediaPetition) : null;

  const videoEmbedUrl = videoId
    ? `https://drive.google.com/file/d/${videoId}/preview`
    : candidate.VideoPetition;

  const imageEmbedUrl = mediaId
    ? `https://drive.google.com/uc?export=view&id=${mediaId}`
    : candidate.MediaPetition;

  return (
    <div className="candidate">
      <h3>{candidate.Name}</h3>

      <button className="petition-toggle" onClick={togglePetition}>
        {showPetition ? "Hide Petition" : "Show Petition"}
      </button>

      {showPetition && (
        <p className="petition-text">{candidate.WrittenPetition}</p>
      )}

      {/* Embedded video petition */}
      {candidate.VideoPetition && (
        <div className="video-container">
          {videoId ? (
            <iframe
              src={videoEmbedUrl}
              title={`${candidate.Name}'s Video Petition`}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="candidate-video-petition"
            ></iframe>
          ) : (
            <a
              className="petition-link"
              target="_blank"
              rel="noopener noreferrer"
              href={candidate.VideoPetition}
            >
              Watch My Video Petition
            </a>
          )}
        </div>
      )}

      {/* Embedded image/media petition */}
      {candidate.MediaPetition && (
        <div className="media-container">
          {mediaId ? (
            <img
              src={imageEmbedUrl}
              alt={`${candidate.Name}'s Media Petition`}
              className="candidate-media-petition"
            />
          ) : (
            <a
              className="petition-link"
              target="_blank"
              rel="noopener noreferrer"
              href={candidate.MediaPetition}
            >
              View My Media Petition
            </a>
          )}
        </div>
      )}
    </div>
  );
};

// Main elections component
export default function ElectionPage({ displayElectionResults = null }) {
  return (
    <>
      <div className="title">
        <h1>Election Candidates</h1>
      </div>

      <section className="info-page">
        {/* Render all candidates */}
        {electionData.map((candidate) => (
          <CandidateCard key={candidate.Name} candidate={candidate} />
        ))}

        {/* Optional results display */}
        {displayElectionResults && <div>{displayElectionResults}</div>}
      </section>
    </>
  );
}
