import "./Club.scss"
import LinkButton from "../../components/LinkButton"
//more to implement

export default function ClubResources(){
    return(
        <>
            <div className="title">
                <h1>Club Resources</h1>
            </div>
            <div className="club-resources">
                <h1>Welcome Club Leaders and Students!</h1>
                <p>Here you can find all the materials and resources to maintain, or start a new club in one place!</p>
                <h2>Join the 2025-2026 Activities Google Classroom</h2>
                <p><strong>Join Code:</strong> knmn6yuw</p>
                <p>Here you can find updates and announcements for clubs, such as sign-ups for co-curricular events, or important forms to fill out! Keep in mind that although the materials can be found here, you must join the google classroom to be able to submit docs, and receive important updates</p>
                <h2>Main Contact: Enkhiinkhuslen Tegshjargal (SBC Club Coordinator)</h2>
                <p>Email: lowellclubcoord25@gmail.com</p>
                <div className="club-buttons">
                    <LinkButton to="/Clubs/NewClub" noTarget={true}>How to Start a Club</LinkButton>
                    <LinkButton to="/Clubs/EventPlanning" noTarget={true}>Event Planning Resources</LinkButton>
                    <LinkButton to="/Clubs/Fundraising" noTarget={true}>Fundraising Resources</LinkButton>
                </div>
            </div>

        </>
    )
}
