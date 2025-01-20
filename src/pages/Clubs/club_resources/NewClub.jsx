import LinkButton from "../../../components/LinkButton"

export default function NewClub(){
    return(
        <>  
            <div className="title">
                <h1>How to Start a Club</h1>
            </div>
            <section className="info-page">
                <LinkButton to="/Clubs/ClubResources" noTarget={true}>{"< back to club resources"}</LinkButton>
                <p>Resources to get you started on how to plan an event for your club! Club events are DIFFERENT from fundraisers! If you are looking to plan a fundraiser, visit the fundraising resources page!</p>
                <p>KEEP IN MIND that there are only resources that are listed here. If you are looking for more information, join the 2023-2024 Activities Google Classroom (g6sf3ss). </p>
                <h2>Main Contact Shanice Lam (SBC Club Coordinator)</h2>
                <p>Email: lowell.clubcoord@gmail.com</p>
                <h2>Step 1 Join the 2023-2024 Activities Google Classroom</h2>
                <p>Join Code: g6sf3ss</p>
                <p>Here you can find updates and announcements for clubs, such as sign-ups for co-curricular events, or important forms to fill out! Keep in mind that although the materials can be found here, you must join the google classroom to be able to submit docs, and receive important updates</p>
                <h2>Step 2 Complete the Necessary Forms</h2>
                <p>Before you can start meetings, you must fill out a couple of forms and get them approved by the SBC Club Coordinator. All of these MUST be filled out by the deadline in order to begin the process of starting a new club. All forms should preferably be signed digitally. Please email lowell.clubcoord@gmail.com with any questions or concerns.</p>
                <div className="club-buttons">
                    <LinkButton>Petition for New Club</LinkButton>
                    <LinkButton>Club Registration Form</LinkButton>
                    <LinkButton>Club Contract</LinkButton>
                    <LinkButton>Club Policies</LinkButton>
                    <LinkButton>Club Budget Sheet</LinkButton>
                </div>
                <h2>Step 3 Create a Club Bulletin Board</h2>
                <p>Once you get an EMAIL saying you are CONFIRMED with all your submitted forms, you will be sent a spreadsheet with your bulletin board assignment. Look at the SPREADSHEET, and decorate your bulletin board, then submit the form below. Be sure all the necessary information is included, and refrain from filling it out twice.</p>
                <div className="club-buttons"><LinkButton>Bulletin Board Submission</LinkButton></div>
                <h2>What are your next steps?</h2>
                <p>Get your club started by promoting it, and deciding when your club will be meeting!</p>
                <div className="club-buttons">
                    <LinkButton>Flier Request Form</LinkButton>
                    <LinkButton>Club Meeting Form</LinkButton>
                </div>
            </section>
        </>
    )
}