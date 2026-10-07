import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "../../styles/DetailPage.scss";

export default function ShieldAndScroll() {
  return (
    <main className="detail-page">
      <header className="detail-hero">
        <div className="detail-hero__content">
          <Link to="/Organizations" className="detail-hero__back">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            Organizations
          </Link>
          <p className="detail-hero__eyebrow">Honor and service</p>
          <h1 className="detail-hero__title">
            Lowell Shield and Scroll Honor and Service Society
          </h1>
          <p className="detail-hero__lead">
            Lowell&apos;s second oldest student organization, focused on
            service, scholarship, and citizenship.
          </p>
        </div>
      </header>

      <div className="detail-content">
        <div className="detail-content__main">
          <section className="detail-block">
            <h2 className="detail-block__heading">Who we are</h2>
            <p className="detail-text">
              Shield and Scroll is an honor and service society made up of Lowell
              students committed to supporting the school community with
              consistency and care.
            </p>
            <p className="detail-text">
              Our goal is to help Lowell run effectively and efficiently while
              modeling responsibility and service.
            </p>
          </section>

          <section className="detail-block">
            <h2 className="detail-block__heading">What we do</h2>
            <ul className="detail-topics">
              <li className="detail-topic">
                <h3 className="detail-topic__title">School-wide events</h3>
                <p className="detail-topic__text">
                  We organize and support key events like Freshman Orientation,
                  Eighth Grade Night, Arena, and Graduation.
                </p>
              </li>
              <li className="detail-topic">
                <h3 className="detail-topic__title">Faculty support</h3>
                <p className="detail-topic__text">
                  We assist teachers and staff with logistics, setup, and
                  administrative tasks when support is needed.
                </p>
              </li>
              <li className="detail-topic">
                <h3 className="detail-topic__title">Student service</h3>
                <p className="detail-topic__text">
                  We help maintain a smooth and welcoming school environment for
                  students across campus activities.
                </p>
              </li>
            </ul>
          </section>
        </div>

        <aside className="detail-content__aside" aria-label="Contact">
          <section className="detail-block">
            <h2 className="detail-block__heading">Contact</h2>
            <p className="detail-text">
              Questions, comments, or requests? Reach out anytime.
            </p>
            <div className="detail-links detail-links--column">
              <a
                href="mailto:shieldscroll@gmail.com"
                className="detail-btn detail-btn--primary"
              >
                shieldscroll@gmail.com
              </a>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
