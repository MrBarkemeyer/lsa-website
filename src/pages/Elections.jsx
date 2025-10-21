export default function Elections({electionData}){

    const displayElectionResults = electionResults.map((element, index)=>{
        const {board, color, president, vicePresident, secretary, treasurer, publicRelations, historian} = element
        return(
            <div key={index}>
                <div className="election-outer-container">
                    <div className="election-inner-container">
                        <h3 style={{color: color}}>{board}</h3>
                        <p><span className="bold">President: </span>{president}</p>
                        <p><span className="bold">Vice President: </span>{vicePresident}</p>
                        <p><span className="bold">Secretary: </span>{secretary}</p>
                        <p><span className="bold">Treasurer: </span>{treasurer}</p>
                        <p><span className="bold">Public Relations: </span>{publicRelations}</p>
                        <p><span className="bold">Historian: </span>{historian}</p>
                    </div>
                </div>
            </div>
        )
    })
import { useState } from "react";
import { Link } from "react-router-dom";


//New Code Starts Here
    // Function to extract the file ID from a Google Drive URL
export default function Elections({ electionData }) {
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
            </div>
        );
    };

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

    const displayElectionCandidates = (() => {
        const groupedData = electionData.reduce((acc, curr) => {
            const board = curr.Board;
            const grade = curr.Grade;
            const position = curr.Position;
    
            // Key for organizing: e.g. "LSA 2028" or "SBC"
            const boardKey = board === 'LSA' ? `${board} ${grade}` : 'SBC';
    
            if (!acc[boardKey]) acc[boardKey] = {};
            if (!acc[boardKey][position]) acc[boardKey][position] = [];
    
            acc[boardKey][position].push(curr);
            return acc;
        }, {});
    
        const POSITIONS = [
            "President",
            "Vice President",
            "Secretary",
            "Treasurer",
            "Public Relations",
            "Historian"
        ];
    
        return Object.entries(groupedData).map(([sectionTitle, positions]) => (
            <div className="elections" key={sectionTitle}>
                <h2 className="election-title">
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
    
                {POSITIONS.map(position => (

                {positionsList.map(position => (
<div key={position}>
<h3 className="center election-title flex-center">{position}</h3>
    
                        {positions[position]?.map(candidate => (
                            <div className="candidate" key={candidate.Name}>
                                <h3>{candidate.Name}</h3>
                                <p>{candidate.WrittenPetition}</p>
                                {candidate.MediaPetition && <img className="candidate-media-petition"src={`https://drive.google.com/thumbnail?id=${extractFileId(candidate.MediaPetition)}`} alt={`${candidate.Name}`}/>}
                            </div>

                        {(positionsInThisSection[position] || []).map(candidate => (
                            <CandidateCard candidate={candidate} key={candidate.Name} />
))}
</div>
))}
</div>
        ));
    })();

//New Code Starts Here

        );
    }

    return(
    return (
<>
<div className="title">
<h1>
Spring '25 <br />
Lowell Elections
</h1>
</div>
            
<section className="info-page">
                {displayElectionCandidates}
                <div className="quick-links flex-center">
                    <a href="#LSA 2028">LSA 2028 Elections</a>
                    <a href="#LSA 2027">LSA 2027 Elections</a>
                    <a href="#LSA 2026">LSA 2026 Elections</a>
                    <a href="#SBC">SBC Elections</a>
                </div>
                {renderedSections}
</section>
            
</>
    )
}
    );
}
