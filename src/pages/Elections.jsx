import { useState } from "react";
import { Link } from "react-router-dom";

// Extract Google Drive file ID (if needed later)
function extractFileId(url) {
  const regex = /(?:\/file\/d\/|[?&]id=)([^/&?]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Component for a single candidate
const CandidateCard = ({ candidate }) => {
  const [showWritten, setShowWritten] = useState(true);
  const [showVideo, setShowVideo] = useState(true);
  const [showMedia, setShowMedia] = useState(true);

  return (
    <div className="candidate" key={candidate.Name}>
      <h3>{candidate.Name}</h3>

      {/* --- Written Petition --- */}
      <button
        className="petition-toggle"
        onClick={() => setShowWritten(prev => !prev)}
      >
        {showWritten ? "Hide Written Petition" : "Show Written Petition"}
      </button>
      {showWritten && candidate.WrittenPetition && (
        <p className="petition-text">{candidate.WrittenPetition}</p>
      )}

      {/* --- Video Petition --- */}
      {candidate.VideoPetition && (
        <>
          <button
            className="petition-toggle"
            onClick={() => setShowVideo(prev => !prev)}
          >
            {showVideo ? "Hide Video Petition" : "Show Video Petition"}
          </button>
          {showVideo && (
            <a
              className="petition-link"
              target="_blank"
              rel="noopener noreferrer"
              href={candidate.VideoPetition}
            >
              Watch My Video Petition
            </a>
          )}
        </>
      )}

      {/* --- Media Petition --- */}
      {candidate.MediaPetition && (
        <>
          <button
            className="petition-toggle"
            onClick={() => setShowMedia(prev => !prev)}
          >
            {showMedia ? "Hide Media Petition" : "Show Media Petition"}
          </button>
          {showMedia && (
            <a
              className="petition-link"
              target="_blank"
              rel="noopener noreferrer"
              href={candidate.MediaPetition}
            >
              View My Media Petition
            </a>
          )}
        </>
      )}
    </div>
  );
};

export default CandidateCard;
