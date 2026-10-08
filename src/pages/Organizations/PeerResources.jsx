import OrgProfile from "./OrgProfile";

export default function PeerResources() {
  return (
    <OrgProfile slug="PeerResources" accent="#0d5c63">
      <section className="club-block club-about">
        <h2 className="club-block__heading">About</h2>
        <p className="club-about__text">
          The Peer Mentoring Program helps freshmen move from middle school
          into Lowell. Each freshman is paired with a mentor who can answer
          questions and offer advice, including during registry.
        </p>
        <p className="club-about__text">
          Mentors also lead professional development and take part in
          school-wide events such as Wellness Week.
        </p>
      </section>
    </OrgProfile>
  );
}
