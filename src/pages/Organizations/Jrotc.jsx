import OrgProfile from "./OrgProfile";

export default function Jrotc() {
  return (
    <OrgProfile slug="Jrotc" title="Lowell JROTC" accent="#1b2a4a">
      <section className="club-block club-about">
        <h2 className="club-block__heading">About</h2>
        <p className="club-about__text">
          JROTC has been part of Lowell since the National Defense Act of 1916.
          The program teaches leadership and teamwork, and it prepares cadets
          for whatever they take on after high school.
        </p>
        <p className="club-about__text">
          One former battalion commander is William Hewlett, who went on to
          found Hewlett-Packard. Cadets practice leadership, teamwork through
          drill and ceremony, and citizenship built around service.
        </p>
      </section>
    </OrgProfile>
  );
}
