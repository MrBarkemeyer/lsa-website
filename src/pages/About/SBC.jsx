import {Link} from "react-router-dom"
import { useState, useEffect } from "react"
export default function SBC(props){

    const officers = props.officerData;
    const [officerData, setOfficerData] = useState([]);
    useEffect(()=>{
        setOfficerData((officers.filter(officer => "SBC" === officer.Team)));
    }, [props]);

    const displayOfficers = officerData.map((officer, index)=>{
        return(
            <div key={index}>
                <div className="team-member">
                <img src={`https://picsum.photos/200/200?random=${Math.floor(Math.random()*1000)}`} alt="" className="team-member-photo" />
                <div>
                    <h2><span className="team-member-role" style={{color: "#861212"}}>{officer.Role}</span> 
                    <span className="team-member-name"> {officer.Name}</span></h2>
                    <p className="team-member-description">{officer.Description}</p>
                </div>
            </div>
            </div>
        )
    })


    return(
        <>
            <h1 className="team-name center">
                Student Body Council(SBC) 
                <br />2024-2025
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
