import { useState, useEffect } from "react";
import Papa from "papaparse"; // npm install papaparse

export default function ElectionPage({ displayElectionResults }) {
  const [electionData, setElectionData] = useState([]);

  // 🧠 Your published Google Sheet CSV link
  const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/pub?output=csv";

  // Load data from the sheet
  useEffect(() => {
    fetch(SHEET_URL)
      .then(res => res.text())
      .then(csv => {
        const parsed = Papa.parse(csv, { header: true }).data;
        setElectionData(parsed);
      })
      .catch(err => console.error("Error loading sheet data:", err));
  }, []);

  // Extract Google Drive or YouTube video IDs
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

  // Component for displaying videos
  const VideoEmbed = ({ url }) => {
    const info = extractFileId(url);
    if (!info) return null;

    if (info.type === "drive") {
      return (
        <iframe
          src={`https://drive.google.com/file/d/${info.id}/preview`}
          width="480"
          height="270"
          allow="autoplay"
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
          title="YouTube Petition"
        />
      );
    }
    return null;
  };

  // Candidate card
  const CandidateCard = ({ candidate }) => {
    const [showPetition, setShowPetition] = useState(false);

    return (
      <div className="candidate">
        <h3>{candidate.Name}</h3>
        <button onClick={() => setShowPetition(p => !p)}>
          {showPetition ? "Hide Petition" : "Show Petition"}
        </button>

        {showPetition && (
          <>
            {candidate.WrittenPetition && (
              <p className="petition-text">{candidate.WrittenPetition}</p>
            )}

            {candidate.VideoPetition && (
              <div className="video-container">
                <VideoEmbed url={candidate.VideoPetition} />
              </div>
            )}

            {candidate.Media && (
              <img
                src={candidate.Media}
                alt={`${candidate.Name}'s media`}
                className="petition-media"
                style={{ width: "300px", borderRadius: "8px", marginTop: "10px" }}
              />
            )}
          </>
        )}
      </div>
    );
  };

  // Handle missing data
  if (!electionData.length) {
    return <p>Loading election data...</p>;
  }

  // Group data by board and position
  const groupedCandidates = {};
  for (const c of electionData) {
    const sectionTitle = c.Board === "LSA" ? `LSA ${c.Grade}` : "SBC";
    if (!groupedCandidates[sectionTitle]) groupedCandidates[sectionTitle] = {};
    if (!groupedCandidates[sectionTitle][c.Position])
      groupedCandidates[sectionTitle][c.Position] = [];
    groupedCandidates[sectionTitle][c.Position].push(c);
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

  return (
    <>
      <div className="title">
        <h1>
          Fall '25 <br /> Freshmen Elections
        </h1>
      </div>

      <section className="info-page">
        {Object.entries(groupedCandidates).map(([sectionTitle, positions]) => {
          const isSBC = sectionTitle === "SBC";
          const positionsList = isSBC ? SBC_POSITIONS : LSA_POSITIONS;
          return (
            <div className="elections" key={sectionTitle} id={sectionTitle}>
              <h2 className="center">{sectionTitle} Elections</h2>
              {positionsList.map(position => (
                <div key={position}>
                  <h3 className="center">{position}</h3>
                  {(positions[position] || []).map(candidate => (
                    <CandidateCard candidate={candidate} key={candidate.Name} />
                  ))}
                </div>
              ))}
            </div>
          );
        })}

        <div>{displayElectionResults}</div>
      </section>
    </>
  );
}
