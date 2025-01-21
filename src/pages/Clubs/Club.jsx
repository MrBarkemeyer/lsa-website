import { useParams, Link } from "react-router-dom";
import {useState, useEffect} from "react";
import { GlowCapture, Glow } from "@codaworks/react-glow";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram } from "@fortawesome/free-brands-svg-icons";
import LoadingTruck from "../../components/LoadingTruck"
import "../Clubs/Club.scss" //update to module

export default function Club(props){
    const params = useParams().ClubName;
    const [clubName, setClubName] = useState(params);
    const [clubData, setClubData] = useState([]);
    useEffect(()=>{
        setClubName(params)
        setClubData((props.clubData.filter(club => params === club.Name.trim())[0]));
    }, [params, props.clubData]);



    function removeLeadingAt(str) {
        if (typeof str === 'string') {
            return str.replace(/^@/, '');
        }
        return ''; 
    }
    
    if (!clubData) {
        return (
            <LoadingTruck />
        )
    }
    function extractFileId(driveUrl) {
        const match = driveUrl.match(/[?&]id=([^&]+)/);
        return match ? match[1] : null; // Return the file ID if matched, otherwise null
    }
    
    return(
        <section>
            <div className="club-info">
            {clubData.Banner && <iframe src={`https://drive.google.com/file/d/${extractFileId(clubData.Banner)}/preview?modestbranding=1&rel=0`} width="640" className="club-banner"></iframe>}
                <h1 className="title">
                    {clubName}
                </h1>
                <p className="club-description">{clubData.ClubDescription}</p>
                <p className="meeting-times"><strong>Meetings: </strong>We meet every {clubData.MeetingDays} {clubData.Weekly} at {clubData.MeetingPlaceTime}</p>
            </div>
            <div className="club-officers">
                <h3>Club Officers:</h3>
                <p><strong>President:</strong> {clubData.President}</p>
                <p><strong>Vice President:</strong> {clubData.VP}</p>
                <p><strong>Other Officers:</strong> {clubData.OtherOfficers}</p>
                <GlowCapture>
                    <Glow color="purple">
                        {clubData.Instagram && <a href={`https://www.instagram.com/${removeLeadingAt(clubData.Instagram)}`} className="link-button flex-center" target="_blank">Check out our Instagram <FontAwesomeIcon icon={faInstagram} className="instagram-icon" /></a>}
                    </Glow>
                </GlowCapture>
            </div>
           
        </section>
    )
}