import { useState } from "react";
import { Link } from "react-router-dom";
 // Extract Google Drive file ID
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
            <div className="candidate" key={candidate.Name}>
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
            </div>   <a
                        className="petition-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={candidate.MediaPetition}
                    >
                        My Media Petition
                    </a>
        );
// Extract Google Drive file ID
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
           <a
                    className="petition-link"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={candidate.MediaPetition}
                >
                    My Media Petition
                </a>
        </div>
    );
};

// Main elections component
export default function ElectionPage({ electionData = [], displayElectionResults = null }) {
// Group data by board section and position
const groupedCandidates = {};

@@ -117,18 +120,17 @@ import { Link } from "react-router-dom";
</div>

<section className="info-page">
                {/* <div className="quick-links flex-center">
                <div className="quick-links flex-center">
<a href="#LSA 2028">LSA 2028 Elections</a>
<a href="#LSA 2027">LSA 2027 Elections</a>
<a href="#LSA 2026">LSA 2026 Elections</a>
<a href="#SBC">SBC Elections</a>
</div>
                {renderedSections} */}
                <div>
                    {displayElectionResults}
                </div>
                {/* Render grouped candidate sections */}
                {renderedSections}
                {/* Optionally, render custom election results if provided */}
                {displayElectionResults && <div>{displayElectionResults}</div>}
</section>
</>
);
}
