import { useState, useEffect } from "react";
import Papa from "papaparse"; // npm install papaparse

export default function ElectionPage({ displayElectionResults }) {
  const [electionData, setElectionData] = useState([]);

  // 🧠 Replace this with your Google Sheet's published CSV link
  const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/1Kk7Bs58DAWZ9pHvqD-RFvoV1ePeThQ1Yr9c5RsDeAq4/edit?usp=sharing";

  // 🗳️ Fetch Google Sheet data once when component loads
  useEffect(() => {
    fetch(SHEET_URL)
      .then(res => res.text())
      .then(csv => {
        const parsed = Papa.parse(csv, { header: true }).data;
        setElectionData(parsed);
      })
      .catch(err => console.error("Error loading sheet data:", err));
  }, []);

  // 🔍 Helper: extract IDs from Google Drive or YouTube links
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

  // 🎞️ Video embed handler
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

  // 🧩 Candidate card
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

  // 🗳️ Group candidates by board + position
  const groupedCandidates = {};
  for (let i = 0; i < electionData.length; i++) {
    const c = electionData[i];
    const boardType = c.Board;
    const grade = c.Grade;
    const position = c.Position;
    const sectionTitle = boardType === "LSA" ? `LSA ${grade}` : "SBC";

    if (!groupedCandidates[sectionTitle]) groupedCandidates[sectionTitle] = {};
    if (!groupedCandidates[sectionTitle][position])
      groupedCandidates[sectionTitle][position] = [];

    groupedCandidates[sectionTitle][position].push(c);
  }

  // 🎓 Position lists
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

  // 🧱 Render everything dynamically
  const renderedSections = Object.entries(groupedCandidates).map(
    ([sectionTitle, positions]) => {
      const isSBC = sectionTitle === "SBC";
      const positionsList = isSBC ? SBC_POSITIONS : LSA_POSITIONS;

      return (
        <div className="elections" key={sectionTitle} id={sectionTitle}>
          <h2 className="center election-title flex-center">
            {sectionTitle} Elections
          </h2>

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
    }
  );

  // 🧾 Final render
  return (
    <>
      <div className="title">
        <h1>
          Fall ’25 <br />
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
