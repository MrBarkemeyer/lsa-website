import LinkButton from "../../../components/LinkButton"

export default function EventPlanning(){
    return(
        <>
            <div className="title">
                <h1>Event Planning Resources</h1>
            </div>
            <section className="info-page">
                <LinkButton to="/Clubs/ClubResources" noTarget={true}>{"< back to club resources"}</LinkButton>
                <p>Resources to get you started on how to plan an event for your club! Club events are DIFFERENT from fundraisers! If you are looking to plan a fundraiser, visit the fundraising resources page!
                </p>
                <p><strong>KEEP IN MIND</strong> that there are only resources that are listed here. If you are looking for more information, join the 2023-2024 Activities Google Classroom (g6sf3ss). </p>
                <h2>Main Contact Brandon Ho (SBC Events Coordinator) </h2>
                <p>email: lowelleventscoordinator@gmail.com</p>
                <div className="club-buttons">
                    <LinkButton>Event Planning Form</LinkButton>
                    <LinkButton>Event Planning Form(Submit)</LinkButton>
                    <LinkButton>Lowell Facility Usage Form</LinkButton>
                </div>
                <h2>What are your next steps?</h2>
                <p>After your event is approved, you may begin promoting it by posting on social media, or you can submit a flier request form to hang up fliers around the school. </p>
                <div className="club-buttons">
                    <LinkButton>Flier Request Form</LinkButton>
                </div>
            </section>
        </>
    )
}
