import "./Organizations.scss";

export default function MockTrial() {
  return (
    <section className="mock-trial-page">
      <header className="mock-trial-hero">
        <h1>Lowell Mock Trial</h1>
        <p>
          Learn legal reasoning, advocacy, and public speaking through real courtroom
          simulation.
        </p>
      </header>

      <div className="mock-trial-content">
        <article className="mock-trial-card">
          <h2>About the program</h2>
          <p>
            Lowell Mock Trial helps students build a deeper understanding of law and
            the U.S. justice system. Each year, students prepare a simulated case
            from the Constitutional Rights Foundation and compete against other San
            Francisco high schools.
          </p>
          <p>
            Team members can participate as witnesses, prosecution or defense
            attorneys, bailiffs, or time clerks. The program strengthens critical
            thinking, teamwork, and confident speaking.
          </p>
        </article>

        <article className="mock-trial-card">
          <h2>Why join</h2>
          <div className="mock-trial-grid">
            <div className="mock-trial-feature">
              <h3>Build real skills</h3>
              <p>
                Practice argumentation, questioning, and persuasive speaking in a
                structured, high-impact setting.
              </p>
            </div>
            <div className="mock-trial-feature">
              <h3>Compete as a team</h3>
              <p>
                Represent Lowell in city/county competition and potentially advance to
                California state finals.
              </p>
            </div>
            <div className="mock-trial-feature">
              <h3>Open to all grades</h3>
              <p>
                Students interested in law, acting, debate, or public speaking are
                encouraged to participate.
              </p>
            </div>
          </div>
        </article>

        <article className="mock-trial-card">
          <h2>Program highlights</h2>
          <p>
            Lowell won city championships in <strong>2012, 2014, 2016, 2018, 2019,
            and 2020</strong>, then advanced to the California State competition.
          </p>
        </article>

        <article className="mock-trial-card mock-trial-card--contact">
          <h2>Coaches & contact</h2>
          <ul className="mock-trial-contact-list">
            <li><strong>Michael Ungar</strong> - ungarm@sfusd.edu</li>
            <li><strong>Lisa Hathaway</strong> - lhathaway13@gmail.com</li>
            <li><strong>Lauretta Komlos</strong> - komlosl@sfusd.edu</li>
            <li><strong>Nikole Gorin</strong> - nikolegorin@gmail.com</li>
          </ul>
          <p><strong>Instagram:</strong> @lowellmocktrial</p>
          <a href="mailto:lowellhsmocktrial@gmail.com" className="mock-trial-email">
            lowellhsmocktrial@gmail.com
          </a>
        </article>
      </div>
    </section>
  );
}
