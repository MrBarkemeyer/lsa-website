import { faClock, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import OrgProfile from "./OrgProfile";

export default function Lsrp() {
  return (
    <OrgProfile
      slug="Lsrp"
      title="Lowell Science Research Program"
      accent="#0d47a1"
      glance={[
        {
          icon: faClock,
          label: "When",
          value: "Mondays and Thursdays, 3:50-5:00",
        },
        {
          icon: faLocationDot,
          label: "Where",
          value: "Room 263",
        },
      ]}
    >
      <section className="club-block club-about">
        <h2 className="club-block__heading">About</h2>
        <p className="club-about__text">
          The UCSF-Lowell Science Research Program introduces students to
          science, teaches laboratory techniques, and builds a passion for
          research and discovery. Presentations are held in Room 263.
        </p>
      </section>
    </OrgProfile>
  );
}
