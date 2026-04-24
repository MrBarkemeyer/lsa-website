import "./Organizations.scss";

export default function ShieldAndScroll() {
  return (
    <section className="shield-scroll-page">
      <header className="shield-scroll-hero">
        <h1>Lowell Shield and Scroll Honor and Service Society</h1>
        <p>
          Lowell&apos;s second oldest student organization, focused on service,
          scholarship, and citizenship.
        </p>
      </header>

      <div className="shield-scroll-content">
        <article className="shield-scroll-card">
          <h2>Who we are</h2>
          <p>
            Shield and Scroll is an honor and service society made up of Lowell
            students committed to supporting the school community with consistency
            and care.
          </p>
          <p>
            Our goal is to help Lowell run effectively and efficiently while
            modeling responsibility and service.
          </p>
        </article>

        <article className="shield-scroll-card">
          <h2>What we do</h2>
          <div className="shield-scroll-grid">
            <div className="shield-scroll-task">
              <h3>School-wide events</h3>
              <p>
                We organize and support key events like Freshman Orientation, Eighth
                Grade Night, Arena, and Graduation.
              </p>
            </div>
            <div className="shield-scroll-task">
              <h3>Faculty support</h3>
              <p>
                We assist teachers and staff with logistics, setup, and administrative
                tasks when support is needed.
              </p>
            </div>
            <div className="shield-scroll-task">
              <h3>Student service</h3>
              <p>
                We help maintain a smooth and welcoming school environment for
                students across campus activities.
              </p>
            </div>
          </div>
        </article>

        <article className="shield-scroll-card shield-scroll-card--contact">
          <h2>Contact</h2>
          <p>
            Questions, comments, or requests? Reach out anytime:
          </p>
          <a href="mailto:shieldscroll@gmail.com" className="shield-scroll-email">
            shieldscroll@gmail.com
          </a>
        </article>
      </div>
    </section>
  );
}
