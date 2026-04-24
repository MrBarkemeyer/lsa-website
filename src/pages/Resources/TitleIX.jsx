import "./Resources.scss";

export default function TitleIX() {
  return (
    <main className="resource-page">
      <header className="resource-hero">
        <div className="title">
          <h1>Title IX Support</h1>
          <p>Know your rights and where to get help.</p>
        </div>
      </header>
      <div className="resource-content">
        <section className="resource-section">
          <h2 className="resource-section__heading">What is Title IX</h2>
          <p>
            Title IX of the Education Amendments of 1972 prohibits sex
            discrimination in education, including K-12 schools. Title IX is a
            federal law that has been used to promote equity in education by
            ensuring that girls and women receive equal resources and treatment in
            the classroom and provides protections for students who are sexually
            harassed and discriminated against and/or bullied based on their
            gender.
          </p>
          <p>
            In addition to this federal law, the California Education code
            similarly prohibits schools discriminating against its students on the
            basis of sex (Education Codes 220-221.1).
          </p>
          <p>
            Sexual harassment is also in violation of San Francisco Unified School
            District Board and Administrative policies. These policies extend to
            the San Francisco County Office of Education, including community
            school programs and activities. All forms of sexual harassment,
            whether student to student, staff to student, or student to staff, are
            unlawful at SFUSD schools.
          </p>
          <a
            className="resource-link-btn"
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.sfusd.edu/know-your-rights/sexual-harassment-and-sex-discrimination-title-ix"
          >
            Learn more on SFUSD
          </a>
        </section>

        <section className="resource-grid" aria-label="Title IX quick links">
          <article className="resource-tile">
            <h2>Office of Equity</h2>
            <p>SFUSD guidance, processes, and district-level contact information.</p>
            <a
              className="resource-link-btn resource-link-btn--ghost"
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.sfusd.edu/departments/office-equity"
            >
              Visit Office of Equity
            </a>
          </article>
          <article className="resource-tile">
            <h2>Investigation resources</h2>
            <div className="resource-links">
              <a
                className="resource-link-btn resource-link-btn--ghost"
                target="_blank"
                rel="noopener noreferrer"
                href="https://drive.google.com/file/d/1Lb_elI3OHaRCE6htqcGOWVIkzjNiL8b8/view"
              >
                Investigation overview
              </a>
              <a
                className="resource-link-btn resource-link-btn--ghost"
                target="_blank"
                rel="noopener noreferrer"
                href="https://drive.google.com/file/d/1zcOlCWZxyqmgbFQ9JcD5jO2pnyxAFvXU/view"
              >
                Student & family FAQ
              </a>
            </div>
          </article>
        </section>

        <section className="resource-section">
          <h2 className="resource-section__heading">Resources & contacts</h2>

          <div className="resource-card">
            <div className="resource-card__title">
              <a
                href="https://www.sfusd.edu/know-your-rights/sexual-harassment-and-sex-discrimination-title-ix"
                target="_blank"
                rel="noopener noreferrer"
              >
                San Francisco Unified School District (SFUSD)
              </a>
            </div>
            <ul className="resource-card__list">
              <li>
                <a
                  href="https://drive.google.com/file/d/1M2njXNeBJ00dUoiqypqifuSEQu8Uf81t/view"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Title IX Complaint Form
                </a>
              </li>
              <li>Office of Equity</li>
            </ul>
            <div className="resource-card__meta">
              Phone: 415-355-7334 · Email: equity@sfusd.edu
            </div>
          </div>

          <div className="resource-card">
            <div className="resource-card__title">
              <a
                href="https://www.sanfranciscopolice.org/get-service/sexual-assault"
                target="_blank"
                rel="noopener noreferrer"
              >
                San Francisco Police Department (SFPD)
              </a>
            </div>
            <ul className="resource-card__list">
              <li>
                <a
                  href="https://drive.google.com/file/d/1M2njXNeBJ00dUoiqypqifuSEQu8Uf81t/view"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Title IX Complaint Form
                </a>
              </li>
              <li>Special Victims Unit</li>
            </ul>
            <div className="resource-card__meta">
              Phone: 415-553-1361 · Email: sfpd.sexcrimes@sfgov.org
            </div>
          </div>

          <div className="resource-card">
            <div className="resource-card__title">
              <a
                href="https://sfwar.org/programs-services/advocacy-counseling/"
                target="_blank"
                rel="noopener noreferrer"
              >
                San Francisco Women Against Rape (SFWAR)
              </a>
            </div>
            <ul className="resource-card__list">
              <li>Advocacy & Counseling Program</li>
            </ul>
            <div className="resource-card__meta">
              Phone: 415-861-2024 · Email: dac@sfwar.org
            </div>
          </div>

          <p className="resource-note">
            <strong>Title IX Coordinators:</strong> Ms. Liverpool (liverpoolk@sfusd.edu), Ms. Fong (fongc3@sfusd.edu)
          </p>
        </section>

        <section className="resource-section">
          <h2 className="resource-section__heading">Key forms</h2>
          <div className="resource-links">
            <a
              className="resource-link-btn"
              href="https://drive.google.com/file/d/1M2njXNeBJ00dUoiqypqifuSEQu8Uf81t/view"
              target="_blank"
              rel="noopener noreferrer"
            >
              SFUSD Title IX Complaint Form
            </a>
            <a
              className="resource-link-btn"
              href="https://drive.google.com/file/d/1mLVM9x8aYIftEUHCQ_blYr6_djKaN5FE/view"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lowell Incident Report Form
            </a>
          </div>
          <p className="resource-note">
            tinyurl.com/titleixformalcomplaint · tinyurl.com/lhsincidentreport
          </p>
        </section>
      </div>
    </main>
  );
}
