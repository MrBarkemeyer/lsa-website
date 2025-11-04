import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Committees(props) {
  const { BoardName: params } = useParams();
  const officers = props.officerData;
  const [officerData, setOfficerData] = useState([]);

  useEffect(() => {
    if (officers && params) {
      setOfficerData(officers.filter(officer => params === officer.Team));
    }
  }, [officers, params]);

  function extractFileId(driveUrl) {
    const match = driveUrl?.match(/[?&]id=([^&]+)/);
    return match ? match[1] : null; // Return the file ID if matched, otherwise null
  }

  if (!officerData.length) {
    return <LoadingTruck />;
  }

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
        Committees {params}
        <br /> 2025-2026
      </h1>

      <div className="teams">
        {displayOfficers}
      </div>
    </>
  );
}
