import OrgProfile from "./OrgProfile";

export default function MockTrial() {
  return (
    <OrgProfile slug="MockTrial" title="Lowell Mock Trial" accent="#1d2354">
      <section className="club-block club-about">
        <h2 className="club-block__heading">About</h2>
        <p className="club-about__text">
          Lowell Mock Trial helps students build a deeper understanding of law
          and the U.S. justice system. Each year, students prepare a simulated
          case from the Constitutional Rights Foundation and compete against
          other San Francisco high schools.
        </p>
        <p className="club-about__text">
          Team members can participate as witnesses, prosecution or defense
          attorneys, bailiffs, or time clerks. The program strengthens critical
          thinking, teamwork, and confident speaking, and it is open to
          students interested in law, acting, debate, or public speaking.
        </p>
        <p className="club-about__text">
          Lowell won city championships in 2012, 2014, 2016, 2018, 2019, and
          2020, then advanced to the California State competition.
        </p>
      </section>
    </OrgProfile>
  );
}
