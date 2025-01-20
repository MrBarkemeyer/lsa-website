import LinkButton from "../../../components/LinkButton"

export default function Fundraising() {
  return (
    <>
        <div className="title">
            <h1>Fundraising Resources</h1>
        </div>
        <section className="info-page">
            <LinkButton to="/Clubs/ClubResources" noTarget={true}>{"< back to club resources"}</LinkButton>
            <p>Resources to get you started on how to plan a fundraiser for your club! Club fundraisers are DIFFERENT from club events! If you are looking to plan an event, visit the event planning resources!
            </p>
            <p><strong>KEEP IN MIND</strong> that there are only resources that are listed here. If you are looking for more information, join the 2023-2024 Activities Google Classroom (g6sf3ss). </p>
            <h2>Main Contact Kaitlyn Lee (SBC Treasurer)</h2>
            <p>email: lowellsbc.treasurer@gmail.com
            </p>
            <div className="club-buttons">
                <LinkButton>Fundraising Handbook</LinkButton>
                <LinkButton>Pre-Fundraising Form</LinkButton>
                <LinkButton>Before Fundraising Doc</LinkButton>
                <LinkButton>Fundraising Request Form</LinkButton>
                <LinkButton>Fundraising Reconciliation Doc</LinkButton>
                <LinkButton>SFUSD Nutrition Guidelines</LinkButton>
                <LinkButton>Treasurer Training</LinkButton>
                <LinkButton>After Fundraising Form</LinkButton>
                <LinkButton>Form Templates</LinkButton>
                <LinkButton>Form Examples</LinkButton>
                <LinkButton>Club Budget Sheet</LinkButton>
            </div>
            <h2>What are your next steps?</h2>
            <p>After your event is approved, you may begin promoting it by posting on social media, or you can submit a flier request form to hang up fliers around the school. When advertising, please be sure to read through the Fundraising handbook to see the restrictions and rules on advertising fundraisers.</p>
            <div className="club-buttons">
                <LinkButton>Flier Request Form</LinkButton>
            </div>
        </section>
    </>
  )
}