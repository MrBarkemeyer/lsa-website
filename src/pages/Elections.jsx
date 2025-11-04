import { useState } from "react";
import { Link } from "react-router-dom";

export default function Elections({ electionData }) {
    const ElectionResults = [
        {
            board: "LSA 2029 Election Results",
            color: "#9c1919",
            president: "---",
            vicePresident: "----",
            secretary: "----",
            treasurer: "----",
            publicRelations: "----",
            historian: "----"
        },
    ];

    const displayElectionResults = ElectionResults.map((element, index) => {
        const {
            board,
            color,
            president,
            vicePresident,
            secretary,
            treasurer,
            publicRelations,
            historian,
            clubCoordinator,
            danceCoordinator,
            communityLiaison
        } = element;

        return (
            <div key={index} className="election-outer-container">
                <div className="election-inner-container" style={{ borderLeft: `6px solid ${color}` }}>
                    <h3 style={{ color }}>{board}</h3>
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
        );
    });

    return (
        <>
            <section>
                <div>
                    {displayElectionResults}
                </div>
            </section>
        </>
    );
}
