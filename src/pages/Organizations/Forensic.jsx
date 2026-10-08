import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import OrgProfile, { OrgPeople } from "./OrgProfile";

const BRANCH_COPY = {
  "Congressional Debate": (
    <>
      <p className="club-about__text">
        Congress is the branch where speech meets debate. Speaking in front of
        15 other students and 3 judges sounds scary, but this is the event that
        will get you speaking well in front of large crowds the fastest. You
        choose which side of a topic, called legislation, you stand on. Topics
        range from housing in California to defense systems in space, and you
        can write your own legislation for tournaments.
      </p>
      <p className="club-about__text">
        The branch holds bi-weekly online scrimmages judged by nationally
        ranked debaters and practices with local schools such as Washington
        High School. Practices roleplay real Congress, with gavels and titles
        like Representative and Senator.
      </p>
    </>
  ),
  "Individual Events (Speech)": (
    <p className="club-about__text">
      Individual events cover improvisation, acting, and original writing,
      including duet acting, extemp, and oratory. Practice is often solo or in
      small groups, with asynchronous competitions available. Alumni from
      Northeastern, Boston University, UC Irvine, and UCLA often return to
      coach.
    </p>
  ),
  "Parliamentary Debate": (
    <p className="club-about__text">
      Parliamentary debate is fast and team-based. You get 30 minutes to
      prepare for a surprise prompt, and the branch will help find a partner.
      Practices vary and can include joint sessions with Lincoln High. Students
      are encouraged to attend four tournaments a year. Members have qualified
      for State and All-States, and gone on to schools such as Harvard and
      Swarthmore.
    </p>
  ),
  "Policy Debate": (
    <p className="club-about__text">
      Policy debate is research-heavy. This year&apos;s topic explores how
      countries should develop the Arctic. The branch competes at TOC and CHSSA
      and travels to LA, Vegas, Chicago, and Lexington. Alumni have gone on to
      Harvard, Princeton, and UC Berkeley.
    </p>
  ),
};

function Branch({ heading, rows, children }) {
  return (
    <section className="club-block">
      <h2 className="club-block__heading">{heading}</h2>
      <OrgPeople rows={rows} />
      {children}
    </section>
  );
}

export default function Forensic() {
  return (
    <OrgProfile
      slug="Forensic"
      title="Lowell Forensic Society"
      accent="#4e1c24"
      glance={[
        {
          icon: faLocationDot,
          label: "Home base",
          value: "Room 135, the Leland Room",
        },
      ]}
    >
      {(org) => (
        <>
          <section className="club-block club-about">
            <h2 className="club-block__heading">About</h2>
            <p className="club-about__text">
              The Lowell Forensic Society is the oldest organization at Lowell
              and the longest-running speech and debate team west of the
              Mississippi, established in 1892. The Leland Room is named after
              Deputy Under Treasury Secretary Marc Leland.
            </p>
            <p className="club-about__text">
              Students practice public speaking, learn to debate, make friends,
              and compete in local, state, and national tournaments. The head
              coach and sponsor is Mr. Abad, a Lowell alum, holder of the
              California High School Speech Association&apos;s 2019 Donovan
              Cummings Service Above Self Award, and a 2023 CHSSA Hall of Fame
              inductee.
            </p>
          </section>
          {(org.officerGroups || []).map((group) =>
            BRANCH_COPY[group.heading] ? (
              <Branch
                key={group.heading}
                heading={group.heading}
                rows={group.people}
              >
                {BRANCH_COPY[group.heading]}
              </Branch>
            ) : (
              <OrgPeople
                key={group.heading}
                heading={group.heading}
                rows={group.people}
              />
            ),
          )}
        </>
      )}
    </OrgProfile>
  );
}
