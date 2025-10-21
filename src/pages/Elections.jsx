import { useState, useEffect } from "react";
import Papa from "papaparse";

export default function ElectionPage({ displayElectionResults }) {
  const [electionData, setElectionData] = useState([]);

  // CSV export URL from Google Sheets
  const SHEET_URL =
    "https://docs.google.com/spreadsheets/d/1Kk7Bs58DAWZ9pHvqD-RFvoV1ePeThQ1Yr9c5RsDeAq4/export?format=csv&gid=654173408";

  // Load data from the sheet
  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.text())
      .then((csv) => {
        const parsed = Papa.parse(csv, { header: true }).data;
        setElectionData(parsed.filter(row => row.Name)); // Filter out empty rows
      })
      .catch((err) => console.error("Error loading sheet data:", err));
  }, []);

  // Extract IDs from Google Drive or YouTube links
  function extractFileId(url) {
    if (!url) return null;

    // Google Drive file
    if (url.includes("drive.google.com")) {
      const match = url.match(/[-\w]{25,}/);
      return match ? { type: "drive", id: match[0] } : null;
    }

    // YouTube
    if (url.includes("youtu.be") || url.includes("youtube.com")) {
      const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/
      );
      return match ? { type: "youtube", id: match[1] } : null;
    }

    return null;
  }

  // Component to embed video
  const VideoEmbed = ({ url }) => {
    const info = extractFileId(url);
    if (!info) return null;

    if (info.type === "drive") {
      return (
        <iframe
          src={`https://drive.google.com/file/d/${info.id}/preview`}
          width="480"
          height="270"
          allow="autoplay; encrypted-media"
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
          allow="autoplay; encrypted-media"
          title="YouTube Petition"
        />
      );
    }

    return null;
  };

  // Candidate card
  const CandidateCard = ({ candidate }) => {
    const [showPetition] = useState(true); // Show by default

    // Transform Google Drive media URL for direct display
    const mediaUrl =
      candidate.Media && candidate.Media.includes("drive.google.com")
        ? `https://drive.google.com/uc?export=view&id=${extractFileId(
            candidate.Media
          ).id}`
        : candidate.Media;

    return (
      <div className="candidate" style={{ marginBottom: "20px" }}>
        <h3>{candidate.Name}</h3>

        {showPetition && (
          <>
            {candidate.WrittenPetition && (
              <p className="petition-text">{candidate.WrittenPetition}</p>
            )}

            {candidate.VideoPetition && (
              <div className="video-container" style={{ marginTop: "10px" }}>
                <VideoEmbed url={candidate.VideoPetition} />
              </div>
            )}

            {mediaUrl && (
              <img
                src={mediaUrl}
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

  // Fallback candidate if sheet is empty
  const fallbackCandidate = [
    {
      Name: "Isabella Chen",
      Board: "LSA",
      Grade: "2029",
      Position: "President",
      WrittenPetition:
        "Hey Cardinals! I’m Isabella Chen and I’m running to be your freshman president! From these few weeks into high school, you’ve probably seen and experienced the stress of school. In contrast to this, I would like to help make your high school smooth and fun! My goal is to make resources more available for students, such as making sure care stations are resupplied. I would also like to have more lunch activities where students can participate in fun games to decompress and distract themselves from schoolwork. As your president I will work hard to make these goals come true in addition to any suggestions you tell me! Let’s make freshmen year unforgettable! Vote Isabella Chen to be your freshman president!",
      VideoPetition:
        "https://drive.google.com/file/d/1WpuZV07ip83LGudaVcRNwgGdaEsMWTI2/view?usp=sharing",
      Media:
        "https://drive.google.com/file/d/1PBiRzBc9h62NkZmMgyCFy6L71iR05S7B/view",
    },
  ];

  const candidates = electionData.length ? electionData : fallbackCandidate;

  // Group candidates by board and position
  const groupedCandidates = {};
  for (const c of candidates) {
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

              {positionsList.map((position) => (
                <div key={position}>
                  <h3 className="center">{position}</h3>
                  {(positions[position] || []).map((candidate, i) => (
                    <CandidateCard
                      candidate={candidate}
                      key={candidate.Name + i}
                    />
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
