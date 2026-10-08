import OrgProfile from "./OrgProfile";

export default function Sac() {
  return (
    <OrgProfile slug="Sac" accent="#243056">
      <section className="club-block club-about">
        <h2 className="club-block__heading">About</h2>
        <p className="club-about__text">
          The Student Advisory Council is a citywide, youth-led organization.
          It speaks for students of the San Francisco Unified School District
          by bringing their interests to the district&apos;s administrative and
          policy-making bodies.
        </p>
        <p className="club-about__text">
          Under the LSA charter, the SBC Community Liaison and Co-Community
          Liaison are Lowell&apos;s representatives at SFUSD Student Advisory
          Council meetings when other SBC officers are not there. They can vote
          on behalf of Lowell students at those meetings, report back to the
          LSA, and they coordinate Social Awareness Week.
        </p>
      </section>
    </OrgProfile>
  );
}
