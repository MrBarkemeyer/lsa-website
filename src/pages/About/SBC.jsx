import {Link} from "react-router-dom"
import { useState, useEffect } from "react"
export default function SBC(props){

    const officers = props.officerData;
    const [officerData, setOfficerData] = useState([]);
    useEffect(()=>{
        setOfficerData((officers.filter(officer => "SBC" === officer.Team)));
    }, [props]);

    function extractFileId(driveUrl) {
        const match = driveUrl.match(/[?&]id=([^&]+)/);
        return match ? match[1] : null; // Return the file ID if matched, otherwise null
    }
            
    const displayOfficers = officerData.map((officer, index)=>{
        return(
            <div key={index}>
                <div className="team-member">
                <img src={`https://drive.google.com/thumbnail?id=${extractFileId(officer.Photo)}`} alt="" className="team-member-photo" />
                <div>
                    <h2><span className="team-member-role" style={{color: "#861212"}}>{officer.Role}</span> 
                    <span className="team-member-name"> {officer.Name}</span></h2>
                    <p className="team-member-description">{officer.Description}</p>
                </div>
            </div>
            </div>
        )
    })

    if (!officerData) {
        return (
            <LoadingTruck />
        )
    }
        

    return(
        <>
            <h1 className="team-name center">
                Student Body Council (SBC) 
                <br />2025-2026
            </h1>
            <div className="team-info">
                <p><strong>LOCATION - </strong>The Cave (Room 80A) during 1st block Leadership</p>
                <p><strong>EMAIL - </strong>lowellhssbc@gmail.com</p>
                <p><strong>INSTAGRAM - </strong>@lowellhs</p>
                <p><strong>FACEBOOK PAGE - </strong>Lowell Student Association</p>
            </div>
            <div className="teams">
                {displayOfficers}
            </div>
        </>
    )
}
