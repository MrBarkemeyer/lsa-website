import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Committees({ officerData: allOfficers }) {
  const { BoardName: params } = useParams();
  const [officerData, setOfficerData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (allOfficers && params) {
      const filtered = allOfficers.filter(
        (officer) => officer.Team === params
      );
      setOfficerData(filtered);
      setLoading(false);
    }
  }, [allOfficers, params]);

  function extractFileId(driveUrl) {
    const match = driveUrl?.match(/[?&]id=([^&]+)/);
    return match ? match[1] : null;
  }

  if (loading) {
    return <LoadingTruck />;
  }

  if (!officerData.length) {
    return (
      <div className="center">
        <h1 className="team-name">Committees {params}</h1>
        <p>No officers found for this committee.</p>
      </div>
    );
  }

  const committeeName = officerData[0]?.Team || params;

  const displayOfficers = officerData.map((officer, index) => (
    <div key={index} className="team-member">
      <img
        src={`https://drive.google.com/thumbnail?id=${extractFileId(officer.Photo)}`}
        alt={officer.Name}
        className="team-member-photo"
      />
      <div>
        <h2>
          <span className="team-member-role" style={{ color: "#861212" }}>
            {officer.Role}
          </span>
          <span className="team-member-name"> {officer.Name}</span>
        </h2>
        <p className="team-member-description">{officer.Description}</p>
      </div>
    </div>
  ));

  return (
    <>
      <h1 className="team-name center">
        {committeeName}
        <br /> 2025–2026
      </h1>

      <div className="teams">{displayOfficers}</div>
    </>
  );
}
