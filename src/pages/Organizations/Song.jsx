import {
  faCalendarDays,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import OrgProfile from "./OrgProfile";

export default function Song() {
  return (
    <OrgProfile
      slug="Song"
      accent="#9b1b4a"
      glance={[
        {
          icon: faCalendarDays,
          label: "Info meeting",
          value: "September 2 · 2:45 · Courtyard",
        },
        {
          icon: faLocationDot,
          label: "Clinics",
          value: "September 3, 4, and 7 · 3:50 · Outside volleyball courts",
        },
      ]}
    >
      <section className="club-block club-about">
        <h2 className="club-block__heading">Tryouts</h2>
        <p className="club-about__text">
          Want to make choreography? Love to dance? Looking for a community?
          Try out for Lowell Song.
        </p>
      </section>
      <section className="club-block club-about">
        <h2 className="club-block__heading">What is Song?</h2>
        <p className="club-about__text">
          Song is Lowell&apos;s official dance and pom team. The team performs
          at school events and cheers at sports games. It is entirely student
          led, and the choreography is original.
        </p>
      </section>
    </OrgProfile>
  );
}
