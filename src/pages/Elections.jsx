import { useState } from "react";
import { Link } from "react-router-dom";

export default function Elections({ electionData }) {
    const ElectionResults = [
        {
            board: "SBC Election Results",
            color: "red",
            president: "Shoon Mon",
            vicePresident: "Leona Cyster",
            secretary: "Sydney Sharp",
            treasurer: "Kaitlyn Huey",
            publicRelations: "Karolyn Wong",
            clubCoordinator: "Khuslen Tegshjargal",
            danceCoordinator: "Peyton David",
            communityLiaison: "Emily Gorodetskiy"
            
        },
        {
            board: "LSA 2026 Election Results",
            color: "#9c1919",
            president: "Bernice Chen",
            vicePresident: "Max Marcelo-Tabios",
            secretary: "Tracy Chau",
            treasurer: "Bernie Zhen",
            publicRelations: "Harrison Kashiwabara",
            historian: "Jaden Yee"
        },
        {
            board: "LSA 2027 Election Results",
            color: "#5353f6",
            president: "Riley Chon",
            vicePresident: "Zeina Danfoura",
            secretary: "Linda Nguyen",
            treasurer: "Carson Lem",
            publicRelations: "Emily Ma",
            historian: "Leo Zhou"
        },
        {
            board: "LSA 2028 Election Results",
            color: "green",
            president: "Dylan Mac",
            vicePresident: "Andrew Bates",
            secretary: "Fatima Shaikh",
            treasurer: "Cameron Wee",
            publicRelations: "NhaLan Vo",
            historian: " Felix Meil"
        },
    ];
    const displayElectionResults = ElectionResults.map((element, index)=>{
        const {board, color, president, vicePresident, secretary, treasurer, publicRelations, historian, clubCoordinator, danceCoordinator, communityLiaison} = element
        return(
            <div key={index}>
                <div className="election-outer-container">
                    <div className="election-inner-container" style={{borderLeft: `6px solid ${color}`}}>
                        <h3 style={{color: color}}>{board}</h3>
                        <p><span className="bold">President: </span>{president}</p>
                        <p><span className="bold">Vice President: </span>{vicePresident}</p>
                        <p><span className="bold">Secretary: </span>{secretary}</p>
                        <p><span className="bold">Treasurer: </span>{treasurer}</p>
                        <p><span className="bold">Public Relations: </span>{publicRelations}</p>
                        {historian && <p><span className="bold">Historian: </span>{historian}</p>}
                        {clubCoordinator && <p><span className="bold">Club Coordinator: </span>{clubCoordinator}</p>}
                        {danceCoordinator && <p><span className="bold">Dance Coordinator: </span>{danceCoordinator}</p>}
                        {communityLiaison && <p><span className="bold">Community Liaison: </span>{communityLiaison}</p>}
                    </div>
                </div>
            </div>
        )
    })
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

    return (
        <>
            <div className="title">
                <h1>
                    Spring '25 <br />
                    Lowell Elections
                </h1>
            </div>
            
            <section className="info-page">
                {/* <div className="quick-links flex-center">
                    <a href="#LSA 2028">LSA 2028 Elections</a>
                    <a href="#LSA 2027">LSA 2027 Elections</a>
                    <a href="#LSA 2026">LSA 2026 Elections</a>
                    <a href="#SBC">SBC Elections</a>
                </div>
                {renderedSections} */}
                <div>
                    {displayElectionResults}
                </div>
            </section>
        </>
    );
}
