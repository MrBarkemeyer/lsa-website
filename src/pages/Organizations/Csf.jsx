import { faClock, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import OrgProfile from "./OrgProfile";

export default function Csf() {
  return (
    <OrgProfile
      slug="Csf"
      accent="#1b5e20"
      glance={[
        {
          icon: faClock,
          label: "Drop-in",
          value:
            "Lunch A, Lunch B, Block 5, Block 7, and after school except Wednesday",
        },
        {
          icon: faLocationDot,
          label: "Where",
          value: "Library",
        },
      ]}
    >
      <section className="club-block club-about">
        <h2 className="club-block__heading">About</h2>
        <p className="club-about__text">
          Lowell CSF is the 273rd chapter of the California Scholarship
          Federation, a statewide honor society. Members tutor, and they also
          belong to an academic honor society that supports the school and
          parts of the local community.
        </p>
        <p className="club-about__text">
          CSF helps students, and it assists teachers and faculty as well. The
          chapter is supported by the Lowell PTSA and the Lowell Alumni
          Association. One-on-one help depends on the day, the time, and which
          tutors are available.
        </p>
      </section>
    </OrgProfile>
  );
}
