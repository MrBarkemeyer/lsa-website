import OrgProfile from "./OrgProfile";

export default function CardinalBotics() {
  return (
    <OrgProfile slug="CardinalBotics" accent="#8b1e2d">
      <section className="club-block club-about">
        <h2 className="club-block__heading">About</h2>
        <p className="club-about__text">
          CardinalBotics is Lowell High School&apos;s FIRST Robotics Competition
          team. Founded in 2012, the team designs a robot for each season and
          competes with high school teams from around the world.
        </p>
        <p className="club-about__text">
          During build season students have a short window to design and build
          that robot. In competition season the team travels to regional events
          and, when they qualify, the world championship. The team also works
          to inspire younger students and share science, technology,
          engineering, and math with the community.
        </p>
      </section>
    </OrgProfile>
  );
}
