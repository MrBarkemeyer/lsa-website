import React from "react";

export default function Elections({ electionData }) {
  // Use provided data or fallback to default
  const ElectionResults = electionData || [
    {
      board: "LSA 2029 Election Results",
      color: "#9c1919",
      president: "Taran Yang",
      vicePresident: "Preston Wang",
      secretary: "Violette Trinh-Hsu",
      treasurer: "Shirley Guan",
      publicRelations: "Zarina Gorji",
      historian: "Ashley Zhao",
    },
  ];

  return (
    <section className="election-section">
      {ElectionResults.map((element, index) => {
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
          communityLiaison,
        } = element;

        return (
          <div key={index} className="election-outer-container">
            <div
              className="election-inner-container"
              style={{
                borderLeft: `6px solid ${color}`,
                padding: "1rem",
                marginBottom: "1rem",
                backgroundColor: "#fff",
              }}
            >
              <h3 style={{ color, marginBottom: "0.5rem" }}>{board}</h3>
              <p><span className="bold">President:</span> {president}</p>
              <p><span className="bold">Vice President:</span> {vicePresident}</p>
              <p><span className="bold">Secretary:</span> {secretary}</p>
              <p><span className="bold">Treasurer:</span> {treasurer}</p>
              <p><span className="bold">Public Relations:</span> {publicRelations}</p>
              {historian && <p><span className="bold">Historian:</span> {historian}</p>}
              {clubCoordinator && <p><span className="bold">Club Coordinator:</span> {clubCoordinator}</p>}
              {danceCoordinator && <p><span className="bold">Dance Coordinator:</span> {danceCoordinator}</p>}
              {communityLiaison && <p><span className="bold">Community Liaison:</span> {communityLiaison}</p>}
            </div>
          </div>
        );
      })}
    </section>
  );
}
function App() {
  return (
    <div style={{ padding: "2rem", backgroundColor: "#f7f7f7" }}>
      <Elections />
    </div>
  );
}

export default App;
