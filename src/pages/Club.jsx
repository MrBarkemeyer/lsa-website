import { useParams } from "react-router-dom";
import {useState, useEffect} from "react"
export default function Club(props){
    const params = useParams().ClubName;
    const [clubName, setClubName] = useState(params);
    const [clubData, setClubData] = useState([]);
    useEffect(()=>{
        setClubName(params)
        setClubData((props.clubData.filter(club => params === club.Name)[0]));
    }, [params, props.clubData]);


    
    if (!clubData) {
        // Show loading or fallback if data is not ready or no matching club found
        return <h1>Loading club details or club not found...</h1>;
    }
    
    
    return(
        <>
            <div className="club-info">
                <img src="https://picsum.photos/2000/250" alt="Club Banner" />
                <p className="club-description">{clubData.ClubDescription}</p>
                <p className="meeting-times"><strong>Meetings: </strong>We meet every {clubData.MeetingDays} {clubData.Weekly} at {clubData.MeetingPlaceTime}</p>
            </div>
            <div className="club-officers">
                <h3>Club Officers:</h3>
                <p><strong>President:</strong> {clubData.President}</p>
                <p><strong>Vice President:</strong> {clubData.VP}</p>
                <p><strong>Other Officers:</strong> {clubData.OtherOfficers}</p>
            </div>
           
        </>
    )
}